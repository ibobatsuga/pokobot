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
  Inbox,
} from "lucide-react";

interface DealItem {
  id: string;
  title: string;
  client: string;
  phone: string;
  agent: string;
  value: string;
  date: string;
  tag: string;
  tagColor: string;
}

export default function PipelinePage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const stages: {
    id: string;
    name: string;
    count: number;
    total: string;
    deals: DealItem[];
  }[] = [
    {
      id: "stage-1",
      name: "New Inquiries",
      count: 0,
      total: "Rp 0",
      deals: [],
    },
    {
      id: "stage-2",
      name: "AI Qualifying (Bot Poko)",
      count: 0,
      total: "Rp 0",
      deals: [],
    },
    {
      id: "stage-3",
      name: "Sales Follow-up (Human CS)",
      count: 0,
      total: "Rp 0",
      deals: [],
    },
    {
      id: "stage-4",
      name: "Deal Closed / Won",
      count: 0,
      total: "Rp 0",
      deals: [],
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
            Total Pipeline Revenue: <span className="font-bold text-poko-charcoal">Rp 0</span>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="rounded-3xl bg-stone-50/70 border border-poko-border p-4 flex flex-col space-y-4 min-h-[420px]"
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
              {stage.deals.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-200/80 rounded-2xl text-center space-y-2">
                  <Inbox className="w-6 h-6 text-stone-300" />
                  <p className="text-[11px] font-medium text-stone-400">
                    Belum ada deal di tahapan ini
                  </p>
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
