"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Smartphone,
  Plus,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  BatteryCharging,
  Wifi,
  ExternalLink,
  X,
  Check,
} from "lucide-react";

export default function WhatsappDevicePage() {
  const [showQrModal, setShowQrModal] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "default",
      phone: "+62 812-3456-7890",
      label: "WhatsApp Bisnis Utama",
      status: "WORKING",
      engine: "WAHA (devlikeapro/waha:latest)",
      battery: "94% (Charging)",
      connectedAt: "Hari ini, 09:30 WIB",
      webhookUrl: "https://ping-clone-poc.vercel.app/api/webhook",
    },
  ]);

  const [newDevicePhone, setNewDevicePhone] = useState("");
  const [newDeviceLabel, setNewDeviceLabel] = useState("");

  const handleDisconnect = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const handleConnectSimulated = () => {
    const newSession = {
      id: `session_${Date.now()}`,
      phone: newDevicePhone || "+62 821-9876-5432",
      label: newDeviceLabel || "WhatsApp CS Baru",
      status: "WORKING",
      engine: "WAHA (devlikeapro/waha:latest)",
      battery: "98%",
      connectedAt: "Baru saja",
      webhookUrl: "https://ping-clone-poc.vercel.app/api/webhook",
    };
    setSessions([...sessions, newSession]);
    setShowQrModal(false);
    setNewDevicePhone("");
    setNewDeviceLabel("");
  };

  return (
    <PokoAppShell
      title="Whatsapp Device Manager"
      subtitle="Hubungkan nomor WhatsApp baru dengan scan QR Code menggunakan engine WAHA"
      actionButton={
        <button
          onClick={() => setShowQrModal(true)}
          className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Device Baru</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-5xl">
        {/* Onboarding Banner when no device connected */}
        {sessions.length === 0 && (
          <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-4 shadow-subtle">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-poko-charcoal">
              Belum Ada Perangkat WhatsApp yang Terhubung
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Scan QR Code untuk menautkan nomor WhatsApp Anda ke PokoBot agar AI Bot dan CRM dapat langsung mulai membalas pesan.
            </p>
            <button
              onClick={() => setShowQrModal(true)}
              className="h-9 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all inline-flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Scan QR Code Sekarang</span>
            </button>
          </div>
        )}

        {/* Device Cards Grid */}
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
                  <span className="font-medium text-stone-800">{device.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Baterai Ponsel:</span>
                  <span className="font-medium text-emerald-600 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5" />
                    {device.battery}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Tersambung Sejak:</span>
                  <span className="text-stone-600">{device.connectedAt}</span>
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDisconnect(device.id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QR CODE SCANNER MODAL */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-poko-charcoal">Tautkan WhatsApp Baru</h3>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* QR Code Card */}
              <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/80 flex flex-col items-center text-center space-y-3">
                <div className="w-48 h-48 bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-center shadow-xs">
                  {/* SVG QR Code Simulation */}
                  <svg className="w-full h-full text-stone-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="10" y="10" width="25" height="25" rx="4" />
                    <rect x="65" y="10" width="25" height="25" rx="4" />
                    <rect x="10" y="65" width="25" height="25" rx="4" />
                    <rect x="15" y="15" width="15" height="15" fill="white" />
                    <rect x="70" y="15" width="15" height="15" fill="white" />
                    <rect x="15" y="70" width="15" height="15" fill="white" />
                    <rect x="19" y="19" width="7" height="7" fill="black" />
                    <rect x="74" y="19" width="7" height="7" fill="black" />
                    <rect x="19" y="74" width="7" height="7" fill="black" />
                    <rect x="42" y="12" width="6" height="6" />
                    <rect x="52" y="12" width="6" height="6" />
                    <rect x="42" y="24" width="6" height="12" />
                    <rect x="52" y="30" width="6" height="6" />
                    <rect x="12" y="45" width="8" height="6" />
                    <rect x="25" y="45" width="12" height="6" />
                    <rect x="42" y="45" width="16" height="10" />
                    <rect x="65" y="45" width="10" height="6" />
                    <rect x="80" y="45" width="8" height="6" />
                    <rect x="42" y="65" width="8" height="15" />
                    <rect x="55" y="65" width="12" height="6" />
                    <rect x="75" y="65" width="12" height="15" />
                    <rect x="55" y="78" width="8" height="12" />
                  </svg>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  QR Code otomatis diperbarui setiap 20 detik
                </span>
              </div>

              {/* Instructions */}
              <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200/60">
                <p className="font-bold text-stone-800 mb-1">Cara Menghubungkan:</p>
                <p>1. Buka aplikasi WhatsApp di HP Anda.</p>
                <p>2. Ketuk <strong>Menu (titik tiga)</strong> atau <strong>Pengaturan</strong>.</p>
                <p>3. Pilih <strong>Perangkat Tertaut</strong> lalu ketuk <strong>Tautkan Perangkat</strong>.</p>
                <p>4. Arahkan kamera HP Anda ke kode QR di atas.</p>
              </div>

              {/* Form Input for Custom Name/Phone */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Label Nama Perangkat (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newDeviceLabel}
                    onChange={(e) => setNewDeviceLabel(e.target.value)}
                    placeholder="Contoh: WhatsApp CS 2"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    value={newDevicePhone}
                    onChange={(e) => setNewDevicePhone(e.target.value)}
                    placeholder="Contoh: +62 821-9876-5432"
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  />
                </div>
              </div>

              {/* Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  onClick={handleConnectSimulated}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Simulasi Tautkan Perangkat</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PokoAppShell>
  );
}
