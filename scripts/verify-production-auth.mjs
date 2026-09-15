import "dotenv/config";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;
const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();

if (!databaseUrl) throw new Error("DATABASE_URL is required");
if (!email) throw new Error("ADMIN_EMAIL is required");

const sql = postgres(databaseUrl, { prepare: false, max: 1, connect_timeout: 10 });

try {
  const rows = await sql`
    SELECT
      id,
      "openId",
      name,
      username,
      email,
      "loginMethod",
      role,
      "isBanned"
    FROM users
    WHERE lower(email) = ${email}
    LIMIT 1
  `;

  if (!rows.length) {
    console.error("[AuthCheck] Admin user NOT FOUND in this database.");
    process.exitCode = 2;
  } else {
    const user = rows[0];
    console.log("[AuthCheck] Admin user found:", {
      id: user.id,
      openId: user.openId,
      username: user.username,
      email: user.email,
      role: user.role,
      isBanned: user.isBanned,
    });

    if (user.role !== "admin") {
      console.error("[AuthCheck] FAIL: role is not admin.");
      process.exitCode = 3;
    } else if (user.isBanned) {
      console.error("[AuthCheck] FAIL: admin account is banned.");
      process.exitCode = 4;
    } else {
      console.log("[AuthCheck] PASS: admin identity is present and authorized.");
    }
  }
} finally {
  await sql.end();
}
