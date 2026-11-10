"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Brain,
  Sparkles,
  Save,
  ArrowLeft,
  Sliders,
  FileText,
  HelpCircle,
  Upload,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Bot,
  Plus,
  Trash2,
  Globe,
  RefreshCw,
  Image as ImageIcon,
  Truck,
  MapPin,
  Paperclip,
  Check,
} from "lucide-react";

export default function FineTunnelCreatePage() {
  const [activeTab, setActiveTab] = useState<
    "basic" | "behaviour" | "knowledge" | "extra_training" | "follow_up" | "media" | "shipping" | "escalation"
  >("basic");

  // Basic Settings
  const [agentName, setAgentName] = useState("PokoBot Sales & CS Consultant");
  const [model, setModel] = useState("pokobot-fast");
  const [temperature, setTemperature] = useState(0.7);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [replyDelay, setReplyDelay] = useState(3);
  const [role, setRole] = useState("sales_cs");
  const [tone, setTone] = useState("friendly");

  const [businessProfile, setBusinessProfile] = useState(
    "PT FLUXY KARYA DIGITAL - Penyedia solusi WhatsApp CRM, automasi pesan massal, dan chatbot AI pintar untuk bisnis & UMKM di Indonesia."
  );

  // Core Knowledge
  const [trainingDataText, setTrainingDataText] = useState(
`=== KATALOG PAKET LANGGANAN ===
1. Paket Starter:
   - Harga: Rp 499.000 / bulan
   - Kapasitas: 1 Nomor WhatsApp, 3 CS Agent, 5.000 pesan AI per bulan.
   - Fitur: Auto-reply AI, Kontak Manajemen, Quick Reply.

2. Paket Pro (Paling Populer):
   - Harga: Rp 999.000 / bulan
   - Kapasitas: 3 Nomor WhatsApp, 10 CS Agent, 20.000 pesan AI per bulan.
   - Fitur: Broadcast WhatsApp (Anti-Banned), Kanban Pipeline CRM, Drip Follow-up, WA Scraper.

3. Paket Enterprise:
   - Harga: Rp 2.500.000 / bulan (atau custom kontrak tahunan diskon 20%)
   - Kapasitas: Dedicated WAHA Server, Unlimited Nomor & Agent, Kuota AI Tanpa Batas.

=== ALUR PEMBAYARAN & REKENING ===
- Pembayaran resmi melalui rekening BCA: 8830-1928-11 a/n PT FLUXY KARYA DIGITAL.
- Tersedia pembayaran QRIS instan melalui payment gateway Duitku yang aktif dalam 1 menit.

=== JAM OPERASIONAL & BANTUAN MANUSIA ===
- Bot AI siap melayani 24 jam nonstop setiap hari.
- Tim CS Manusia siap membantu Senin - Jumat pukul 08.00 - 21.00 WIB, Sabtu pukul 09.00 - 17.00 WIB.`
  );

  const [faqs, setFaqs] = useState([
    {
      q: "Apakah aman dari blokir WhatsApp?",
      a: "Sangat aman. PokoBot menggunakan engine WAHA dengan jeda acak (random delay) 8-15 detik antar pengiriman dan personalisasi nama pelanggan.",
    },
    {
      q: "Apakah bisa disambungkan ke nomor WhatsApp yang sudah ada?",
      a: "Bisa, Anda cukup scan QR Code dari WhatsApp Web nomor Anda sendiri tanpa perlu ganti nomor baru.",
    },
  ]);

  // 1. DATA TRAINING TAMBAHAN
  const [webUrls, setWebUrls] = useState(["https://tokofluxy.id/katalog", "https://tokofluxy.id/faq"]);
  const [newUrlInput, setNewUrlInput] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState([
    { name: "SOP-Pelayanan-CS-2026.pdf", size: "1.8 MB", status: "Sudah Dipelajari AI", chars: 8400 },
    { name: "Daftar-Harga-Grosir-Q4.xlsx", size: "450 KB", status: "Sudah Dipelajari AI", chars: 3200 },
  ]);

  // 2. FOLLOW UP OTOMATIS
  const [followUpEnabled, setFollowUpEnabled] = useState(true);
  const [followUpSequences, setFollowUpSequences] = useState([
    {
      step: 1,
      delayMinutes: 15,
      delayLabel: "15 Menit setelah chat berhenti",
      message: "Halo kak {{nama}}, apakah ada informasi lain yang ingin ditanyakan seputar paket PokoBot? Tim kami siap bantu ya!",
      active: true,
    },
    {
      step: 2,
      delayMinutes: 120,
      delayLabel: "2 Jam jika belum ada respon",
      message: "Hai kak {{nama}}, khusus hari ini ada promo diskon tambahan 10% untuk upgrade ke Paket Pro lho. Mau kami bantu proses vouchernya?",
      active: true,
    },
    {
      step: 3,
      delayMinutes: 1440,
      delayLabel: "24 Jam (Hari Berikutnya)",
      message: "Halo kak, percakapan ini akan kami simpan ke sistem CRM kami. Jika butuh konsultasi lagi, tinggal balas chat ini kapan saja ya. Terima kasih!",
      active: true,
    },
  ]);

  // 3. INTEGRASI MEDIA
  const [mediaRules, setMediaRules] = useState([
    {
      id: "mr-1",
      keyword: "katalog, brosur, pricelist, paket",
      mediaType: "PDF Document",
      mediaName: "Brosur-Paket-Enterprise-2026.pdf",
      caption: "Berikut katalog lengkap produk dan paket PokoBot kami ya kak:",
      active: true,
    },
    {
      id: "mr-2",
      keyword: "rekening, bayar, qris, transfer, invoice",
      mediaType: "Image (QRIS)",
      mediaName: "QRIS-Duitku-Fluxy-Official.png",
      caption: "Silakan scan kode QRIS BCA/Gopay/OVO resmi kami di atas untuk pembayaran instan:",
      active: true,
    },
    {
      id: "mr-3",
      keyword: "halo, selamat pagi, selamat siang, assalamualaikum",
      mediaType: "Voice Note (.ogg)",
      mediaName: "Voice-Greeting-Halo-Selamat-Datang.ogg",
      caption: "Salam hangat dari Customer Care PokoBot!",
      active: false,
    },
  ]);

  // 4. INTEGRASI ONGKOS KIRIM
  const [shippingEnabled, setShippingEnabled] = useState(true);
  const [originCity, setOriginCity] = useState("Jakarta Barat (Gudang Utama)");
  const [defaultWeight, setDefaultWeight] = useState(1000); // 1kg
  const [selectedCouriers, setSelectedCouriers] = useState(["jne", "jnt", "sicepat", "anteraja"]);

  // Escalation
  const [escalateKeywords, setEscalateKeywords] = useState("admin, manusia, cs, komplain, refund, bos, telepon");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addUrl = () => {
    if (!newUrlInput.trim()) return;
    setWebUrls((prev) => [...prev, newUrlInput.trim()]);
    setNewUrlInput("");
  };

  const removeUrl = (idx: number) => {
    setWebUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleCourier = (courierId: string) => {
    setSelectedCouriers((prev) =>
      prev.includes(courierId) ? prev.filter((c) => c !== courierId) : [...prev, courierId]
    );
  };

  const addFaq = () => {
    setFaqs((prev) => [...prev, { q: "", a: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFaq = (index: number, field: "q" | "a", value: string) => {
    setFaqs((prev) => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };

  return (
    <PokoAppShell
      title="Buat Data Training AI (FineTunnel)"
      subtitle="Kelola pengetahuan produk, data training tambahan, auto follow-up, kirim media otomatis, dan integrasi ongkos kirim"
      actionButton={
        <div className="flex items-center gap-2">
          <Link
            href="/app/auto-reply/finetunnel"
            className="h-9 px-3.5 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar</span>
          </Link>
          <button
            onClick={handleSave}
            className="h-9 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Semua Konfigurasi</span>
          </button>
        </div>
      }
    >
      <div className="max-w-5xl space-y-6">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data Training, Follow-up, Media, dan Integrasi Ongkos Kirim berhasil disimpan dan aktif!</span>
          </div>
        )}

        {/* Tab Navigation (8 Dedicated Modules) */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-poko-border shadow-xs overflow-x-auto">
          {[
            { id: "basic", label: "Pengaturan Dasar", icon: Sliders },
            { id: "behaviour", label: "Persona & SOP", icon: Bot },
            { id: "knowledge", label: "Knowledge Base", icon: FileText },
            { id: "extra_training", label: "Training Tambahan", icon: Globe, badge: "Web & File" },
            { id: "follow_up", label: "Auto Follow Up", icon: RefreshCw, badge: "Drip" },
            { id: "media", label: "Kirim Media", icon: ImageIcon, badge: "QRIS/PDF" },
            { id: "shipping", label: "Integrasi Ongkir", icon: Truck, badge: "Cek Ongkir" },
            { id: "escalation", label: "Eskalasi CS", icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-poko-charcoal text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PENGATURAN DASAR */}
        {activeTab === "basic" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-poko-charcoal">Parameter & Identitas AI Agent</h3>
              <p className="text-xs text-stone-500">Tentukan profil teknis dan kecerdasan model yang digunakan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama AI Agent (Untuk Identifikasi Internal)
                </label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pilihan Model Kecerdasan AI
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value="pokobot-fast">PokoBot Standard (Super Cepat ~1.2s & Efisien)</option>
                  <option value="pokobot-pro">PokoBot Advanced (Deep Reasoning untuk Kebutuhan Kompleks)</option>
                  <option value="gpt-4o">GPT-4o Multi-Lingual Engine</option>
                  <option value="claude-3-5">Claude 3.5 Sonnet Engine</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-stone-700">
                    Temperature (Kreativitas Jawaban): <span className="font-mono text-purple-700 font-bold">{temperature}</span>
                  </label>
                  <span className="text-[10px] text-stone-400">
                    {temperature <= 0.3 ? "Sangat Faktual" : temperature <= 0.7 ? "Seimbang & Luwes" : "Kreatif"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-poko-charcoal cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>0.0 (Kaku & Faktual)</span>
                  <span>0.7 (Rekomendasi CS)</span>
                  <span>1.0 (Kreatif)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  AI History Limit (Jumlah Pesan Terakhir yang Diingat)
                </label>
                <select
                  value={historyLimit}
                  onChange={(e) => setHistoryLimit(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value={5}>5 Pesan Terakhir (Hemat Token)</option>
                  <option value={10}>10 Pesan Terakhir (Direkomendasikan)</option>
                  <option value={20}>20 Pesan Terakhir (Konteks Percakapan Panjang)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Jeda Waktu Balasan AI (Simulasi Mengetik Alami)
                </label>
                <select
                  value={replyDelay}
                  onChange={(e) => setReplyDelay(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value={0}>Instan (Langsung terkirim dalam ~1 detik)</option>
                  <option value={3}>3 Detik (Alami seperti manusia mengetik)</option>
                  <option value={5}>5 Detik (Sangat natural untuk chat panjang)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI BEHAVIOUR & PERSONA */}
        {activeTab === "behaviour" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-poko-charcoal">Persona, Peran & Gaya Komunikasi</h3>
              <p className="text-xs text-stone-500">Tentukan kepribadian bot saat berinteraksi dengan pelanggan di WhatsApp</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Peran Utama AI
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value="sales_cs">Sales Consultant & Customer Care (Kualifikasi & Penjualan)</option>
                  <option value="support_only">Customer Service Support Murni (Pusat Bantuan & Komplain)</option>
                  <option value="appointment">Appointment / Reservasi Jadwal Konsultasi</option>
                  <option value="order_taker">Order Taker Toko Online (Catat Pesanan)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Gaya Bahasa & Tone of Voice
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value="friendly">Sangat Ramah, Hangat & Solutif (Disertai Emoji Secukupnya)</option>
                  <option value="formal">Formal, Profesional & Ringkas (Bahasa Baku)</option>
                  <option value="casual">Santai, Kasual & Gaul (Cocok untuk Brand Gen-Z/Lifestyle)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Profil & Deskripsi Bisnis Anda
              </label>
              <textarea
                rows={3}
                value={businessProfile}
                onChange={(e) => setBusinessProfile(e.target.value)}
                className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 3: KNOWLEDGE BASE INTI */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-poko-charcoal">Dokumen Utama Data Training (Knowledge Base)</h3>
                  <p className="text-xs text-stone-500">
                    Tuliskan seluruh informasi produk, spesifikasi, harga, tata cara order, dan SOP yang WAJIB dipahami oleh bot
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                  {trainingDataText.length} Karakter Terisi
                </span>
              </div>

              <textarea
                rows={12}
                value={trainingDataText}
                onChange={(e) => setTrainingDataText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            {/* Q&A FAQ Builder */}
            <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-poko-charcoal">Tanya & Jawab Cepat (Q&A Pairs)</h3>
                  <p className="text-xs text-stone-500">Pasangan pertanyaan umum dari pelanggan dan jawaban pasti yang harus diberikan</p>
                </div>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-poko-border bg-stone-50 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Q&A</span>
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">Pertanyaan #{idx + 1}</span>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(idx)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Contoh: Berapa lama waktu pengiriman paket?"
                      value={faq.q}
                      onChange={(e) => updateFaq(idx, "q", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-poko-charcoal font-semibold"
                    />
                    <textarea
                      rows={2}
                      placeholder="Jawaban resmi yang harus disampaikan oleh bot..."
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, "a", e.target.value)}
                      className="w-full p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-poko-charcoal leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATA TRAINING TAMBAHAN (URL & FILES) */}
        {activeTab === "extra_training" && (
          <div className="space-y-6">
            {/* Website Scraper / URL Crawler */}
            <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">Web Scraper Knowledge (Crawl Otomatis URL)</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Masukkan link landing page atau website toko online Anda agar AI otomatis membaca seluruh konten teksnya
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="https://tokoanda.com/katalog-produk"
                  value={newUrlInput}
                  onChange={(e) => setNewUrlInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
                <button
                  type="button"
                  onClick={addUrl}
                  className="h-9 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ambil Konten URL</span>
                </button>
              </div>

              {/* URL List */}
              <div className="space-y-2 pt-2">
                {webUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="font-mono text-stone-800 truncate">{url}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Tersinkronisasi
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUrl(idx)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Upload (PDF, Word, Excel) */}
            <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">Upload Berkas Dokumen (PDF, DOCX, CSV)</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Lampirkan dokumen SOP, brosur spesifikasi produk, atau spreadsheet daftar harga untuk dipelajari AI
                </p>
              </div>

              {/* Dropzone */}
              <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:border-stone-400 transition-colors bg-stone-50/50 cursor-pointer">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-700">Tarik dan letakkan berkas di sini, atau klik untuk memilih</p>
                <p className="text-[11px] text-stone-400 mt-1">Mendukung file PDF, Word (.docx), Excel (.xlsx), atau TXT (Maks. 25MB per file)</p>
              </div>

              {/* Uploaded Docs Table */}
              <div className="space-y-2 pt-2">
                {uploadedDocs.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-semibold text-poko-charcoal">{doc.name}</p>
                        <p className="text-[11px] text-stone-400">{doc.size} • {doc.chars} karakter diekstrak</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FOLLOW UP OTOMATIS */}
        {activeTab === "follow_up" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">Auto Follow-Up Sequence (Pancingan Chat Otomatis)</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Kirim pesan pengingat otomatis jika pelanggan berhenti membalas atau menggantungkan percakapan
                </p>
              </div>

              {/* Master Switch */}
              <button
                type="button"
                onClick={() => setFollowUpEnabled(!followUpEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  followUpEnabled ? "bg-emerald-600" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    followUpEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Sequence Steps */}
            <div className="space-y-4">
              {followUpSequences.map((seq, idx) => (
                <div key={seq.step} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-poko-charcoal text-white text-[11px] font-bold flex items-center justify-center">
                        {seq.step}
                      </span>
                      <h4 className="font-bold text-xs text-poko-charcoal">{seq.delayLabel}</h4>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-stone-700 border border-stone-200">
                      Jeda: {seq.delayMinutes} Menit
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Template Pesan Follow-Up:
                    </label>
                    <textarea
                      rows={2}
                      value={seq.message}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFollowUpSequences((prev) => {
                          const next = [...prev];
                          next[idx].message = val;
                          return next;
                        });
                      }}
                      className="w-full p-3 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-poko-charcoal"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: INTEGRASI MEDIA OTOMATIS */}
        {activeTab === "media" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm text-poko-charcoal">Integrasi Media Otomatis (Kirim Gambar/PDF dari Bot)</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Atur pengiriman file brosur, gambar QRIS, atau foto produk secara otomatis saat pelanggan menanyakan hal terkait
              </p>
            </div>

            <div className="space-y-4">
              {mediaRules.map((rule, idx) => (
                <div key={rule.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-poko-charcoal bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                      Pemicu: {rule.keyword}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {rule.mediaType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        File Terpilih dari Media Manager:
                      </label>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-2">
                        <Paperclip className="w-3.5 h-3.5 text-stone-400" />
                        <span>{rule.mediaName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Caption / Kalimat Pengantar File:
                      </label>
                      <input
                        type="text"
                        value={rule.caption}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMediaRules((prev) => {
                            const next = [...prev];
                            next[idx].caption = val;
                            return next;
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-poko-charcoal"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INTEGRASI ONGKOS KIRIM */}
        {activeTab === "shipping" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-poko-charcoal">Integrasi Ongkos Kirim (Cek Ongkir Otomatis by AI)</h3>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  AI akan secara otomatis mendeteksi nama kecamatan/kota tujuan pelanggan dan langsung membalas tarif ongkir real-time
                </p>
              </div>

              {/* Master Switch */}
              <button
                type="button"
                onClick={() => setShippingEnabled(!shippingEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  shippingEnabled ? "bg-emerald-600" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    shippingEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Kota / Kecamatan Asal Pengiriman (Gudang Anda)
                </label>
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  placeholder="Contoh: Kebon Jeruk, Jakarta Barat"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Estimasi Berat Default per Paket (Gram)
                </label>
                <input
                  type="number"
                  value={defaultWeight}
                  onChange={(e) => setDefaultWeight(parseInt(e.target.value) || 1000)}
                  placeholder="1000 (1 kg)"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>
            </div>

            {/* Courier Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Pilih Ekspedisi Kurir yang Didukung:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { id: "jne", label: "JNE Express" },
                  { id: "jnt", label: "J&T Express" },
                  { id: "sicepat", label: "SiCepat" },
                  { id: "anteraja", label: "Anteraja" },
                  { id: "pos", label: "Pos Indonesia" },
                  { id: "idexpress", label: "ID Express" },
                ].map((courier) => {
                  const isChecked = selectedCouriers.includes(courier.id);
                  return (
                    <div
                      key={courier.id}
                      onClick={() => toggleCourier(courier.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-1 ${
                        isChecked
                          ? "bg-poko-charcoal text-white border-poko-charcoal shadow-xs"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                      }`}
                    >
                      <span className="text-xs font-bold">{courier.label}</span>
                      <span className="text-[10px] text-stone-400">
                        {isChecked ? "Aktif" : "Mati"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Output Preview */}
            <div className="p-5 rounded-2xl bg-poko-linen border border-stone-300/60 space-y-2">
              <span className="text-xs font-bold text-poko-charcoal block">
                Contoh Balasan Otomatis WhatsApp Saat Klien Tanya Ongkir:
              </span>
              <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-700 font-mono leading-relaxed whitespace-pre-wrap">
{`Halo kak! Untuk pengiriman dari ${originCity} ke tujuan *Kecamatan Lowokwaru, Malang* (Estimasi 1 kg):

📦 J&T EZ: Rp 22.000 (2-3 hari)
📦 JNE REG: Rp 24.000 (2-3 hari)
📦 SiCepat REG: Rp 22.000 (1-2 hari)

Kakak mau diproses menggunakan kurir yang mana? 😊`}
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ATURAN ESKALASI KE HUMAN CS */}
        {activeTab === "escalation" && (
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-poko-charcoal">Aturan Serah Terima ke CS Manusia (Human Takeover)</h3>
              <p className="text-xs text-stone-500">Mencegah AI menjawab di luar batas kewenangan ketika pelanggan membutuhkan penanganan khusus</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kata Kunci Pemicu Eskalasi (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={escalateKeywords}
                  onChange={(e) => setEscalateKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Jika pelanggan mengetik salah satu kata kunci di atas, bot akan otomatis berhenti membalas dan membunyikan notifikasi ke tim CS.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pesan Transisi saat AI Menyerahkan Chat ke Manusia
                </label>
                <textarea
                  rows={3}
                  defaultValue="Baik kak, pertanyaan kakak akan segera ditangani langsung oleh staf Customer Service kami. Mohon ditunggu sebentar ya!"
                  className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PokoAppShell>
  );
}
