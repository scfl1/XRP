export interface Env {
  JWT_SECRET?: string;
  HYPERDRIVE?: { connectionString: string };
  ASSETS?: Fetcher;
  API_ALLOWED_ORIGINS?: string;
}

// ===== دوال JWT =====
async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  let keyData = encoder.encode(secret);
  
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
    exp: now + 604800
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

// ===== تخزين مؤقت للمستخدمين =====
const users = new Map();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ✅ التحقق من JWT_SECRET
    const JWT_SECRET = env.JWT_SECRET;
    
    if (!JWT_SECRET || JWT_SECRET.length < 10) {
      return new Response(JSON.stringify({
        error: "JWT_SECRET is required",
        solution: "Add JWT_SECRET to environment variables in Cloudflare Dashboard"
      }), {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    // ===== تسجيل حساب جديد =====
    if (path === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string; name?: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // التحقق من وجود المستخدم
        for (const [id, user] of users) {
          if (user.email === body.email) {
            return new Response(JSON.stringify({ error: 'User already exists' }), {
              status: 409,
              headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
          }
        }

        // إنشاء مستخدم جديد
        const userId = crypto.randomUUID();
        const newUser = {
          id: userId,
          email: body.email,
          name: body.name || body.email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        users.set(userId, newUser);

        // إنشاء JWT
        const token = await signJWT(
          { userId, email: body.email, name: newUser.name },
          JWT_SECRET
        );

        return new Response(JSON.stringify({
          success: true,
          user: { id: userId, email: body.email, name: newUser.name },
          token: token
        }), {
          status: 201,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Registration failed',
          details: (error as Error).message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // ===== تسجيل الدخول =====
    if (path === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json() as { email: string; password: string };
        
        if (!body.email || !body.password) {
          return new Response(JSON.stringify({ error: 'Email and password required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // البحث عن المستخدم
        let foundUser = null;
        for (const [id, user] of users) {
          if (user.email === body.email) {
            foundUser = user;
            break;
          }
        }

        if (!foundUser) {
          return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        // إنشاء JWT
        const token = await signJWT(
          { userId: foundUser.id, email: foundUser.email, name: foundUser.name },
          JWT_SECRET
        );

        return new Response(JSON.stringify({
          success: true,
          user: { id: foundUser.id, email: foundUser.email, name: foundUser.name },
          token: token
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Login failed',
          details: (error as Error).message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // ===== التحقق من JWT =====
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
        const payload = await verifyJWT(token, JWT_SECRET);

        if (!payload) {
          return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
          });
        }

        return new Response(JSON.stringify({ 
          valid: true, 
          user: payload 
        }), {
          status: 200,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Verification failed',
          details: (error as Error).message 
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // ===== الصفحة الرئيسية =====
    return new Response(JSON.stringify({
      message: '✅ CwaAX API is running!',
      endpoints: [
        'POST /api/auth/register - Create account',
        'POST /api/auth/login - Login',
        'GET /api/auth/verify - Verify token'
      ],
      status: 'JWT_SECRET is configured ✅'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
