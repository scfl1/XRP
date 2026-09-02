import { and, desc, eq, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, auditLogs, depositRequests, transactions, users, walletBalances, withdrawalRequests } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId }; const updateSet: Record<string, unknown> = {};
  for (const field of ["name", "email", "loginMethod"] as const) if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date(); if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}
export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; return (await db.select().from(users).where(eq(users.openId, openId)).limit(1))[0]; }
export async function getWalletBalances(userId: number) { const db = await getDb(); if (!db) return []; return db.select().from(walletBalances).where(eq(walletBalances.userId, userId)).orderBy(desc(walletBalances.updatedAt)); }
export async function createDepositRequest(data: { userId: number; currency: string; amount: number; network?: string; paymentMethod?: string }) { const db = await getDb(); if (!db) throw new Error("Database not available"); const result = await db.insert(depositRequests).values({ ...data, amount: data.amount.toFixed(8) }); return Number((result as any)[0]?.insertId ?? 0); }
export async function createWithdrawalRequest(data: { userId: number; currency: string; amount: number; address: string; network?: string }) { const db = await getDb(); if (!db) throw new Error("Database not available"); const result = await db.insert(withdrawalRequests).values({ ...data, amount: data.amount.toFixed(8) }); return Number((result as any)[0]?.insertId ?? 0); }
export async function listDepositRequests() { const db = await getDb(); if (!db) return []; return db.select().from(depositRequests).orderBy(desc(depositRequests.createdAt)); }
export async function listWithdrawalRequests() { const db = await getDb(); if (!db) return []; return db.select().from(withdrawalRequests).orderBy(desc(withdrawalRequests.createdAt)); }
export async function listTransactions(userId?: number) { const db = await getDb(); if (!db) return []; const query = db.select().from(transactions); return userId ? query.where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt)) : query.orderBy(desc(transactions.createdAt)); }

function affectedRows(result: unknown) { const value = result as any; return Number(value?.[0]?.affectedRows ?? value?.affectedRows ?? 0); }

export async function approveDeposit(requestId: number, adminId: number) {
  const db = await getDb(); if (!db) throw new Error("Database not available");
  return db.transaction(async (tx) => {
    const request = (await tx.select().from(depositRequests).where(and(eq(depositRequests.id, requestId), eq(depositRequests.status, "pending"))).limit(1))[0];
    if (!request) return { changed: false, reason: "already_processed" as const };
    const marked = await tx.update(depositRequests).set({ status: "approved", approvedBy: adminId, approvedAt: new Date() }).where(and(eq(depositRequests.id, requestId), eq(depositRequests.status, "pending")));
    if (!affectedRows(marked)) return { changed: false, reason: "already_processed" as const };
    const balance = (await tx.select().from(walletBalances).where(and(eq(walletBalances.userId, request.userId), eq(walletBalances.currency, request.currency))).limit(1))[0];
    if (balance) await tx.update(walletBalances).set({ amount: sql`${walletBalances.amount} + ${request.amount}` }).where(eq(walletBalances.id, balance.id)); else await tx.insert(walletBalances).values({ userId: request.userId, currency: request.currency, amount: request.amount });
    await tx.insert(transactions).values({ transactionId: `DEP-${request.id}-${Date.now()}`, userId: request.userId, type: "deposit", amount: request.amount, currency: request.currency, status: "completed", adminId });
    await tx.insert(auditLogs).values({ adminId, action: "approve_deposit", entity: "deposit_request", entityId: requestId, metadata: JSON.stringify({ currency: request.currency, amount: request.amount }) });
    return { changed: true };
  });
}
export async function rejectDeposit(requestId: number, adminId: number) {
  const db = await getDb(); if (!db) throw new Error("Database not available");
  return db.transaction(async (tx) => { const result = await tx.update(depositRequests).set({ status: "rejected", approvedBy: adminId, approvedAt: new Date() }).where(and(eq(depositRequests.id, requestId), eq(depositRequests.status, "pending"))); if (!affectedRows(result)) return { changed: false, reason: "already_processed" as const }; await tx.insert(auditLogs).values({ adminId, action: "reject_deposit", entity: "deposit_request", entityId: requestId }); return { changed: true }; });
}
export async function approveWithdrawal(requestId: number, adminId: number) {
  const db = await getDb(); if (!db) throw new Error("Database not available");
  return db.transaction(async (tx) => {
    const request = (await tx.select().from(withdrawalRequests).where(and(eq(withdrawalRequests.id, requestId), eq(withdrawalRequests.status, "pending"))).limit(1))[0];
    if (!request) return { changed: false, reason: "already_processed" as const };
    const debited = await tx.update(walletBalances).set({ amount: sql`${walletBalances.amount} - ${request.amount}` }).where(and(eq(walletBalances.userId, request.userId), eq(walletBalances.currency, request.currency), gte(walletBalances.amount, request.amount)));
    if (!affectedRows(debited)) return { changed: false, reason: "insufficient_balance" as const };
    const marked = await tx.update(withdrawalRequests).set({ status: "approved", approvedBy: adminId, approvedAt: new Date() }).where(and(eq(withdrawalRequests.id, requestId), eq(withdrawalRequests.status, "pending")));
    if (!affectedRows(marked)) return { changed: false, reason: "already_processed" as const };
    await tx.insert(transactions).values({ transactionId: `WTH-${request.id}-${Date.now()}`, userId: request.userId, type: "withdrawal", amount: request.amount, currency: request.currency, status: "completed", adminId });
    await tx.insert(auditLogs).values({ adminId, action: "approve_withdrawal", entity: "withdrawal_request", entityId: requestId, metadata: JSON.stringify({ currency: request.currency, amount: request.amount }) });
    return { changed: true };
  });
}
export async function rejectWithdrawal(requestId: number, adminId: number) {
  const db = await getDb(); if (!db) throw new Error("Database not available");
  return db.transaction(async (tx) => { const result = await tx.update(withdrawalRequests).set({ status: "rejected", approvedBy: adminId, approvedAt: new Date() }).where(and(eq(withdrawalRequests.id, requestId), eq(withdrawalRequests.status, "pending"))); if (!affectedRows(result)) return { changed: false, reason: "already_processed" as const }; await tx.insert(auditLogs).values({ adminId, action: "reject_withdrawal", entity: "withdrawal_request", entityId: requestId }); return { changed: true }; });
}
