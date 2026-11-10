"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Share2,
  Copy,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export default function AffiliateJoinPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://ping-clone-poc.vercel.app/?ref=affiliate_partner";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PokoAppShell
      title="Program Kemitraan & Affiliate"
      subtitle="Dapatkan komisi berulang (recurring) 30% dari setiap langganan pengguna baru yang Anda referensikan"
    >
      <div className="space-y-8 max-w-5xl">
        {/* Referral Link Box */}
        <div className="p-7 rounded-3xl bg-poko-linen border border-stone-300/60 shadow-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-poko-charcoal">Tautan Referral Anda</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200">
              Komisi 30% Recurring
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-stone-800 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Tersalin!" : "Salin Tautan"}</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle">
            <span className="text-xs text-stone-500 font-medium">Total Komisi Didapat</span>
            <div className="text-2xl font-bold text-poko-charcoal mt-1">Rp 4.250.000</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              Siap dicairkan ke rekening
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle">
            <span className="text-xs text-stone-500 font-medium">Total Klien Aktif</span>
            <div className="text-2xl font-bold text-poko-charcoal mt-1">18 Pelanggan</div>
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              Membayar langganan rutin
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle">
            <span className="text-xs text-stone-500 font-medium">Estimasi Bulan Depan</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">Rp 5.400.000</div>
            <span className="text-[11px] text-stone-400 font-medium mt-1 block">
              Berdasarkan perpanjangan otomatis
            </span>
          </div>
        </div>

        {/* Payout Action */}
        <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-poko-charcoal">Tarik Saldo Komisi (Payout)</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Pencairan dikirim ke rekening BCA / Mandiri dalam 1x24 jam kerja.
            </p>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
            Ajukan Penarikan Dana
          </button>
        </div>
      </div>
    </PokoAppShell>
  );
}
