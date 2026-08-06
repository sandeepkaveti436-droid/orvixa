"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  X,
} from "lucide-react";

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [showTasks, setShowTasks] = useState(true);
  const [showMeetings, setShowMeetings] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showInvoices, setShowInvoices] = useState(true);

  const events = [
    {
      id: 1,
      title: "Acme iOS Wireframes Due",
      type: "deadline",
      date: 12,
      color: "bg-amber-500",
    },
    {
      id: 2,
      title: "Design Sync with Sarah Chen",
      type: "meeting",
      date: 14,
      color: "bg-purple-600",
    },
    {
      id: 3,
      title: "Invoice #1043 Due ($3,200)",
      type: "invoice",
      date: 18,
      color: "bg-[#0047AB]",
    },
    {
      id: 4,
      title: "Stripe Sandbox QA Testing",
      type: "task",
      date: 22,
      color: "bg-emerald-600",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Smart </span>
            <span className="font-heading italic text-[#0047AB]">
              Calendar.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Schedule meetings, task deadlines, and invoice due dates in one
            calendar view.
          </p>
        </div>

        {/* Views Switcher (Month / Week / Day) */}
        <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm font-sans">
          {(["month", "week", "day"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                viewMode === v
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Checkboxes Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700">
        <span className="text-slate-400 uppercase tracking-wider text-[11px]">
          Filter View:
        </span>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showTasks}
            onChange={(e) => setShowTasks(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Tasks</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showMeetings}
            onChange={(e) => setShowMeetings(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-600"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Meetings</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showDeadlines}
            onChange={(e) => setShowDeadlines(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Deadlines</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showInvoices}
            onChange={(e) => setShowInvoices(e.target.checked)}
            className="w-4 h-4 text-[#0047AB] rounded border-slate-300 focus:ring-[#0047AB]"
          />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#0047AB]" />
            <span>Invoice Due Dates</span>
          </span>
        </label>
      </div>

      {/* Calendar Month Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900">August 2026</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border rounded-xl">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 border rounded-xl">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Month Grid Cells */}
        <div className="grid grid-cols-7 gap-2 text-xs font-semibold h-96">
          {[...Array(31)].map((_, i) => {
            const dayNum = i + 1;
            const dayEvents = events.filter((e) => e.date === dayNum);

            return (
              <div
                key={i}
                className="p-2 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col justify-between text-left hover:bg-slate-100/50 transition-colors"
              >
                <span className="text-[10px] font-bold text-slate-400">
                  {dayNum}
                </span>

                <div className="space-y-1">
                  {dayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`${ev.color} text-white text-[9px] font-bold p-1 rounded line-clamp-1 shadow-xs`}
                    >
                      {ev.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
