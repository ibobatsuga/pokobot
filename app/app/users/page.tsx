"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  UserCheck,
  Plus,
  Shield,
  MessageSquare,
  Clock,
  MoreVertical,
} from "lucide-react";

export default function HumanAgentPage() {
  const [agents, setAgents] = useState([
    {
      id: "u1",
      name: "Super Admin",
      email: "admin@pokobot.id",
      role: "Super Admin",
      status: "Online",
      activeChats: 3,
      maxChats: "Unlimited",
      assignedTags: ["VIP", "Enterprise", "Procurement"],
    },
    {
      id: "u2",
      name: "Sarah Amanda",
      email: "sarah.cs@fluxy.id",
      role: "Senior CS Agent",
      status: "Online",
      activeChats: 7,
      maxChats: "10 Chat",
      assignedTags: ["Inquiry Umum", "Onboarding"],
    },
    {
      id: "u3",
      name: "Rizky Ramadhan",
      email: "rizky.tech@fluxy.id",
      role: "Technical Support",
      status: "Offline",
      activeChats: 0,
      maxChats: "5 Chat",
      assignedTags: ["API Integration", "Docker Bug"],
    },
  ]);

  return (
    <PokoAppShell
      title="Human Agent & Manajemen CS"
      subtitle="Kelola tim Customer Service, pembagian kuota antrean chat, dan hak akses per agent"
      actionButton={
        <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Undang Agent Baru</span>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/70 border-b border-poko-border text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="py-3 px-5">Nama Agent</th>
                <th className="py-3 px-4">Role & Hak Akses</th>
                <th className="py-3 px-4">Status Kerja</th>
                <th className="py-3 px-4">Chat Sedang Aktif</th>
                <th className="py-3 px-4">Kapasitas Maksimal</th>
                <th className="py-3 px-4">Keahlian Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-stone-50/50">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-poko-charcoal">{agent.name}</div>
                    <div className="text-[11px] text-stone-400">{agent.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-800">{agent.role}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                        agent.status === "Online"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          agent.status === "Online" ? "bg-emerald-500 animate-pulse" : "bg-stone-400"
                        }`}
                      ></span>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-poko-charcoal">{agent.activeChats} Chat</td>
                  <td className="py-3.5 px-4 font-mono text-stone-500">{agent.maxChats}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      {agent.assignedTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
