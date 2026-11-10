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
} from "lucide-react";

export default function WhatsappDevicePage() {
  const [sessions, setSessions] = useState([
    {
      id: "default",
      phone: "+62 896-3737-0000",
      label: "Nomor Utama CRM Ibob",
      status: "WORKING",
      engine: "WAHA (devlikeapro/waha:latest)",
      battery: "94% (Charging)",
      connectedAt: "10 Nov 2026, 11:15 WIB",
      webhookUrl: "http://localhost:8000/webhook.php",
    },
  ]);

  return (
    <PokoAppShell
      title="Whatsapp Device Manager"
      subtitle="Kelola koneksi perangkat WhatsApp multi-device bertenaga WAHA Docker Engine"
      actionButton={
        <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Device Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
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
                  href="http://localhost:3000/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-poko-charcoal font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka WAHA Dashboard
                </a>

                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
