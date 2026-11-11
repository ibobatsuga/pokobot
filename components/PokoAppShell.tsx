"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sidebar } from "./Sidebar";
import { Search, ExternalLink, Menu } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen lg:h-screen w-full lg:overflow-hidden bg-poko-canvas overflow-x-hidden">
      {/* 1. UNIFIED FULL SIDEBAR (Desktop-first fixed sidebar + mobile drawer) */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* 2. MAIN CONTENT BODY */}
      <div className="flex-1 flex flex-col lg:overflow-hidden min-w-0">
        {/* Global Topbar Header */}
        <header className="min-h-16 py-2.5 lg:py-0 lg:h-16 border-b border-poko-border bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 shrink-0 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="lg:hidden p-2 -ml-1 rounded-xl border border-poko-border bg-white text-stone-700 hover:bg-stone-50 shrink-0"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-bold text-poko-charcoal tracking-tight flex items-center gap-2 truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 line-clamp-1">{subtitle}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search */}
            <div className="relative hidden xl:block">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kontak, pesan, kampanye..."
                className="pl-8 pr-4 h-9 w-60 rounded-xl text-xs bg-stone-100 border-none focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
              />
            </div>

            {/* Custom Page Action Button (if provided) */}
            {actionButton && (
              <div className="flex items-center gap-2 [&_button]:h-9 [&_a]:h-9 [&_select]:h-9">
                {actionButton}
              </div>
            )}

            {/* Quick Link to Standalone CRM Chat App */}
            <Link
              href="/app/omnichannel-crm"
              className="h-9 flex items-center gap-2 px-3 sm:px-3.5 rounded-xl text-xs font-semibold bg-poko-charcoal text-white hover:bg-black transition-all shadow-xs shrink-0"
            >
              <span className="hidden sm:inline">CRM Chat App</span>
              <span className="sm:hidden">CRM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
