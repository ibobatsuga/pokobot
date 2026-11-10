"use client";

import React from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Video,
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

export default function TutorialPage() {
  const tutorials = [
    {
      id: "tut-1",
      title: "Langkah Awal: Menghubungkan Nomor WhatsApp via WAHA Docker",
      duration: "04:15",
      category: "Dasar & Onboarding",
      desc: "Panduan cara menjalankan Docker compose WAHA, scan QR code WhatsApp Web, dan memastikan status session WORKING.",
    },
    {
      id: "tut-2",
      title: "Setup Sakelar AI Gateway dengan Model GPT-6 Luna",
      duration: "06:30",
      category: "AI & Otomasi",
      desc: "Cara mengisi API key Sakelar, mengatur prompt sistem kepribadian bot, dan mengaktifkan fitur whitelist nomor ramah.",
    },
    {
      id: "tut-3",
      title: "Strategi Broadcast Massal WhatsApp Tanpa Risiko Terblokir",
      duration: "08:45",
      category: "Marketing & Blash",
      desc: "Praktek terbaik penggunaan random delay 8-15 detik, personalisasi nama pelanggan {{nama}}, dan segmentasi tag.",
    },
    {
      id: "tut-4",
      title: "Manajemen Pipeline Sales & Live Chat Omnichannel CS",
      duration: "05:50",
      category: "Sales CRM",
      desc: "Cara agent CS menggunakan CRM Chat App 👑, memindahkan kartu deal di Kanban board, dan melakukan takeover bot.",
    },
  ];

  return (
    <PokoAppShell
      title="Tutorial Video & Panduan Penggunaan"
      subtitle="Panduan video langkah demi langkah untuk mengoptimalkan potensi WhatsApp CRM dan bot AI Anda"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tutorials.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle flex flex-col justify-between space-y-4 transition-all hover:border-stone-400"
            >
              <div className="space-y-3">
                <div className="h-44 rounded-2xl bg-stone-900 text-white flex items-center justify-center relative overflow-hidden group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white">
                    {item.duration}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-sm text-poko-charcoal leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
