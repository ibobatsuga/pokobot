"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Sliders,
  Cpu,
  Key,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [aiKey, setAiKey] = useState("sk_live_********************");
  const [aiBaseUrl, setAiBaseUrl] = useState("https://api.openai.com/v1");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [wahaBaseUrl, setWahaBaseUrl] = useState("http://localhost:3000");
  const [whitelistInput, setWhitelistInput] = useState("6281802731947, 6281226300090, 6289637370000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PokoAppShell
      title="Setting Aplikasi & Gateway API"
      subtitle="Konfigurasi integrasi AI Engine, Docker WAHA Endpoint, dan parameter keamanan whitelist"
    >
      <form onSubmit={handleSave} className="max-w-3xl space-y-6">
        {/* AI Config */}
        <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Cpu className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-bold text-sm text-poko-charcoal">PokoBot AI Engine Gateway</h3>
              <p className="text-xs text-stone-500">Pusat engine kecerdasan buatan untuk PokoBot</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                API Base URL
              </label>
              <input
                type="text"
                value={aiBaseUrl}
                onChange={(e) => setAiBaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                API Secret Key
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={aiKey}
                  onChange={(e) => setAiKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Model LLM Utama
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              >
                <option value="gpt-4o">GPT-4o (Direkomendasikan - Tercepat & Paling Cerdas)</option>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              </select>
            </div>
          </div>
        </div>

        {/* WAHA & Safety Settings */}
        <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-poko-charcoal">WAHA & Keamanan Whitelist</h3>
              <p className="text-xs text-stone-500">Mencegah bot membalas nomor asing atau spam grup</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                WAHA Endpoint URL (Docker Gateway)
              </label>
              <input
                type="text"
                value={wahaBaseUrl}
                onChange={(e) => setWahaBaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Daftar Nomor Whitelist (Pisahkan dengan koma)
              </label>
              <textarea
                rows={2}
                value={whitelistInput}
                onChange={(e) => setWhitelistInput(e.target.value)}
                className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Hanya nomor di atas yang akan menerima balasan otomatis AI bot.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Pengaturan berhasil disimpan!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto flex items-center gap-2 px-6 py-2.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </PokoAppShell>
  );
}
