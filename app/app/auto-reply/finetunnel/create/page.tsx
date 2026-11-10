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
} from "lucide-react";

export default function FineTunnelCreatePage() {
  const [activeTab, setActiveTab] = useState<"basic" | "behaviour" | "knowledge" | "escalation">("basic");
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

  const [escalateKeywords, setEscalateKeywords] = useState("admin, manusia, cs, komplain, refund, bos, telepon");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
      title="Buat Data Training AI (Fine-Tuning)"
      subtitle="Kelola pengetahuan bisnis, SOP respon, dan data latih produk untuk AI Agent WhatsApp Anda"
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
            <span>Simpan Data Training</span>
          </button>
        </div>
      }
    >
      <div className="max-w-5xl space-y-6">
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data Training berhasil disimpan dan siap digunakan oleh engine AI PokoBot!</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-poko-border shadow-xs overflow-x-auto">
          {[
            { id: "basic", label: "1. Pengaturan Dasar AI Agent", icon: Sliders },
            { id: "behaviour", label: "2. AI Behaviour & Persona", icon: Bot },
            { id: "knowledge", label: "3. Data Training & Knowledge Base", icon: FileText },
            { id: "escalation", label: "4. Aturan Eskalasi ke CS Manusia", icon: UserCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-poko-charcoal text-white shadow-xs"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
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

        {/* TAB 3: DATA TRAINING & KNOWLEDGE BASE */}
        {activeTab === "knowledge" && (
          <div className="space-y-6">
            {/* Core Training Text */}
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
                rows={14}
                value={trainingDataText}
                onChange={(e) => setTrainingDataText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />

              <div className="p-3.5 rounded-2xl bg-poko-linen border border-stone-300/60 text-xs text-stone-700 space-y-1">
                <span className="font-bold block text-poko-charcoal">Tips Format Data Training Efektif:</span>
                <p>• Gunakan judul bab dengan tanda sama dengan, misalnya: <code className="bg-white px-1 py-0.5 rounded border border-stone-300">=== DAFTAR HARGA ===</code></p>
                <p>• Tuliskan poin-poin dengan jelas dan sertakan angka nominal agar bot tidak salah memberikan harga ke calon pembeli.</p>
              </div>
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

        {/* TAB 4: ATURAN ESKALASI KE HUMAN CS */}
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
