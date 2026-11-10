"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  RefreshCw,
  Plus,
  Clock,
  ArrowRight,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Users,
} from "lucide-react";

export default function UpsellingCampaignPage() {
  const [sequences, setSequences] = useState([
    {
      id: "seq-1",
      title: "Drip Follow-up Pasca Pembelian Pertama",
      trigger: "Pelanggan baru saja checkout / Deal Won",
      active: true,
      stats: { enrolled: 340, converted: 82, rate: "24.1%" },
      steps: [
        {
          day: "Hari ke-1",
          title: "Ucapan Terima Kasih & Tutorial Pemakaian",
          summary: "Kirim video tutorial dan panduan login member area.",
        },
        {
          day: "Hari ke-3",
          title: "Check-in Kepuasan Pelanggan",
          summary: "Menanyakan apakah ada kendala atau butuh bantuan CS.",
        },
        {
          day: "Hari ke-7",
          title: "Penawaran Upsell Add-on & Paket Tahunan",
          summary: "Voucher diskon 20% untuk upgrade ke tier Enterprise.",
        },
      ],
    },
    {
      id: "seq-2",
      title: "Re-aktivasi Prospek Mengambang (Cart Abandoned)",
      trigger: "Leads berhenti membalas selama 48 jam",
      active: true,
      stats: { enrolled: 185, converted: 39, rate: "21.0%" },
      steps: [
        {
          day: "Hari ke-2",
          title: "Pengingat Ramah dari CS Poko",
          summary: "Halo kak, apakah ada informasi tambahan yang ingin ditanyakan?",
        },
        {
          day: "Hari ke-5",
          title: "Penawaran Free Demo 1-on-1 dengan Konsultan",
          summary: "Slot konsultasi Zoom gratis 15 menit bersama tim ahli kami.",
        },
      ],
    },
  ]);

  return (
    <PokoAppShell
      title="Upselling Campaign & Auto Follow-up"
      subtitle="Rangkaian pesan berkala (drip campaign) otomatis untuk meningkatkan Lifetime Value (LTV) pelanggan"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Campaign Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        {sequences.map((seq) => (
          <div
            key={seq.id}
            className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-5"
          >
            {/* Header info */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm text-poko-charcoal">{seq.title}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Aktif Berjalan
                  </span>
                </div>
                <p className="text-xs text-stone-500">Pemicu: {seq.trigger}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-stone-600">
                <div>
                  <span className="text-[10px] text-stone-400 block">Kontak Terdaftar</span>
                  <span className="font-bold text-poko-charcoal">{seq.stats.enrolled}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Konversi Upsell</span>
                  <span className="font-bold text-emerald-600">{seq.stats.converted} ({seq.stats.rate})</span>
                </div>
              </div>
            </div>

            {/* Steps Timeline Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-stone-100">
              {seq.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1.5 relative"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    {step.day}
                  </span>
                  <h4 className="font-bold text-xs text-poko-charcoal">{step.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{step.summary}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PokoAppShell>
  );
}
