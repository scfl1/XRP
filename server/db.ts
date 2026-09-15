import { randomUUID } from "node:crypto";

import {
  and,
  desc,
  eq,
  gte,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  InsertUser,
  auditLogs,
  depositRequests,
  notificationReads,
  notifications,
  referralRewards,
  transactions,
  users,
  walletBalances,
  withdrawalRequests,
} from "../drizzle/schema";

import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _databaseUrl = "";
let _client: ReturnType<typeof postgres> | null = null;

export function configureDatabase(databaseUrl: string) {
  if (databaseUrl && databaseUrl !== _databaseUrl) {
    _databaseUrl = databaseUrl;
    if (_client) {
      _client.end({ timeout: 5 }).catch(() => {});
    }
    _client = null;
    _db = null;
  }
}

export async function getDb() {
  if (_db) {
    return _db;
  }

  const databaseUrl =
    _databaseUrl || process.env.DATABASE_URL || ENV.databaseUrl;

  if (!databaseUrl) {
    console.warn("[Database] DATABASE_URL is not configured");
    return null;
  }

  try {
    /*
     * Supabase Transaction Pooler uses PgBouncer in transaction mode.
     * Prepared statements must therefore be disabled.
     *
     * idle_timeout: 0 → keep connections alive to avoid the
     * intermittent "connection closed while idle" failures that were
     * surfacing as deceptive errors in admin mutations.
     * max: 10 → enough headroom for concurrent admin queries.
     */
    if (!_client) {
      _client = postgres(databaseUrl, {
        prepare: false,
        max: 10,
        idle_timeout: 0,
        connect_timeout: 15,
        max_lifetime: 60 * 30,
      });
    }

    _db = drizzle(_client);

    console.log("[Database] PostgreSQL connection initialized");

    return _db;
  } catch (error) {
    console.error("[Database] Failed to initialize connection:", error);
    _db = null;
    return null;
  }
}

/* =========================
   RETRY HELPER
========================= */

async function withDbRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isTransient =
      /connection|terminated|closed|timeout|ECONNRESET|ECONNREFUSED|too many|pool/i.test(msg);

    if (!isTransient) {
      throw error;
    }

    console.warn("[Database] Transient failure, retrying once:", msg);

    // انتظر قليلاً قبل إعادة المحاولة ليعطي الاتصال الجديد وقتاً للفتح
    await new Promise((r) => setTimeout(r, 300));

    return operation();
  }
}

/* =========================
   USERS
========================= */

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();

  if (!db) {
    throw new Error("Database is not available");
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  for (const field of [
    "name",
    "username",
    "email",
    "loginMethod",
    "passwordHash",
  ] as const) {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) {
    values.lastSignedIn = new Date();
  }

  if (!Object.keys(updateSet).length) {
    updateSet.lastSignedIn = new Date();
  }

  updateSet.updatedAt = new Date();

  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
}

export async function getUserByEmailOrUsername(identifier: string) {
  const db = await getDb();
  if (!db) return undefined;

  return withDbRetry(
    async () =>
      (
        await db
          .select()
          .from(users)
          .where(
            or(
              eq(users.email, identifier.toLowerCase()),
              eq(users.username, identifier),
            ),
          )
          .limit(1)
      )[0],
  );
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  return (
    await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)
  )[0];
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) return undefined;

  return (
    await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1)
  )[0];
}

export async function getUserByReferralCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  return (
    await db
      .select()
      .from(users)
      .where(eq(users.referralCode, code.trim().toUpperCase()))
      .limit(1)
  )[0];
}

export async function createLocalUser(data: {
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  referralCode?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const openId = `local_${randomUUID()}`;
  const ownReferralCode = `CWAAX-${data.username.toUpperCase()}`;

  let referredById: number | undefined;
  if (data.referralCode?.trim()) {
    const inviter = await getUserByReferralCode(data.referralCode);
    if (inviter) referredById = inviter.id;
  }

  const inserted = await db
    .insert(users)
    .values({
      openId,
      name: data.name,
      username: data.username,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      loginMethod: "email",
      role: "user",
      referralCode: ownReferralCode,
      referredById,
    })
    .returning({ id: users.id });

  const id = inserted[0]?.id ?? 0;

  return (
    await db.select().from(users).where(eq(users.id, id)).limit(1)
  )[0];
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;

  return withDbRetry(
    async () =>
      (
        await db
          .select()
          .from(users)
          .where(eq(users.openId, openId))
          .limit(1)
      )[0],
  );
}

export async function updateUserLastSignedIn(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(users)
    .set({ lastSignedIn: new Date(), updatedAt: new Date() })
    .where(eq(users.id, userId));
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));
}

/* =========================
   ADMIN USERS
========================= */

export async function listUsers(search?: string) {
  const db = await getDb();
  if (!db) return [];

  const term = search?.trim();
  const pattern = term ? `%${term}%` : null;

  const rows = await (pattern
    ? db
        .select()
        .from(users)
        .where(
          or(
            like(users.name, pattern),
            like(users.username, pattern),
            like(users.email, pattern),
            like(users.openId, pattern),
          ),
        )
        .orderBy(desc(users.createdAt))
    : db.select().from(users).orderBy(desc(users.createdAt)));

  if (!rows.length) return [];

  const ids = rows.map((u) => u.id);

  const referralCounts = await db
    .select({
      referredById: users.referredById,
      count: sql<string>`count(*)`,
    })
    .from(users)
    .where(inArray(users.referredById, ids))
    .groupBy(users.referredById);

  const referralCountMap = new Map<number, number>();
  for (const row of referralCounts) {
    if (row.referredById != null) {
      referralCountMap.set(row.referredById, Number(row.count));
    }
  }

  const earnings = await db
    .select({
      referrerId: referralRewards.referrerId,
      total: sql<string>`coalesce(sum(${referralRewards.commission}), 0)`,
    })
    .from(referralRewards)
    .where(inArray(referralRewards.referrerId, ids))
    .groupBy(referralRewards.referrerId);

  const earningsMap = new Map<number, number>();
  for (const row of earnings) {
    earningsMap.set(row.referrerId, Number(row.total));
  }

  const balances = await db
    .select()
    .from(walletBalances)
    .where(inArray(walletBalances.userId, ids));

  const balanceMap = new Map<number, { currency: string; amount: string }[]>();
  for (const b of balances) {
    const list = balanceMap.get(b.userId) ?? [];
    list.push({ currency: b.currency, amount: b.amount });
    balanceMap.set(b.userId, list);
  }

  return rows.map((u) => ({
    ...u,
    directReferrals: referralCountMap.get(u.id) ?? 0,
    totalReferralEarnings: earningsMap.get(u.id) ?? 0,
    balances: balanceMap.get(u.id) ?? [],
  }));
}

/* =========================
   ADMIN: USER DETAIL
========================= */

export async function getAdminUserDetail(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const user = (
    await db.select().from(users).where(eq(users.id, userId)).limit(1)
  )[0];

  if (!user) return null;

  const [referral, balances, recentTransactions] = await Promise.all([
    getReferralStats(userId),
    db
      .select()
      .from(walletBalances)
      .where(eq(walletBalances.userId, userId)),
    db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(20),
  ]);

  return { user, referral, balances, recentTransactions };
}

/* =========================
   ADMIN: BAN / UNBAN
========================= */

export async function banUser(userId: number, reason?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({
      isBanned: true,
      bannedReason: reason ?? null,
      bannedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

export async function unbanUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(users)
    .set({
      isBanned: false,
      bannedReason: null,
      bannedAt: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/* =========================
   ADMIN: BALANCE ADJUSTMENT
========================= */

export async function adminAdjustBalance(params: {
  userId: number;
  currency: string;
  amount: number;
  direction: "credit" | "debit";
  adminId: number;
  note?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const currency = params.currency.toUpperCase();

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const balance = (
        await tx
          .select()
          .from(walletBalances)
          .where(
            and(
              eq(walletBalances.userId, params.userId),
              eq(walletBalances.currency, currency),
            ),
          )
          .limit(1)
      )[0];

      if (params.direction === "debit") {
        const current = Number(balance?.amount ?? 0);
        if (!balance || current < params.amount) {
          throw new Error("رصيد المستخدم غير كافٍ لإتمام هذا السحب");
        }
      }

      const signedAmount =
        params.direction === "credit" ? params.amount : -params.amount;

      if (balance) {
        await tx
          .update(walletBalances)
          .set({
            amount: sql`${walletBalances.amount} + ${signedAmount}`,
            updatedAt: new Date(),
          })
          .where(eq(walletBalances.id, balance.id));
      } else {
        await tx.insert(walletBalances).values({
          userId: params.userId,
          currency,
          amount: params.amount.toFixed(8),
        });
      }

      await tx.insert(transactions).values({
        transactionId: `ADJ-${params.userId}-${Date.now()}`,
        userId: params.userId,
        type: params.direction === "credit" ? "deposit" : "withdrawal",
        amount: params.amount.toFixed(8),
        currency,
        status: "completed",
        adminId: params.adminId,
      });

      await tx.insert(auditLogs).values({
        adminId: params.adminId,
        action:
          params.direction === "credit"
            ? "admin_credit_balance"
            : "admin_debit_balance",
        entity: "user",
        entityId: params.userId,
        metadata: JSON.stringify({
          currency,
          amount: params.amount,
          note: params.note ?? null,
        }),
      });

      return { success: true };
    }),
  );
}

/* =========================
   NOTIFICATIONS
========================= */

export async function sendNotification(params: {
  userId: number | null;
  title: string;
  message: string;
  sentBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(notifications)
    .values({
      userId: params.userId,
      title: params.title,
      message: params.message,
      sentBy: params.sentBy,
    })
    .returning({ id: notifications.id });

  await db.insert(auditLogs).values({
    adminId: params.sentBy,
    action: params.userId ? "send_notification" : "broadcast_notification",
    entity: "notification",
    entityId: result[0]?.id ?? 0,
    metadata: JSON.stringify({ userId: params.userId, title: params.title }),
  });

  return result[0]?.id ?? 0;
}

export async function listNotificationsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(notifications)
    .where(
      or(
        eq(notifications.userId, userId),
        sql`${notifications.userId} is null`,
      ),
    )
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  if (!rows.length) return [];

  const reads = await db
    .select()
    .from(notificationReads)
    .where(
      and(
        eq(notificationReads.userId, userId),
        inArray(
          notificationReads.notificationId,
          rows.map((r) => r.id),
        ),
      ),
    );

  const readSet = new Set(reads.map((r) => r.notificationId));

  return rows.map((n) => ({ ...n, read: readSet.has(n.id) }));
}

export async function markNotificationRead(
  notificationId: number,
  userId: number,
) {
  const db = await getDb();
  if (!db) return;

  const existing = (
    await db
      .select()
      .from(notificationReads)
      .where(
        and(
          eq(notificationReads.notificationId, notificationId),
          eq(notificationReads.userId, userId),
        ),
      )
      .limit(1)
  )[0];

  if (existing) return;

  await db.insert(notificationReads).values({
    notificationId,
    userId,
  });
}

/* =========================
   ADMIN STATISTICS
========================= */

export async function getAdminStats() {
  const db = await getDb();

  if (!db) {
    return {
      users: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      bannedUsers: 0,
      totalReferralPayout: 0,
    };
  }

  const userRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const deposits = await db
    .select({ count: sql<number>`count(*)` })
    .from(depositRequests)
    .where(eq(depositRequests.status, "pending"));

  const withdrawals = await db
    .select({ count: sql<number>`count(*)` })
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.status, "pending"));

  const bannedRows = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.isBanned, true));

  const referralPayoutRows = await db
    .select({
      total: sql<string>`coalesce(sum(${referralRewards.commission}), 0)`,
    })
    .from(referralRewards);

  return {
    users: Number(userRows[0]?.count ?? 0),
    pendingDeposits: Number(deposits[0]?.count ?? 0),
    pendingWithdrawals: Number(withdrawals[0]?.count ?? 0),
    bannedUsers: Number(bannedRows[0]?.count ?? 0),
    totalReferralPayout: Number(referralPayoutRows[0]?.total ?? 0),
  };
}

/* =========================
   WALLET
========================= */

export async function getWalletBalances(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(walletBalances)
    .where(eq(walletBalances.userId, userId))
    .orderBy(desc(walletBalances.updatedAt));
}

/* =========================
   DEPOSITS
========================= */

export async function createDepositRequest(data: {
  userId: number;
  currency: string;
  amount: number;
  network?: string;
  paymentMethod?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db
    .insert(depositRequests)
    .values({
      userId: data.userId,
      currency: data.currency,
      amount: data.amount.toFixed(8),
      network: data.network,
      paymentMethod: data.paymentMethod,
    })
    .returning({ id: depositRequests.id });

  return result[0]?.id ?? 0;
}

export async function listDepositRequests() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      request: depositRequests,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
      },
    })
    .from(depositRequests)
    .leftJoin(users, eq(users.id, depositRequests.userId))
    .orderBy(desc(depositRequests.createdAt));
}

/* =========================
   WITHDRAWALS
========================= */

export async function createWithdrawalRequest(data: {
  userId: number;
  currency: string;
  amount: number;
  address: string;
  network?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const debited = await tx
        .update(walletBalances)
        .set({
          amount: sql`${walletBalances.amount} - ${data.amount}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(walletBalances.userId, data.userId),
            eq(walletBalances.currency, data.currency),
            gte(walletBalances.amount, data.amount),
          ),
        )
        .returning({ id: walletBalances.id });

      if (!debited.length) {
        throw new Error("Insufficient balance");
      }

      const result = await tx
        .insert(withdrawalRequests)
        .values({
          userId: data.userId,
          currency: data.currency,
          amount: data.amount.toFixed(8),
          address: data.address,
          network: data.network,
        })
        .returning({ id: withdrawalRequests.id });

      const requestId = result[0]?.id ?? 0;

      await tx.insert(transactions).values({
        transactionId: `WTH-${requestId}`,
        userId: data.userId,
        type: "withdrawal",
        amount: data.amount.toFixed(8),
        currency: data.currency,
        status: "pending",
      });

      return requestId;
    }),
  );
}

export async function listWithdrawalRequests() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      request: withdrawalRequests,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username: users.username,
      },
    })
    .from(withdrawalRequests)
    .leftJoin(users, eq(users.id, withdrawalRequests.userId))
    .orderBy(desc(withdrawalRequests.createdAt));
}

/* =========================
   TRANSACTIONS
========================= */

export async function listTransactions(userId?: number) {
  const db = await getDb();
  if (!db) return [];

  const query = db.select().from(transactions);

  if (userId !== undefined) {
    return query
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  }

  return query.orderBy(desc(transactions.createdAt));
}

/* =========================
   APPROVE DEPOSIT
========================= */

const REFERRAL_RATES = [0.10, 0.05, 0.025];

async function creditReferralChain(
  tx: any,
  params: {
    sourceUserId: number;
    depositRequestId: number;
    depositAmount: number;
    currency: string;
  },
) {
  let childId = params.sourceUserId;

  for (let level = 1; level <= REFERRAL_RATES.length; level++) {
    const child = (
      await tx
        .select({ referredById: users.referredById })
        .from(users)
        .where(eq(users.id, childId))
        .limit(1)
    )[0];

    if (!child?.referredById) break;

    const referrerId = child.referredById as number;
    const commission =
      params.depositAmount * REFERRAL_RATES[level - 1];

    if (commission > 0) {
      const balance = (
        await tx
          .select()
          .from(walletBalances)
          .where(
            and(
              eq(walletBalances.userId, referrerId),
              eq(walletBalances.currency, params.currency),
            ),
          )
          .limit(1)
      )[0];

      if (balance) {
        await tx
          .update(walletBalances)
          .set({
            amount: sql`${walletBalances.amount} + ${commission.toFixed(8)}`,
            updatedAt: new Date(),
          })
          .where(eq(walletBalances.id, balance.id));
      } else {
        await tx.insert(walletBalances).values({
          userId: referrerId,
          currency: params.currency,
          amount: commission.toFixed(8),
        });
      }

      await tx.insert(referralRewards).values({
        referrerId,
        sourceUserId: params.sourceUserId,
        depositRequestId: params.depositRequestId,
        level,
        depositAmount: params.depositAmount.toFixed(8),
        commission: commission.toFixed(8),
        currency: params.currency,
      });
    }

    childId = referrerId;
  }
}

export async function getReferralStats(userId: number) {
  const db = await getDb();

  if (!db) {
    return {
      referralCode: null,
      levelCounts: [0, 0, 0],
      levelEarnings: [0, 0, 0],
      totalReferred: 0,
      totalEarned: 0,
      history: [],
    };
  }

  const me = (
    await db
      .select({ referralCode: users.referralCode })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  )[0];

  const level1 = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.referredById, userId));

  const level1Ids = level1.map((u) => u.id);

  const level2 = level1Ids.length
    ? await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.referredById, level1Ids))
    : [];

  const level2Ids = level2.map((u) => u.id);

  const level3 = level2Ids.length
    ? await db
        .select({ id: users.id })
        .from(users)
        .where(inArray(users.referredById, level2Ids))
    : [];

  const earningsByLevel = await db
    .select({
      level: referralRewards.level,
      total: sql<string>`coalesce(sum(${referralRewards.commission}), 0)`,
    })
    .from(referralRewards)
    .where(eq(referralRewards.referrerId, userId))
    .groupBy(referralRewards.level);

  const levelEarnings: [number, number, number] = [0, 0, 0];

  for (const row of earningsByLevel) {
    if (row.level >= 1 && row.level <= 3) {
      levelEarnings[row.level - 1] = Number(row.total);
    }
  }

  const history = await db
    .select({
      id: referralRewards.id,
      level: referralRewards.level,
      commission: referralRewards.commission,
      currency: referralRewards.currency,
      createdAt: referralRewards.createdAt,
      sourceUsername: users.username,
      sourceName: users.name,
    })
    .from(referralRewards)
    .leftJoin(users, eq(referralRewards.sourceUserId, users.id))
    .where(eq(referralRewards.referrerId, userId))
    .orderBy(desc(referralRewards.createdAt))
    .limit(30);

  return {
    referralCode: me?.referralCode ?? null,
    levelCounts: [level1Ids.length, level2Ids.length, level3.length],
    levelEarnings,
    totalReferred: level1Ids.length + level2Ids.length + level3.length,
    totalEarned:
      levelEarnings[0] + levelEarnings[1] + levelEarnings[2],
    history,
  };
}

export async function approveDeposit(requestId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const request = (
        await tx
          .select()
          .from(depositRequests)
          .where(
            and(
              eq(depositRequests.id, requestId),
              eq(depositRequests.status, "pending"),
            ),
          )
          .limit(1)
      )[0];

      if (!request) {
        return { changed: false, reason: "already_processed" as const };
      }

      const marked = await tx
        .update(depositRequests)
        .set({
          status: "approved",
          approvedBy: adminId,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(depositRequests.id, requestId),
            eq(depositRequests.status, "pending"),
          ),
        )
        .returning({ id: depositRequests.id });

      if (!marked.length) {
        return { changed: false, reason: "already_processed" as const };
      }

      const balance = (
        await tx
          .select()
          .from(walletBalances)
          .where(
            and(
              eq(walletBalances.userId, request.userId),
              eq(walletBalances.currency, request.currency),
            ),
          )
          .limit(1)
      )[0];

      if (balance) {
        await tx
          .update(walletBalances)
          .set({
            amount: sql`${walletBalances.amount} + ${request.amount}`,
            updatedAt: new Date(),
          })
          .where(eq(walletBalances.id, balance.id));
      } else {
        await tx.insert(walletBalances).values({
          userId: request.userId,
          currency: request.currency,
          amount: request.amount,
        });
      }

      await tx.insert(transactions).values({
        transactionId: `DEP-${request.id}-${Date.now()}`,
        userId: request.userId,
        type: "deposit",
        amount: request.amount,
        currency: request.currency,
        status: "completed",
        adminId,
      });

      await creditReferralChain(tx, {
        sourceUserId: request.userId,
        depositRequestId: request.id,
        depositAmount: Number(request.amount),
        currency: request.currency,
      });

      await tx.insert(auditLogs).values({
        adminId,
        action: "approve_deposit",
        entity: "deposit_request",
        entityId: requestId,
        metadata: JSON.stringify({
          currency: request.currency,
          amount: request.amount,
        }),
      });

      return { changed: true };
    }),
  );
}

/* =========================
   REJECT DEPOSIT
========================= */

export async function rejectDeposit(requestId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const result = await tx
        .update(depositRequests)
        .set({
          status: "rejected",
          approvedBy: adminId,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(depositRequests.id, requestId),
            eq(depositRequests.status, "pending"),
          ),
        )
        .returning({ id: depositRequests.id });

      if (!result.length) {
        return { changed: false, reason: "already_processed" as const };
      }

      await tx.insert(auditLogs).values({
        adminId,
        action: "reject_deposit",
        entity: "deposit_request",
        entityId: requestId,
      });

      return { changed: true };
    }),
  );
}

/* =========================
   APPROVE WITHDRAWAL
========================= */

export async function approveWithdrawal(requestId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const request = (
        await tx
          .select()
          .from(withdrawalRequests)
          .where(
            and(
              eq(withdrawalRequests.id, requestId),
              eq(withdrawalRequests.status, "pending"),
            ),
          )
          .limit(1)
      )[0];

      if (!request) {
        return { changed: false, reason: "already_processed" as const };
      }

      const claimed = await tx
        .update(withdrawalRequests)
        .set({
          status: "approved",
          approvedBy: adminId,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(withdrawalRequests.id, requestId),
            eq(withdrawalRequests.status, "pending"),
          ),
        )
        .returning({ id: withdrawalRequests.id });

      if (!claimed.length) {
        return { changed: false, reason: "already_processed" as const };
      }

      await tx
        .update(transactions)
        .set({
          status: "completed",
          adminId,
          updatedAt: new Date(),
        })
        .where(eq(transactions.transactionId, `WTH-${request.id}`));

      await tx.insert(auditLogs).values({
        adminId,
        action: "approve_withdrawal",
        entity: "withdrawal_request",
        entityId: requestId,
        metadata: JSON.stringify({
          currency: request.currency,
          amount: request.amount,
        }),
      });

      return { changed: true };
    }),
  );
}

/* =========================
   REJECT WITHDRAWAL
========================= */

export async function rejectWithdrawal(requestId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return withDbRetry(() =>
    db.transaction(async (tx) => {
      const request = (
        await tx
          .select()
          .from(withdrawalRequests)
          .where(
            and(
              eq(withdrawalRequests.id, requestId),
              eq(withdrawalRequests.status, "pending"),
            ),
          )
          .limit(1)
      )[0];

      if (!request) {
        return { changed: false, reason: "already_processed" as const };
      }

      const claimed = await tx
        .update(withdrawalRequests)
        .set({
          status: "rejected",
          approvedBy: adminId,
          approvedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(withdrawalRequests.id, requestId),
            eq(withdrawalRequests.status, "pending"),
          ),
        )
        .returning({ id: withdrawalRequests.id });

      if (!claimed.length) {
        return { changed: false, reason: "already_processed" as const };
      }

      await tx
        .update(walletBalances)
        .set({
          amount: sql`${walletBalances.amount} + ${request.amount}`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(walletBalances.userId, request.userId),
            eq(walletBalances.currency, request.currency),
          ),
        );

      await tx
        .update(transactions)
        .set({
          status: "failed",
          adminId,
          updatedAt: new Date(),
        })
        .where(eq(transactions.transactionId, `WTH-${request.id}`));

      await tx.insert(auditLogs).values({
        adminId,
        action: "reject_withdrawal",
        entity: "withdrawal_request",
        entityId: requestId,
        metadata: JSON.stringify({
          currency: request.currency,
          amount: request.amount,
          refunded: true,
        }),
      });

      return { changed: true };
    }),
  );
}
