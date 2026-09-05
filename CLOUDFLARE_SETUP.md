# CwaAX — Cloudflare-only deployment

This version runs the API as a Cloudflare Worker and uses Cloudflare Hyperdrive to connect to the existing Supabase PostgreSQL database. The same `workers.dev` origin serves both the Expo web assets and `/api/*`.

## Required Cloudflare setup
1. Create a Hyperdrive configuration pointing at the existing Supabase PostgreSQL connection.
2. Put the returned Hyperdrive ID in `wrangler.toml` in place of `REPLACE_WITH_YOUR_HYPERDRIVE_ID`.
3. Add Worker secret `JWT_SECRET` (the same value used by the existing backend).
4. Deploy.

Do not commit real database passwords, JWT secrets, or admin passwords.
