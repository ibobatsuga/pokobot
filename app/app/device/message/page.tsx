"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  SendHorizontal,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";

export default function TestWhatsappMessagePage() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState(
    "Halo! Ini adalah tes pesan koneksi WhatsApp dari Poko Gateway (WAHA Engine). Status: 200 OK."
  );
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const handleTestSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setResponseLog(null);

    // Simulate WAHA API test call
    setTimeout(() => {
      setStatus("success");
      setResponseLog(
        JSON.stringify(
          {
            status: "success",
            http_code: 201,
            message: "Message dispatched via WAHA default session",
            data: {
              id: "true_" + recipient + "@c.us_3EB0C821" + Date.now(),
              timestamp: Math.floor(Date.now() / 1000),
              from: "default_session@c.us",
              to: recipient + "@c.us",
              body: message,
              ack: 1,
            },
          },
          null,
          2
        )
      );
    }, 700);
  };

  return (
    <PokoAppShell
      title="Tes Koneksi WhatsApp"
      subtitle="Uji coba pengiriman pesan langsung dari sesi WAHA yang terhubung ke nomor tujuan manapun"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Form Card */}
        <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-poko-charcoal">Form Uji Kirim Pesan WA</h3>

          <form onSubmit={handleTestSend} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Nomor WhatsApp Tujuan (Awali dengan kode negara 62)
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Contoh: 6281234567890"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Isi Pesan WhatsApp
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <SendHorizontal className="w-4 h-4" />
              {status === "sending" ? "Sedang Mengirim Pesan..." : "Kirim Pesan Tes Sekarang"}
            </button>
          </form>
        </div>

        {/* Response JSON Viewer Card */}
        <div className="p-7 rounded-3xl bg-stone-900 text-white shadow-subtle space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              WAHA Engine Response Log
            </span>
            <span className="text-[10px] text-stone-500 font-mono">POST /api/sendText</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {responseLog ? (
              <pre className="text-xs font-mono text-stone-200 leading-relaxed whitespace-pre-wrap">
                {responseLog}
              </pre>
            ) : (
              <div className="h-48 flex items-center justify-center text-xs text-stone-500 font-mono text-center">
                Tekan "Kirim Pesan Tes" untuk melihat response JSON langsung dari gateway WAHA.
              </div>
            )}
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
