"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  FileText,
  Plus,
  Tag,
  Copy,
  CheckCircle2,
} from "lucide-react";

export default function MasterTemplatePage() {
  const [templates, setTemplates] = useState([
    {
      id: "tpl-1",
      name: "notifikasi_pesanan_selesai",
      category: "Utility / Transaksional",
      preview: "Halo {{1}}, pesanan Anda #{{2}} telah dikirim melalui kurir {{3}} dengan nomor resi {{4}}. Terima kasih telah berbelanja!",
      status: "Disetujui",
    },
    {
      id: "tpl-2",
      name: "undangan_webinar_eksklusif",
      category: "Marketing",
      preview: "Halo {{1}}! Sesi live demo Poko AI CRM akan dimulai jam 19.00 WIB. Klik tautan berikut untuk bergabung: {{2}}",
      status: "Disetujui",
    },
    {
      id: "tpl-3",
      name: "otp_verifikasi_login",
      category: "Authentication",
      preview: "Kode OTP verifikasi akun Poko Anda adalah: {{1}}. Jangan berikan kode ini kepada siapapun demi keamanan akun Anda.",
      status: "Disetujui",
    },
  ]);

  return (
    <PokoAppShell
      title="Master Template Pesan"
      subtitle="Koleksi template pesan WhatsApp baku dengan parameter dinamis untuk kebutuhan API & broadcast"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Template Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-5 rounded-3xl bg-white border border-poko-border shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {tpl.status}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{tpl.category}</span>
                </div>
                <h4 className="font-mono font-bold text-xs text-poko-charcoal">{tpl.name}</h4>
                <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 leading-relaxed">
                  {tpl.preview}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <button className="text-[11px] font-semibold text-stone-600 hover:text-poko-charcoal flex items-center gap-1">
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
