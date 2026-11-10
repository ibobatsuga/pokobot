import { NextResponse } from "next/server";

export async function GET() {
  const connectedNumber = process.env.WAHA_CONNECTED_NUMBER || null;
  const whitelist = process.env.POKOBOT_WHITELIST
    ? process.env.POKOBOT_WHITELIST.split(",").map((s) => s.trim())
    : [];

  return NextResponse.json({
    status: "ok",
    app: "PokoBot by FLUXY.ID",
    version: "1.0.0",
    engine: {
      whatsapp: "WAHA (WhatsApp HTTP API)",
      session: "default",
      connected_number: connectedNumber,
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
  });
}
