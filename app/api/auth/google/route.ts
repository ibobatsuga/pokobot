import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { OAUTH_STATE_COOKIE_NAME } from "@/lib/session";

function getPublicOrigin(req: NextRequest): string {
  const proto = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return host ? `${proto}://${host}` : req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const origin = getPublicOrigin(req);
  const clientId = (process.env.GOOGLE_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || "").trim();

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/login?error=google_not_configured", origin));
  }

  const nextPath = req.nextUrl.searchParams.get("next") || "/";
  const state = crypto.randomBytes(24).toString("hex");
  const redirectUri = `${origin}/api/auth/google/callback`;

  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.searchParams.set("client_id", clientId);
  googleUrl.searchParams.set("redirect_uri", redirectUri);
  googleUrl.searchParams.set("response_type", "code");
  googleUrl.searchParams.set("scope", "openid email profile");
  googleUrl.searchParams.set("access_type", "online");
  googleUrl.searchParams.set("prompt", "select_account");
  googleUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(googleUrl);
  const cookiePayload = JSON.stringify({ state, next: nextPath.startsWith("/") ? nextPath : "/" });
  res.cookies.set(OAUTH_STATE_COOKIE_NAME, cookiePayload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return res;
}
