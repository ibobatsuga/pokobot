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

interface LogItem {
  id: string;
  time: string;
  type: string;
  recipient: string;
  content: string;
  status: string;
  latency: string;
}

export default function LogReportsPage() {
  const [logs] = useState<LogItem[]>([]);

  return (
    <PokoAppShell
      title="Log Reports & Riwayat Transmisi"
      subtitle="Audit trail lengkap seluruh pengiriman pesan WhatsApp, status centang, dan latensi respons server"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          {logs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-poko-charcoal">Belum Ada Log Transmisi</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Seluruh riwayat pesan masuk, balasan AI otomatis, maupun pesan CS akan dicatat real-time di sini.
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </PokoAppShell>
  );
}
