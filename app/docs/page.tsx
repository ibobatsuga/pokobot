"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  BookOpen,
  Code2,
  Copy,
  Terminal,
  CheckCircle2,
} from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"curl" | "node" | "php">("curl");

  const curlExample = `curl -X POST "https://ping-clone-poc.vercel.app/api/sendText" \\
  -H "Content-Type: application/json" \\
  -d '{
    "chatId": "6289637370000@c.us",
    "text": "Halo! Pesanan Anda telah kami proses.",
    "session": "default"
  }'`;

  const nodeExample = `const response = await fetch("https://ping-clone-poc.vercel.app/api/sendText", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chatId: "6289637370000@c.us",
    text: "Halo! Pesanan Anda telah kami proses.",
    session: "default"
  })
});
const data = await response.json();
console.log(data);`;

  const phpExample = `<?php
$ch = curl_init("https://ping-clone-poc.vercel.app/api/sendText");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'chatId' => '6289637370000@c.us',
  'text' => 'Halo! Pesanan Anda telah kami proses.',
  'session' => 'default'
]));
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;

  return (
    <PokoAppShell
      title="Dokumentasi REST API"
      subtitle="Panduan integrasi API pengiriman pesan WhatsApp untuk developer, toko online, dan sistem ERP"
    >
      <div className="max-w-4xl space-y-8">
        {/* Endpoint 1 */}
        <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-100 text-emerald-800">
              POST
            </span>
            <span className="font-mono text-xs font-bold text-poko-charcoal">
              /api/sendText
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Mengirimkan pesan teks biasa secara instan ke nomor WhatsApp personal maupun grup melalui instance WAHA terhubung.
          </p>

          {/* Code Tabs */}
          <div className="rounded-2xl bg-stone-900 overflow-hidden text-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-2">
                {(["curl", "node", "php"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      activeTab === tab
                        ? "bg-white/10 text-white font-bold"
                        : "text-stone-400 hover:text-white"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  const text =
                    activeTab === "curl"
                      ? curlExample
                      : activeTab === "node"
                      ? nodeExample
                      : phpExample;
                  navigator.clipboard.writeText(text);
                }}
                className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <Copy className="w-3 h-3" />
                Salin
              </button>
            </div>

            <pre className="p-4 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed">
              {activeTab === "curl" && curlExample}
              {activeTab === "node" && nodeExample}
              {activeTab === "php" && phpExample}
            </pre>
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
