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
  getSavedConnectedDevices,
  saveConnectedDevices,
  getActiveSessionName,
  setActiveSessionName,
  setActiveTenantEmail,
  formatWhatsAppNumber,
  ConnectedDeviceItem,
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
  const [activeSession, setActiveSession] = useState<string>("");
  const [loadingSessions, setLoadingSessions] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      const meData = await meRes.json().catch(() => ({}));
      if (!meData?.user?.email) {
        setActiveTenantEmail(null);
        setSessions([]);
        setActiveSession("");
        setLoadingSessions(false);
        return;
      }

      setActiveTenantEmail(meData.user.email);
      const savedDevices = getSavedConnectedDevices();
      const savedLabelMap = new Map(savedDevices.map((d) => [d.session, d.label]));

      const res = await fetch("/api/waha?action=sessions", {
        cache: "no-store",
      });
      const data = await res.json();

      if (Array.isArray(data.sessions)) {
        const origin = typeof window !== "undefined" ? window.location.origin : "https://ping-clone-poc.vercel.app";
        const mapped: DeviceSession[] = data.sessions
          .filter((s: any) => s.status === "WORKING" || s.me?.id)
          .map((s: any) => {
            const sessionName = s.name || "default";
            return {
              id: sessionName,
              phone: formatWhatsAppNumber(s.me?.id) || "Menunggu Pairing",
              label: s.label || savedLabelMap.get(sessionName) || s.me?.pushName || `WhatsApp (${sessionName})`,
              status: s.status || "WORKING",
              engine: "WAHA Cloud Multi-Device",
              connectedAt: "Live Sync",
              webhookUrl: `${origin}/api/webhook`,
            };
          });

        setSessions(mapped);

        const nextDevices: ConnectedDeviceItem[] = mapped.map((d) => ({
          session: d.id,
          label: d.label,
          phone: d.phone,
          status: d.status,
        }));
        saveConnectedDevices(nextDevices);
        setActiveSession(getActiveSessionName());
      }
    } catch {
      // Fallback to locally stored connected devices if backend unreachable
      const fallback = getSavedConnectedDevices();
      setSessions(
        fallback.map((d) => ({
          id: d.session,
          phone: d.phone,
          label: d.label,
          status: d.status,
          engine: "WAHA Cloud Multi-Device",
          connectedAt: "Tersimpan",
          webhookUrl: "https://ping-clone-poc.vercel.app/api/webhook",
        }))
      );
      setActiveSession(getActiveSessionName());
    } finally {
      setLoadingSessions(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
    const syncActive = () => setActiveSession(getActiveSessionName());
    window.addEventListener("pokobot-waha-updated", syncActive);
    return () => window.removeEventListener("pokobot-waha-updated", syncActive);
  }, [loadSessions]);

  const handleDisconnect = async (sessionId: string) => {
    await fetch("/api/waha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", session: sessionId }),
    }).catch(() => {});

    const remaining = getSavedConnectedDevices().filter((d) => d.session !== sessionId);
    saveConnectedDevices(remaining);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setActiveSession(getActiveSessionName());
    await loadSessions();
  };

  return (
    <PokoAppShell
      title="Koneksi WhatsApp"
      subtitle="Kelola satu atau lebih nomor WhatsApp Anda dengan nama label khusus. Scan QR langsung di halaman ini atau melalui pop-up."
      actionButton={
        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <select
              value={activeSession}
              onChange={(e) => {
                setActiveSessionName(e.target.value);
                setActiveSession(e.target.value);
              }}
              aria-label="Pilih WhatsApp Aktif"
              className="h-9 px-3 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
            >
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  Aktif: {s.label} ({s.phone})
                </option>
              ))}
            </select>
          )}
          <button
            onClick={loadSessions}
            className="h-9 flex items-center gap-1.5 px-3 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSessions ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setShowQrModal(true)}
            className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah WhatsApp</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* Connected Device Cards Grid (if any active WORKING sessions) */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sessions.map((device) => {
              const isActive = activeSession === device.id;
              return (
                <div
                  key={device.id}
                  className={`p-6 rounded-3xl bg-white border shadow-subtle space-y-4 transition-all ${
                    isActive ? "border-emerald-400 ring-2 ring-emerald-500/10" : "border-poko-border"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-poko-charcoal">{device.label}</h3>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-poko-charcoal text-white">
                              Utama
                            </span>
                          )}
                        </div>
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
                      <span className="text-stone-400">Nama / Label:</span>
                      <span className="font-semibold text-stone-800">{device.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-400">Engine Gateway:</span>
                      <span className="font-medium text-stone-800 flex items-center gap-1">
                        <Cloud className="w-3.5 h-3.5 text-blue-600" />
                        {device.engine}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    {!isActive ? (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSessionName(device.id);
                          setActiveSession(device.id);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pilih Jadi Aktif</span>
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Dipakai Sebagai Pengirim Aktif
                      </span>
                    )}

                    <button
                      onClick={() => handleDisconnect(device.id)}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Putuskan</span>
                    </button>
                  </div>
                </div>
              );
            })}
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
