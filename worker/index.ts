import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { configureServerEnvironment, type ServerEnvBindings } from "../server/_core/env";
import { configureDatabase } from "../server/db";

type Env = ServerEnvBindings & {
  HYPERDRIVE: { connectionString: string };
  ASSETS: Fetcher;
  API_ALLOWED_ORIGINS?: string;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      configureServerEnvironment(env);
      configureDatabase(env.HYPERDRIVE.connectionString);

      if (request.method === "OPTIONS") {
        return withCors(new Response(null, { status: 204 }), request, env);
      }

      const url = new URL(request.url);

      if (url.pathname === "/api/health") {
        return json({ ok: true, service: "CwaAX API", timestamp: Date.now() }, 200, request, env);
      }

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

      if (url.pathname.startsWith("/api/")) {
        return json({ error: "API endpoint not found" }, 404, request, env);
      }

      return env.ASSETS.fetch(request);
    } catch (error) {
      console.error("[Worker] Request failed", error);
      return json({ error: "Internal server error" }, 500, request, env);
    }
  },
};
