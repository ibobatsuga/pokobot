"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Send,
  Users,
  Clock,
  ShieldAlert,
  Paperclip,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function BroadcastPage() {
  const [campaignName, setCampaignName] = useState("");
  const [targetAudience, setTargetAudience] = useState("vip");
  const [delaySec, setDelaySec] = useState("8-15");
  const [messageTemplate, setMessageTemplate] = useState("");

  return (
    <PokoAppShell
      title="Broadcast WhatsApp (Blash)"
      subtitle="Kirim pesan massal terpersonalisasi ke ribuan kontak dengan proteksi anti-banned WAHA"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Campaign Setup Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-5">
            <h3 className="font-bold text-sm text-poko-charcoal">Form Buat Kampanye Broadcast</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Kampanye
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Contoh: Promo Spesial Pelanggan Baru"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Target Audiens / Segmen Kontak
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  >
                    <option value="vip">Pelanggan VIP (0 Kontak)</option>
                    <option value="leads">Semua Leads Masuk (0 Kontak)</option>
                    <option value="closed">Deal Won / Pelanggan Aktif (0 Kontak)</option>
                    <option value="custom">Upload File Kontak CSV / Excel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Random Jeda Waktu Pengiriman (Anti-Banned)
                  </label>
                  <select
                    value={delaySec}
                    onChange={(e) => setDelaySec(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  >
                    <option value="8-15">Sangat Aman: 8 - 15 Detik (Direkomendasikan)</option>
                    <option value="5-10">Standar: 5 - 10 Detik</option>
                    <option value="15-30">Ekstra Santai: 15 - 30 Detik</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Template Pesan WhatsApp
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                    <span>Variabel:</span>
                    <button
                      type="button"
                      onClick={() => setMessageTemplate((prev) => prev + " {{nama}}")}
                      className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono"
                    >
                      {"{{nama}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageTemplate((prev) => prev + " {{nomor}}")}
                      className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-mono"
                    >
                      {"{{nomor}}"}
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  placeholder="Halo {{nama}}! Tulis isi pesan broadcast Anda di sini..."
                  className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Lampirkan Gambar / Brosur PDF
                </button>

                <button
                  type="button"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Mulai Kirim Broadcast Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Phone Preview & Safety Advice */}
        <div className="space-y-6">
          {/* WhatsApp Preview Card */}
          <div className="p-6 rounded-3xl bg-[#f0f2f5] border border-stone-300/80 shadow-subtle space-y-4">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Live Preview di Layar Pelanggan
            </span>

            <div className="p-4 rounded-2xl bg-white shadow-xs border border-stone-200/70 text-xs text-poko-charcoal leading-relaxed whitespace-pre-wrap">
              {messageTemplate
                ? messageTemplate.replace(/\{\{nama\}\}/g, "Nama Pelanggan")
                : "Ketik template pesan di kolom kiri untuk melihat live preview WhatsApp..."}
              <div className="mt-2 text-right text-[10px] text-stone-400">13:45 ✓✓</div>
            </div>
          </div>

          {/* Safety Anti-Banned Tips */}
          <div className="p-5 rounded-3xl bg-poko-linen border border-stone-300/60 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-poko-charcoal">
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
              Proteksi Anti-Banned WAHA
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Poko secara otomatis mengacak jeda pengiriman antar kontak dan menyertakan nama penerima agar WhatsApp tidak mendeteksi spam broadcast.
            </p>
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
