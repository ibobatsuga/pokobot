"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import { WahaQrConnector } from "@/components/WahaQrConnector";
import {
  Smartphone,
  Plus,
  RefreshCw,
  QrCode,
  ExternalLink,
  Cloud,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import {
  getSavedWahaConfig,
  buildWahaHeaders,
  formatWhatsAppNumber,
  saveConnectedDevice,
} from "@/lib/wahaClient";

interface DeviceSession {
  id: string;
  phone: string;
  label: string;
  status: string;
  engine: string;
  connectedAt: string;
  webhookUrl: string;
}

export default function WhatsappDevicePage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [wahaConfigured, setWahaConfigured] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const cfg = getSavedWahaConfig();
      const res = await fetch("/api/waha?action=sessions", {
        headers: buildWahaHeaders(cfg),
        cache: "no-store",
      });
      const data = await res.json();

      setWahaConfigured(Boolean(data.configured));

      if (Array.isArray(data.sessions)) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://ping-clone-poc.vercel.app";
        const mapped: DeviceSession[] = data.sessions
          .filter((s: any) => s.status === "WORKING" || s.me?.id)
          .map((s: any) => ({
            id: s.name || "default",
            phone: formatWhatsAppNumber(s.me?.id) || "Menunggu Pairing",
            label: s.me?.pushName || `WhatsApp (${s.name || "default"})`,
            status: s.status || "WORKING",
            engine: "WAHA Cloud Gateway",
            connectedAt: "Live Sync",
            webhookUrl: `${origin}/api/webhook`,
          }));

        setSessions(mapped);

        if (mapped.length > 0 && mapped[0].status === "WORKING") {
          saveConnectedDevice({
            phone: mapped[0].phone,
            name: mapped[0].label,
            session: mapped[0].id,
          });
        } else {
          saveConnectedDevice(null);
        }
      }
    } catch {
      // keep empty state cleanly
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const handler = () => loadSessions();
    window.addEventListener("pokobot-waha-updated", handler);
    return () => window.removeEventListener("pokobot-waha-updated", handler);
  }, [loadSessions]);

  const handleDisconnect = async (sessionId: string) => {
    const cfg = getSavedWahaConfig();
    await fetch("/api/waha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...buildWahaHeaders(cfg),
      },
      body: JSON.stringify({ action: "logout", session: sessionId }),
    }).catch(() => {});
    saveConnectedDevice(null);
    await loadSessions();
  };

  return (
    <PokoAppShell
      title="Whatsapp Device Manager"
      subtitle="Hubungkan nomor WhatsApp Anda melalui server Cloud/VPS WAHA dengan QR Code langsung di aplikasi maupun pop-up"
      actionButton={
        <div className="flex items-center gap-2">
          <button
            onClick={loadSessions}
            className="h-9 flex items-center gap-1.5 px-3 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? "animate-spin" : ""}`} />
            <span>Sync Status</span>
          </button>
          <button
            onClick={() => setShowQrModal(true)}
            className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Pop-up Scan QR</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* Connected Device Cards Grid (if any active WORKING sessions) */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((device) => (
              <div
                key={device.id}
                className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-poko-charcoal">{device.label}</h3>
                      <p className="text-xs font-mono text-stone-500 font-semibold">{device.phone}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {device.status}
                  </span>
                </div>

                {/* Specs */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Session ID:</span>
                    <span className="font-mono font-semibold text-stone-800">{device.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Engine Gateway:</span>
                    <span className="font-medium text-stone-800 flex items-center gap-1">
                      <Cloud className="w-3.5 h-3.5 text-blue-600" />
                      {device.engine}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Webhook Auto-Sync:</span>
                    <span className="font-mono text-[11px] text-emerald-700 truncate max-w-[200px]">
                      {device.webhookUrl}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-2 flex items-center justify-between">
                  <a
                    href="/docs"
                    className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-poko-charcoal font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Dokumentasi API
                  </a>

                  <button
                    onClick={() => handleDisconnect(device.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Putuskan Koneksi</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* IN-APP INLINE LIVE WAHA QR CONNECTOR (Always accessible directly on page!) */}
        <WahaQrConnector
          mode="inline"
          onOpenPopup={() => setShowQrModal(true)}
          onConnected={() => {
            loadSessions();
          }}
        />

        {/* POP-UP QR MODAL */}
        <WahaQrConnector
          mode="modal"
          isOpen={showQrModal}
          onClose={() => setShowQrModal(false)}
          onConnected={() => {
            setShowQrModal(false);
            loadSessions();
          }}
        />
      </div>
    </PokoAppShell>
  );
}
