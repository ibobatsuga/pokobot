"use client";

import React, { useState, useEffect } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import { getSavedWahaConfig, saveWahaConfig, isLocalhostUrl } from "@/lib/wahaClient";
import {
  Sliders,
  Cpu,
  Key,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
  Copy,
  Terminal,
  Code2,
  ExternalLink,
  Plus,
  Trash2,
  Check,
  Server,
  Zap,
  Bot,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"api-keys" | "mcp" | "ai-engine" | "waha">("mcp");

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    {
      id: "key-1",
      name: "Claude Desktop & Cursor IDE Key",
      prefix: "pk_live_fluxy_pokobot_enterprise",
      created: "Hari ini",
      scopes: ["messages:send", "messages:read", "crm:deals", "mcp:full"],
      status: "Active",
    },
    {
      id: "key-2",
      name: "Antigravity Assistant Agent",
      prefix: "pk_live_fluxy_antigravity_agent_99",
      created: "08 Nov 2026",
      scopes: ["mcp:full", "knowledge:query"],
      status: "Active",
    },
  ]);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [selectedClient, setSelectedClient] = useState<"claude" | "cursor" | "antigravity" | "gpt">("claude");

  // AI Config
  const [aiKey, setAiKey] = useState("");
  const [aiBaseUrl, setAiBaseUrl] = useState("https://api.openai.com/v1");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [wahaBaseUrl, setWahaBaseUrl] = useState("");
  const [wahaApiKey, setWahaApiKey] = useState("");
  const [wahaError, setWahaError] = useState<string | null>(null);
  const [whitelistInput, setWhitelistInput] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedWaha = getSavedWahaConfig();
    if (savedWaha.url) setWahaBaseUrl(savedWaha.url);
    if (savedWaha.apiKey) setWahaApiKey(savedWaha.apiKey);
  }, []);

  // MCP Ping Test State
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestMCP = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "tools/list",
        }),
      });
      const data = await res.json();
      if (data?.result?.tools) {
        setTestResult(`Sukses! MCP Server aktif dengan ${data.result.tools.length} tool PokoBot terdaftar.`);
      } else {
        setTestResult("Respons diterima tetapi format berbeda.");
      }
    } catch (e: any) {
      setTestResult("Gagal terhubung ke endpoint MCP.");
    } finally {
      setTesting(false);
    }
  };

  const claudeDesktopConfig = `{
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

  const cursorConfig = `{
  "mcpServers": {
    "pokobot": {
      "url": "https://ping-clone-poc.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer pk_live_fluxy_pokobot_enterprise"
      }
    }
  }
}`;

  const antigravityConfig = `{
  "mcpServers": {
    "pokobot": {
      "url": "https://ping-clone-poc.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer pk_live_fluxy_pokobot_enterprise"
      }
    }
  }
}`;

  const gptCustomAction = `URL OpenAPI Schema:
https://ping-clone-poc.vercel.app/api/openapi

Authentication:
Type: API Key
Header: Authorization (Bearer pk_live_fluxy_pokobot_enterprise)`;

  return (
    <PokoAppShell
      title="Pengaturan & Integrasi AI / MCP"
      subtitle="Kelola API Key, protokol MCP untuk Claude, Cursor, Antigravity, dan konfigurasi AI Engine"
    >
      <div className="max-w-4xl space-y-6 pb-12">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-poko-border pb-3">
          <button
            onClick={() => setActiveTab("mcp")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "mcp"
                ? "bg-poko-charcoal text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-poko-border"
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>Model Context Protocol (MCP)</span>
          </button>

          <button
            onClick={() => setActiveTab("api-keys")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "api-keys"
                ? "bg-poko-charcoal text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-poko-border"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span>API Keys & Akses</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-engine")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "ai-engine"
                ? "bg-poko-charcoal text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-poko-border"
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-500" />
            <span>AI Engine Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab("waha")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "waha"
                ? "bg-poko-charcoal text-white shadow-xs"
                : "bg-white text-stone-600 hover:bg-stone-100 border border-poko-border"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>WAHA & Whitelist</span>
          </button>
        </div>

        {/* TAB 1: MODEL CONTEXT PROTOCOL (MCP) */}
        {activeTab === "mcp" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-poko-linen border border-stone-200/80 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-stone-200 text-xs font-semibold text-stone-700 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Model Context Protocol Aktif
                </div>
                <h3 className="text-lg font-bold text-poko-charcoal">
                  Koneksikan PokoBot ke Claude, GPT, Cursor & Antigravity
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-xl leading-relaxed">
                  Dengan standar MCP, coding agent dan LLM favorit Anda dapat secara langsung membaca pesan WhatsApp, memicu broadcast, mengelola kontak CRM, dan mencari knowledge base PokoBot.
                </p>
              </div>

              <button
                onClick={handleTestMCP}
                disabled={testing}
                className="h-9 px-4 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all flex items-center gap-2 shrink-0 shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{testing ? "Menghubungkan..." : "Test Endpoint MCP"}</span>
              </button>
            </div>

            {testResult && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}

            {/* Client Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "claude", name: "Claude Desktop", sub: "Anthropic MCP" },
                { id: "cursor", name: "Cursor IDE", sub: ".cursor/mcp.json" },
                { id: "antigravity", name: "Antigravity", sub: "DeepMind / AGY" },
                { id: "gpt", name: "Custom GPTs", sub: "OpenAPI Actions" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedClient(c.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedClient === c.id
                      ? "bg-poko-charcoal text-white border-poko-charcoal shadow-card"
                      : "bg-white text-stone-700 border-poko-border hover:border-stone-400"
                  }`}
                >
                  <p className="font-bold text-xs">{c.name}</p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      selectedClient === c.id ? "text-stone-300" : "text-stone-400"
                    }`}
                  >
                    {c.sub}
                  </p>
                </button>
              ))}
            </div>

            {/* Config Snippet Card */}
            <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-stone-600" />
                  <h4 className="font-bold text-xs text-poko-charcoal">
                    Konfigurasi untuk {selectedClient.toUpperCase()}
                  </h4>
                </div>

                <button
                  onClick={() => {
                    const text =
                      selectedClient === "claude"
                        ? claudeDesktopConfig
                        : selectedClient === "cursor"
                        ? cursorConfig
                        : selectedClient === "antigravity"
                        ? antigravityConfig
                        : gptCustomAction;
                    navigator.clipboard.writeText(text);
                    setCopiedConfig(true);
                    setTimeout(() => setCopiedConfig(false), 2000);
                  }}
                  className="h-8 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors flex items-center gap-1.5"
                >
                  {copiedConfig ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Konfigurasi</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-stone-900 p-4 font-mono text-xs text-stone-200 overflow-x-auto">
                <pre>
                  {selectedClient === "claude"
                    ? claudeDesktopConfig
                    : selectedClient === "cursor"
                    ? cursorConfig
                    : selectedClient === "antigravity"
                    ? antigravityConfig
                    : gptCustomAction}
                </pre>
              </div>

              <p className="text-[11px] text-stone-500">
                Endpoint resmi MCP Server:{" "}
                <code className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-mono">
                  https://ping-clone-poc.vercel.app/api/mcp
                </code>
              </p>
            </div>

            {/* Exposed MCP Tools List */}
            <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="pb-3 border-b border-stone-100">
                <h4 className="font-bold text-xs text-poko-charcoal">
                  Daftar Tool PokoBot yang Tersedia via MCP
                </h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Semua tool ini otomatis dikenali dan dapat dipanggil oleh Claude, GPT, Cursor, dan Antigravity
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "pokobot_send_whatsapp_message",
                    desc: "Kirim pesan teks atau media via WhatsApp ke nomor tujuan melalui instance WAHA.",
                    params: "phone, message, session",
                  },
                  {
                    name: "pokobot_get_chats",
                    desc: "Mengambil daftar obrolan aktif, unread messages, dan ringkasan chat WhatsApp.",
                    params: "limit, unreadOnly",
                  },
                  {
                    name: "pokobot_search_contacts",
                    desc: "Cari data pelanggan, tag label (VIP/Leads), dan riwayat kota pengiriman.",
                    params: "query",
                  },
                  {
                    name: "pokobot_update_crm_deal",
                    desc: "Pindahkan stage deal pelanggan (New Inquiries -> AI Qualifying -> Sales Follow-up -> Closed Won).",
                    params: "phone, stage, dealValue, notes",
                  },
                  {
                    name: "pokobot_trigger_broadcast",
                    desc: "Menjadwalkan blast WhatsApp massal ke label tertentu dengan proteksi anti-banned.",
                    params: "campaignName, targetTag, messageTemplate",
                  },
                  {
                    name: "pokobot_query_knowledge_base",
                    desc: "Cari jawaban akurat dari knowledge base SOP dan katalog produk FineTunnel PokoBot.",
                    params: "question",
                  },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <span className="font-mono font-bold text-xs text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                        {tool.name}
                      </span>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{tool.desc}</p>
                    </div>
                    <div className="shrink-0 text-[10px] font-mono text-stone-400 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                      Params: {tool.params}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API KEYS */}
        {activeTab === "api-keys" && (
          <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-sm text-poko-charcoal">Kunci API PokoBot (Secret API Keys)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Digunakan untuk otentikasi koneksi eksternal dari script Node.js, Python, cURL, dan MCP
                </p>
              </div>

              <button
                onClick={() => {
                  const newKey = {
                    id: `key-${Date.now()}`,
                    name: "New Integration Key",
                    prefix: `pk_live_fluxy_${Math.random().toString(36).substring(2, 10)}`,
                    created: "Baru saja",
                    scopes: ["messages:send", "mcp:full"],
                    status: "Active",
                  };
                  setApiKeys([newKey, ...apiKeys]);
                }}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Kunci Baru</span>
              </button>
            </div>

            <div className="space-y-3">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-poko-charcoal">{key.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {key.status}
                      </span>
                    </div>

                    <p className="font-mono text-xs text-stone-500 bg-white px-2 py-1 rounded-lg border border-stone-200 inline-block">
                      {key.prefix}••••••••••••
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-1">
                      <span>Dibuat: {key.created}</span>
                      <span>•</span>
                      <span>Scopes: {key.scopes.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(key.prefix, key.id)}
                      className="h-8 px-3 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedKey === key.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Disalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Token</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setApiKeys(apiKeys.filter((k) => k.id !== key.id))}
                      className="h-8 w-8 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AI ENGINE GATEWAY */}
        {activeTab === "ai-engine" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <Cpu className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-sm text-poko-charcoal">PokoBot AI Engine Gateway</h3>
                  <p className="text-xs text-stone-500">Pilih provider model dan kunci API untuk bot auto-reply</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Provider & Model Utama
                  </label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  >
                    <option value="gpt-4o">OpenAI - GPT-4o (Direkomendasikan - Tercepat & Cerdas)</option>
                    <option value="claude-3-5-sonnet">Anthropic - Claude 3.5 Sonnet</option>
                    <option value="gemini-1.5-pro">Google - Gemini 1.5 Pro</option>
                    <option value="deepseek-chat">DeepSeek Chat</option>
                    <option value="custom">Custom OpenAI-Compatible API (Ollama / vLLM)</option>
                  </select>
                </div>

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
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {saved ? "Pengaturan berhasil disimpan!" : "Perubahan berlaku langsung untuk auto-reply."}
                </span>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 4: WAHA & WHITELIST */}
        {activeTab === "waha" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setWahaError(null);
              if (wahaBaseUrl.trim() && isLocalhostUrl(wahaBaseUrl)) {
                setWahaError("Backend WAHA tidak boleh menggunakan localhost. Masukkan URL Server WAHA Cloud/VPS (https://...).");
                return;
              }
              saveWahaConfig({ url: wahaBaseUrl, apiKey: wahaApiKey });
              setSaved(true);
              setTimeout(() => setSaved(false), 2500);
            }}
            className="space-y-6"
          >
            <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-sm text-poko-charcoal">WAHA Cloud Gateway & Keamanan Whitelist</h3>
                  <p className="text-xs text-stone-500">
                    Hubungkan ke server WAHA Cloud / VPS Anda (tanpa ketergantungan localhost) dan atur proteksi nomor
                  </p>
                </div>
              </div>

              {wahaError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {wahaError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Cloud / VPS WAHA Base URL
                  </label>
                  <input
                    type="url"
                    value={wahaBaseUrl}
                    onChange={(e) => setWahaBaseUrl(e.target.value)}
                    placeholder="https://waha.domainanda.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Gunakan server WAHA publik (Railway, VPS Ubuntu, Coolify, Fly.io). Jangan gunakan localhost pada mode produksi.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    WAHA Server API Key (X-Api-Key)
                  </label>
                  <input
                    type="password"
                    value={wahaApiKey}
                    onChange={(e) => setWahaApiKey(e.target.value)}
                    placeholder="Opsional — sesuai WAHA_API_KEY di server cloud Anda"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Whitelist Nomor Pengujian (Pisahkan dengan koma)
                  </label>
                  <textarea
                    rows={3}
                    value={whitelistInput}
                    onChange={(e) => setWhitelistInput(e.target.value)}
                    placeholder="Contoh: 6281234567890, 6289876543210 (Biarkan kosong agar PokoBot dapat melayani semua chat baru masuk)"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Proteksi loop aktif. Tersinkronisasi dengan Device Manager QR.</span>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </PokoAppShell>
  );
}
