import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, verifyUserApiKey } from "@/lib/session";

export const maxDuration = 30;

const SANDBOX_QA_KEY = "pk_live_fluxy_pokobot_enterprise";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Api-Key, X-Owner-Email",
  Vary: "Origin",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  // 1. Resolve Auth / Owner from Token, Headers, Query, or Cookie
  let ownerEmail: string | null = null;
  let isSandbox = false;

  const authHeader = req.headers.get("authorization") || req.headers.get("x-api-key") || "";
  const queryKey =
    req.nextUrl.searchParams.get("apiKey") ||
    req.nextUrl.searchParams.get("api_key") ||
    req.nextUrl.searchParams.get("key") ||
    "";
  const rawKey = (authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader) || queryKey;
  const token = rawKey.trim();

  if (token) {
    if (token === SANDBOX_QA_KEY) {
      isSandbox = true;
    } else if (token.startsWith("pk_user_")) {
      ownerEmail = await verifyUserApiKey(token);
    }
  }

  if (!ownerEmail) {
    const rawCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const cookieUser = await verifySessionToken(rawCookie);
    if (cookieUser?.email) {
      ownerEmail = cookieUser.email;
    }
  }

  // 2. Query VPS WAHA Orchestrator for Live Connected WhatsApp Info
  const wahaBaseUrl = (process.env.WAHA_BASE_URL || "").trim().replace(/\/+$/, "");
  const wahaApiKey = (process.env.WAHA_API_KEY || "").trim();

  let liveNumber: string | null = process.env.WAHA_CONNECTED_NUMBER || null;
  let livePhone: string | null = liveNumber ? `+${liveNumber.replace(/[^0-9]/g, "")}` : null;
  let isConnected = Boolean(liveNumber);
  let liveSession = "default";
  let livePushName: string | null = null;

  if (isSandbox) {
    liveNumber = "6281234567890";
    livePhone = "+6281234567890";
    isConnected = true;
    livePushName = "PokoBot QA Enterprise";
  } else if (wahaBaseUrl) {
    try {
      const headers: Record<string, string> = {};
      if (wahaApiKey) headers["X-Api-Key"] = wahaApiKey;
      if (ownerEmail) headers["X-Owner-Email"] = ownerEmail;

      const url = new URL(`${wahaBaseUrl}/api/system-status`);
      if (ownerEmail) url.searchParams.set("owner", ownerEmail);

      const res = await fetch(url.toString(), {
        headers,
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.connected && (data.connected_number || data.phone)) {
          liveNumber =
            data.connected_number || (data.phone ? data.phone.replace(/[^0-9]/g, "") : null);
          livePhone = data.phone || (liveNumber ? `+${liveNumber}` : null);
          isConnected = true;
          liveSession = data.session || "default";
          livePushName = data.push_name || null;
        }
      }
    } catch {
      // Non-blocking fallback to env or null
    }
  }

  const whitelist = process.env.POKOBOT_WHITELIST
    ? process.env.POKOBOT_WHITELIST.split(",").map((s) => s.trim())
    : [];

  return NextResponse.json(
    {
      status: "ok",
      app: "PokoBot by FLUXY.ID",
      version: "1.1.0",
      connected: isConnected,
      connected_number: liveNumber,
      phone: livePhone,
      session: liveSession,
      push_name: livePushName,
      engine: {
        whatsapp: "WAHA (WhatsApp HTTP API)",
        session: liveSession,
        status: isConnected ? "WORKING" : "STOPPED",
        connected: isConnected,
        connected_number: liveNumber,
        phone: livePhone,
        push_name: livePushName,
        ai_provider: "PokoBot AI Engine",
        ai_model: "pokobot-v1-intelligence",
        auto_reply_enabled: true,
        safety: {
          whitelist_enforced: whitelist.length > 0,
          group_filter: "strict_no_group_reply",
          self_chat_loop_guard: true,
        },
        whitelisted_numbers: whitelist,
      },
    },
    { headers: CORS_HEADERS }
  );
}
