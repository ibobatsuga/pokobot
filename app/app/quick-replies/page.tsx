"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Zap,
  Plus,
  Copy,
  CheckCircle2,
  Tag,
} from "lucide-react";

export default function QuickRepliesPage() {
  const [replies, setReplies] = useState([
    {
      id: "qr-1",
      shortcut: "/harga",
      title: "Pricelist Paket CRM 2026",
      text: "Berikut paket berlangganan Poko Omnichannel CRM:\n1. Starter: Rp 499.000/bln (1 Device, 3 CS)\n2. Pro: Rp 999.000/bln (3 Device, 10 CS)\n3. Enterprise: Custom instance WAHA dedicated + unlimited agent.",
      usage: 342,
    },
    {
      id: "qr-2",
      shortcut: "/rekening",
      title: "Rekening Pembayaran Bank & QRIS",
      text: "Pembayaran dapat ditransfer ke rekening resmi kami:\nBank BCA: 8830-1928-11 a/n PT FLUXY KARYA DIGITAL\nKonfirmasi otomatis aktif dalam 1 menit via Duitku Gateway.",
      usage: 215,
    },
    {
      id: "qr-3",
      shortcut: "/jam_kerja",
      title: "Jam Operasional Customer Support",
      text: "Jam operasional live support manusia: Senin - Jumat pukul 08.00 - 21.00 WIB, Sabtu pukul 09.00 - 17.00 WIB. Di luar jam tersebut, Poko AI Bot akan otomatis melayani Anda.",
      usage: 180,
    },
  ]);

  return (
    <PokoAppShell
      title="Quick Reply (Balasan Cepat)"
      subtitle="Koleksi shortcut pintas percakapan CS untuk mempercepat waktu respons ke pelanggan"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Shortcut Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {replies.map((reply) => (
            <div
              key={reply.id}
              className="p-5 rounded-3xl bg-white border border-poko-border shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-poko-linen text-stone-800 border border-stone-200">
                    {reply.shortcut}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {reply.usage}x digunakan
                  </span>
                </div>
                <h4 className="font-bold text-xs text-poko-charcoal">{reply.title}</h4>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 whitespace-pre-wrap leading-relaxed">
                  {reply.text}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(reply.text)}
                  className="text-[11px] font-semibold text-stone-600 hover:text-poko-charcoal flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Salin Teks
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
