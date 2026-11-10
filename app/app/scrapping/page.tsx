"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  Search,
  Users,
  Download,
  Filter,
  Play,
  MapPin,
  CheckCircle2,
  Database,
} from "lucide-react";

export default function ScraperPage() {
  const [scrapeType, setScrapeType] = useState<"group" | "gmaps">("group");
  const [selectedGroup, setSelectedGroup] = useState("120363045678901234@g.us");
  const [gmapsKeyword, setGmapsKeyword] = useState("Distributor Fashion Tanah Abang");
  const [isScraping, setIsScraping] = useState(false);

  const mockScrapedLeads = [
    {
      name: "Toko Grosir Berkah Jaya",
      phone: "+62 812-4455-6677",
      source: "Grup: Komunitas Reseller Jabodetabek",
      status: "Valid WA",
    },
    {
      name: "Sentra Konveksi Bandung",
      phone: "+62 857-8899-0011",
      source: "Grup: Komunitas Reseller Jabodetabek",
      status: "Valid WA",
    },
    {
      name: "Owner Butik Sabrina",
      phone: "+62 813-2233-4455",
      source: "Grup: Komunitas Reseller Jabodetabek",
      status: "Valid WA",
    },
    {
      name: "Mitra Logistik Cepat",
      phone: "+62 819-7788-9900",
      source: "Grup: Komunitas Reseller Jabodetabek",
      status: "Valid WA",
    },
  ];

  return (
    <PokoAppShell
      title="WhatsApp Lead Scraper"
      subtitle="Ekstrak kontak prospek tertarget dari Grup WhatsApp yang tergabung atau data Google Maps bisnis lokal"
    >
      <div className="space-y-6">
        {/* Scrape source selector tabs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScrapeType("group")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              scrapeType === "group"
                ? "bg-poko-charcoal text-white shadow-sm"
                : "bg-white border border-poko-border text-stone-600 hover:bg-stone-50"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Scrape Member Grup WhatsApp</span>
          </button>

          <button
            onClick={() => setScrapeType("gmaps")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
              scrapeType === "gmaps"
                ? "bg-poko-charcoal text-white shadow-sm"
                : "bg-white border border-poko-border text-stone-600 hover:bg-stone-50"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Scrape Bisnis Google Maps</span>
          </button>
        </div>

        {/* Input form */}
        <div className="p-6 rounded-3xl bg-white border border-poko-border shadow-subtle space-y-4">
          {scrapeType === "group" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pilih Grup WhatsApp (Dari Akun Terhubung)
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                >
                  <option value="120363045678901234@g.us">
                    Komunitas Reseller Fashion Jabodetabek (256 Member)
                  </option>
                  <option value="120363098765432109@g.us">
                    Asosiasi UMKM Digital Kuliner (180 Member)
                  </option>
                  <option value="120363011223344556@g.us">
                    Grup Diskusi Developer & Tech Startups (512 Member)
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Mulai Ekstrak Semua Member
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Kata Kunci Pencarian & Kota
                </label>
                <input
                  type="text"
                  value={gmapsKeyword}
                  onChange={(e) => setGmapsKeyword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Cari Leads Google Maps
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results table */}
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-poko-border flex items-center justify-between">
            <span className="text-xs font-bold text-poko-charcoal">
              Hasil Scrape Terkini ({mockScrapedLeads.length} Kontak Ditemukan)
            </span>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50">
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-poko-linen text-poko-charcoal text-xs font-semibold border border-stone-300/60 hover:bg-stone-200">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Simpan ke Database Kontak
              </button>
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-5">Nama Profil</th>
                <th className="py-3 px-4">Nomor WhatsApp</th>
                <th className="py-3 px-4">Sumber Ekstraksi</th>
                <th className="py-3 px-4">Status WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {mockScrapedLeads.map((item, idx) => (
                <tr key={idx} className="hover:bg-stone-50/50">
                  <td className="py-3 px-5 font-semibold text-poko-charcoal">{item.name}</td>
                  <td className="py-3 px-4 font-mono font-medium">{item.phone}</td>
                  <td className="py-3 px-4 text-stone-500">{item.source}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" />
                      {item.status}
                    </span>
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
