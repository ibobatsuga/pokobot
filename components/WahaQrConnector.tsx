"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  QrCode,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Cloud,
  Key,
  X,
  Maximize2,
  Loader2,
  Copy,
  Check,
  Smartphone,
  Server,
} from "lucide-react";
import {
  getSavedWahaConfig,
  saveWahaConfig,
  saveConnectedDevice,
  formatWhatsAppNumber,
  buildWahaHeaders,
  isLocalhostUrl,
} from "@/lib/wahaClient";

interface WahaQrConnectorProps {
  mode: "inline" | "modal";
  isOpen?: boolean;
  onClose?: () => void;
  onOpenPopup?: () => void;
  onConnected?: (sessionInfo: { session: string; phone: string; name: string }) => void;
}

export function WahaQrConnector({
  mode,
  isOpen = true,
  onClose,
  onOpenPopup,
  onConnected,
}: WahaQrConnectorProps) {
  const [wahaUrl, setWahaUrl] = useState("");
  const [wahaApiKey, setWahaApiKey] = useState("");
  const [sessionName, setSessionName] = useState("default");
  const [showServerConfig, setShowServerConfig] = useState(false);

  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [testLatency, setTestLatency] = useState<number | null>(null);

  useEffect(() => {
    const saved = getSavedWahaConfig();
    if (saved.url) setWahaUrl(saved.url);
    if (saved.apiKey) setWahaApiKey(saved.apiKey);
    if (saved.session) setSessionName(saved.session);
  }, [isOpen]);

  const fetchQrFromWaha = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      setErrorMsg(null);

      try {
        const saved = getSavedWahaConfig();
        const activeUrl = wahaUrl.trim() || saved.url;
        const activeKey = wahaApiKey.trim() || saved.apiKey;
        const activeSession = sessionName.trim() || saved.session || "default";

        if (activeUrl && isLocalhostUrl(activeUrl)) {
          setNotConfigured(true);
          setShowServerConfig(true);
          setErrorMsg(
            "URL localhost/127.0.0.1 tidak didukung di Cloud. Gunakan URL Server WAHA Cloud/VPS publik (https://...)."
          );
          setLoading(false);
          return;
        }

        const headers = buildWahaHeaders({
          url: activeUrl,
          apiKey: activeKey,
          session: activeSession,
        });

        const res = await fetch(`/api/waha?action=qr&session=${encodeURIComponent(activeSession)}`, {
          headers,
          cache: "no-store",
        });
        const data = await res.json();

        if (data.configured === false) {
          setNotConfigured(true);
          setShowServerConfig(true);
          setQrImageDataUrl(null);
          setStatus("UNCONFIGURED");
          setErrorMsg(null);
          setLoading(false);
          return;
        }

        setNotConfigured(false);

        if (data.connected === false && data.error) {
          setErrorMsg(data.error);
          setQrImageDataUrl(null);
          setStatus("ERROR");
          setLoading(false);
          return;
        }

        if (data.status === "WORKING") {
          const phone = formatWhatsAppNumber(data.me?.id) || "Terhubung";
          const pushName = data.me?.pushName || "WhatsApp Bisnis";
          setStatus("WORKING");
          setQrImageDataUrl(null);
          saveConnectedDevice({ phone, name: pushName, session: activeSession });
          if (onConnected) {
            onConnected({ session: activeSession, phone, name: pushName });
          }
          setLoading(false);
          return;
        }

        if (data.qrImageDataUrl) {
          setQrImageDataUrl(data.qrImageDataUrl);
          setStatus("SCAN_QR_CODE");
          setCountdown(15);
        } else {
          setStatus(data.status || "STARTING");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Gagal mengambil QR Code dari server WAHA.");
      } finally {
        setLoading(false);
      }
    },
    [wahaUrl, wahaApiKey, sessionName, onConnected]
  );

  // Initial fetch when open
  useEffect(() => {
    if (mode === "modal" && !isOpen) return;
    fetchQrFromWaha();
  }, [mode, isOpen, fetchQrFromWaha]);

  // Countdown & auto-refresh QR every 15s + poll WORKING status every 3s
  useEffect(() => {
    if (mode === "modal" && !isOpen) return;
    if (notConfigured || status === "WORKING") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchQrFromWaha(true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    const statusPoll = setInterval(() => {
      if (status === "SCAN_QR_CODE" || status === "STARTING") {
        fetchQrFromWaha(true);
      }
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(statusPoll);
    };
  }, [mode, isOpen, notConfigured, status, fetchQrFromWaha]);

  const handleSaveAndConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = wahaUrl.trim().replace(/\/+$/, "");

    if (!cleaned) {
      setErrorMsg("Masukkan URL Server WAHA Cloud/VPS terlebih dahulu.");
      return;
    }

    if (isLocalhostUrl(cleaned)) {
      setErrorMsg("Dilarang menggunakan localhost. Masukkan domain/IP publik Cloud/VPS WAHA Anda.");
      return;
    }

    saveWahaConfig({
      url: cleaned,
      apiKey: wahaApiKey.trim(),
      session: sessionName.trim() || "default",
    });

    setLoading(true);
    setErrorMsg(null);
    setTestLatency(null);

    try {
      const testRes = await fetch("/api/waha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test",
          wahaUrl: cleaned,
          wahaApiKey: wahaApiKey.trim(),
        }),
      });
      const testData = await testRes.json();
      if (testData.ok) {
        setTestLatency(testData.latencyMs || 120);
        setShowServerConfig(false);
        await fetchQrFromWaha();
      } else {
        setErrorMsg(testData.error || "Server WAHA tidak merespons.");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const webhookOrigin = typeof window !== "undefined" ? window.location.origin : "https://ping-clone-poc.vercel.app";
  const dockerCmd = `docker run -d --name pokobot-waha -p 3000:3000 -e WHATSAPP_HOOK_URL=${webhookOrigin}/api/webhook -e WAHA_API_KEY=pk_waha_secret devlikeapro/waha:latest`;

  const handleCopyDocker = () => {
    navigator.clipboard.writeText(dockerCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (mode === "modal" && !isOpen) return null;

  const content = (
    <div className="space-y-5">
      {/* Header Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-poko-charcoal">
              Tautkan WhatsApp via Cloud WAHA
            </h3>
            <p className="text-[11px] text-stone-500">
              {notConfigured
                ? "Hubungkan URL Server WAHA Cloud/VPS Anda untuk memunculkan QR Code"
                : status === "WORKING"
                ? "Perangkat WhatsApp terhubung dan siap digunakan"
                : "Scan QR Code langsung dari WhatsApp HP Anda"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowServerConfig((prev) => !prev)}
            className="px-3 py-1.5 rounded-xl border border-poko-border bg-white text-[11px] font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-600" />
            <span>{showServerConfig ? "Tutup Pengaturan Server" : "Atur Server WAHA"}</span>
          </button>

          {mode === "inline" && onOpenPopup && (
            <button
              type="button"
              onClick={onOpenPopup}
              className="px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-[11px] font-semibold hover:bg-black flex items-center gap-1.5 shadow-xs"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Buka Pop-up QR</span>
            </button>
          )}

          {mode === "modal" && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* Remote Cloud WAHA Config Form */}
      {(showServerConfig || notConfigured) && (
        <form
          onSubmit={handleSaveAndConnect}
          className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-poko-charcoal" />
              <span className="text-xs font-bold text-poko-charcoal">
                Konfigurasi Backend WAHA Cloud / VPS (Non-Localhost)
              </span>
            </div>
            {testLatency !== null && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                Terhubung ({testLatency}ms)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Cloud WAHA Base URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={wahaUrl}
                onChange={(e) => setWahaUrl(e.target.value)}
                placeholder="https://waha.domainanda.com"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Nama Session
              </label>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="default"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">
              WAHA API Key (Opsional / sesuai setting WAHA_API_KEY di server Anda)
            </label>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={wahaApiKey}
                onChange={(e) => setWahaApiKey(e.target.value)}
                placeholder="Masukkan X-Api-Key server WAHA Anda"
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-stone-500">
              Webhook otomatis diarahkan ke{" "}
              <code className="font-mono text-stone-700">{webhookOrigin}/api/webhook</code>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Simpan & Muat QR Code</span>
            </button>
          </div>

          {/* Deploy Cloud WAHA Quick Guide */}
          <div className="pt-3 border-t border-stone-200/80 space-y-2">
            <p className="text-[11px] font-bold text-stone-700">
              Belum punya server WAHA Cloud? Deploy instan di VPS / Railway / Coolify:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2.5 rounded-xl bg-poko-charcoal text-stone-200 text-[10px] font-mono overflow-x-auto whitespace-nowrap">
                {dockerCmd}
              </code>
              <button
                type="button"
                onClick={handleCopyDocker}
                className="p-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-stone-700 shrink-0"
                title="Salin perintah Docker VPS"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* LIVE QR CODE DISPLAY AREA */}
      {!notConfigured && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* QR Box */}
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col items-center text-center space-y-3">
            <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-center shadow-xs relative overflow-hidden">
              {loading && !qrImageDataUrl ? (
                <div className="flex flex-col items-center gap-2 text-stone-400">
                  <Loader2 className="w-8 h-8 animate-spin text-poko-charcoal" />
                  <span className="text-[11px] font-medium">Mengambil QR dari WAHA...</span>
                </div>
              ) : status === "WORKING" ? (
                <div className="flex flex-col items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-12 h-12" />
                  <span className="text-xs font-bold">WhatsApp Terhubung!</span>
                </div>
              ) : qrImageDataUrl ? (
                <img
                  src={qrImageDataUrl}
                  alt="WhatsApp WAHA QR Code"
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-400 p-4">
                  <QrCode className="w-10 h-10 text-stone-300" />
                  <span className="text-[11px] text-stone-500">
                    {status === "STARTING"
                      ? "WAHA sedang menyiapkan sesi WhatsApp..."
                      : "Klik Refresh QR untuk memuat kode scan"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-stone-500 font-medium">
                {status === "SCAN_QR_CODE"
                  ? `Refresh otomatis dalam ${countdown}s`
                  : `Status: ${status}`}
              </span>
              <button
                type="button"
                onClick={() => fetchQrFromWaha()}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh QR</span>
              </button>
            </div>
          </div>

          {/* Scan Instructions */}
          <div className="space-y-4">
            <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <p className="font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                <Smartphone className="w-4 h-4 text-emerald-600" />
                <span>Cara Scan WhatsApp (10 Detik):</span>
              </p>
              <p>1. Buka aplikasi <strong>WhatsApp</strong> di smartphone Anda.</p>
              <p>2. Ketuk ikon <strong>Menu (⋮)</strong> di Android atau <strong>Pengaturan (⚙)</strong> di iPhone.</p>
              <p>3. Pilih <strong>Perangkat Tertaut (Linked Devices)</strong> &rarr; <strong>Tautkan Perangkat</strong>.</p>
              <p>4. Arahkan kamera HP ke QR Code di samping hingga status berubah menjadi <strong>WORKING</strong>.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-800">
              <strong>Auto-Sync Aktif:</strong> Begitu QR berhasil di-scan, nomor WhatsApp Anda otomatis muncul di Sidebar, Dashboard, dan siap menerima chat masuk di Omnichannel CRM.
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (mode === "modal") {
    return (
      <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle">
      {content}
    </div>
  );
}
