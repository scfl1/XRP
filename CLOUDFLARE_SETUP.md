# CwaAX — Cloudflare-only deployment

This version runs the API as a Cloudflare Worker and uses Cloudflare Hyperdrive to connect to the existing Supabase PostgreSQL database. The same `workers.dev` origin serves both the Expo web assets and `/api/*`.

## Required Cloudflare setup
1. Create a Hyperdrive configuration pointing at the existing Supabase PostgreSQL connection.
2. Put the returned Hyperdrive ID in `wrangler.toml` in place of `REPLACE_WITH_YOUR_HYPERDRIVE_ID`.
3. Add Worker secret `JWT_SECRET` (the same value used by the existing backend).
4. Deploy.

Do not commit real database passwords, JWT secrets, or admin passwords.

## Production authentication verification

The Worker must point Hyperdrive at the **same Supabase PostgreSQL database**
used by the local/admin seed and the application's users. A valid JWT alone
does not make a user an admin; the Worker resolves the signed identity to the
`users` table and checks `role = 'admin'`.

Before/after deployment, verify the production database with:

```bash
ADMIN_EMAIL="the-existing-admin-email" DATABASE_URL="the-same-production-db-url" pnpm db:verify-admin
```

The command prints only non-secret account fields. Never print or commit
`DATABASE_URL`, passwords, JWTs, or API keys.

If the Cloudflare logs show an old `local_<uuid>` openId that is absent from
the production database, sign out and sign in again after confirming the app
and Worker use the same database. New local sessions also carry the stable
database user id, allowing the server to recover from an openId mismatch
without granting access to an unknown user.

### Database migrations

This repository currently contains the Drizzle schema but no committed SQL
migration files (only the migrations directory placeholder). Therefore a
deployment must not assume that `wrangler deploy` applies schema changes.
Apply/verify the schema against the production Supabase database separately
with the project's Drizzle workflow before relying on new schema fields.
