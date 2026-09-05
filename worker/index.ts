import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { configureServerEnvironment, type ServerEnvBindings } from "../server/_core/env";
import { configureDatabase } from "../server/db";

type Env = ServerEnvBindings & {
  HYPERDRIVE: { connectionString: string };
  ASSETS: Fetcher;
  API_ALLOWED_ORIGINS?: string;
  JWT_SECRET?: string;
};

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  const configured = (env.API_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured.length === 0 || configured.includes(origin)) return origin;
  if (origin.includes("localhost") || origin.includes("127.0.0.1")) return origin;
  return null;
}

function withCors(response: Response, request: Request, env: Env): Response {
  const origin = allowedOrigin(request, env);
  if (!origin) return response;
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", origin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Vary", "Origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function json(data: unknown, status = 200, request?: Request, env?: Env) {
  const response = Response.json(data, { status });
  return request && env ? withCors(response, request, env) : response;
}

// ===== دوال JWT المصلحة =====
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  let keyData = encoder.encode(secret);
  
  // التأكد من أن المفتاح بطول 32 بايت (256 بت) لـ HMAC-SHA256
  if (keyData.byteLength < 32) {
    const padded = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      padded[i] = keyData[i % keyData.byteLength];
    }
    keyData = padded;
  } else if (keyData.byteLength > 32) {
    keyData = keyData.slice(0, 32);
  }

  return await crypto.subtle.importKey(
    'raw',
    keyData.buffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function signJWT(payload: any, secret: string): Promise<string> {
  const key = await getCryptoKey(secret);
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  
  const payloadWithExp = {
    ...payload,
    iat: now,
    exp: now + 604800 // 7 أيام
  };

  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  
  const encodedPayload = btoa(JSON.stringify(payloadWithExp))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const encoder = new TextEncoder();
  const signatureData = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput));
  
  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureData)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

async function verifyJWT(token: string, secret: string): Promise<any> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const key = await getCryptoKey(secret);
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const encoder = new TextEncoder();
    
    const sigBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(signatureInput));
    
    if (!isValid) return null;

    const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
// ===== نهاية دوال JWT =====

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      configureServerEnvironment(env);
      configureDatabase(env.HYPERDRIVE.connectionString);

      // التحقق من وجود JWT_SECRET
      if (!env.JWT_SECRET || env.JWT_SECRET.length < 10) {
        console.error('JWT_SECRET is not configured properly');
        // نستمر في التشغيل ولكن مع تحذير
      }

      if (request.method === "OPTIONS") {
        return withCors(new Response(null, { status: 204 }), request, env);
      }

      const url = new URL(request.url);

      // ===== صحة الخدمة =====
      if (url.pathname === "/api/health") {
        return json({ ok: true, service: "CwaAX API", timestamp: Date.now() }, 200, request, env);
      }

      // ===== تسجيل مستخدم جديد =====
      if (url.pathname === "/api/auth/register" && request.method === "POST") {
        try {
          if (!env.JWT_SECRET) {
            return json({ error: "JWT_SECRET not configured" }, 500, request, env);
          }

          const body = await request.json() as { email: string; password: string; name?: string };
          if (!body.email || !body.password) {
            return json({ error: "Email and password required" }, 400, request, env);
          }

          // هنا يمكنك إضافة منطق التسجيل الخاص بك
          // مثال مبسط:
          const userId = crypto.randomUUID();
          const token = await signJWT({ userId, email: body.email }, env.JWT_SECRET);

          return json({
            success: true,
            user: { id: userId, email: body.email, name: body.name || body.email.split('@')[0] },
            token: token
          }, 201, request, env);
        } catch (error) {
          console.error("[Register] Error:", error);
          return json({ error: (error as Error).message }, 500, request, env);
        }
      }

      // ===== تسجيل الدخول =====
      if (url.pathname === "/api/auth/login" && request.method === "POST") {
        try {
          if (!env.JWT_SECRET) {
            return json({ error: "JWT_SECRET not configured" }, 500, request, env);
          }

          const body = await request.json() as { email: string; password: string };
          if (!body.email || !body.password) {
            return json({ error: "Email and password required" }, 400, request, env);
          }

          // هنا يمكنك إضافة منطق تسجيل الدخول الخاص بك
          // مثال مبسط:
          const token = await signJWT({ userId: "user-id", email: body.email }, env.JWT_SECRET);

          return json({
            success: true,
            user: { id: "user-id", email: body.email },
            token: token
          }, 200, request, env);
        } catch (error) {
          console.error("[Login] Error:", error);
          return json({ error: (error as Error).message }, 500, request, env);
        }
      }

      // ===== التحقق من JWT =====
      if (url.pathname === "/api/auth/verify" && request.method === "GET") {
        try {
          if (!env.JWT_SECRET) {
            return json({ error: "JWT_SECRET not configured" }, 500, request, env);
          }

          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return json({ error: "No token provided" }, 401, request, env);
          }

          const token = authHeader.split(" ")[1];
          const payload = await verifyJWT(token, env.JWT_SECRET);

          if (!payload) {
            return json({ error: "Invalid or expired token" }, 401, request, env);
          }

          return json({ valid: true, user: payload }, 200, request, env);
        } catch (error) {
          console.error("[Verify] Error:", error);
          return json({ error: (error as Error).message }, 500, request, env);
        }
      }

      // ===== tRPC =====
      if (url.pathname === "/api/trpc" || url.pathname.startsWith("/api/trpc/")) {
        const response = await fetchRequestHandler({
          endpoint: "/api/trpc",
          req: request,
          router: appRouter,
          createContext: ({ req }) => createContext({ req }),
          onError({ path, error }) {
            console.error("[tRPC]", path, error);
          },
        });
        return withCors(response, request, env);
      }

      // ===== 404 =====
      if (url.pathname.startsWith("/api/")) {
        return json({ error: "API endpoint not found" }, 404, request, env);
      }

      // ===== Assets =====
      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error("[Worker] Request failed", error);
      return json({ error: "Internal server error" }, 500, request, env);
    }
  },
};
