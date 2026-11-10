"use client";

import React from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Search, ExternalLink, Bell, Smartphone, ShieldCheck } from "lucide-react";

interface PokoAppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function PokoAppShell({
  children,
  title,
  subtitle,
  actionButton,
}: PokoAppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-poko-canvas">
      {/* 1. UNIFIED FULL SIDEBAR (All Ping Menus) */}
      <Sidebar />

      {/* 2. MAIN CONTENT BODY */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Global Topbar Header */}
        <header className="h-16 border-b border-poko-border bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold text-poko-charcoal tracking-tight flex items-center gap-2">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kontak, pesan, kampanye..."
                className="pl-8 pr-4 py-1.5 w-60 rounded-xl text-xs bg-stone-100 border-none focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            {/* Custom Page Action Button (if provided) */}
            {actionButton}

            {/* Quick Link to Standalone CRM Chat App */}
            <Link
              href="/app/omnichannel-crm"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all shadow-xs shrink-0"
            >
              <span>CRM Chat App 👑</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
