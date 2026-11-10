"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  MessageCircle,
  Copy,
  Code2,
  Smartphone,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function LiveChatWidgetPage() {
  const [widgetTitle, setWidgetTitle] = useState("Chat dengan CS Poko");
  const [welcomeText, setWelcomeText] = useState(
    "Halo! Ada yang bisa kami bantu seputar Poko Omnichannel & AI CRM?"
  );
  const [whatsappNumber, setWhatsappNumber] = useState("+6281234567890");

  const embedCode = `<script 
  src="https://ping-clone-poc.vercel.app/widget.js" 
  data-phone="${whatsappNumber.replace(/[^0-9]/g, "")}" 
  data-title="${widgetTitle}" 
  async>
</script>`;

  return (
    <PokoAppShell
      title="Live Chat Widget Website"
      subtitle="Pasang tombol floating chat WhatsApp interaktif di website, landing page, atau toko online Anda"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Config */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-poko-charcoal">Pengaturan Widget Website</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Judul Pop-up Widget
                </label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nomor WhatsApp Tujuan
                </label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-mono focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pesan Pembuka (Greeting)
                </label>
                <textarea
                  rows={3}
                  value={welcomeText}
                  onChange={(e) => setWelcomeText(e.target.value)}
                  className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>
            </div>

            {/* Code Snippet */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-poko-charcoal flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  Kode Script Embed (Paste sebelum &lt;/body&gt;)
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(embedCode)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-poko-charcoal"
                >
                  <Copy className="w-3 h-3" />
                  Salin Kode
                </button>
              </div>

              <pre className="p-4 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
                {embedCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Widget Floating Preview */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-poko-linen border border-stone-300/60 shadow-subtle space-y-4">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Pratinjau Widget di Layar Pengunjung
            </span>

            {/* Simulated Widget Box */}
            <div className="rounded-2xl bg-white p-4 border border-stone-200/80 shadow-card space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-xs text-poko-charcoal">{widgetTitle}</h4>
                  <span className="text-[10px] text-emerald-600 font-medium">Online • Balas cepat</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 text-xs text-stone-700 leading-relaxed">
                {welcomeText}
              </div>

              <button className="w-full py-2 px-3 rounded-xl bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-xs">
                <Smartphone className="w-3.5 h-3.5" />
                Mulai Chat via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
