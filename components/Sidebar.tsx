"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WahaQrConnector } from "@/components/WahaQrConnector";
import { getSavedConnectedDevice } from "@/lib/wahaClient";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  CheckSquare,
  Send,
  RefreshCw,
  Users,
  Search,
  Sparkles,
  Smartphone,
  Webhook,
  ShieldAlert,
  UserCheck,
  FolderOpen,
  MessageCircle,
  FileText,
  BarChart3,
  Zap,
  Sliders,
  CreditCard,
  SendHorizontal,
  Video,
  BookOpen,
  Share2,
  Phone,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Plus,
  Brain,
  Key,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  isExternal?: boolean;
}

interface MenuGroup {
  groupTitle: string;
  items: MenuItem[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    groupTitle: "CRM & CHAT",
    items: [
      {
        title: "Dashboard Stats",
        href: "/app",
        icon: LayoutDashboard,
      },
      {
        title: "CRM Chat App",
        href: "/app/omnichannel-crm",
        icon: MessageSquare,
      },
      {
        title: "CRM Pipeline",
        href: "/app/omnichannel-crm/pipeline",
        icon: Kanban,
      },
      {
        title: "To Do List",
        href: "/app/omnichannel-crm/todo-list",
        icon: CheckSquare,
      },
    ],
  },
  {
    groupTitle: "CAMPAIGN & PROSPEK",
    items: [
      {
        title: "Broadcast Whatsapp",
        href: "/app/blash",
        icon: Send,
      },
      {
        title: "Upselling Campaign",
        href: "/app/broadcast-followups",
        icon: RefreshCw,
      },
      {
        title: "Database Kontak",
        href: "/app/stores",
        icon: Users,
      },
      {
        title: "WhatsApp Scraper",
        href: "/app/scrapping",
        icon: Search,
      },
      {
        title: "Request Fitur",
        href: "/app/feature-request",
        icon: Sparkles,
      },
    ],
  },
  {
    groupTitle: "AI AUTOMATION",
    items: [
      {
        title: "Data Training AI",
        href: "/app/auto-reply/finetunnel",
        icon: Brain,
      },
      {
        title: "Webhook Rules",
        href: "/app/webhook/rules",
        icon: Webhook,
      },
      {
        title: "Keyword Guard",
        href: "/app/keyword-guards",
        icon: ShieldAlert,
      },
      {
        title: "Live Chat Widget",
        href: "/app/livechats",
        icon: MessageCircle,
      },
      {
        title: "Media Manager",
        href: "/app/master/media-manager",
        icon: FolderOpen,
      },
    ],
  },
  {
    groupTitle: "MASTER DATA",
    items: [
      {
        title: "Whatsapp Device",
        href: "/app/device",
        icon: Smartphone,
      },
      {
        title: "Human Agent",
        href: "/app/users",
        icon: UserCheck,
      },
      {
        title: "Master Template",
        href: "/app/master/templates",
        icon: FileText,
      },
    ],
  },
  {
    groupTitle: "LAPORAN",
    items: [
      {
        title: "Log Reports",
        href: "/app/reports/logs",
        icon: BarChart3,
      },
    ],
  },
  {
    groupTitle: "PENGATURAN",
    items: [
      {
        title: "Quick Reply",
        href: "/app/quick-replies",
        icon: Zap,
      },
      {
        title: "Setting Aplikasi",
        href: "/app/settings",
        icon: Sliders,
      },
      {
        title: "API Keys & MCP",
        href: "/app/settings",
        icon: Key,
      },
      {
        title: "Top Up Credit",
        href: "/app/billing",
        icon: CreditCard,
      },
    ],
  },
  {
    groupTitle: "MISC & DOKUMENTASI",
    items: [
      {
        title: "Tes Koneksi WhatsApp",
        href: "/app/device/message",
        icon: SendHorizontal,
      },
      {
        title: "Tutorial Video",
        href: "/tutorial",
        icon: Video,
      },
      {
        title: "API Documentation",
        href: "/docs",
        icon: BookOpen,
      },
      {
        title: "Affiliate",
        href: "/app/starter/affiliate/join",
        icon: Share2,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [connectedDevice, setConnectedDevice] = useState<{ phone: string; name: string; session: string } | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    const syncDevice = () => {
      setConnectedDevice(getSavedConnectedDevice());
    };
    syncDevice();
    window.addEventListener("pokobot-waha-updated", syncDevice);
    return () => window.removeEventListener("pokobot-waha-updated", syncDevice);
  }, []);

  return (
    <aside className="w-64 flex flex-col border-r border-poko-border bg-white justify-between select-none shrink-0 h-screen overflow-hidden">
      {/* Top Header Logo */}
      <div className="p-5 border-b border-poko-border shrink-0">
        <Link href="/app" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="PokoBot"
            className="w-9 h-9 rounded-full object-contain shrink-0 shadow-xs border border-stone-200"
          />
          <div>
            <div className="font-bold text-base tracking-tight text-poko-charcoal leading-none">
              PokoBot
            </div>
            <p className="text-[11px] text-stone-400 mt-1">by FLUXY.ID</p>
          </div>
        </Link>
      </div>

      {/* Navigation Groups (Scrollable) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {MENU_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-wider text-stone-400 uppercase mb-2">
              {group.groupTitle}
            </h3>
            {group.items.map((item, iIdx) => {
              const Icon = item.icon;
              // Check active
              const isActive =
                item.href === "/app"
                  ? pathname === "/app" || pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-poko-linen text-poko-charcoal font-semibold shadow-xs border border-stone-300/50"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-poko-charcoal" : "text-stone-400"
                      }`}
                    />
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${
                        item.badgeColor || "bg-stone-100 text-stone-700 border-stone-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile & Connection Status */}
      <div className="p-4 border-t border-poko-border bg-stone-50/50 shrink-0 space-y-3">
        {/* Connected Device Card */}
        {connectedDevice ? (
          <Link
            href="/app/device"
            className="block p-2.5 rounded-2xl bg-white border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3 h-3 text-emerald-600" />
                WhatsApp Terhubung
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-xs font-mono text-stone-900 font-semibold truncate">
              {connectedDevice.phone}
            </div>
            <div className="text-[10px] text-stone-400">WAHA Cloud ({connectedDevice.session})</div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setShowQrModal(true)}
            className="w-full text-left block p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-poko-charcoal/40 transition-colors"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-stone-700 flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3 h-3 text-stone-500" />
                Device WhatsApp
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
            </div>
            <div className="text-xs font-mono text-stone-600 font-semibold truncate">
              Belum Terhubung
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Klik untuk Scan QR Pop-up &rarr;
            </div>
          </button>
        )}

        {/* User profile */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-poko-charcoal text-white flex items-center justify-center font-semibold text-xs">
              PB
            </div>
            <div>
              <p className="text-xs font-semibold text-poko-charcoal leading-none">Admin PokoBot</p>
              <p className="text-[10px] text-stone-400 mt-1">Super Admin • Workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Global QR Connect Pop-up Modal */}
      <WahaQrConnector
        mode="modal"
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        onConnected={() => setShowQrModal(false)}
      />
    </aside>
  );
}
