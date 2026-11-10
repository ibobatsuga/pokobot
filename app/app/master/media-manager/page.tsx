"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function MediaManagerPage() {
  const [mediaItems, setMediaItems] = useState([
    {
      id: "med-1",
      name: "Brosur-Paket-Enterprise-2026.pdf",
      type: "PDF Document",
      size: "2.4 MB",
      uploadedAt: "10 Nov 2026",
      usedIn: "Auto-reply FAQ & Quick Reply",
    },
    {
      id: "med-2",
      name: "Banner-Promo-Diskon-25-Persen.png",
      type: "Image (PNG)",
      size: "840 KB",
      uploadedAt: "9 Nov 2026",
      usedIn: "Broadcast Kampanye Blash",
    },
    {
      id: "med-3",
      name: "Voice-Greeting-Halo-Selamat-Datang.ogg",
      type: "WhatsApp Voice Note (Opus)",
      size: "120 KB",
      uploadedAt: "8 Nov 2026",
      usedIn: "Onboarding Flow",
    },
  ]);

  return (
    <PokoAppShell
      title="Media Manager"
      subtitle="Pusat penyimpanan berkas gambar, katalog PDF, dan audio voice note untuk broadcast & bot WhatsApp"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Media Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-3"
            >
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-poko-charcoal">
                {item.type.includes("PDF") && <FileText className="w-5 h-5 text-rose-600" />}
                {item.type.includes("Image") && <ImageIcon className="w-5 h-5 text-blue-600" />}
                {item.type.includes("Voice") && <Music className="w-5 h-5 text-emerald-600" />}
              </div>

              <div>
                <h4 className="font-bold text-xs text-poko-charcoal truncate">{item.name}</h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  {item.type} • {item.size}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 text-[10px] text-stone-600">
                <span className="text-stone-400 block mb-0.5">Digunakan pada:</span>
                <span className="font-semibold text-stone-800">{item.usedIn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
