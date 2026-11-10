"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Phone,
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Smile,
  CheckCheck,
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Tag,
  DollarSign,
  AlertCircle,
  FileText,
  UserCheck,
} from "lucide-react";

interface Message {
  id: string;
  sender: "customer" | "bot" | "agent";
  text: string;
  time: string;
}

interface ChatContact {
  id: string;
  name: string;
  phone: string;
  unread: number;
  lastMessage: string;
  time: string;
  stage: string;
  botActive: boolean;
  dealValue: string;
  intent: string;
  sentiment: string;
  messages: Message[];
}

export default function OmnichannelCrmPage() {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "bot" | "human">("all");
  const [activeContactId, setActiveContactId] = useState("1");
  const [inputMessage, setInputMessage] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Initial mock contacts matching tested WhatsApp numbers
  const [contacts, setContacts] = useState<ChatContact[]>([
    {
      id: "1",
      name: "Hendro Wijaya (Whitelisted)",
      phone: "+62 812-2630-0090",
      unread: 0,
      lastMessage: "Bisa kirim penawaran paket enterprise untuk 10.000 broadcast?",
      time: "13:15",
      stage: "AI Qualifying",
      botActive: true,
      dealValue: "Rp 18.000.000",
      intent: "Kebutuhan broadcast massal & API WAHA",
      sentiment: "Tinggi (94% closing probability)",
      messages: [
        {
          id: "m1",
          sender: "customer",
          text: "Halo Poko, saya mau tanya paket langganan untuk perusahaan.",
          time: "13:10",
        },
        {
          id: "m2",
          sender: "bot",
          text: "Halo Pak Hendro! Selamat datang di Poko. Kami menyediakan solusi CRM Omnichannel & Automasi WhatsApp bertenaga AI. Ada estimasi berapa kontak atau pesan yang ingin diproses setiap bulannya?",
          time: "13:10",
        },
        {
          id: "m3",
          sender: "customer",
          text: "Bisa kirim penawaran paket enterprise untuk 10.000 broadcast?",
          time: "13:15",
        },
      ],
    },
    {
      id: "2",
      name: "Budi Santoso",
      phone: "+62 818-0273-1947",
      unread: 1,
      lastMessage: "Apakah sistem ini bisa multi-device dengan Docker?",
      time: "12:45",
      stage: "New Inquiries",
      botActive: true,
      dealValue: "Rp 7.500.000",
      intent: "Docker self-host & multi-agent",
      sentiment: "Positif (80%)",
      messages: [
        {
          id: "m4",
          sender: "customer",
          text: "Apakah sistem ini bisa multi-device dengan Docker?",
          time: "12:45",
        },
      ],
    },
    {
      id: "3",
      name: "Ibob Atsuga (Self Test)",
      phone: "+62 896-3737-0000",
      unread: 0,
      lastMessage: "Test pesan live dari engine Poko WhatsApp",
      time: "11:15",
      stage: "Deal Closed / Won",
      botActive: false,
      dealValue: "Rp 38.000.000",
      intent: "Verifikasi integrasi engine WAHA & Sakelar AI",
      sentiment: "Owner / Internal",
      messages: [
        {
          id: "m5",
          sender: "customer",
          text: "Test ping bot poko apakah webhook jalan?",
          time: "11:14",
        },
        {
          id: "m6",
          sender: "agent",
          text: "Webhook WAHA aktif dan respons 201 Created sukses terkirim.",
          time: "11:15",
        },
      ],
    },
  ]);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

  // Toggle Bot handling for this contact
  const toggleBotActive = () => {
    setContacts((prev) =>
      prev.map((c) => (c.id === activeContact.id ? { ...c, botActive: !c.botActive } : c))
    );
  };

  // Send message as Human Agent
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: "msg_" + Date.now(),
      sender: "agent",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContact.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessage: inputMessage,
              time: newMsg.time,
            }
          : c
      )
    );
    setInputMessage("");
  };

  // Quick Reply template insertion
  const handleQuickReply = (text: string) => {
    setInputMessage(text);
  };

  // AI Suggestion generator using Sakelar AI Luna mock/live
  const handleGenerateAiSuggestion = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setInputMessage(
        "Tentu Pak Hendro, untuk paket Enterprise 10.000 broadcast sudah mencakup dedicated WAHA instance, unlimited agent seat, dan kuota Sakelar GPT-6 Luna. Saya kirimkan proposal PDF lengkapnya ya!"
      );
      setIsGeneratingAi(false);
    }, 600);
  };

  // Filter contacts
  const filteredContacts = contacts.filter((c) => {
    if (selectedFilter === "unread") return c.unread > 0;
    if (selectedFilter === "bot") return c.botActive;
    if (selectedFilter === "human") return !c.botActive;
    return true;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* 1. LEFT CONVERSATIONS LIST COLUMN (340px) */}
      <section className="w-80 md:w-96 flex flex-col border-r border-poko-border bg-stone-50/50 shrink-0">
        {/* Top Header */}
        <div className="p-4 border-b border-poko-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-600 transition-colors"
              title="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h2 className="font-bold text-sm text-poko-charcoal leading-tight">Omnichannel CRM</h2>
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                WAHA Gateway Online
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-poko-linen text-stone-700 border border-stone-200">
              Poko v1.0
            </span>
          </div>
        </div>

        {/* Search & Filter Tabs */}
        <div className="p-3 border-b border-poko-border bg-white space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari chat atau nomor WA..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-stone-100 border-none focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {[
              { id: "all", label: "Semua" },
              { id: "unread", label: "Belum Dibaca" },
              { id: "bot", label: "🤖 Bot Aktif" },
              { id: "human", label: "👤 CS Agent" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedFilter === tab.id
                    ? "bg-poko-charcoal text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
          {filteredContacts.map((contact) => {
            const isSelected = contact.id === activeContact.id;
            return (
              <div
                key={contact.id}
                onClick={() => setActiveContactId(contact.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected ? "bg-poko-linen border-l-4 border-poko-charcoal" : "hover:bg-white"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs">
                    {contact.name.substring(0, 2).toUpperCase()}
                  </div>
                  {contact.botActive && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] shadow-sm">
                      <Bot className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-xs font-bold text-poko-charcoal truncate">{contact.name}</h4>
                    <span className="text-[10px] text-stone-400 shrink-0">{contact.time}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-mono truncate mb-1">
                    {contact.phone}
                  </p>
                  <p className="text-xs text-stone-600 truncate">{contact.lastMessage}</p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-white border border-stone-200 text-stone-700">
                      {contact.stage}
                    </span>
                    {contact.botActive ? (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-purple-100 text-purple-700">
                        AI Autopilot
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-100 text-emerald-800">
                        Human CS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. CENTER CHAT STREAM COLUMN */}
      <section className="flex-1 flex flex-col bg-[#fafaf8] min-w-0">
        {/* Chat Active Header */}
        <header className="h-16 px-6 border-b border-poko-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-xs shrink-0">
              {activeContact.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-poko-charcoal truncate">
                  {activeContact.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  WhatsApp
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono">{activeContact.phone}</p>
            </div>
          </div>

          {/* Action buttons & AI Switch */}
          <div className="flex items-center gap-3">
            {/* AI Bot Toggle */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-100 border border-stone-200">
              <Bot className={`w-4 h-4 ${activeContact.botActive ? "text-purple-600" : "text-stone-400"}`} />
              <span className="text-xs font-semibold text-stone-700">
                {activeContact.botActive ? "Poko AI Aktif" : "AI Paused"}
              </span>
              <button
                onClick={toggleBotActive}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                  activeContact.botActive ? "bg-purple-600" : "bg-stone-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    activeContact.botActive ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Resolve Chat Button */}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-poko-border bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-subtle">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Selesaikan Chat
            </button>
          </div>
        </header>

        {/* Message Thread Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-center">
            <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-stone-200/70 text-stone-600">
              Hari Ini • Enkripsi End-to-End via WAHA
            </span>
          </div>

          {activeContact.messages.map((msg) => {
            const isCustomer = msg.sender === "customer";
            const isBot = msg.sender === "bot";

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isCustomer ? "items-start" : "items-end"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-subtle text-xs leading-relaxed ${
                    isCustomer
                      ? "bg-white text-poko-charcoal border border-stone-200/80 rounded-bl-sm"
                      : isBot
                      ? "bg-poko-linen text-poko-charcoal border border-stone-300/80 rounded-br-sm"
                      : "bg-poko-charcoal text-white rounded-br-sm"
                  }`}
                >
                  {isBot && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-purple-700 mb-1">
                      <Bot className="w-3 h-3" />
                      <span>Poko AI (gpt-6-luna)</span>
                    </div>
                  )}
                  {msg.sender === "agent" && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-stone-300 mb-1">
                      <User className="w-3 h-3" />
                      <span>Ibob Atsuga (CS)</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <div className="flex items-center gap-1 mt-1 px-1">
                  <span className="text-[10px] text-stone-400">{msg.time}</span>
                  {!isCustomer && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Replies Bar */}
        <div className="px-6 py-2 bg-white/90 border-t border-poko-border flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
            Balasan Cepat:
          </span>
          {[
            "Katalog Paket Enterprise",
            "Jadwal Konsultasi",
            "Rekening Bank Fluxy",
            "Panduan WAHA Docker",
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(item)}
              className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-stone-100 text-stone-700 hover:bg-poko-linen hover:text-poko-charcoal border border-stone-200/60 whitespace-nowrap transition-all"
            >
              {item}
            </button>
          ))}

          {/* AI Suggestion Button */}
          <button
            onClick={handleGenerateAiSuggestion}
            disabled={isGeneratingAi}
            className="ml-auto px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 shrink-0 transition-all"
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            {isGeneratingAi ? "Sedang generate..." : "Generate Saran AI"}
          </button>
        </div>

        {/* Rich Input Form */}
        <div className="p-4 bg-white border-t border-poko-border">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ketik pesan WhatsApp atau pilih saran AI..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-stone-100 text-xs border-none focus:outline-none focus:ring-2 focus:ring-poko-charcoal/20"
            />

            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* 3. RIGHT COLUMN: CRM PROFILE & AI CONTEXT DRAWER (320px) */}
      <aside className="w-80 border-l border-poko-border bg-white p-5 flex flex-col justify-between overflow-y-auto shrink-0">
        <div className="space-y-6">
          {/* Contact Identity */}
          <div className="text-center pb-5 border-b border-poko-border">
            <div className="w-16 h-16 rounded-3xl bg-poko-linen border border-stone-200 text-poko-charcoal font-bold text-lg mx-auto flex items-center justify-center mb-3 shadow-subtle">
              {activeContact.name.substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-bold text-sm text-poko-charcoal">{activeContact.name}</h3>
            <p className="text-xs text-stone-500 font-mono mt-0.5">{activeContact.phone}</p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold mt-2 border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              Whitelisted Contact
            </div>
          </div>

          {/* CRM Deal & Pipeline Stage */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Tahap Sales Pipeline
            </h4>
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Stage Saat Ini:</span>
                <span className="font-bold text-poko-charcoal">{activeContact.stage}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Estimasi Deal:</span>
                <span className="font-bold text-emerald-600">{activeContact.dealValue}</span>
              </div>
            </div>
          </div>

          {/* AI Memory & Intent Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                AI Memory Insight
              </h4>
              <span className="text-[10px] font-mono text-purple-600 font-semibold">gpt-6-luna</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-poko-linen border border-stone-300/60 space-y-2.5 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase">
                  Intent Klien:
                </span>
                <p className="text-poko-charcoal font-medium mt-0.5">{activeContact.intent}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-stone-500 uppercase">
                  Closing Score:
                </span>
                <p className="text-emerald-700 font-semibold mt-0.5">{activeContact.sentiment}</p>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Catatan Internal Tim
            </h4>
            <textarea
              rows={3}
              placeholder="Tambahkan catatan deal atau follow up..."
              className="w-full p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-poko-charcoal resize-none"
              defaultValue="Klien meminta setup Docker di server dedicated mereka. Sudah dikirimkan spesifikasi Colima/Ubuntu."
            />
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4 border-t border-poko-border">
          <Link
            href="/"
            className="w-full py-2 px-3 rounded-xl border border-poko-border text-xs font-semibold text-stone-600 hover:bg-stone-50 flex items-center justify-center gap-2"
          >
            <span>Tutup & Kembali ke Dashboard</span>
          </Link>
        </div>
      </aside>
    </div>
  );
}
