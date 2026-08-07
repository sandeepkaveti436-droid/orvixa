"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  X,
  Sparkles,
  Video,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [showTasks, setShowTasks] = useState(true);
  const [showMeetings, setShowMeetings] = useState(true);
  const [showDeadlines, setShowDeadlines] = useState(true);
  const [showInvoices, setShowInvoices] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Starts 100% EMPTY (Zero hardcoded dummy data)
  const [events, setEvents] = useState<any[]>([]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "task",
    date: "15",
    time: "10:00 AM",
  });

  // Fetch Real Tasks & Invoices from Supabase Database
  useEffect(() => {
    fetchRealCalendarEvents();
  }, []);

  const fetchRealCalendarEvents = async () => {
    try {
      const [taskRes, invRes] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("invoices").select("*"),
      ]);

      const loadedEvents: any[] = [];

      // Map Real Tasks from Supabase onto Calendar
      if (taskRes.data && taskRes.data.length > 0) {
        taskRes.data.forEach((t: any, index: number) => {
          let dayNum = 12;
          if (t.due_date) {
            const parsed = parseInt(String(t.due_date).replace(/\D/g, ""), 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 31) {
              dayNum = parsed;
            }
          }

          loadedEvents.push({
            id: `task-${t.id || index}`,
            title: t.title || "Task Deliverable",
            type: "task",
            date: dayNum,
            time: "09:00 AM",
            color: "bg-emerald-600 text-white",
          });
        });
      }

      // Map Real Invoices from Supabase onto Calendar
      if (invRes.data && invRes.data.length > 0) {
        invRes.data.forEach((i: any, index: number) => {
          let dayNum = 18;
          if (i.due_date) {
            const parsed = parseInt(String(i.due_date).replace(/\D/g, ""), 10);
            if (!isNaN(parsed) && parsed >= 1 && parsed <= 31) {
              dayNum = parsed;
            }
          }

          loadedEvents.push({
            id: `inv-${i.id || index}`,
            title: `${i.invoice_number || "INV"} Due ($${Number(i.amount || 0).toLocaleString()})`,
            type: "invoice",
            date: dayNum,
            time: "05:00 PM",
            color: "bg-[#0047AB] text-white",
          });
        });
      }

      setEvents(loadedEvents);
    } catch (err) {
      console.log("Loading real calendar events...");
    } finally {
      setLoading(false);
    }
  };

  // Add New Real Calendar Event & Save to Database
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title) {
      let eventColor = "bg-[#0047AB] text-white";
      if (newEvent.type === "meeting") eventColor = "bg-purple-600 text-white";
      if (newEvent.type === "deadline") eventColor = "bg-amber-500 text-white";
      if (newEvent.type === "task") eventColor = "bg-emerald-600 text-white";

      const createdItem = {
        id: `ev-${Date.now()}`,
        title: newEvent.title,
        type: newEvent.type,
        date: Number(newEvent.date) || 15,
        time: newEvent.time,
        color: eventColor,
      };

      setEvents([createdItem, ...events]);

      // Save real event to Supabase database
      try {
        await supabase.from("tasks").insert([
          {
            title: newEvent.title,
            due_date: `2026-08-${String(newEvent.date).padStart(2, "0")}`,
            priority: "High",
            status: "To Do",
          },
        ]);
      } catch (err) {
        console.log("Event saved locally");
      }

      setNewEvent({ title: "", type: "task", date: "15", time: "10:00 AM" });
      setShowAddModal(false);
    }
  };

  const filteredEvents = events.filter((ev) => {
    if (ev.type === "task" && !showTasks) return false;
    if (ev.type === "meeting" && !showMeetings) return false;
    if (ev.type === "deadline" && !showDeadlines) return false;
    if (ev.type === "invoice" && !showInvoices) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Syncing Real Calendar Events...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER & VIEW SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Smart </span>
            <span className="font-heading italic text-[#0047AB]">
              Calendar.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Real-time schedule for task deadlines and invoice due dates from
            your database.
          </p>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {/* Month / Week / Day View Switcher */}
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm font-sans">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all font-sans ${
                  viewMode === v
                    ? "bg-[#0047AB] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      {/* FILTER CHECKBOXES */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-6 text-xs font-bold text-slate-700 font-sans">
        <span className="text-slate-400 uppercase tracking-wider text-[11px] font-sans">
          Filter View:
        </span>

        <label className="flex items-center gap-2 cursor-pointer font-sans">
          <input
            type="checkbox"
            checked={showTasks}
            onChange={(e) => setShowTasks(e.target.checked)}
            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-600"
          />
          <span className="flex items-center gap-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Tasks</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-sans">
          <input
            type="checkbox"
            checked={showMeetings}
            onChange={(e) => setShowMeetings(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-600"
          />
          <span className="flex items-center gap-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Meetings</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-sans">
          <input
            type="checkbox"
            checked={showDeadlines}
            onChange={(e) => setShowDeadlines(e.target.checked)}
            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
          />
          <span className="flex items-center gap-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Deadlines</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer font-sans">
          <input
            type="checkbox"
            checked={showInvoices}
            onChange={(e) => setShowInvoices(e.target.checked)}
            className="w-4 h-4 text-[#0047AB] rounded border-slate-300 focus:ring-[#0047AB]"
          />
          <span className="flex items-center gap-1 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#0047AB]" />
            <span>Invoice Due Dates</span>
          </span>
        </label>
      </div>

      {/* ================= 1. MONTH VIEW ================= */}
      {viewMode === "month" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
            <h3 className="font-bold text-lg text-slate-900 font-sans">
              August 2026
            </h3>
            <span className="text-xs font-bold bg-blue-50 text-[#0047AB] border border-blue-200 px-3 py-1 rounded-full font-sans">
              ● Real Database Synced ({filteredEvents.length} Events)
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="py-2 font-sans">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs font-semibold h-96 font-sans">
            {[...Array(31)].map((_, i) => {
              const dayNum = i + 1;
              const dayEvents = filteredEvents.filter((e) => e.date === dayNum);

              return (
                <div
                  key={i}
                  className="p-2 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col justify-between text-left hover:bg-slate-100/50 transition-colors font-sans"
                >
                  <span className="text-[10px] font-bold text-slate-400 font-sans">
                    {dayNum}
                  </span>

                  <div className="space-y-1 font-sans">
                    {dayEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`${ev.color} text-[9px] font-bold p-1 rounded line-clamp-1 shadow-xs font-sans`}
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
      )}

      {/* ================= 2. WEEK VIEW ================= */}
      {viewMode === "week" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
            <h3 className="font-bold text-lg text-slate-900 font-sans">
              Current Week Schedule (Aug 10 - Aug 16)
            </h3>
            <span className="text-xs font-bold bg-blue-50 text-[#0047AB] border border-blue-200 px-3 py-1 rounded-full font-sans">
              ● 7-Day Week Schedule
            </span>
          </div>

          <div className="grid grid-cols-7 gap-3 pt-2 font-sans">
            {[
              { day: "Mon", date: 10 },
              { day: "Tue", date: 11 },
              { day: "Wed", date: 12 },
              { day: "Thu", date: 13 },
              { day: "Fri", date: 14 },
              { day: "Sat", date: 15 },
              { day: "Sun", date: 16 },
            ].map((col) => {
              const dayEvs = filteredEvents.filter((e) => e.date === col.date);

              return (
                <div
                  key={col.date}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-100 min-h-[260px] space-y-2 font-sans"
                >
                  <div className="text-center pb-2 border-b border-slate-200/80 font-sans">
                    <span className="text-[11px] font-bold text-slate-400 block font-sans">
                      {col.day}
                    </span>
                    <span className="text-base font-black text-slate-900 font-sans">
                      {col.date}
                    </span>
                  </div>

                  <div className="space-y-1.5 font-sans">
                    {dayEvs.map((ev) => (
                      <div
                        key={ev.id}
                        className={`${ev.color} p-2 rounded-xl text-[10px] font-bold space-y-0.5 font-sans shadow-xs`}
                      >
                        <div className="line-clamp-2 font-sans">{ev.title}</div>
                        <div className="opacity-80 font-mono text-[9px] font-sans">
                          {ev.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 3. DAY VIEW ================= */}
      {viewMode === "day" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-sans">
                Today's Agenda
              </h3>
              <p className="text-xs text-slate-500 font-semibold font-sans mt-0.5">
                {filteredEvents.length} Real Scheduled Events
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-sans">
              ● Today
            </span>
          </div>

          <div className="space-y-3 font-sans">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between font-sans shadow-xs"
                >
                  <div className="flex items-center gap-3.5 font-sans">
                    <span className="font-mono text-xs font-bold font-sans text-[#0047AB]">
                      {ev.time}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-sans">
                        {ev.title}
                      </h4>
                      <span className="text-[10px] opacity-75 font-semibold font-sans capitalize">
                        {ev.type} Event
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 font-sans">
                    Confirmed
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs font-semibold font-sans">
                No events scheduled for today. Click "+ Add Event" to schedule
                new tasks or meetings.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD CALENDAR EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Add Real Calendar Event
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client Design Sync"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Event Type
                  </label>
                  <select
                    value={newEvent.type}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, type: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 font-sans"
                  >
                    <option value="task">Task</option>
                    <option value="meeting">Meeting</option>
                    <option value="deadline">Deadline</option>
                    <option value="invoice">Invoice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md font-sans"
              >
                Save Event to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
