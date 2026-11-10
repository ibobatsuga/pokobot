"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  ShieldAlert,
  Plus,
  Tag,
  MessageSquare,
  Bot,
  CheckCircle2,
} from "lucide-react";

export default function KeywordGuardsPage() {
  const [guards, setGuards] = useState([
    {
      id: "kg-1",
      keyword: "harga, pricelist, biaya, tarif",
      matchType: "Mengandung Salah Satu",
      action: "Kirim Brosur PDF & Trigger AI Qualifier",
      autoTag: "Inquiry Pricing",
      hits: 412,
      active: true,
    },
    {
      id: "kg-2",
      keyword: "rekening, transfer, no rek, bayar",
      matchType: "Mengandung Salah Satu",
      action: "Kirim Informasi No Rekening BCA & QRIS Duitku",
      autoTag: "Ready to Pay",
      hits: 198,
      active: true,
    },
    {
      id: "kg-3",
      keyword: "komplain, rusak, lambat, refund",
      matchType: "Mengandung Salah Satu",
      action: "Takeover CS Human & Matikan Bot AI Otomatis",
      autoTag: "High Priority Urgent",
      hits: 28,
      active: true,
    },
  ]);

  return (
    <PokoAppShell
      title="Keyword Guard & Auto-Trigger"
      subtitle="Deteksi otomatis kata kunci percakapan untuk memberi tag otomatis, memicu pesan template, atau mematikan AI bot saat ada keluhan"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Keyword Guard</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-5">Kata Kunci (Keywords)</th>
                <th className="py-3 px-4">Tipe Pencocokan</th>
                <th className="py-3 px-4">Aksi Otomatis</th>
                <th className="py-3 px-4">Auto-Tag Pelanggan</th>
                <th className="py-3 px-4">Total Terpicu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {guards.map((guard) => (
                <tr key={guard.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-5 font-mono font-bold text-poko-charcoal">
                    {guard.keyword}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">{guard.matchType}</td>
                  <td className="py-3.5 px-4 font-medium text-poko-charcoal">{guard.action}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {guard.autoTag}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">{guard.hits} kali</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PokoAppShell>
  );
}
