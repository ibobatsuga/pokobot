"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  TrendingUp,
  Bot,
  Kanban,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Plus,
} from "lucide-react";

export default function PokoDashboardPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false);

  const pipelineStages = [
    {
      title: "New Inquiries",
      count: 12,
      total: "Rp 28.5M",
      cards: [
        {
          id: "1",
          name: "Budi Santoso",
          phone: "+62 818-0273-1947",
          tag: "API Integration",
          tagColor: "bg-blue-50 text-blue-700 border-blue-200",
          value: "Rp 7.500.000",
          time: "10 min lalu",
          summary: "Menanyakan integrasi WAHA & CRM untuk 5 CS agent.",
          dark: false,
        },
        {
          id: "2",
          name: "Siti Rahma",
          phone: "+62 812-9988-7711",
          tag: "Paket Starter",
          tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          value: "Rp 3.200.000",
          time: "32 min lalu",
          summary: "Tanya promo onboarding bulanan bot toko online.",
          dark: false,
        },
      ],
    },
    {
      title: "AI Qualifying",
      count: 8,
      total: "Rp 34.2M",
      cards: [
        {
          id: "3",
          name: "Hendro Wijaya",
          phone: "+62 812-2630-0090",
          tag: "Enterprise Tier",
          tagColor: "bg-purple-50 text-purple-700 border-purple-200",
          value: "Rp 18.000.000",
          time: "1 jam lalu",
          summary: "Bot Poko sedang kualifikasi kebutuhan 10.000 broadcast/hari.",
          dark: true, // Dark card highlight Ronas IT style
        },
        {
          id: "4",
          name: "Dewi Lestari",
          phone: "+62 856-1234-5678",
          tag: "Custom Bot",
          tagColor: "bg-amber-50 text-amber-700 border-amber-200",
          value: "Rp 8.700.000",
          time: "2 jam lalu",
          summary: "Menyediakan FAQ katalog produk skincare via GPT-6 Luna.",
          dark: false,
        },
      ],
    },
    {
      title: "Sales Follow-up",
      count: 5,
      total: "Rp 42.0M",
      cards: [
        {
          id: "5",
          name: "Kurniawan Pratama",
          phone: "+62 813-7722-1100",
          tag: "Human Review",
          tagColor: "bg-rose-50 text-rose-700 border-rose-200",
          value: "Rp 24.000.000",
          time: "3 jam lalu",
          summary: "Request demo live via Google Meet dari tim procurement.",
          dark: false,
        },
      ],
    },
    {
      title: "Deal Closed / Won",
      count: 19,
      total: "Rp 142.8M",
      cards: [
        {
          id: "6",
          name: "CV Berkah Abadi",
          phone: "+62 819-3344-5566",
          tag: "Annual Contract",
          tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          value: "Rp 38.000.000",
          time: "Kemarin",
          summary: "Invoice lunas via Duitku Payment Gateway.",
          dark: false,
        },
      ],
    },
  ];

  return (
    <PokoAppShell
      title="Dashboard Stats"
      subtitle="Ringkasan performa penjualan, pipeline CRM, dan bot otomatisasi AI"
    >
      <div className="space-y-8">
        {/* HERO KPI SECTION: Ronas IT Warm Minimalist Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Linen Card with Radial Gauge & Charts */}
          <div className="lg:col-span-2 rounded-3xl bg-poko-linen border border-stone-200/60 p-7 flex flex-col justify-between shadow-subtle relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-stone-200 text-xs font-semibold text-stone-700 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Target Penjualan Bulan Ini
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-poko-charcoal">
                  Rp 142.800.000
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Dari target total Rp 180.000.000 (November 2026)
                </p>
              </div>

              {/* Semicircular Radial Gauge */}
              <div className="flex flex-col items-center">
                <div className="relative w-36 h-20 flex items-end justify-center overflow-hidden">
                  <svg className="w-36 h-36 transform -rotate-180" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#e2e3d5"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="125.6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1f1f1f"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="153.2"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute bottom-1 text-center">
                    <span className="text-2xl font-bold text-poko-charcoal">78%</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-stone-500 mt-1">Goal Reached</span>
              </div>
            </div>

            {/* Striped / Solid Activity Bars (Ronas IT Design Signature) */}
            <div className="mt-8 pt-6 border-t border-stone-300/40 relative z-10">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-3">
                <span className="font-semibold text-poko-charcoal">
                  Aktivitas Percakapan Harian
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-poko-charcoal"></span> AI Handled
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-stone-300"></span> Human Agent
                  </span>
                </div>
              </div>

              {/* Bars */}
              <div className="grid grid-cols-7 gap-3 items-end h-24">
                {[
                  { day: "Sen", ai: 65, human: 20 },
                  { day: "Sel", ai: 85, human: 15 },
                  { day: "Rab", ai: 92, human: 25 },
                  { day: "Kam", ai: 78, human: 30 },
                  { day: "Jum", ai: 110, human: 40 },
                  { day: "Sab", ai: 50, human: 10 },
                  { day: "Min", ai: 45, human: 5 },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1">
                      <div
                        style={{ height: `${(bar.ai / 120) * 80}px` }}
                        className="w-4 rounded-t-md bg-poko-charcoal transition-all hover:opacity-80"
                      ></div>
                      <div
                        style={{ height: `${(bar.human / 120) * 80}px` }}
                        className="w-4 rounded-t-md bg-stone-300 transition-all hover:opacity-80"
                      ></div>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: AI Bot Control & Safety Switch */}
          <div className="rounded-3xl bg-white border border-poko-border p-7 flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-stone-100 text-stone-600">
                  gpt-6-luna
                </span>
              </div>

              <h3 className="font-bold text-base text-poko-charcoal">Poko AI Engine</h3>
              <p className="text-xs text-stone-500 mt-1">
                Didukung Sakelar AI Gateway dengan proteksi self-chat loop & filter grup anti-spam.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs font-medium text-stone-700">Auto-Reply Status</span>
                  <button
                    onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      autoReplyEnabled ? "bg-emerald-600" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoReplyEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Target WhatsApp:</span>
                    <span className="font-semibold text-stone-800">089637370000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Response Speed:</span>
                    <span className="font-semibold text-emerald-600">1.2 detik (Streaming)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Whitelist Safety:</span>
                    <span className="font-semibold text-stone-800">3 Nomor Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-poko-border">
              <Link
                href="/app/omnichannel-crm"
                className="w-full py-2.5 px-4 rounded-xl bg-poko-linen text-poko-charcoal font-semibold text-xs flex items-center justify-center gap-2 hover:bg-stone-200 transition-all border border-stone-300/60"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                Buka CRM Chat App
              </Link>
            </div>
          </div>
        </div>

        {/* KANBAN CRM PIPELINE PREVIEW */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-poko-charcoal">Sales Pipeline & CRM Deals</h2>
              <p className="text-xs text-stone-500">
                Pelacakan otomatis deal dari WhatsApp masuk sampai transaksi selesai
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/app/omnichannel-crm/pipeline"
                className="px-3.5 py-1.5 rounded-xl border border-poko-border text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 flex items-center gap-1.5"
              >
                <span>Lihat Full Pipeline Board</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kanban Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pipelineStages.map((stage, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-poko-border p-4 flex flex-col shadow-subtle min-h-[440px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-poko-border mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-poko-charcoal"></span>
                    <h4 className="font-bold text-xs text-poko-charcoal tracking-tight">
                      {stage.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600">
                      {stage.count}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-400">{stage.total}</span>
                </div>

                {/* Cards inside Column */}
                <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
                  {stage.cards.map((card) =>
                    card.dark ? (
                      <div
                        key={card.id}
                        className="rounded-2xl bg-poko-charcoal text-white p-4 shadow-card space-y-3 border border-stone-800 transition-all hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white border border-white/20">
                            {card.tag}
                          </span>
                          <span className="text-[10px] text-stone-400">{card.time}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{card.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                            {card.phone}
                          </p>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">{card.summary}</p>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-stone-400">Estimasi Nilai</span>
                          <span className="font-bold text-emerald-400">{card.value}</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={card.id}
                        className="rounded-2xl bg-white p-4 shadow-subtle border border-stone-200/70 space-y-3 transition-all hover:border-stone-400 hover:-translate-y-0.5"
                      >
                        <div className="flex items-start justify-between">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${card.tagColor}`}
                          >
                            {card.tag}
                          </span>
                          <span className="text-[10px] text-stone-400">{card.time}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-poko-charcoal">{card.name}</p>
                          <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                            {card.phone}
                          </p>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{card.summary}</p>
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-stone-400">Estimasi Nilai</span>
                          <span className="font-bold text-poko-charcoal">{card.value}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
