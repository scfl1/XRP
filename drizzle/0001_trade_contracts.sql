CREATE TABLE IF NOT EXISTS "trade_contracts" (
  "id" serial PRIMARY KEY NOT NULL,
  "userId" integer NOT NULL,
  "principalAmount" numeric(24,8) NOT NULL,
  "currency" varchar(16) DEFAULT 'USDT' NOT NULL,
  "dailyRateBps" integer DEFAULT 200 NOT NULL,
  "status" varchar(16) DEFAULT 'active' NOT NULL,
  "totalProfitPaid" numeric(24,8) DEFAULT '0' NOT NULL,
  "lastPayoutAt" timestamp,
  "nextPayoutAt" timestamp NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "closedAt" timestamp
);

CREATE TABLE IF NOT EXISTS "trade_payouts" (
  "id" serial PRIMARY KEY NOT NULL,
  "contractId" integer NOT NULL,
  "userId" integer NOT NULL,
  "payoutDate" varchar(32) NOT NULL,
  "amount" numeric(24,8) NOT NULL,
  "transactionId" varchar(64) NOT NULL UNIQUE,
  "createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "trade_payouts_contract_date_idx" ON "trade_payouts" ("contractId", "payoutDate");
CREATE INDEX IF NOT EXISTS "trade_contracts_user_id_idx" ON "trade_contracts" ("userId");
CREATE INDEX IF NOT EXISTS "trade_contracts_due_idx" ON "trade_contracts" ("status", "nextPayoutAt");
CREATE INDEX IF NOT EXISTS "trade_payouts_user_id_idx" ON "trade_payouts" ("userId");
