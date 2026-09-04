import { randomUUID } from "node:crypto";

import {
  and,
  desc,
  eq,
  gte,
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
  transactions,
  users,
  walletBalances,
  withdrawalRequests,
} from "../drizzle/schema";

import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (_db) {
    return _db;
  }

  const databaseUrl =
    process.env.DATABASE_URL ||
    ENV.databaseUrl;

  if (!databaseUrl) {
    console.warn(
      "[Database] DATABASE_URL is not configured",
    );

    return null;
  }

  try {
    /*
     * Supabase Transaction Pooler uses PgBouncer
     * in transaction mode.
     *
     * Prepared statements must therefore be disabled.
     */
    const client = postgres(databaseUrl, {
      prepare: false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });

    _db = drizzle(client);

    console.log(
      "[Database] PostgreSQL connection initialized",
    );

    return _db;
  } catch (error) {
    console.error(
      "[Database] Failed to initialize connection:",
      error,
    );

    _db = null;

    return null;
  }
}

/* =========================
   USERS
========================= */

export async function upsertUser(
  user: InsertUser,
): Promise<void> {
  if (!user.openId) {
    throw new Error(
      "User openId is required for upsert",
    );
  }

  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database is not available",
    );
  }

  const values: InsertUser = {
    openId: user.openId,
  };

  const updateSet: Record<
    string,
    unknown
  > = {};

  for (const field of [
    "name",
    "username",
    "email",
    "loginMethod",
    "passwordHash",
  ] as const) {
    if (user[field] !== undefined) {
      values[field] =
        user[field] ?? null;

      updateSet[field] =
        user[field] ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn =
      user.lastSignedIn;

    updateSet.lastSignedIn =
      user.lastSignedIn;
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (
    user.openId === ENV.ownerOpenId
  ) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) {
    values.lastSignedIn = new Date();
  }

  if (!Object.keys(updateSet).length) {
    updateSet.lastSignedIn =
      new Date();
  }

  updateSet.updatedAt =
    new Date();

  await db
    .insert(users)
    .values(values)
    .onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
}

export async function getUserByEmailOrUsername(
  identifier: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  return (
    await db
      .select()
      .from(users)
      .where(
        or(
          eq(
            users.email,
            identifier.toLowerCase(),
          ),
          eq(
            users.username,
            identifier,
          ),
        ),
      )
      .limit(1)
  )[0];
}

export async function getUserByEmail(
  email: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  return (
    await db
      .select()
      .from(users)
      .where(
        eq(
          users.email,
          email.toLowerCase(),
        ),
      )
      .limit(1)
  )[0];
}

export async function getUserByUsername(
  username: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  return (
    await db
      .select()
      .from(users)
      .where(
        eq(users.username, username),
      )
      .limit(1)
  )[0];
}

export async function createLocalUser(
  data: {
    name: string;
    username: string;
    email: string;
    passwordHash: string;
  },
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  const openId =
    `local_${randomUUID()}`;

  const inserted =
    await db
      .insert(users)
      .values({
        openId,
        name: data.name,
        username: data.username,
        email:
          data.email.toLowerCase(),
        passwordHash:
          data.passwordHash,
        loginMethod: "email",
        role: "user",
      })
      .returning({
        id: users.id,
      });

  const id =
    inserted[0]?.id ?? 0;

  return (
    await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
  )[0];
}

export async function getUserByOpenId(
  openId: string,
) {
  const db = await getDb();

  if (!db) {
    return undefined;
  }

  return (
    await db
      .select()
      .from(users)
      .where(
        eq(users.openId, openId),
      )
      .limit(1)
  )[0];
}

export async function updateUserLastSignedIn(
  userId: number,
) {
  const db = await getDb();

  if (!db) {
    return;
  }

  await db
    .update(users)
    .set({
      lastSignedIn: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));
}

/* =========================
   ADMIN USERS
========================= */

export async function listUsers(
  search?: string,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const term = search?.trim();

  if (!term) {
    return db
      .select()
      .from(users)
      .orderBy(
        desc(users.createdAt),
      );
  }

  const pattern =
    `%${term}%`;

  return db
    .select()
    .from(users)
    .where(
      or(
        like(users.name, pattern),
        like(
          users.username,
          pattern,
        ),
        like(users.email, pattern),
        like(
          users.openId,
          pattern,
        ),
      ),
    )
    .orderBy(
      desc(users.createdAt),
    );
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
    };
  }

  const userRows =
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(users);

  const deposits =
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(depositRequests)
      .where(
        eq(
          depositRequests.status,
          "pending",
        ),
      );

  const withdrawals =
    await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(withdrawalRequests)
      .where(
        eq(
          withdrawalRequests.status,
          "pending",
        ),
      );

  return {
    users: Number(
      userRows[0]?.count ?? 0,
    ),

    pendingDeposits: Number(
      deposits[0]?.count ?? 0,
    ),

    pendingWithdrawals: Number(
      withdrawals[0]?.count ?? 0,
    ),
  };
}

/* =========================
   WALLET
========================= */

export async function getWalletBalances(
  userId: number,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select()
    .from(walletBalances)
    .where(
      eq(
        walletBalances.userId,
        userId,
      ),
    )
    .orderBy(
      desc(
        walletBalances.updatedAt,
      ),
    );
}

/* =========================
   DEPOSITS
========================= */

export async function createDepositRequest(
  data: {
    userId: number;
    currency: string;
    amount: number;
    network?: string;
    paymentMethod?: string;
  },
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  const result =
    await db
      .insert(depositRequests)
      .values({
        userId: data.userId,
        currency: data.currency,
        amount:
          data.amount.toFixed(8),
        network: data.network,
        paymentMethod:
          data.paymentMethod,
      })
      .returning({
        id: depositRequests.id,
      });

  return result[0]?.id ?? 0;
}

export async function listDepositRequests() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select({
      request:
        depositRequests,

      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username:
          users.username,
      },
    })
    .from(depositRequests)
    .leftJoin(
      users,
      eq(
        users.id,
        depositRequests.userId,
      ),
    )
    .orderBy(
      desc(
        depositRequests.createdAt,
      ),
    );
}

/* =========================
   WITHDRAWALS
========================= */

export async function createWithdrawalRequest(
  data: {
    userId: number;
    currency: string;
    amount: number;
    address: string;
    network?: string;
  },
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  return db.transaction(
    async (tx) => {
      const balance =
        (
          await tx
            .select()
            .from(walletBalances)
            .where(
              and(
                eq(
                  walletBalances.userId,
                  data.userId,
                ),
                eq(
                  walletBalances.currency,
                  data.currency,
                ),
              ),
            )
            .limit(1)
        )[0];

      if (
        !balance ||
        Number(balance.amount) <
          data.amount
      ) {
        throw new Error(
          "Insufficient balance",
        );
      }

      const result =
        await tx
          .insert(
            withdrawalRequests,
          )
          .values({
            userId: data.userId,
            currency:
              data.currency,
            amount:
              data.amount.toFixed(
                8,
              ),
            address:
              data.address,
            network:
              data.network,
          })
          .returning({
            id:
              withdrawalRequests.id,
          });

      return (
        result[0]?.id ?? 0
      );
    },
  );
}

export async function listWithdrawalRequests() {
  const db = await getDb();

  if (!db) {
    return [];
  }

  return db
    .select({
      request:
        withdrawalRequests,

      user: {
        id: users.id,
        name: users.name,
        email: users.email,
        username:
          users.username,
      },
    })
    .from(withdrawalRequests)
    .leftJoin(
      users,
      eq(
        users.id,
        withdrawalRequests.userId,
      ),
    )
    .orderBy(
      desc(
        withdrawalRequests.createdAt,
      ),
    );
}

/* =========================
   TRANSACTIONS
========================= */

export async function listTransactions(
  userId?: number,
) {
  const db = await getDb();

  if (!db) {
    return [];
  }

  const query =
    db
      .select()
      .from(transactions);

  if (userId !== undefined) {
    return query
      .where(
        eq(
          transactions.userId,
          userId,
        ),
      )
      .orderBy(
        desc(
          transactions.createdAt,
        ),
      );
  }

  return query.orderBy(
    desc(
      transactions.createdAt,
    ),
  );
}

/* =========================
   APPROVE DEPOSIT
========================= */

export async function approveDeposit(
  requestId: number,
  adminId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  return db.transaction(
    async (tx) => {
      const request =
        (
          await tx
            .select()
            .from(
              depositRequests,
            )
            .where(
              and(
                eq(
                  depositRequests.id,
                  requestId,
                ),
                eq(
                  depositRequests.status,
                  "pending",
                ),
              ),
            )
            .limit(1)
        )[0];

      if (!request) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      const marked =
        await tx
          .update(
            depositRequests,
          )
          .set({
            status: "approved",
            approvedBy:
              adminId,
            approvedAt:
              new Date(),
            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                depositRequests.id,
                requestId,
              ),
              eq(
                depositRequests.status,
                "pending",
              ),
            ),
          )
          .returning({
            id:
              depositRequests.id,
          });

      if (!marked.length) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      const balance =
        (
          await tx
            .select()
            .from(walletBalances)
            .where(
              and(
                eq(
                  walletBalances.userId,
                  request.userId,
                ),
                eq(
                  walletBalances.currency,
                  request.currency,
                ),
              ),
            )
            .limit(1)
        )[0];

      if (balance) {
        await tx
          .update(
            walletBalances,
          )
          .set({
            amount: sql`
              ${walletBalances.amount}
              + ${request.amount}
            `,
            updatedAt:
              new Date(),
          })
          .where(
            eq(
              walletBalances.id,
              balance.id,
            ),
          );
      } else {
        await tx
          .insert(
            walletBalances,
          )
          .values({
            userId:
              request.userId,
            currency:
              request.currency,
            amount:
              request.amount,
          });
      }

      await tx
        .insert(transactions)
        .values({
          transactionId:
            `DEP-${request.id}-${Date.now()}`,
          userId:
            request.userId,
          type: "deposit",
          amount:
            request.amount,
          currency:
            request.currency,
          status:
            "completed",
          adminId,
        });

      await tx
        .insert(auditLogs)
        .values({
          adminId,
          action:
            "approve_deposit",
          entity:
            "deposit_request",
          entityId:
            requestId,
          metadata:
            JSON.stringify({
              currency:
                request.currency,
              amount:
                request.amount,
            }),
        });

      return {
        changed: true,
      };
    },
  );
}

/* =========================
   REJECT DEPOSIT
========================= */

export async function rejectDeposit(
  requestId: number,
  adminId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  return db.transaction(
    async (tx) => {
      const result =
        await tx
          .update(
            depositRequests,
          )
          .set({
            status: "rejected",
            approvedBy:
              adminId,
            approvedAt:
              new Date(),
            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                depositRequests.id,
                requestId,
              ),
              eq(
                depositRequests.status,
                "pending",
              ),
            ),
          )
          .returning({
            id:
              depositRequests.id,
          });

      if (!result.length) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      await tx
        .insert(auditLogs)
        .values({
          adminId,
          action:
            "reject_deposit",
          entity:
            "deposit_request",
          entityId:
            requestId,
        });

      return {
        changed: true,
      };
    },
  );
}

/* =========================
   APPROVE WITHDRAWAL
========================= */

export async function approveWithdrawal(
  requestId: number,
  adminId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  return db.transaction(
    async (tx) => {
      const request =
        (
          await tx
            .select()
            .from(
              withdrawalRequests,
            )
            .where(
              and(
                eq(
                  withdrawalRequests.id,
                  requestId,
                ),
                eq(
                  withdrawalRequests.status,
                  "pending",
                ),
              ),
            )
            .limit(1)
        )[0];

      if (!request) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      const claimed =
        await tx
          .update(
            withdrawalRequests,
          )
          .set({
            status: "approved",
            approvedBy:
              adminId,
            approvedAt:
              new Date(),
            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                withdrawalRequests.id,
                requestId,
              ),
              eq(
                withdrawalRequests.status,
                "pending",
              ),
            ),
          )
          .returning({
            id:
              withdrawalRequests.id,
          });

      if (!claimed.length) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      const debited =
        await tx
          .update(
            walletBalances,
          )
          .set({
            amount: sql`
              ${walletBalances.amount}
              - ${request.amount}
            `,
            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                walletBalances.userId,
                request.userId,
              ),
              eq(
                walletBalances.currency,
                request.currency,
              ),
              gte(
                walletBalances.amount,
                request.amount,
              ),
            ),
          )
          .returning({
            id:
              walletBalances.id,
          });

      if (!debited.length) {
        throw new Error(
          "Insufficient balance",
        );
      }

      await tx
        .insert(transactions)
        .values({
          transactionId:
            `WTH-${request.id}-${Date.now()}`,
          userId:
            request.userId,
          type:
            "withdrawal",
          amount:
            request.amount,
          currency:
            request.currency,
          status:
            "completed",
          adminId,
        });

      await tx
        .insert(auditLogs)
        .values({
          adminId,
          action:
            "approve_withdrawal",
          entity:
            "withdrawal_request",
          entityId:
            requestId,
          metadata:
            JSON.stringify({
              currency:
                request.currency,
              amount:
                request.amount,
            }),
        });

      return {
        changed: true,
      };
    },
  );
}

/* =========================
   REJECT WITHDRAWAL
========================= */

export async function rejectWithdrawal(
  requestId: number,
  adminId: number,
) {
  const db = await getDb();

  if (!db) {
    throw new Error(
      "Database not available",
    );
  }

  return db.transaction(
    async (tx) => {
      const result =
        await tx
          .update(
            withdrawalRequests,
          )
          .set({
            status: "rejected",
            approvedBy:
              adminId,
            approvedAt:
              new Date(),
            updatedAt:
              new Date(),
          })
          .where(
            and(
              eq(
                withdrawalRequests.id,
                requestId,
              ),
              eq(
                withdrawalRequests.status,
                "pending",
              ),
            ),
          )
          .returning({
            id:
              withdrawalRequests.id,
          });

      if (!result.length) {
        return {
          changed: false,
          reason:
            "already_processed" as const,
        };
      }

      await tx
        .insert(auditLogs)
        .values({
          adminId,
          action:
            "reject_withdrawal",
          entity:
            "withdrawal_request",
          entityId:
            requestId,
        });

      return {
        changed: true,
      };
    },
  );
}
