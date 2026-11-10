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
} from "lucide-react";

export default function PokoDashboardPage() {
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  // Ping KPI Stats Cards
  const kpiStats = [
    {
      title: "Device WhatsApp",
      value: "2 / 2",
      unit: "Terkoneksi",
      change: "100% Online",
      changeType: "positive",
      icon: Smartphone,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      href: "/app/device",
    },
    {
      title: "Database Kontak",
      value: "3.480",
      unit: "Kontak",
      change: "+128 minggu ini",
      changeType: "positive",
      icon: Users,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      href: "/app/stores",
    },
    {
      title: "Broadcast Terkirim",
      value: "14.250",
      unit: "Pesan",
      change: "99.4% Anti-Ban",
      changeType: "positive",
      icon: Send,
      iconBg: "bg-purple-50 text-purple-600 border-purple-200",
      href: "/app/blash",
    },
    {
      title: "Sisa Kuota AI",
      value: "85.740",
      unit: "Credits",
      change: "Paket Business Pro",
      changeType: "neutral",
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

  // Connected Devices (Ping Device Health)
  const connectedDevices = [
    {
      id: "dev-1",
      name: "CS & Billing Official",
      phone: "+62 818-0273-1947",
      status: "Connected",
      battery: "94%",
      autoReply: true,
      lastSync: "Baru saja",
    },
    {
      id: "dev-2",
      name: "Sales & Inbound Marketing",
      phone: "+62 896-3737-0000",
      status: "Connected",
      battery: "88%",
      autoReply: true,
      lastSync: "1 min lalu",
    },
  ];

  // Recent Broadcasts (Ping Campaign Reports)
  const recentBroadcasts = [
    {
      id: "b-1",
      name: "Promo Gajian Flash Sale 50%",
      target: "1.200 Kontak",
      success: 1194,
      failed: 6,
      rate: "99.5%",
      date: "Hari ini, 10:15 WIB",
      status: "Selesai",
    },
    {
      id: "b-2",
      name: "Nudge Keranjang Belanja Belum Checkout",
      target: "450 Kontak",
      success: 450,
      failed: 0,
      rate: "100%",
      date: "Kemarin, 16:30 WIB",
      status: "Selesai",
    },
    {
      id: "b-3",
      name: "Edukasi Tips Perawatan & Katalog Baru",
      target: "850 Kontak",
      success: 842,
      failed: 8,
      rate: "99.1%",
      date: "08 Nov 2026",
      status: "Selesai",
    },
  ];

  // Live Inbound Activity Feed
  const recentMessages = [
    {
      id: "m-1",
      sender: "Budi Santoso",
      phone: "+62 818-0273-1947",
      snippet: "Halo kak, ongkir ke Jagakarsa Jakarta Selatan berapa ya untuk paket 1kg?",
      intent: "Cek Ongkir Otomatis",
      status: "Dibalas AI (1.1s)",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "2 min lalu",
    },
    {
      id: "m-2",
      sender: "Siti Rahma",
      phone: "+62 812-9988-7711",
      snippet: "Saya mau transfer lewat QRIS BCA bisa dikirim kodenya?",
      intent: "Kirim QRIS Pembayaran",
      status: "Dibalas AI (0.9s)",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "8 min lalu",
    },
    {
      id: "m-3",
      sender: "Hendro Wijaya",
      phone: "+62 812-2630-0090",
      snippet: "Bisa minta tolong dihubungkan ke tim sales langsung untuk negosiasi kontrak?",
      intent: "Eskalasi CS Manusia",
      status: "Takeover CS Agent",
      statusColor: "bg-blue-50 text-blue-700 border-blue-200",
      time: "15 min lalu",
    },
    {
      id: "m-4",
      sender: "Dewi Lestari",
      phone: "+62 856-1234-5678",
      snippet: "Katalog skincare brightening yang cocok buat kulit sensitif ada kak?",
      intent: "Kirim Katalog PDF",
      status: "Dibalas AI (1.4s)",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      time: "24 min lalu",
    },
  ];

  // CRM Pipeline Stages
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
          summary: "Menyediakan FAQ katalog produk skincare via PokoBot AI.",
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
          summary: "Invoice lunas via Payment Gateway.",
          dark: false,
        },
      ],
    },
  ];

  return (
    <PokoAppShell
      title="Dashboard Stats"
      subtitle="Ringkasan performa bisnis, integrasi WhatsApp, status perangkat, dan pipeline CRM"
      actionButton={
        <Link
          href="/app/blash"
          className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all shadow-xs flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Broadcast</span>
        </Link>
      }
    >
      <div className="space-y-8 pb-12">
        {/* 1. QUICK ACTIONS BAR (Ping Quick Action Suite) */}
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

        {/* 2. PING KPI STATS SUMMARY CARDS (4 Cards Row) */}
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

        {/* 3. HERO KPI & AI ACTIVITY SECTION (Ronas IT Warm Minimalist Card) */}
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
                  18.420 Pesan
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  1.428 kontak aktif • 1.2 detik rata-rata kecepatan respon AI
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
                      strokeDashoffset="142.8"
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute bottom-1 text-center">
                    <span className="text-2xl font-bold text-poko-charcoal">86%</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-stone-500 mt-1">
                  Otomasi AI Berhasil
                </span>
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
                <img
                  src="/logo.png"
                  alt="PokoBot"
                  className="w-10 h-10 rounded-full object-contain border border-stone-200 shadow-xs"
                />
                <span className="text-[11px] font-mono px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Engine Aktif
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

        {/* 4. DUAL MIDDLE SECTION: DEVICE HEALTH & RECENT BROADCASTS vs LIVE INBOUND FEED */}
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
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    2 Online
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

              <div className="space-y-3">
                {connectedDevices.map((dev) => (
                  <div
                    key={dev.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-emerald-600">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-poko-charcoal">{dev.name}</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <p className="text-[11px] text-stone-500 font-mono mt-0.5">{dev.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1 text-stone-500">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-medium">{dev.battery}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100/70 text-emerald-800">
                        Auto-Reply
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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

              <div className="space-y-3">
                {recentBroadcasts.map((b) => (
                  <div
                    key={b.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-poko-charcoal">{b.name}</h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">
                          {b.target} • {b.date}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.rate} Sukses
                      </span>
                    </div>

                    {/* Mini Progress Bar */}
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full w-[99.5%]"></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
                      <span>Terkirim: {b.success.toLocaleString()} pesan</span>
                      <span>Gagal: {b.failed}</span>
                    </div>
                  </div>
                ))}
              </div>
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

              <div className="space-y-3">
                {recentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 hover:bg-stone-100/80 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-poko-charcoal">{msg.sender}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{msg.phone}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">{msg.time}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/50">
                      &ldquo;{msg.snippet}&rdquo;
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span className="font-medium text-stone-600">Intent: {msg.intent}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${msg.statusColor}`}
                      >
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <Link
                href="/app/omnichannel-crm"
                className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Lihat Semua Percakapan di CRM</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 5. KANBAN CRM PIPELINE PREVIEW (Preserved from Current Dashboard) */}
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
