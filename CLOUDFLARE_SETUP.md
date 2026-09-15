# CwaAX — Cloudflare-only deployment

This version runs the API as a Cloudflare Worker and uses Cloudflare Hyperdrive to connect to the existing Supabase PostgreSQL database. The same `workers.dev` origin serves both the Expo web assets and `/api/*`.

## Required Cloudflare setup
1. Create a Hyperdrive configuration pointing at the existing Supabase PostgreSQL connection.
2. Put the returned Hyperdrive ID in `wrangler.toml` in place of `REPLACE_WITH_YOUR_HYPERDRIVE_ID`.
3. Add Worker secret `JWT_SECRET` (the same value used by the existing backend).
4. Deploy.

Do not commit real database passwords, JWT secrets, or admin passwords.

## Trade contracts and daily payout scheduler

The Trade screen now creates a real database-backed trade contract for one of the configured USDT tiers. The server reserves the selected USDT amount atomically, stores the contract in `trade_contracts`, and records the opening transaction.

Daily payout processing is server-side only. The Cloudflare Worker runs the `scheduled` handler every hour and pays a contract only when its `nextPayoutAt` is due. The database claim condition prevents overlapping scheduled invocations from paying the same 24-hour slot twice. Each payout is stored in `trade_payouts` and credited to the user's USDT wallet inside the same database transaction.

Before deploying this version, apply `drizzle/0001_trade_contracts.sql` to the same production PostgreSQL database used by the Worker/Hyperdrive. Do not create a second database for these tables.

The configured rate is 200 basis points (2%) per 24-hour payout. This is an application-configured calculation, not a statement that real-world trading markets guarantee a 2% return.
