"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Brain,
  Plus,
  Bot,
  Sliders,
  FileText,
  Clock,
  CheckCircle2,
  Trash2,
  Edit3,
  ExternalLink,
} from "lucide-react";

export default function FineTunnelListPage() {
  const [agents, setAgents] = useState([
    {
      id: "agent-1",
      name: "PokoBot Sales & CS Consultant",
      role: "Sales Consultant & Customer Care",
      model: "PokoBot Standard (Fast)",
      temperature: 0.7,
      historyLimit: 10,
      trainingCharacters: 1840,
      active: true,
      lastUpdated: "Hari Ini, 21:30 WIB",
      status: "Aktif Melayani",
    },
    {
      id: "agent-2",
      name: "Bot Tanya Jawab Produk Reseller",
      role: "Katalog & Stok Produk",
      model: "PokoBot Advanced",
      temperature: 0.3,
      historyLimit: 5,
      trainingCharacters: 3200,
      active: false,
      lastUpdated: "Kemarin",
      status: "Standby",
    },
  ]);

  return (
    <PokoAppShell
      title="Data Training AI (FineTunnel)"
      subtitle="Daftar model kecerdasan dan basis pengetahuan (Knowledge Base) AI Agent yang aktif di WhatsApp"
      actionButton={
        <Link
          href="/app/auto-reply/finetunnel/create"
          className="h-9 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Data Training Baru</span>
        </Link>
      }
    >
      <div className="space-y-6 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-poko-charcoal">{agent.name}</h3>
                      <p className="text-xs text-stone-500 font-medium">{agent.role}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      agent.active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-2 mt-4">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Model AI:</span>
                    <span className="font-semibold text-stone-800">{agent.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Kapasitas Memory:</span>
                    <span className="font-medium text-stone-800">{agent.historyLimit} Pesan Terakhir</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Ukuran Data Training:</span>
                    <span className="font-bold text-purple-700">{agent.trainingCharacters} Karakter Teks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Terakhir Diupdate:</span>
                    <span className="text-stone-600">{agent.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <Link
                  href="/app/auto-reply/finetunnel/create"
                  className="text-xs font-semibold text-stone-700 hover:text-poko-charcoal flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Data Training</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50">
                    {agent.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
