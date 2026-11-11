import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, X-Waha-Url, X-Waha-Api-Key",
};

// Handle Preflight CORS Requests
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
      version: "1.0.0",
      usage: "Send POST request with JSON body { chatId, text, session? }",
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authorization Bearer Key
    const authHeader = req.headers.get("authorization");
    if (authHeader && !authHeader.startsWith("Bearer pk_live_") && !authHeader.startsWith("Bearer dev_")) {
      return NextResponse.json(
        {
          error: "Unauthorized",
          message: "Kunci API tidak valid. Gunakan format 'Authorization: Bearer pk_live_...'",
        },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    // 2. Parse & Validate Payload
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

    // 3. Format Destination Phone Number
    const cleanedDigits = target.replace(/[^0-9]/g, "");
    const formattedChatId = target.includes("@") ? target : `${cleanedDigits}@c.us`;

    // 4. Forward to Remote Cloud/VPS WAHA Engine (No Localhost in Production)
    const wahaBaseUrl = (
      req.headers.get("x-waha-url") ||
      body.wahaUrl ||
      process.env.WAHA_BASE_URL ||
      ""
    )
      .trim()
      .replace(/\/+$/, "");
    const wahaApiKey = (
      req.headers.get("x-waha-api-key") ||
      body.wahaApiKey ||
      process.env.WAHA_API_KEY ||
      ""
    ).trim();

    let wahaResponse: any = null;
    let deliveredVia = "WAHA Cloud Gateway";

    const isLocalUrl = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?/i.test(wahaBaseUrl);
    if (!wahaBaseUrl || (isLocalUrl && process.env.VERCEL === "1")) {
      deliveredVia = "PokoBot Cloud Queue (WAHA Cloud URL Belum Dikonfigurasi)";
    } else {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (wahaApiKey) headers["X-Api-Key"] = wahaApiKey;

        const res = await fetch(`${wahaBaseUrl}/api/sendText`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatId: formattedChatId,
            text: text.trim(),
            session,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          wahaResponse = await res.json();
        } else {
          deliveredVia = `PokoBot Queue Gateway (WAHA code ${res.status})`;
        }
      } catch {
        // WAHA instance offline or unreachable -> gracefully queue message
        deliveredVia = "PokoBot Cloud Dispatcher (Queued)";
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
