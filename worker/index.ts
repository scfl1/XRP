export default {
  async fetch(request: Request, env: any): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ===== جلب المفتاح من البيئة =====
    // المتغير موجود في Cloudflare Dashboard باسم JWT_SECRET
    const JWT_SECRET = env.JWT_SECRET || "my-fallback-secret-key-32-chars-long!!";

    // ===== دوال التشفير =====
    async function generateToken(payload: any): Promise<string> {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(JWT_SECRET);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payloadBase64 = btoa(JSON.stringify(payload));
      
      const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(`${header}.${payloadBase64}`)
      );

      const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
      
      return `${header}.${payloadBase64}.${signatureBase64}`;
    }

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // ===== تسجيل حساب =====
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const userId = crypto.randomUUID();
        const token = await generateToken({
          userId,
          email: body.email,
          exp: Math.floor(Date.now() / 1000) + 604800 // 7 أيام
        });

        return new Response(JSON.stringify({
          success: true,
          user: { id: userId, email: body.email },
          token: token
        }), {
          status: 201,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ===== تسجيل دخول =====
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const token = await generateToken({
          userId: 'user-123',
          email: body.email,
          exp: Math.floor(Date.now() / 1000) + 604800
        });

        return new Response(JSON.stringify({
          success: true,
          user: { id: 'user-123', email: body.email },
          token: token
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ===== التحقق من التوكن =====
    if (path === '/api/auth/verify' && request.method === 'GET') {
      try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return new Response(JSON.stringify({ error: 'No token provided' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const token = authHeader.split(' ')[1];
        const parts = token.split('.');
        
        if (parts.length !== 3) {
          return new Response(JSON.stringify({ error: 'Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        const payload = JSON.parse(atob(parts[1]));
        
        // التحقق من الانتهاء
        if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
          return new Response(JSON.stringify({ error: 'Token expired' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        return new Response(JSON.stringify({ valid: true, user: payload }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ error: (error as Error).message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // ===== الصفحة الرئيسية =====
    return new Response(JSON.stringify({
      message: '✅ CwaAX API is running!',
      endpoints: [
        'POST /api/auth/register',
        'POST /api/auth/login', 
        'GET /api/auth/verify (requires Bearer token)'
      ]
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
