"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Layers,
  ExternalLink,
  X,
  Filter,
  Loader2,
  IndianRupee,
  Briefcase,
  Check,
  FolderOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CalendarItem {
  id: string;
  title: string;
  client: string;
  date: string; // YYYY-MM-DD
  status: "Completed" | "In Progress" | "Pending" | "Stopped" | string;
  amount?: number;
  type: "deliverable" | "project" | "task";
  projectId?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Normalize any date/timestamp into "YYYY-MM-DD"
const toDateKey = (raw: any): string => {
  if (!raw) return "";
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.substring(0, 10);
  }
  try {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
  } catch {}
  return "";
};

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter View State
  const [statusFilter, setStatusFilter] = useState<
    "all" | "in_progress" | "completed"
  >("all");
  const [selectedClient, setSelectedClient] = useState("all");

  // Event Detail Modal
  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);

  // Quick Add Event Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    client: "",
    date: toDateKey(new Date()),
    status: "In Progress",
    amount: "1500",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const items: CalendarItem[] = [];

      // 1. Fetch Projects & Creative Deliverables
      const { data: projects, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projError) {
        console.error(
          "Error loading projects for calendar:",
          projError.message,
        );
      }

      if (projects && projects.length > 0) {
        projects.forEach((proj: any) => {
          const clientName = proj.client || "Direct Client";
          const projDate =
            toDateKey(proj.date) ||
            toDateKey(proj.deadline) ||
            toDateKey(proj.due_date) ||
            toDateKey(proj.created_at) ||
            toDateKey(new Date());

          let foundDeliverables = false;

          // Check if deliverables JSON array exists
          if (proj.deliverables) {
            try {
              const parsed =
                typeof proj.deliverables === "string"
                  ? JSON.parse(proj.deliverables)
                  : proj.deliverables;

              if (Array.isArray(parsed) && parsed.length > 0) {
                foundDeliverables = true;
                parsed.forEach((deliv: any, index: number) => {
                  const itemDate = toDateKey(deliv.date) || projDate;
                  items.push({
                    id: deliv.id || `${proj.id}-deliv-${index}`,
                    title: deliv.name || `${proj.title} - Creative Work`,
                    client: clientName,
                    date: itemDate,
                    status: deliv.status || proj.status || "In Progress",
                    amount: deliv.amount || 0,
                    type: "deliverable",
                    projectId: proj.id,
                  });
                });
              }
            } catch {
              // Non-JSON plain text deliverables
            }
          }

          // If no inner deliverables, register the master project on the calendar
          if (!foundDeliverables) {
            items.push({
              id: `proj-${proj.id}`,
              title: proj.title || "Client Project Work",
              client: clientName,
              date: projDate,
              status: proj.status || "In Progress",
              amount: parseFloat(proj.budget) || 0,
              type: "project",
              projectId: proj.id,
            });
          }
        });
      }

      // 2. Fetch Tasks table if it exists
      try {
        const { data: tasks } = await supabase.from("tasks").select("*");
        if (tasks && tasks.length > 0) {
          tasks.forEach((t: any) => {
            const taskDate = toDateKey(t.due_date) || toDateKey(t.created_at);
            if (taskDate) {
              items.push({
                id: `task-${t.id}`,
                title: t.title || t.name || "Scheduled Task",
                client: t.client || "Internal",
                date: taskDate,
                status: t.status === "completed" ? "Completed" : "In Progress",
                type: "task",
              });
            }
          });
        }
      } catch {
        // Table might not exist yet
      }

      setCalendarItems(items);

      // Auto-focus on the month containing events if today has none
      if (items.length > 0) {
        const latestEvent = items[0];
        if (latestEvent.date) {
          const parts = latestEvent.date.split("-");
          if (parts.length === 3) {
            const evYear = parseInt(parts[0], 10);
            const evMonth = parseInt(parts[1], 10) - 1;
            // If the current displayed month is different, optionally set it
            // setCurrentDate(new Date(evYear, evMonth, 1));
          }
        }
      }
    } catch (err: any) {
      console.error("Calendar data error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Distinct clients list for filter
  const clientList = useMemo(() => {
    return Array.from(new Set(calendarItems.map((item) => item.client))).filter(
      Boolean,
    );
  }, [calendarItems]);

  // Month navigation
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate 35 or 42 calendar grid cells (Monday start)
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0,
    ).getDate();

    // Monday is index 0 (JS getDay: 0=Sun, 1=Mon, ..., 6=Sat)
    const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInPrevMonth = new Date(
      currentYear,
      currentMonthIndex,
      0,
    ).getDate();

    const cells: {
      dateKey: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    const todayStr = toDateKey(new Date());

    // 1. Previous month trailing days
    for (let i = startDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonthIndex - 1, dayNum);
      const key = toDateKey(prevDate);
      cells.push({
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: key === todayStr,
      });
    }

    // 2. Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const thisDate = new Date(currentYear, currentMonthIndex, dayNum);
      const key = toDateKey(thisDate);
      cells.push({
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: key === todayStr,
      });
    }

    // 3. Next month leading days (fill up to full weeks of 35 or 42)
    const remaining = (7 - (cells.length % 7)) % 7;
    const totalCellsNeeded =
      cells.length + remaining < 35 ? 35 : cells.length + remaining;
    const nextDaysCount = totalCellsNeeded - cells.length;

    for (let dayNum = 1; dayNum <= nextDaysCount; dayNum++) {
      const nextDate = new Date(currentYear, currentMonthIndex + 1, dayNum);
      const key = toDateKey(nextDate);
      cells.push({
        dateKey: key,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: key === todayStr,
      });
    }

    return cells;
  }, [currentYear, currentMonthIndex]);

  // Group filtered items by date key
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};

    calendarItems.forEach((item) => {
      // Filter status
      if (statusFilter === "in_progress" && item.status === "Completed") return;
      if (statusFilter === "completed" && item.status !== "Completed") return;

      // Filter client
      if (selectedClient !== "all" && item.client !== selectedClient) return;

      if (!map[item.date]) {
        map[item.date] = [];
      }
      map[item.date].push(item);
    });

    return map;
  }, [calendarItems, statusFilter, selectedClient]);

  // Total visible events count
  const visibleEventsCount = useMemo(() => {
    return Object.values(eventsByDate).reduce(
      (acc, curr) => acc + curr.length,
      0,
    );
  }, [eventsByDate]);

  // Quick Add Event to Supabase
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    setIsSubmitting(true);
    try {
      const itemAmount = parseFloat(newEvent.amount) || 0;
      const clientName = newEvent.client.trim() || "General Client";

      const projectPayload: any = {
        title: newEvent.title.trim(),
        client: clientName,
        category: "Graphic Design",
        budget: itemAmount,
        status: newEvent.status,
        date: newEvent.date,
        deliverables: JSON.stringify([
          {
            id: `deliv-${Date.now()}`,
            name: newEvent.title.trim(),
            type: "Flyer / Creative Work",
            amount: itemAmount,
            date: newEvent.date,
            status: newEvent.status,
          },
        ]),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([projectPayload])
        .select();
      if (error) throw error;

      const createdItem: CalendarItem = {
        id: `created-${Date.now()}`,
        title: newEvent.title.trim(),
        client: clientName,
        date: newEvent.date,
        status: newEvent.status,
        amount: itemAmount,
        type: "deliverable",
        projectId: data && data[0] ? data[0].id : undefined,
      };

      setCalendarItems((prev) => [createdItem, ...prev]);
      setShowAddModal(false);
      setNewEvent({
        title: "",
        client: "",
        date: toDateKey(new Date()),
        status: "In Progress",
        amount: "1500",
      });
    } catch (err: any) {
      alert(`Could not schedule work: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans not-italic space-y-6 text-slate-900 pb-16">
      {/* HEADER (Single clean font, no italics) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Work Schedule & Project Calendar
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Real-time schedule for client deliverables, creative works, and
            project deadlines from your database.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleToday}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-xs text-slate-700 shadow-sm transition"
          >
            Today
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule Work</span>
          </button>
        </div>
      </div>

      {/* FILTER & MONTH NAVIGATION TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Month Navigation */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-slate-900 min-w-[160px] text-center md:text-left">
            {MONTH_NAMES[currentMonthIndex]} {currentYear}
          </h2>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#0047AB] border border-blue-100 shrink-0">
            {loading ? "Syncing..." : `${visibleEventsCount} Active Events`}
          </span>
        </div>

        {/* Status & Client Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Client Filter Dropdown */}
          {clientList.length > 0 && (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0047AB]"
            >
              <option value="all">All Clients ({clientList.length})</option>
              {clientList.map((client) => (
                <option key={client} value={client}>
                  {client}
                </option>
              ))}
            </select>
          )}

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                statusFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("in_progress")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                statusFilter === "in_progress"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>In Progress</span>
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
                statusFilter === "completed"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR MAIN GRID */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center text-xs font-bold text-slate-500 py-3">
          {WEEKDAY_NAMES.map((name) => (
            <div key={name}>{name}</div>
          ))}
        </div>

        {/* Calendar Days */}
        {loading ? (
          <div className="py-24 text-center font-medium text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#0047AB]" />
            <span>Loading database events & project deliverables...</span>
          </div>
        ) : (
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarGrid.map((cell, idx) => {
              const dayEvents = eventsByDate[cell.dateKey] || [];

              return (
                <div
                  key={`${cell.dateKey}-${idx}`}
                  className={`min-h-[110px] p-2 flex flex-col justify-between transition group hover:bg-slate-50/60 ${
                    cell.isCurrentMonth
                      ? "bg-white"
                      : "bg-slate-50/40 text-slate-400"
                  }`}
                >
                  {/* Date number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        cell.isToday
                          ? "bg-[#0047AB] text-white"
                          : cell.isCurrentMonth
                            ? "text-slate-800"
                            : "text-slate-400"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {dayEvents.length}{" "}
                        {dayEvents.length === 1 ? "work" : "works"}
                      </span>
                    )}
                  </div>

                  {/* Events list inside cell */}
                  <div className="space-y-1 mt-1.5 flex-1">
                    {dayEvents.slice(0, 3).map((item) => {
                      const isCompleted = item.status === "Completed";

                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`px-2 py-1 rounded-md text-[11px] font-semibold border truncate cursor-pointer transition flex items-center gap-1 shadow-sm ${
                            isCompleted
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                              : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                          }`}
                          title={`${item.client}: ${item.title} (${item.status})`}
                        >
                          {isCompleted ? (
                            <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                          ) : (
                            <Clock className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                          )}
                          <span className="truncate">
                            <span className="font-bold">{item.client}:</span>{" "}
                            {item.title}
                          </span>
                        </div>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <div className="text-[10px] font-bold text-slate-500 pl-1">
                        +{dayEvents.length - 3} more works
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-sm w-full space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {selectedItem.type === "deliverable"
                    ? "Creative Deliverable"
                    : "Project Task"}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Client / Brand:
                </span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-[#0047AB]" />
                  <span>{selectedItem.client}</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Work Date:</span>
                <span className="font-bold text-slate-900">
                  {selectedItem.date}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedItem.status === "Completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {selectedItem.status}
                </span>
              </div>

              {selectedItem.amount !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    Deliverable Fee:
                  </span>
                  <span className="font-bold text-slate-900">
                    ₹{selectedItem.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {selectedItem.projectId ? (
                <Link
                  href={`/dashboard/freelancer/projects/${selectedItem.projectId}`}
                  className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-semibold transition"
                >
                  <span>Open in Project Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW WORK / EVENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xl max-w-md w-full space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#0047AB]" />
                <span>Schedule Work / Deliverable</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Deliverable / Work Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 13th Lunch Event Flyer, Menu Card Design"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Client / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Food & Link"
                  value={newEvent.client}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, client: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Scheduled Work Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Deliverable Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={newEvent.amount}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, amount: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Initial Status
                </label>
                <select
                  value={newEvent.status}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, status: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0047AB]"
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Save to Calendar & Projects</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
