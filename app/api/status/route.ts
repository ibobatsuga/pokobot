import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "PokoBot by FLUXY.ID",
    version: "1.0.0",
    engine: {
      whatsapp: "WAHA (WhatsApp HTTP API)",
      session: "default",
      connected_number: "+6289637370000",
      ai_provider: "Sakelar AI Gateway",
      ai_model: "openai/gpt-6-luna",
      auto_reply_enabled: false,
      safety: {
        whitelist_enforced: true,
        group_filter: "strict_no_group_reply",
        self_chat_loop_guard: true,
      },
      whitelisted_numbers: [
        "6281802731947",
        "6281226300090",
        "6289637370000",
      ],
    },
  });
}
