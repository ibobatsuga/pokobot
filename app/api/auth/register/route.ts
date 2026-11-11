import { NextRequest, NextResponse } from "next/server";
import { hashPassword, isValidEmail } from "@/lib/password";
import {
  ACCOUNT_COOKIE_NAME,
  AuthUser,
  createSessionToken,
  SESSION_COOKIE_NAME,
  signPayload,
  StoredAccountPayload,
} from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Nama lengkap minimal 2 karakter." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Format alamat email / Gmail tidak valid." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter." }, { status: 400 });
    }

    const accountPayload: StoredAccountPayload = {
      email,
      name,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    const user: AuthUser = {
      email,
      name,
      provider: "email",
    };

    const [accountToken, sessionToken] = await Promise.all([
      signPayload(accountPayload),
      createSessionToken(user),
    ]);

    const res = NextResponse.json({ ok: true, user }, { status: 201 });
    const secure = process.env.NODE_ENV === "production";

    res.cookies.set(ACCOUNT_COOKIE_NAME, accountToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    res.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Gagal memproses pendaftaran akun." }, { status: 500 });
  }
}
