"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PokoAppShell } from "@/components/PokoAppShell";
import { WahaQrConnector } from "@/components/WahaQrConnector";
import { getSavedConnectedDevice } from "@/lib/wahaClient";
import {
  TrendingUp,
  Bot,
  Kanban,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Plus,
  Smartphone,
  Users,
  Send,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Radio,
  MapPin,
  CreditCard,
  BatteryCharging,
  FileText,
  ShieldCheck,
  Check,
  ChevronRight,
  Filter,
  QrCode,
  Inbox,
} from "lucide-react";

export default function PokoDashboardPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [showQrModal, setShowQrModal] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<{ phone: string; name: string; session: string } | null>(null);

  useEffect(() => {
    const sync = () => setConnectedDevice(getSavedConnectedDevice());
    sync();
    window.addEventListener("pokobot-waha-updated", sync);
    return () => window.removeEventListener("pokobot-waha-updated", sync);
  }, []);

  // Ping KPI Stats Cards (Clean Slate for New User)
  const kpiStats = [
    {
      title: "Device WhatsApp",
      value: connectedDevice ? "1 / 1" : "0 / 1",
      unit: "Terkoneksi",
      change: connectedDevice ? connectedDevice.phone : "Siap Scan QR",
      changeType: connectedDevice ? "positive" : "neutral",
      icon: Smartphone,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      href: "/app/device",
    },
    {
      title: "Database Kontak",
      value: "0",
      unit: "Kontak",
      change: "Siap Terima Kontak",
      changeType: "neutral",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      href: "/app/stores",
    },
    {
      title: "Broadcast Terkirim",
      value: "0",
      unit: "Pesan",
      change: "Anti-Ban Ready",
      changeType: "neutral",
      icon: Send,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200",
      href: "/app/blash",
    },
    {
      title: "Sisa Kuota AI",
      value: "10.000",
      unit: "Credits",
      change: "Saldo Starter Baru",
      changeType: "positive",
      icon: Zap,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200",
      href: "/app/billing",
    },
  ];

  // Quick Actions Ping Style
  const quickActions = [
    {
      label: "Koneksi Device",
      desc: "Scan QR WhatsApp",
      href: "/app/device",
      icon: Smartphone,
    },
    {
      label: "Broadcast Baru",
      desc: "Kirim massal anti-ban",
      href: "/app/blash",
      icon: Send,
    },
    {
      label: "Data Training AI",
      desc: "Atur SOP & dokumen",
      href: "/app/auto-reply/finetunnel/create",
      icon: Bot,
    },
    {
      label: "Scraper Kontak",
      desc: "Ekstrak Google Maps",
      href: "/app/scrapping",
      icon: MapPin,
    },
    {
      label: "CRM Chat App",
      desc: "Multi CS & Takeover",
      href: "/app/omnichannel-crm",
      icon: MessageSquare,
      highlight: true,
    },
  ];

  // Connected Devices (Clean State - 0 Connected)
  const connectedDevices: Array<{
    id: string;
    name: string;
    phone: string;
    status: string;
    battery: string;
    autoReply: boolean;
    lastSync: string;
  }> = [];

  // Recent Broadcasts (Clean State - 0 Broadcasts)
  const recentBroadcasts: Array<{
    id: string;
    name: string;
    target: string;
    success: number;
    failed: number;
    rate: string;
    date: string;
    status: string;
  }> = [];

  // Live Inbound Activity Feed (Clean State - 0 Inbound Messages)
  const recentMessages: Array<{
    id: string;
    sender: string;
    phone: string;
    snippet: string;
    intent: string;
    status: string;
    statusColor: string;
    time: string;
  }> = [];

  // CRM Pipeline Stages (Clean Slate)
  const pipelineStages = [
    {
      title: "New Inquiries",
      count: 0,
      total: "Rp 0",
      cards: [] as any[],
    },
    {
      title: "AI Qualifying",
      count: 0,
      total: "Rp 0",
      cards: [] as any[],
    },
    {
      title: "Sales Follow-up",
      count: 0,
      total: "Rp 0",
      cards: [] as any[],
    },
    {
      title: "Deal Closed / Won",
      count: 0,
      total: "Rp 0",
      cards: [] as any[],
    },
  ];

  return (
    <PokoAppShell
      title="Dashboard Stats"
      subtitle="Ringkasan performa bisnis, integrasi WhatsApp, status perangkat, dan pipeline CRM"
      actionButton={
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5"
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{connectedDevice ? "Kelola / Scan QR" : "Hubungkan WhatsApp"}</span>
        </button>
      }
    >
      <div className="space-y-8 pb-12">
        {/* 1. QUICK ACTIONS BAR */}
        <div className="bg-white rounded-2xl border border-poko-border p-3 shadow-subtle flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 pl-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-poko-charcoal uppercase tracking-wider">
              Aksi Cepat:
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {quickActions.map((qa, i) => {
              const Icon = qa.icon;
              return (
                <Link
                  key={i}
                  href={qa.href}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    qa.highlight
                      ? "bg-poko-charcoal text-white border-poko-charcoal hover:bg-black"
                      : "bg-stone-50 text-stone-700 border-stone-200/80 hover:bg-stone-100"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      qa.highlight ? "text-emerald-400" : "text-stone-500"
                    }`}
                  />
                  <span>{qa.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 2. PING KPI STATS SUMMARY CARDS (4 Cards Row - Clean Slate) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {kpiStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Link
                key={i}
                href={stat.href}
                className="group p-5 rounded-2xl bg-white border border-poko-border shadow-subtle hover:border-stone-400 transition-all block relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-stone-500">{stat.title}</span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center border ${stat.iconBg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-poko-charcoal tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-xs text-stone-500 font-medium">{stat.unit}</span>
                </div>

                <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-stone-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-700 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. HERO KPI & AI ACTIVITY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Linen Card with Radial Gauge & Charts */}
          <div className="lg:col-span-2 rounded-3xl bg-poko-linen border border-stone-200/60 p-7 flex flex-col justify-between shadow-subtle relative overflow-hidden">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-stone-200 text-xs font-semibold text-stone-700 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Total Pesan Diproses
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-poko-charcoal">
                  0 Pesan
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  0 kontak aktif • Siap memproses pesan WhatsApp baru secara otomatis
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
                      stroke="#10b981"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset="125.6"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute bottom-1 text-center">
                    <span className="text-xl font-bold text-emerald-700">100%</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-stone-500 mt-1">
                  Sistem AI Siap Digunakan
                </span>
              </div>
            </div>

            {/* Striped / Solid Activity Bars (Clean Slate Baseline) */}
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

              {/* Baseline 0 Bars */}
              <div className="grid grid-cols-7 gap-3 items-end h-24">
                {[
                  { day: "Sen", ai: 0, human: 0 },
                  { day: "Sel", ai: 0, human: 0 },
                  { day: "Rab", ai: 0, human: 0 },
                  { day: "Kam", ai: 0, human: 0 },
                  { day: "Jum", ai: 0, human: 0 },
                  { day: "Sab", ai: 0, human: 0 },
                  { day: "Min", ai: 0, human: 0 },
                ].map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1">
                      <div className="w-4 h-1.5 rounded-t-sm bg-stone-300"></div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">{bar.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: AI Bot Control & Safety Switch */}
          <div className="rounded-3xl bg-white border border-poko-border p-7 flex flex-col justify-between shadow-card">
            <div>
              <div className="flex items-center justify-between mb-4">
                <img
                  src="/logo.png"
                  alt="PokoBot"
                  className="w-10 h-10 rounded-full object-contain border border-stone-200 shadow-xs"
                />
                <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Engine Siap
                </span>
              </div>

              <h3 className="font-bold text-base text-poko-charcoal">PokoBot AI Engine</h3>
              <p className="text-xs text-stone-500 mt-1">
                Didukung arsitektur WAHA & AI Engine cerdas dengan proteksi loop & keyword guard.
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
                    <span className="font-semibold text-stone-800">Menunggu Tautan Device</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Response Speed:</span>
                    <span className="font-semibold text-emerald-600">1.2 detik (Streaming Siap)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Whitelist Safety:</span>
                    <span className="font-semibold text-stone-800">Mode Terbuka (Siap Pakai)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-poko-border">
              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-poko-linen text-poko-charcoal font-semibold text-xs flex items-center justify-center gap-2 hover:bg-stone-200 transition-all border border-stone-300/60"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>{connectedDevice ? `Terhubung: ${connectedDevice.phone}` : "Hubungkan WhatsApp Device (QR Pop-up)"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. DUAL MIDDLE SECTION: CLEAN DEVICE MONITOR & BROADCASTS vs LIVE FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Device Monitor + Recent Broadcasts */}
          <div className="space-y-6">
            {/* Device Monitor Widget */}
            <div className="bg-white rounded-3xl border border-poko-border p-6 shadow-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">
                    Perangkat WhatsApp Terhubung
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      connectedDevice
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {connectedDevice ? "1 Online" : "0 Online"}
                  </span>
                </div>
                <Link
                  href="/app/device"
                  className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1"
                >
                  <span>Kelola Device</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {connectedDevice ? (
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-poko-charcoal">{connectedDevice.name}</p>
                      <p className="text-xs font-mono text-emerald-700 font-semibold">{connectedDevice.phone}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    WORKING
                  </span>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 text-center space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-emerald-600 flex items-center justify-center mx-auto">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-poko-charcoal">Belum Ada WhatsApp Terhubung</p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Scan QR Code WAHA Cloud untuk menautkan nomor WhatsApp bisnis Anda.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Pop-up Scan QR</span>
                    </button>
                    <Link
                      href="/app/device"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors"
                    >
                      <span>Buka Halaman Device</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Broadcasts Widget */}
            <div className="bg-white rounded-3xl border border-poko-border p-6 shadow-subtle">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">
                    Laporan Broadcast Terakhir
                  </h3>
                </div>
                <Link
                  href="/app/blash"
                  className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentBroadcasts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 text-center space-y-2">
                  <Send className="w-6 h-6 text-stone-400 mx-auto" />
                  <p className="font-bold text-xs text-poko-charcoal">Belum Ada Kampanye Broadcast</p>
                  <p className="text-[11px] text-stone-500">
                    Kirim pesan massal promosi atau pengumuman dengan jeda anti-ban otomatis.
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column: Live Inbound WhatsApp Activity */}
          <div className="bg-white rounded-3xl border border-poko-border p-6 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">
                    Aktivitas Chat WhatsApp Masuk
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <Link
                  href="/app/omnichannel-crm"
                  className="text-xs font-semibold text-stone-600 hover:text-black flex items-center gap-1"
                >
                  <span>Buka Live Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentMessages.length === 0 ? (
                <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200/70 text-center space-y-3 my-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 mx-auto">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-poko-charcoal">Menunggu Pesan Masuk</h4>
                    <p className="text-[11px] text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">
                      Pesan WhatsApp dari pelanggan baru akan muncul secara real-time di sini lengkap dengan deteksi intent AI.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <Link
                href="/app/omnichannel-crm"
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Buka CRM Chat App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. KANBAN CRM PIPELINE PREVIEW (Clean Slate - 0 Deals) */}
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
                className="h-9 px-3.5 rounded-xl border border-poko-border text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
              >
                <span>Lihat Full Pipeline Board</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Kanban Columns Grid (Clean State) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {pipelineStages.map((stage, idx) => (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-poko-border p-4 flex flex-col shadow-subtle min-h-[320px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-poko-border mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-poko-charcoal"></span>
                    <h4 className="font-bold text-xs text-poko-charcoal tracking-tight">
                      {stage.title}
                    </h4>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600">
                      0
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-stone-400">Rp 0</span>
                </div>

                {/* Empty State Card */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-stone-200/80 rounded-2xl text-center space-y-2">
                  <span className="text-stone-300">
                    <Inbox className="w-6 h-6 mx-auto" />
                  </span>
                  <p className="text-[11px] font-medium text-stone-400">
                    Belum ada deal di tahapan ini
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WAHA QR Pop-up Modal */}
      <WahaQrConnector
        mode="modal"
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onConnected={() => setShowQrModal(false)}
      />
    </PokoAppShell>
  );
}
