"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  CreditCard,
  Plus,
  QrCode,
  CheckCircle2,
  Receipt,
  Download,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function BillingPage() {
  const [selectedAmount, setSelectedAmount] = useState("500000");

  const packages = [
    { amount: "100000", label: "Rp 100.000", bonus: "500 Kuota AI" },
    { amount: "250000", label: "Rp 250.000", bonus: "1.500 Kuota AI" },
    { amount: "500000", label: "Rp 500.000", bonus: "3.500 Kuota AI + Bonus 10%", popular: true },
    { amount: "1000000", label: "Rp 1.000.000", bonus: "8.000 Kuota AI + Bonus 20%" },
  ];

  const invoices: {
    id: string;
    date: string;
    desc: string;
    amount: string;
    method: string;
    status: string;
  }[] = [];

  return (
    <PokoAppShell
      title="Top Up Credit & Billing"
      subtitle="Manajemen saldo kredit percakapan AI, kuota broadcast, dan riwayat faktur pembayaran"
    >
      <div className="space-y-8">
        {/* Top Balance Banner */}
        <div className="p-7 rounded-3xl bg-poko-linen border border-stone-300/60 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-1">
              Sisa Saldo & Kuota AI Starter
            </span>
            <h2 className="text-3xl font-bold text-poko-charcoal">10.000 Credits</h2>
            <p className="text-xs text-stone-600 mt-1">
              Saldo Kredit Starter (Rp 0 Top-up) — siap untuk pengujian & pesan awal
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-white text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Paket Starter (Akun Baru)
            </span>
          </div>
        </div>

        {/* Top Up Options Grid */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-poko-charcoal">Pilih Nominal Top Up Saldo</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.amount}
                onClick={() => setSelectedAmount(pkg.amount)}
                className={`p-5 rounded-3xl border cursor-pointer transition-all ${
                  selectedAmount === pkg.amount
                    ? "bg-poko-charcoal text-white border-poko-charcoal shadow-card -translate-y-1"
                    : "bg-white border-poko-border text-stone-700 hover:border-stone-400"
                }`}
              >
                {pkg.popular && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-stone-900 mb-2 inline-block">
                    Paling Populer
                  </span>
                )}
                <h4 className="font-bold text-base">{pkg.label}</h4>
                <p className={`text-xs mt-1 ${selectedAmount === pkg.amount ? "text-stone-300" : "text-stone-500"}`}>
                  {pkg.bonus}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
              <QrCode className="w-4 h-4" />
              Bayar Instan via QRIS / VA Duitku
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-poko-border flex items-center justify-between">
            <span className="text-xs font-bold text-poko-charcoal">Riwayat Transaksi & Faktur</span>
          </div>

          {invoices.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <Receipt className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-bold text-poko-charcoal">Belum Ada Riwayat Transaksi</p>
              <p className="text-[11px] text-stone-500">
                Saldo awal 10.000 Credits Starter Anda telah aktif. Faktur pembelian top up berikutnya akan tersimpan di sini.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3 px-5">No. Invoice</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Deskripsi Pembelian</th>
                  <th className="py-3 px-4">Metode Bayar</th>
                  <th className="py-3 px-4">Nominal</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-5 font-mono font-bold text-poko-charcoal">{inv.id}</td>
                    <td className="py-3.5 px-4 text-stone-500">{inv.date}</td>
                    <td className="py-3.5 px-4 font-medium text-poko-charcoal">{inv.desc}</td>
                    <td className="py-3.5 px-4 text-stone-600">{inv.method}</td>
                    <td className="py-3.5 px-4 font-bold text-poko-charcoal">{inv.amount}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inv.status}
                      </span>
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
