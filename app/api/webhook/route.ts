import { NextRequest, NextResponse } from "next/server";

const WHITELIST = ["6281802731947", "6281226300090", "6289637370000"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check event
    const event = body.event || "unknown";
    if (event !== "message" && event !== "message.any") {
      return NextResponse.json({ status: "ignored", reason: `unhandled event ${event}` });
    }

    const payload = body.payload || {};
    const from = payload.from || "";
    const isGroup = from.includes("@g.us");

    // 1. Strict Group Filter
    if (isGroup) {
      return NextResponse.json({ status: "ignored", reason: "group message ignored" });
    }

    // 2. Extract digits
    const digits = from.replace(/[^0-9]/g, "");
    const isWhitelisted = WHITELIST.some((w) => digits.includes(w) || w.includes(digits));

    if (!isWhitelisted) {
      return NextResponse.json({ status: "ignored", reason: "number not in whitelist" });
    }

    const messageText = payload.body || "";

    return NextResponse.json({
      status: "received",
      event,
      from: digits,
      text_preview: messageText.substring(0, 50),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ready", service: "Poko Webhook Gateway" });
}
