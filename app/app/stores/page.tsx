"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Phone,
  Tag,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";

interface StoreContact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  tags: string[];
  stage: string;
  spent: string;
  lastActive: string;
}

export default function StoresContactsPage() {
  const [contacts, setContacts] = useState<StoreContact[]>([]);

  return (
    <PokoAppShell
      title="Database Kontak & Pelanggan"
      subtitle="Manajemen repositori kontak WhatsApp, segmentasi tag, dan riwayat transaksi"
      actionButton={
        <div className="flex items-center gap-2">
          <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50">
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
          <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Kontak</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Table container */}
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-poko-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-poko-charcoal">Semua Kontak</span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 text-stone-600">
                {contacts.length} Tersimpan
              </span>
            </div>

            <div className="text-xs text-stone-400">
              Format ekspor tersedia: CSV, Excel, VCF (vCard)
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-poko-charcoal">Belum Ada Kontak Tersimpan</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Kontak pelanggan akan otomatis tersimpan saat ada pesan WhatsApp masuk dari WAHA, atau Anda dapat meng-import daftar kontak melalui file CSV.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Nama Kontak</th>
                  <th className="py-3 px-4">Nomor WhatsApp</th>
                  <th className="py-3 px-4">Tag Segmentasi</th>
                  <th className="py-3 px-4">Tahap Pipeline</th>
                  <th className="py-3 px-4">Total Transaksi</th>
                  <th className="py-3 px-4">Aktivitas Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {contacts.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-poko-charcoal">{c.name}</div>
                      <div className="text-[11px] text-stone-400">{c.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">{c.phone}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {c.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-700 border border-stone-200"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-poko-linen text-stone-800 border border-stone-300/60">
                        {c.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-poko-charcoal">{c.spent}</td>
                    <td className="py-3.5 px-4 text-stone-400">{c.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PokoAppShell>
  );
}
