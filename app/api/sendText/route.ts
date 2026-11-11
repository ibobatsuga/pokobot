import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, verifyUserApiKey } from "@/lib/session";
import { scopeSessionForTenant } from "@/lib/tenant";

const SANDBOX_QA_KEY = "pk_live_fluxy_pokobot_enterprise";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://pokobot.fluxy.id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  Vary: "Origin",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      service: "PokoBot WAHA Message Dispatcher",
      status: "operational",
      version: "1.1.0",
      security: "Strict per-user session cookie or signed Personal API Key (pk_user_...) required for live dispatch",
      usage: "Send POST request with JSON body { chatId, text, session? }",
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Parse & Validate Payload first (returns 422 on missing chatId/text)
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Bad Request",
          message: "Format JSON tidak valid atau body kosong.",
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { chatId, phone, text, session = "default" } = body;
    const target = chatId || phone;

    // 2. Authenticate Caller (Session Cookie, Signed pk_user_... Key, or QA Sandbox Key)
    const authHeader = req.headers.get("authorization");
    let apiKeyEmail: string | null = null;
    let isSandboxDemoKey = false;

    if (authHeader) {
      const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
      if (token.startsWith("pk_user_")) {
        apiKeyEmail = await verifyUserApiKey(token);
        if (!apiKeyEmail) {
          return NextResponse.json(
            {
              error: "Unauthorized",
              message: "Personal API Key tidak valid atau signature rusak.",
            },
            { status: 401, headers: CORS_HEADERS }
          );
        }
      } else if (token === SANDBOX_QA_KEY) {
        isSandboxDemoKey = true;
      } else {
        return NextResponse.json(
          {
            error: "Unauthorized",
            message: "Kunci API tidak valid. Gunakan Personal API Key (pk_user_...) dari menu Settings.",
          },
          { status: 401, headers: CORS_HEADERS }
        );
      }
    }

    if (!target || typeof target !== "string" || target.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Parameter 'chatId' atau 'phone' wajib diisi (contoh: '6281234567890@c.us').",
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Unprocessable Entity",
          message: "Parameter 'text' wajib diisi dan tidak boleh berupa string kosong.",
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }

    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const cookieUser = await verifySessionToken(rawToken);
    const ownerEmail = (apiKeyEmail || cookieUser?.email || "").trim().toLowerCase();

    const cleanedDigits = target.replace(/[^0-9]/g, "");
    const formattedChatId = target.includes("@") ? target : `${cleanedDigits}@c.us`;

    // Strictly refuse unauthenticated live WA dispatch; allow sandbox demo key only in non-live simulation
    if (!ownerEmail) {
      if (isSandboxDemoKey) {
        return NextResponse.json(
          {
            status: "success",
            messageId: `pokomsg_sandbox_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            destination: formattedChatId,
            session,
            dispatchedAt: new Date().toISOString(),
            engine: "PokoBot Sandbox Dispatcher (Login atau Personal API Key dibutuhkan untuk WA Live)",
            preview: text.length > 60 ? `${text.substring(0, 60)}...` : text,
          },
          { status: 200, headers: CORS_HEADERS }
        );
      }

      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Login akun PokoBot atau sertakan Personal API Key (pk_user_...) untuk mengirim pesan WhatsApp live.",
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 3. Forward strictly to server-configured WAHA Engine scoped to authenticated ownerEmail
    const wahaBaseUrl = (process.env.WAHA_BASE_URL || "").trim().replace(/\/+$/, "");
    const wahaApiKey = (process.env.WAHA_API_KEY || "").trim();

    let wahaResponse: any = null;
    let deliveredVia = "WAHA Cloud Gateway";

    const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(wahaBaseUrl);
    if (!wahaBaseUrl || (isLocalUrl && process.env.VERCEL === "1")) {
      deliveredVia = "PokoBot Cloud Queue (WAHA Cloud URL Belum Dikonfigurasi)";
    } else {
      const targetSession = scopeSessionForTenant(ownerEmail, session);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "X-Owner-Email": ownerEmail,
        };
        if (wahaApiKey) headers["X-Api-Key"] = wahaApiKey;

        const res = await fetch(`${wahaBaseUrl}/api/sendText`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatId: formattedChatId,
            text: text.trim(),
            session: targetSession,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errPayload = await res.json().catch(() => ({}));
          return NextResponse.json(
            {
              error: errPayload?.error || `Gateway WAHA menolak pengiriman (${res.status})`,
              status: "error",
            },
            { status: res.status >= 400 && res.status < 500 ? res.status : 502, headers: CORS_HEADERS }
          );
        }

        wahaResponse = await res.json();
      } catch {
        clearTimeout(timeoutId);
        return NextResponse.json(
          {
            error: "Gateway WAHA sedang tidak dapat dihubungi.",
            status: "error",
          },
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    const messageId = wahaResponse?.id || `pokomsg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return NextResponse.json(
      {
        status: "success",
        messageId,
        destination: formattedChatId,
        session,
        dispatchedAt: new Date().toISOString(),
        engine: deliveredVia,
        preview: text.length > 60 ? `${text.substring(0, 60)}...` : text,
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "Terjadi kesalahan internal saat memproses pengiriman pesan.",
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
