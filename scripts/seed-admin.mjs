import "dotenv/config";
import crypto from "node:crypto";
import mysql from "mysql2/promise";
const email=(process.env.ADMIN_EMAIL||"").trim().toLowerCase();
const username=(process.env.ADMIN_USERNAME||"admin").trim();
const name=(process.env.ADMIN_NAME||"CwaAX Admin").trim();
const password=process.env.ADMIN_PASSWORD||"";
if(!email||!password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before running db:seed-admin");
const salt=crypto.randomBytes(16).toString("hex");
const derived=crypto.scryptSync(password,salt,64,{N:16384,r:8,p:1}).toString("hex");
const passwordHash=`scrypt$16384$8$1$${salt}$${derived}`;
const db=await mysql.createConnection(process.env.DATABASE_URL);
const [rows]=await db.query("SELECT id FROM users WHERE email=? LIMIT 1",[email]);
if(rows.length){await db.execute("UPDATE users SET name=?, username=?, passwordHash=?, role='admin', loginMethod='email' WHERE email=?",[name,username,passwordHash,email]);}
else {const openId=`local_${crypto.randomUUID()}`; await db.execute("INSERT INTO users (openId,name,username,email,passwordHash,loginMethod,role) VALUES (?,?,?,?,?,'email','admin')",[openId,name,username,email,passwordHash]);}
await db.end(); console.log(`Admin account ready: ${email}`);
