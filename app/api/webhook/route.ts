import { NextRequest, NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

// In-memory LRU-like set for message deduplication (prevents duplicate webhook replays)
const processedMessageIds = new Set<string>();
const MAX_CACHE_SIZE = 1000;

const DEFAULT_WHITELIST = ["6281802731947", "6281226300090", "6289637370000"];

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      status: "operational",
      service: "PokoBot Webhook Ingestion Gateway",
      provider: "FLUXY.ID",
      version: "1.0.0",
      activeGuards: [
        "Anti-loop Self-Chat Guard (fromMe check)",
        "Strict Group Message Isolation (@g.us filter)",
        "Duplicate Message ID Deduplication Cache",
        "Whitelist Number Verification",
      ],
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const event = body.event || "unknown";
    const payload = body.payload || {};

    // 1. Filter out unhandled events
    if (event !== "message" && event !== "message.any") {
      return NextResponse.json(
        { status: "ignored", reason: `Event '${event}' diabaikan (hanya memproses event message)` },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 2. CRITICAL LOOP GUARD: Discard messages sent by the bot itself
    if (payload.fromMe === true) {
      return NextResponse.json(
        { status: "ignored", reason: "Pesan dari bot sendiri (fromMe: true) diabaikan untuk mencegah loop tak terbatas" },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 3. DEDUPLICATION: Prevent duplicate webhooks
    const messageId = payload.id || payload._serialized;
    if (messageId) {
      if (processedMessageIds.has(messageId)) {
        return NextResponse.json(
          { status: "ignored", reason: "Pesan duplikat telah diproses sebelumnya", messageId },
          { status: 200, headers: CORS_HEADERS }
        );
      }
      if (processedMessageIds.size >= MAX_CACHE_SIZE) {
        processedMessageIds.clear();
      }
      processedMessageIds.add(messageId);
    }

    // 4. GROUP FILTER: Strict isolation of group messages
    const from = String(payload.from || "");
    if (from.endsWith("@g.us") || from.includes("group")) {
      return NextResponse.json(
        { status: "ignored", reason: "Pesan grup WhatsApp (@g.us) diabaikan sesuai SOP keamanan" },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 5. PHONE SANITIZATION & WHITELIST CHECK
    let digits = from.replace(/[^0-9]/g, "");
    if (digits.startsWith("0")) {
      digits = "62" + digits.substring(1);
    }

    const whitelist = process.env.POKOBOT_WHITELIST
      ? process.env.POKOBOT_WHITELIST.split(",").map((s) => s.trim())
      : DEFAULT_WHITELIST;

    const isWhitelisted = whitelist.some(
      (w) => digits.includes(w) || w.includes(digits)
    );

    if (!isWhitelisted) {
      return NextResponse.json(
        {
          status: "ignored",
          reason: `Nomor ${digits} belum terdaftar di whitelist keamanan PokoBot`,
        },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 6. PROCESS MESSAGE
    const messageText = payload.body || "";

    return NextResponse.json(
      {
        status: "accepted",
        event,
        messageId,
        from: digits,
        textPreview: messageText.substring(0, 80),
        intentDetected: messageText.toLowerCase().includes("ongkir")
          ? "Cek Ongkir Otomatis"
          : messageText.toLowerCase().includes("qris")
          ? "Kirim QRIS Pembayaran"
          : "General Inbound Inquiry",
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Webhook Error", message: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
