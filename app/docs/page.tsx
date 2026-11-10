"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  BookOpen,
  Code2,
  Copy,
  Terminal,
  CheckCircle2,
  Server,
  Zap,
  Bot,
  ExternalLink,
  Check,
} from "lucide-react";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<"mcp" | "curl" | "node" | "php">("mcp");
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const mcpClaudeConfig = `{
  "mcpServers": {
    "pokobot": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch",
        "https://ping-clone-poc.vercel.app/api/mcp"
      ],
      "env": {
        "POKOBOT_API_KEY": "pk_live_fluxy_pokobot_enterprise"
      }
    }
  }
}`;

  const mcpCursorConfig = `{
  "mcpServers": {
    "pokobot": {
      "url": "https://ping-clone-poc.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer pk_live_fluxy_pokobot_enterprise"
      }
    }
  }
}`;

  const curlExample = `curl -X POST "https://ping-clone-poc.vercel.app/api/sendText" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer pk_live_fluxy_pokobot_enterprise" \\
  -d '{
    "chatId": "6281234567890@c.us",
    "text": "Halo! Pesanan Anda telah kami proses.",
    "session": "default"
  }'`;

  const nodeExample = `const response = await fetch("https://ping-clone-poc.vercel.app/api/sendText", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer pk_live_fluxy_pokobot_enterprise"
  },
  body: JSON.stringify({
    chatId: "6281234567890@c.us",
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
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Authorization: Bearer pk_live_fluxy_pokobot_enterprise'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'chatId' => '6281234567890@c.us',
  'text' => 'Halo! Pesanan Anda telah kami proses.',
  'session' => 'default'
]));
$response = curl_exec($ch);
curl_close($ch);
echo $response;`;

  return (
    <PokoAppShell
      title="Dokumentasi REST API & Model Context Protocol (MCP)"
      subtitle="Panduan integrasi PokoBot untuk Claude Desktop, Cursor, Antigravity, Custom GPTs, dan REST API"
    >
      <div className="max-w-4xl space-y-8 pb-12">
        {/* Banner MCP Protocol */}
        <div className="p-7 rounded-3xl bg-poko-linen border border-stone-200/80 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 mb-2">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Model Context Protocol (MCP) Siap Pakai
            </div>
            <h3 className="text-base font-bold text-poko-charcoal">
              Hubungkan Coding Agent Langsung ke WhatsApp & CRM PokoBot
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
              PokoBot menyediakan server MCP native standar JSON-RPC 2.0. Coding assistant seperti Claude Desktop, Cursor IDE, dan Antigravity dapat memanggil fungsi pengiriman pesan, pencarian database kontak, dan perubahan pipeline deal secara langsung.
            </p>
          </div>

          <a
            href="/app/settings"
            className="h-9 px-4 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all flex items-center gap-2 shrink-0 shadow-xs"
          >
            <span>Dapatkan API Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* MCP Setup Guide */}
        <div className="p-7 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
            <Server className="w-5 h-5 text-purple-600" />
            <div>
              <h4 className="font-bold text-sm text-poko-charcoal">
                1. Cara Pasang di Claude Desktop, Cursor, & Antigravity
              </h4>
              <p className="text-xs text-stone-500">
                Salin konfigurasi JSON berikut ke file config client AI Anda
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Claude Desktop */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-poko-charcoal">Claude Desktop</span>
                <button
                  onClick={() => copyToClipboard(mcpClaudeConfig, "claude")}
                  className="text-xs text-stone-500 hover:text-black flex items-center gap-1"
                >
                  {copied === "claude" ? (
                    <span className="text-emerald-600 font-semibold">Tersalin!</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                ~/Library/Application Support/Claude/claude_desktop_config.json
              </p>
              <pre className="text-[11px] font-mono bg-stone-900 text-stone-200 p-3 rounded-xl overflow-x-auto">
                {mcpClaudeConfig}
              </pre>
            </div>

            {/* Cursor & Antigravity */}
            <div className="rounded-2xl border border-stone-200/80 bg-stone-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-poko-charcoal">Cursor & Antigravity</span>
                <button
                  onClick={() => copyToClipboard(mcpCursorConfig, "cursor")}
                  className="text-xs text-stone-500 hover:text-black flex items-center gap-1"
                >
                  {copied === "cursor" ? (
                    <span className="text-emerald-600 font-semibold">Tersalin!</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                .cursor/mcp.json atau Antigravity MCP Settings
              </p>
              <pre className="text-[11px] font-mono bg-stone-900 text-stone-200 p-3 rounded-xl overflow-x-auto">
                {mcpCursorConfig}
              </pre>
            </div>
          </div>
        </div>

        {/* REST API Endpoints */}
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
            Kirimkan pesan WhatsApp instan menggunakan token otentikasi Bearer API Key melalui WAHA instance terhubung.
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
                  copyToClipboard(text, activeTab);
                }}
                className="text-[11px] text-stone-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copied === activeTab ? (
                  <span className="text-emerald-400 font-bold">Tersalin!</span>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 font-mono text-stone-200 overflow-x-auto">
              <pre>
                {activeTab === "curl"
                  ? curlExample
                  : activeTab === "node"
                  ? nodeExample
                  : phpExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </PokoAppShell>
  );
}
