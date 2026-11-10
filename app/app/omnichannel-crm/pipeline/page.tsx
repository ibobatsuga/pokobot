"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Kanban,
  Plus,
  Filter,
  ArrowUpDown,
  MoreVertical,
  DollarSign,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function PipelinePage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stages = [
    {
      id: "stage-1",
      name: "New Inquiries",
      count: 14,
      total: "Rp 32.500.000",
      deals: [
        {
          id: "d1",
          title: "Setup WAHA Multi-Device Enterprise",
          client: "PT Maju Bersama",
          phone: "+62 812-2630-0090",
          agent: "Ibob Atsuga",
          value: "Rp 18.000.000",
          date: "10 Nov 2026",
          tag: "Hot Lead",
          tagColor: "bg-red-50 text-red-700 border-red-200",
        },
        {
          id: "d2",
          title: "Integrasi CRM WhatsApp 5 CS",
          client: "Budi Santoso",
          phone: "+62 818-0273-1947",
          agent: "Sarah (AI Agent)",
          value: "Rp 7.500.000",
          date: "10 Nov 2026",
          tag: "Inquiry API",
          tagColor: "bg-blue-50 text-blue-700 border-blue-200",
        },
        {
          id: "d3",
          title: "Paket Starter Toko Online",
          client: "Siti Rahma",
          phone: "+62 812-9988-7711",
          agent: "Poko AI Bot",
          value: "Rp 3.200.000",
          date: "9 Nov 2026",
          tag: "E-Commerce",
          tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
      ],
    },
    {
      id: "stage-2",
      name: "AI Qualifying (Bot Poko)",
      count: 9,
      total: "Rp 46.800.000",
      deals: [
        {
          id: "d4",
          title: "Broadcast 50.000 Kontak Flash Sale",
          client: "Dewi Lestari",
          phone: "+62 856-1234-5678",
          agent: "PokoBot AI",
          value: "Rp 12.000.000",
          date: "10 Nov 2026",
          tag: "Broadcast",
          tagColor: "bg-purple-50 text-purple-700 border-purple-200",
        },
        {
          id: "d5",
          title: "Custom LLM Knowledge Base Skincare",
          client: "Klinik Cantik Ayu",
          phone: "+62 878-1122-3344",
          agent: "PokoBot AI",
          value: "Rp 24.000.000",
          date: "8 Nov 2026",
          tag: "AI Fine-tune",
          tagColor: "bg-amber-50 text-amber-700 border-amber-200",
        },
      ],
    },
    {
      id: "stage-3",
      name: "Sales Follow-up (Human CS)",
      count: 6,
      total: "Rp 54.000.000",
      deals: [
        {
          id: "d6",
          title: "Annual Subscription 10 Numbers",
          client: "Kurniawan Pratama",
          phone: "+62 813-7722-1100",
          agent: "Ibob Atsuga",
          value: "Rp 36.000.000",
          date: "7 Nov 2026",
          tag: "Enterprise",
          tagColor: "bg-rose-50 text-rose-700 border-rose-200",
        },
      ],
    },
    {
      id: "stage-4",
      name: "Deal Closed / Won",
      count: 22,
      total: "Rp 164.200.000",
      deals: [
        {
          id: "d7",
          title: "Wholesale CRM License 2026",
          client: "CV Berkah Abadi",
          phone: "+62 819-3344-5566",
          agent: "Ibob Atsuga",
          value: "Rp 38.000.000",
          date: "Kemarin",
          tag: "Paid Duitku",
          tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        },
      ],
    },
  ];

  return (
    <PokoAppShell
      title="CRM Pipeline"
      subtitle="Visualisasi tahapan deals, estimasi revenue, dan status konversi WhatsApp leads"
      actionButton={
        <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Deal Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-poko-border shadow-xs">
          <div className="flex items-center gap-2">
            {["all", "my_deals", "high_value", "bot_qualified"].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedFilter === filter
                    ? "bg-poko-linen text-poko-charcoal font-semibold border border-stone-300/60"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {filter === "all" && "Semua Deals"}
                {filter === "my_deals" && "Deal Saya"}
                {filter === "high_value" && "Nilai > Rp 15 Juta"}
                {filter === "bot_qualified" && "🤖 Qualified by AI"}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Total Pipeline Revenue: <span className="font-bold text-poko-charcoal">Rp 297.500.000</span>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-3xl bg-stone-50/70 border border-poko-border p-4 flex flex-col space-y-4 min-h-[500px]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-xs text-poko-charcoal">{stage.name}</h3>
                  <span className="text-[11px] font-bold text-emerald-600">{stage.total}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-stone-700 border border-stone-200">
                  {stage.count}
                </span>
              </div>

              {/* Deals Cards */}
              <div className="space-y-3">
                {stage.deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-subtle space-y-2.5 transition-all hover:border-stone-400 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${deal.tagColor}`}>
                        {deal.tag}
                      </span>
                      <span className="text-[10px] text-stone-400">{deal.date}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-poko-charcoal">{deal.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5 font-medium">{deal.client}</p>
                      <p className="text-[10px] text-stone-400 font-mono">{deal.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-poko-charcoal">{deal.value}</span>
                      <span className="text-[10px] text-stone-500 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        {deal.agent}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
