import { NextRequest, NextResponse } from "next/server";
import { createUserApiKey, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function GET(req: NextRequest) {
  const user = await verifySessionToken(req.cookies.get(SESSION_COOKIE_NAME)?.value);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = await createUserApiKey(user.email);
  return NextResponse.json(
    {
      email: user.email,
      apiKey,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
