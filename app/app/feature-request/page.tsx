"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Sparkles,
  ChevronUp,
  Plus,
  MessageCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function FeatureRequestPage() {
  const [requests, setRequests] = useState([
    {
      id: "fr-1",
      title: "Integrasi Voice Note AI (Audio Speech-to-Text & Text-to-Speech)",
      desc: "Agar Poko AI dapat menerima pesan suara VN dari pelanggan dan membalas juga dengan pesan suara manusia natural.",
      votes: 142,
      status: "Sedang Dikembangkan",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
      comments: 24,
    },
    {
      id: "fr-2",
      title: "Koneksi Langsung ke WooCommerce & Shopify Order Webhook",
      desc: "Otomatis kirim notifikasi resi dan invoice WA saat ada pesanan baru di toko online.",
      votes: 98,
      status: "Sudah Masuk Roadmap",
      statusColor: "bg-purple-50 text-purple-700 border-purple-200",
      comments: 15,
    },
    {
      id: "fr-3",
      title: "Multi-Agent Chat Transfer dengan Notifikasi Internal Mention",
      desc: "Kemampuan agent CS melempar percakapan ke divisi Finance atau Tech Support dengan catatan internal khusus.",
      votes: 76,
      status: "Sudah Rilis di v1.0",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      comments: 19,
    },
  ]);

  const handleVote = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r))
    );
  };

  return (
    <PokoAppShell
      title="Request Fitur & Feedback Pengguna"
      subtitle="Beri masukan fitur baru untuk Poko Omnichannel CRM dan vote ide-ide terbaik dari komunitas"
      actionButton={
        <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Kirim Ide Fitur Baru</span>
        </button>
      }
    >
      <div className="max-w-4xl space-y-4">
        {requests.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-white border border-poko-border shadow-subtle flex items-start gap-4 transition-all hover:border-stone-400"
          >
            {/* Upvote Button */}
            <button
              onClick={() => handleVote(item.id)}
              className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-stone-50 border border-stone-200 hover:bg-poko-linen transition-colors shrink-0 min-w-[54px]"
            >
              <ChevronUp className="w-4 h-4 text-poko-charcoal" />
              <span className="font-bold text-xs text-poko-charcoal mt-0.5">{item.votes}</span>
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-bold text-sm text-poko-charcoal">{item.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-3">{item.desc}</p>
              <div className="flex items-center gap-4 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  {item.comments} Diskusi
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PokoAppShell>
  );
}
