"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bot,
  User,
  Send,
} from "lucide-react";

export default function LogReportsPage() {
  const [logs, setLogs] = useState([
    {
      id: "log-101",
      time: "10 Nov 2026, 13:15:22",
      type: "PokoBot AI",
      recipient: "+62 812-2630-0090",
      content: "Halo Pak Hendro! Selamat datang di Poko. Kami menyediakan solusi CRM...",
      status: "READ",
      latency: "1.2s",
    },
    {
      id: "log-102",
      time: "10 Nov 2026, 12:45:10",
      type: "Human CS (Ibob)",
      recipient: "+62 818-0273-1947",
      content: "Apakah sistem ini bisa multi-device dengan Docker? Tentu bisa...",
      status: "DELIVERED",
      latency: "0.4s",
    },
    {
      id: "log-103",
      time: "10 Nov 2026, 11:15:03",
      type: "Broadcast Campaign",
      recipient: "+62 896-3737-0000",
      content: "Halo Ibob! Diskon 25% untuk langganan tahunan Poko Omnichannel CRM...",
      status: "READ",
      latency: "0.8s",
    },
    {
      id: "log-104",
      time: "10 Nov 2026, 10:02:18",
      type: "Webhook Event",
      recipient: "+62 856-1234-5678",
      content: "Notifikasi Pembayaran #INV-8891 Sukses Diterima",
      status: "SENT",
      latency: "0.3s",
    },
  ]);

  return (
    <PokoAppShell
      title="Log Reports & Riwayat Transmisi"
      subtitle="Audit trail lengkap seluruh pengiriman pesan WhatsApp, status centang, dan latensi respons server"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-5">Waktu Eksekusi</th>
                <th className="py-3 px-4">Tipe Pengirim</th>
                <th className="py-3 px-4">Nomor WhatsApp Tujuan</th>
                <th className="py-3 px-4">Cuplikan Pesan</th>
                <th className="py-3 px-4">Status Pengiriman</th>
                <th className="py-3 px-4">Latensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-5 font-mono text-stone-500 text-[11px]">{log.time}</td>
                  <td className="py-3.5 px-4 font-semibold text-poko-charcoal">{log.type}</td>
                  <td className="py-3.5 px-4 font-mono font-medium">{log.recipient}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-stone-600">{log.content}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "READ"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : log.status === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {log.status === "READ" && "✓✓ Dibaca (Blue)"}
                      {log.status === "DELIVERED" && "✓✓ Terkirim"}
                      {log.status === "SENT" && "✓ Terkirim ke Server"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-emerald-600 font-semibold">
                    {log.latency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PokoAppShell>
  );
}
