"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Webhook,
  Plus,
  Play,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function WebhookRulesPage() {
  const [rules, setRules] = useState([
    {
      id: "wh-1",
      name: "Poko AI Auto-Responder (Sakelar Luna)",
      event: "message.any (Inbound Private)",
      targetUrl: "https://api.sakelar.web.id/v1/chat/completions",
      method: "POST",
      status: "Aktif",
      retries: 3,
    },
    {
      id: "wh-2",
      name: "Sinkronisasi Status Centang Biru (Message Ack)",
      event: "message.ack (Delivered / Read)",
      targetUrl: "https://ping-clone-poc.vercel.app/api/webhook",
      method: "POST",
      status: "Aktif",
      retries: 2,
    },
    {
      id: "wh-3",
      name: "Telegram Alert Saat WhatsApp Disconnect",
      event: "session.status (STOPPED / FAILED)",
      targetUrl: "https://api.telegram.org/bot<token>/sendMessage",
      method: "POST",
      status: "Aktif",
      retries: 5,
    },
  ]);

  return (
    <PokoAppShell
      title="Webhook Rules & Integrasi Event"
      subtitle="Atur aturan pengiriman event WhatsApp WAHA ke server eksternal, bot AI, atau sistem ERP Anda"
      actionButton={
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Webhook Rule</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle divide-y divide-stone-100 overflow-hidden">
          {rules.map((rule) => (
            <div key={rule.id} className="p-6 flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-poko-charcoal">{rule.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {rule.status}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-medium">Event: {rule.event}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] font-bold">
                    {rule.method}
                  </span>
                  <span className="text-xs font-mono text-stone-600 truncate bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
                    {rule.targetUrl}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  Test Webhook
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
