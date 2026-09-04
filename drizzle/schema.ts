import { integer, numeric, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["deposit", "withdrawal", "trade", "transfer"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "completed", "failed"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  username: varchar("username", { length: 64 }).unique(),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  passwordHash: text("passwordHash"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  currency: varchar("currency", { length: 16 }).notNull(),
  amount: numeric("amount", { precision: 24, scale: 8 }).default("0").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const depositRequests = pgTable("deposit_requests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  currency: varchar("currency", { length: 16 }).notNull(),
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  network: varchar("network", { length: 32 }),
  paymentMethod: varchar("paymentMethod", { length: 64 }),
  status: requestStatusEnum("status").default("pending").notNull(),
  approvedBy: integer("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  currency: varchar("currency", { length: 16 }).notNull(),
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  address: text("address").notNull(),
  network: varchar("network", { length: 32 }),
  status: requestStatusEnum("status").default("pending").notNull(),
  approvedBy: integer("approvedBy"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transactionId", { length: 40 }).notNull().unique(),
  userId: integer("userId").notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 24, scale: 8 }).notNull(),
  currency: varchar("currency", { length: 16 }).notNull(),
  status: transactionStatusEnum("status").notNull(),
  adminId: integer("adminId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  adminId: integer("adminId").notNull(),
  action: varchar("action", { length: 80 }).notNull(),
  entity: varchar("entity", { length: 40 }).notNull(),
  entityId: integer("entityId").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WalletBalance = typeof walletBalances.$inferSelect;
export type DepositRequest = typeof depositRequests.$inferSelect;
export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
