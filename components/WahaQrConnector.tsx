"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  QrCode,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Maximize2,
  Loader2,
  Smartphone,
  Tag,
} from "lucide-react";
import {
  getSavedConnectedDevices,
  saveConnectedDevices,
  setActiveSessionName,
  formatWhatsAppNumber,
  slugifySessionName,
} from "@/lib/wahaClient";

interface WahaQrConnectorProps {
  mode: "inline" | "modal";
  isOpen?: boolean;
  onClose?: () => void;
  onOpenPopup?: () => void;
  onConnected?: (sessionInfo: { session: string; phone: string; label: string }) => void;
}

export function WahaQrConnector({
  mode,
  isOpen = true,
  onClose,
  onOpenPopup,
  onConnected,
}: WahaQrConnectorProps) {
  const [deviceLabel, setDeviceLabel] = useState("WhatsApp Utama");
  const [sessionId, setSessionId] = useState<string>("");

  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("IDLE");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(15);

  const fetchQr = useCallback(
    async (targetSession: string, targetLabel: string, silent = false) => {
      if (!targetSession) return;
      if (!silent) setLoading(true);
      setErrorMsg(null);

      try {
        const res = await fetch(
          `/api/waha?action=qr&session=${encodeURIComponent(targetSession)}&label=${encodeURIComponent(
            targetLabel
          )}`,
          { cache: "no-store" }
        );
        const data = await res.json();

        if (res.status === 409 || data.status === "CONFLICT") {
          setErrorMsg(
            data.error ||
              "Nomor WhatsApp ini sedang aktif terhubung pada akun PokoBot lain. Putuskan di akun lama terlebih dahulu."
          );
          setQrImageDataUrl(null);
          setStatus("ERROR");
          setLoading(false);
          return;
        }

        if (res.status === 401) {
          setErrorMsg("Sesi login berakhir. Silakan login kembali untuk menghubungkan WhatsApp.");
          setQrImageDataUrl(null);
          setStatus("ERROR");
          setLoading(false);
          return;
        }

        if (data.configured === false) {
          setQrImageDataUrl(null);
          setStatus("UNCONFIGURED");
          setErrorMsg("Backend WhatsApp Cloud belum diaktifkan oleh administrator sistem.");
          setLoading(false);
          return;
        }

        if (data.connected === false && data.error) {
          setErrorMsg(data.error);
          setQrImageDataUrl(null);
          setStatus("ERROR");
          setLoading(false);
          return;
        }

        if (data.status === "WORKING") {
          const phone = formatWhatsAppNumber(data.me?.id) || "Terhubung";
          const finalLabel = targetLabel || data.label || data.me?.pushName || "WhatsApp Bisnis";
          setStatus("WORKING");
          setQrImageDataUrl(null);

          const existing = getSavedConnectedDevices().filter((d) => d.session !== targetSession);
          saveConnectedDevices([
            ...existing,
            { session: targetSession, label: finalLabel, phone, status: "WORKING" },
          ]);
          setActiveSessionName(targetSession);

          if (onConnected) {
            onConnected({ session: targetSession, phone, label: finalLabel });
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
        setErrorMsg(err.message || "Gagal memuat QR Code WhatsApp.");
      } finally {
        setLoading(false);
      }
    },
    [onConnected]
  );

  // Initialize a fresh session ID when opening or switching to add new WhatsApp
  const startNewQrFlow = useCallback(
    (customLabel?: string) => {
      const label = (customLabel ?? deviceLabel).trim() || "WhatsApp Bisnis";
      const existingDevices = getSavedConnectedDevices();
      const newSessId = existingDevices.length === 0 ? "default" : slugifySessionName(label);
      setSessionId(newSessId);
      setStatus("STARTING");
      setQrImageDataUrl(null);
      fetchQr(newSessId, label);
    },
    [deviceLabel, fetchQr]
  );

  useEffect(() => {
    if (mode === "modal" && !isOpen) return;
    if (!sessionId) {
      startNewQrFlow();
    }
  }, [mode, isOpen, sessionId, startNewQrFlow]);

  // Countdown & auto-refresh QR every 15s + poll WORKING status every 3.5s
  useEffect(() => {
    if (mode === "modal" && !isOpen) return;
    if (!sessionId || status === "WORKING" || status === "UNCONFIGURED" || status === "IDLE") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchQr(sessionId, deviceLabel, true);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    const statusPoll = setInterval(() => {
      if (status === "SCAN_QR_CODE" || status === "STARTING") {
        fetchQr(sessionId, deviceLabel, true);
      }
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(statusPoll);
    };
  }, [mode, isOpen, sessionId, deviceLabel, status, fetchQr]);

  if (mode === "modal" && !isOpen) return null;

  const content = (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-poko-charcoal">
              Tautkan Akun WhatsApp Baru
            </h3>
            <p className="text-[11px] text-stone-500">
              Beri nama WhatsApp Anda lalu scan QR Code menggunakan aplikasi WhatsApp di HP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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

      {/* Custom Device Name Input */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex-1 relative">
          <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={deviceLabel}
            onChange={(e) => setDeviceLabel(e.target.value)}
            placeholder="Beri nama WhatsApp (misal: CS Utama, Sales Toko, Admin)"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-medium text-poko-charcoal focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
          />
        </div>
        <button
          type="button"
          onClick={() => startNewQrFlow(deviceLabel)}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Muat QR Baru</span>
        </button>
      </div>

      {/* Notice / Error Alert */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">{errorMsg}</div>
        </div>
      )}

      {/* LIVE QR CODE DISPLAY AREA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* QR Box */}
        <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col items-center text-center space-y-3">
          <div className="w-56 h-56 bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-center shadow-xs relative overflow-hidden">
            {loading && !qrImageDataUrl ? (
              <div className="flex flex-col items-center gap-2 text-stone-400">
                <Loader2 className="w-8 h-8 animate-spin text-poko-charcoal" />
                <span className="text-[11px] font-medium">Menyiapkan QR WhatsApp...</span>
              </div>
            ) : status === "WORKING" ? (
              <div className="flex flex-col items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-12 h-12" />
                <span className="text-xs font-bold">WhatsApp Terhubung!</span>
              </div>
            ) : qrImageDataUrl ? (
              <img
                src={qrImageDataUrl}
                alt="WhatsApp QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-stone-400 p-4">
                <QrCode className="w-10 h-10 text-stone-300" />
                <span className="text-[11px] text-stone-500">
                  {status === "STARTING"
                    ? "Sedang membuat kode QR WhatsApp..."
                    : "Klik Muat QR Baru untuk memulai"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-500 font-medium">
              {status === "SCAN_QR_CODE"
                ? `Refresh otomatis dalam ${countdown}s`
                : status === "WORKING"
                ? "Siap menerima & mengirim pesan"
                : "Menunggu QR siap"}
            </span>
            <button
              type="button"
              onClick={() => fetchQr(sessionId, deviceLabel)}
              disabled={loading || !sessionId}
              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-stone-700 hover:bg-stone-100 flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
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
            <p>1. Isi <strong>Nama WhatsApp</strong> di atas (misal: CS Utama / Sales).</p>
            <p>2. Buka aplikasi <strong>WhatsApp</strong> di smartphone Anda.</p>
            <p>3. Ketuk <strong>Perangkat Tertaut (Linked Devices)</strong> &rarr; <strong>Tautkan Perangkat</strong>.</p>
            <p>4. Arahkan kamera HP ke QR Code di samping hingga terhubung otomatis.</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-[11px] text-emerald-800">
            <strong>Multi-WhatsApp Ready:</strong> Anda dapat menghubungkan lebih dari 1 nomor WhatsApp dan memilih nomor aktif lewat menu dropdown di dashboard & broadcast.
          </div>
        </div>
      </div>
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
