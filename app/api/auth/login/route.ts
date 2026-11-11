import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, verifyPassword } from "@/lib/password";
import {
  ACCOUNT_COOKIE_NAME,
  AuthUser,
  createSessionToken,
  SESSION_COOKIE_NAME,
  StoredAccountPayload,
  verifyPayload,
} from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Format alamat email / Gmail tidak valid." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Password wajib diisi." }, { status: 400 });
    }

    let matchedUser: AuthUser | null = null;

    // 1. Optional configured Workspace Admin credentials
    const adminEmail = (process.env.POKOBOT_ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPass = process.env.POKOBOT_ADMIN_PASSWORD || "";
    if (adminEmail && adminPass && email === adminEmail && password === adminPass) {
      matchedUser = {
        email: adminEmail,
        name: process.env.POKOBOT_ADMIN_NAME || "Admin PokoBot",
        provider: "email",
      };
    }

    // 2. Registered user account stored in signed HTTP-only cookie
    if (!matchedUser) {
      const accountToken = req.cookies.get(ACCOUNT_COOKIE_NAME)?.value;
      const stored = await verifyPayload<StoredAccountPayload>(accountToken);
      if (stored && stored.email === email && verifyPassword(password, stored.passwordHash)) {
        matchedUser = {
          email: stored.email,
          name: stored.name,
          provider: "email",
        };
      }
    }

    if (!matchedUser) {
      return NextResponse.json(
        { error: "Email atau password salah. Jika belum memiliki akun, silakan pilih tab Daftar Akun." },
        { status: 401 }
      );
    }

    const sessionToken = await createSessionToken(matchedUser);
    const res = NextResponse.json({ ok: true, user: matchedUser });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan saat masuk." }, { status: 500 });
  }
}
