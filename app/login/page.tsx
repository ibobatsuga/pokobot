"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Bot,
  Smartphone,
  Sparkles,
} from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  google_not_configured:
    "Login Google OAuth belum diaktifkan di server (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET belum diisi di Vercel). Silakan daftar atau masuk menggunakan Email Gmail & Password di bawah.",
  access_denied: "Akses login Google dibatalkan.",
  invalid_oauth_state: "Sesi otentikasi Google kadaluarsa. Silakan coba lagi.",
  token_exchange_failed: "Gagal menukar token otorisasi dengan Google.",
  missing_access_token: "Token akses Google tidak diterima.",
  userinfo_failed: "Gagal mengambil profil akun Google.",
  email_unverified: "Email Google Anda belum terverifikasi.",
  oauth_unexpected: "Terjadi gangguan saat login dengan Google. Silakan coba lagi.",
};

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
      />
    </svg>
  );
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    urlError ? ERROR_MESSAGES[urlError] || `Login gagal: ${urlError}` : null
  );
  const [googleReady, setGoogleReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (urlError) {
      setErrorMsg(ERROR_MESSAGES[urlError] || `Login gagal: ${urlError}`);
    }
  }, [urlError]);

  useEffect(() => {
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setGoogleReady(Boolean(data.googleOAuthConfigured));
        if (data.authenticated) {
          router.replace(nextPath.startsWith("/") ? nextPath : "/");
        }
      })
      .catch(() => {
        setGoogleReady(false);
      });
  }, [nextPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload = mode === "register" ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Gagal memproses autentikasi.");
        return;
      }

      router.replace(nextPath.startsWith("/") ? nextPath : "/");
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const googleHref = `/api/auth/google?next=${encodeURIComponent(nextPath.startsWith("/") ? nextPath : "/")}`;

  return (
    <div className="min-h-screen w-full bg-poko-canvas flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-4xl overflow-hidden bg-white border border-poko-border shadow-card">
        {/* LEFT BRAND PANEL */}
        <div className="lg:col-span-5 bg-poko-charcoal text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          <div className="space-y-8 relative z-10">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="PokoBot"
                className="w-11 h-11 rounded-full object-contain bg-white p-1 border border-white/20"
              />
              <div>
                <div className="text-lg font-bold tracking-tight leading-none">PokoBot</div>
                <p className="text-xs text-stone-400 mt-1">by FLUXY.ID</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-[11px] font-semibold border border-white/10">
                <Sparkles className="w-3.5 h-3.5" />
                AI WhatsApp Automation & CRM
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                Kelola Banyak WhatsApp &amp; CS AI dalam Satu Workspace.
              </h1>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Hubungkan berbagai nomor WhatsApp bisnis dengan QR instan, balas pelanggan otomatis 24/7, dan pantau pipeline CRM secara real-time.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Smartphone className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Multi-Device WhatsApp</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Tambahkan lebih dari 1 nomor WA dengan label toko/CS dan switcher dropdown.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <Bot className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold">Zero-Setup Cloud Gateway</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Langsung scan QR Code dari dashboard tanpa perlu konfigurasi server manual.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 relative z-10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Sesi Terenkripsi HTTP-Only
            </span>
            <span>pokobot.fluxy.id</span>
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-poko-charcoal tracking-tight">
                {mode === "login" ? "Masuk ke Workspace" : "Buat Akun PokoBot"}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {mode === "login"
                  ? "Gunakan akun Gmail atau email terdaftar Anda untuk melanjutkan."
                  : "Daftarkan akun workspace baru dalam hitungan detik."}
              </p>
            </div>

            {/* GOOGLE / GMAIL OAUTH BUTTON */}
            <div className="space-y-2">
              <a
                href={googleHref}
                className="w-full h-11 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-poko-charcoal text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-xs"
              >
                <GoogleIcon />
                <span>Masuk dengan Google</span>
              </a>

              {googleReady === false && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 leading-relaxed">
                  Info Admin: Tombol 1-klik Google OAuth membutuhkan{" "}
                  <code className="font-mono font-semibold">GOOGLE_CLIENT_ID</code> &amp;{" "}
                  <code className="font-mono font-semibold">GOOGLE_CLIENT_SECRET</code> di Vercel. Untuk saat ini Anda bisa langsung mendaftar &amp; login memakai alamat Gmail + Password di bawah.
                </p>
              )}
            </div>

            {/* DIVIDER */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-stone-200" />
              <span className="shrink mx-3 text-[11px] font-medium text-stone-400 uppercase tracking-wider">
                atau dengan Email
              </span>
              <div className="flex-grow border-t border-stone-200" />
            </div>

            {/* MODE TABS */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-100 border border-stone-200/70">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === "login"
                    ? "bg-white text-poko-charcoal shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                  mode === "register"
                    ? "bg-white text-poko-charcoal shadow-xs"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Daftar Akun
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* EMAIL & PASSWORD FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nama Anda atau Nama Bisnis"
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Alamat Gmail / Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-poko-charcoal text-white text-xs sm:text-sm font-semibold hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span>
                  {loading
                    ? "Memproses..."
                    : mode === "login"
                    ? "Masuk ke Dashboard"
                    : "Daftar & Masuk Sekarang"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-poko-canvas flex items-center justify-center text-xs text-stone-500">
          Memuat halaman login...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
