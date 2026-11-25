import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken, getUserPlanInfo } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const rawUser = await verifySessionToken(token);
  const planInfo = getUserPlanInfo(rawUser?.email);
  const user = rawUser
    ? {
        ...rawUser,
        plan: planInfo.plan,
        credits: planInfo.credits,
        isUnlimited: planInfo.isUnlimited,
      }
    : null;
  const googleOAuthConfigured = Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim()
  );

  return NextResponse.json({
    authenticated: Boolean(user),
    user,
    plan: user ? planInfo : null,
    googleOAuthConfigured,
  });
}
