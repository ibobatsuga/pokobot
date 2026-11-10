"use client";

import React, { useState } from "react";
import { PokoAppShell } from "@/components/PokoAppShell";
import {
  CheckSquare,
  Square,
  Plus,
  Calendar,
  Clock,
  User,
  AlertCircle,
  Tag,
  Phone,
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  client: string;
  phone: string;
  dueDate: string;
  dueTime: string;
  priority: "Tinggi" | "Sedang" | "Rendah";
  assignedTo: string;
  completed: boolean;
  notes: string;
}

export default function TodoListPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "t1",
      title: "Follow-up proposal Paket Enterprise via WhatsApp Call",
      client: "Hendro Wijaya",
      phone: "+62 812-2630-0090",
      dueDate: "Hari Ini",
      dueTime: "14:00",
      priority: "Tinggi",
      assignedTo: "Tim Sales",
      completed: false,
      notes: "Klien ingin konfirmasi apakah multi-device WAHA support 10 agent online serentak.",
    },
    {
      id: "t2",
      title: "Kirim demo link bot FAQ katalog skincare",
      client: "Dewi Lestari",
      phone: "+62 856-1234-5678",
      dueDate: "Hari Ini",
      dueTime: "16:30",
      priority: "Sedang",
      assignedTo: "PokoBot AI",
      completed: false,
      notes: "Contoh respon PokoBot AI dengan persona ramah & profesional.",
    },
    {
      id: "t3",
      title: "Verifikasi pembayaran transfer invoice Duitku",
      client: "CV Berkah Abadi",
      phone: "+62 819-3344-5566",
      dueDate: "Kemarin",
      dueTime: "10:00",
      priority: "Tinggi",
      assignedTo: "Finance Team",
      completed: true,
      notes: "Invoice #INV-2026-1109 lunas Rp 38.000.000.",
    },
    {
      id: "t4",
      title: "Kirim panduan instalasi Docker Colima ke tim IT klien",
      client: "Budi Santoso",
      phone: "+62 818-0273-1947",
      dueDate: "Besok",
      dueTime: "11:00",
      priority: "Sedang",
      assignedTo: "Tech Support",
      completed: false,
      notes: "Dokumentasi port 3000 dan webhook listener PHP.",
    },
  ]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <PokoAppShell
      title="To Do List & Agenda Sales"
      subtitle="Pengingat follow-up harian, janji demo, dan tugas tim CRM"
      actionButton={
        <button className="h-9 flex items-center gap-1.5 px-3.5 rounded-xl bg-poko-charcoal text-white text-xs font-semibold hover:bg-black transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Tugas Baru</span>
        </button>
      }
    >
      <div className="max-w-4xl space-y-6">
        {/* Quick summary stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-poko-border shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Tugas Belum Selesai</span>
            <div className="text-2xl font-bold text-poko-charcoal mt-1">
              {tasks.filter((t) => !t.completed).length} Tugas
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-poko-border shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Prioritas Tinggi (Hari Ini)</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">
              {tasks.filter((t) => t.priority === "Tinggi" && !t.completed).length} Tugas
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-poko-border shadow-xs">
            <span className="text-xs text-stone-500 font-medium">Selesai Minggu Ini</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">
              {tasks.filter((t) => t.completed).length} Tugas
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white rounded-3xl border border-poko-border shadow-subtle divide-y divide-stone-100 overflow-hidden">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 flex items-start gap-4 transition-colors ${
                task.completed ? "bg-stone-50/50 opacity-60" : "hover:bg-stone-50/30"
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-stone-400 hover:text-poko-charcoal transition-colors"
              >
                {task.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-stone-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`font-semibold text-sm ${
                      task.completed
                        ? "line-through text-stone-400"
                        : "text-poko-charcoal"
                    }`}
                  >
                    {task.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.priority === "Tinggi"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p className="text-xs text-stone-500 leading-relaxed mb-3">
                  {task.notes}
                </p>

                <div className="flex items-center gap-4 text-xs text-stone-400 flex-wrap">
                  <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {task.client} ({task.phone})
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {task.dueDate}, {task.dueTime}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px]">
                    PIC: {task.assignedTo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PokoAppShell>
  );
}
