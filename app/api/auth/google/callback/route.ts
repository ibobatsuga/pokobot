import { NextRequest, NextResponse } from "next/server";
import {
  AuthUser,
  createSessionToken,
  OAUTH_STATE_COOKIE_NAME,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

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

  const oauthError = req.nextUrl.searchParams.get("error");
  if (oauthError) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(oauthError)}`, origin));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const rawStateCookie = req.cookies.get(OAUTH_STATE_COOKIE_NAME)?.value;

  let expectedState = "";
  let nextPath = "/";
  try {
    const parsed = JSON.parse(rawStateCookie || "{}");
    expectedState = parsed.state || "";
    if (typeof parsed.next === "string" && parsed.next.startsWith("/")) {
      nextPath = parsed.next;
    }
  } catch {
    expectedState = "";
  }

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", origin));
  }

  try {
    const redirectUri = `${origin}/api/auth/google/callback`;
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", origin));
    }

    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.access_token;
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login?error=missing_access_token", origin));
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=userinfo_failed", origin));
    }

    const profile = await userRes.json();
    if (!profile.email || profile.email_verified === false) {
      return NextResponse.redirect(new URL("/login?error=email_unverified", origin));
    }

    const user: AuthUser = {
      email: String(profile.email).toLowerCase(),
      name: String(profile.name || profile.email.split("@")[0]),
      avatar: typeof profile.picture === "string" ? profile.picture : undefined,
      provider: "google",
    };

    const sessionToken = await createSessionToken(user);
    const res = NextResponse.redirect(new URL(nextPath, origin));

    res.cookies.set(OAUTH_STATE_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.redirect(new URL("/login?error=oauth_unexpected", origin));
  }
}
