"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Building,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CalendarItem {
  id: string;
  title: string;
  client?: string;
  date: string; // YYYY-MM-DD
  time?: string | null; // Real time only; no fake fallbacks
  status: "Completed" | "In Progress" | "Pending" | "Done" | string;
  category?: string;
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

const WEEKDAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const PASTEL_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-600" },
  {
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-700",
  },
  { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-600" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-600" },
  { bg: "bg-rose-100", text: "text-rose-700", border: "border-rose-600" },
];

const getEventColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_COLORS.length;
  return PASTEL_COLORS[index];
};

// Normalize date to YYYY-MM-DD
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

// Extract real time only if an actual timestamp with time exists
const extractRealTime = (raw: any): string | null => {
  if (!raw || typeof raw !== "string") return null;
  if (raw.includes("T")) {
    try {
      const d = new Date(raw);
      if (!isNaN(d.getTime())) {
        const h = d.getHours();
        const m = d.getMinutes();
        // Skip default midnight 00:00 date-only timestamps
        if (h === 0 && m === 0) return null;
        return d
          .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .toLowerCase();
      }
    } catch {}
  }
  if (/^\d{1,2}:\d{2}/.test(raw)) return raw;
  return null;
};

export default function CalendarPage() {
  const [loading, setLoading] = useState(true);
  const [calendarItems, setCalendarItems] = useState<CalendarItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    toDateKey(new Date()),
  );

  const [selectedItem, setSelectedItem] = useState<CalendarItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    client: "",
    date: toDateKey(new Date()),
    time: "",
    category: "Deliverable",
    status: "In Progress",
    amount: "",
  });

  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const items: CalendarItem[] = [];

      // 1. Fetch Projects & Deliverables
      const { data: projects, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projError)
        console.error("Error loading projects:", projError.message);

      if (projects && projects.length > 0) {
        projects.forEach((proj: any) => {
          const clientName = proj.client || proj.client_name || "";
          const projDate =
            toDateKey(proj.date) ||
            toDateKey(proj.deadline) ||
            toDateKey(proj.due_date) ||
            toDateKey(proj.created_at);

          if (!projDate) return;

          const projTime =
            proj.time ||
            proj.due_time ||
            extractRealTime(proj.date || proj.deadline);

          let foundDeliverables = false;

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
                  const itemTime = deliv.time || projTime || null;

                  items.push({
                    id: String(deliv.id || `${proj.id}-deliv-${index}`),
                    title:
                      deliv.name || deliv.title || proj.title || "Deliverable",
                    client: deliv.client || clientName,
                    date: itemDate,
                    time: itemTime,
                    category: deliv.category || proj.category || "Deliverable",
                    status: deliv.status || proj.status || "In Progress",
                    amount: deliv.amount ? Number(deliv.amount) : undefined,
                    type: "deliverable",
                    projectId: proj.id,
                  });
                });
              }
            } catch {}
          }

          if (!foundDeliverables) {
            items.push({
              id: `proj-${proj.id}`,
              title: proj.title || proj.name || "Project",
              client: clientName,
              date: projDate,
              time: projTime || null,
              category: proj.category || "Project",
              status: proj.status || "In Progress",
              amount: proj.budget ? parseFloat(proj.budget) : undefined,
              type: "project",
              projectId: proj.id,
            });
          }
        });
      }

      // 2. Fetch Tasks
      try {
        const { data: tasks } = await supabase.from("tasks").select("*");
        if (tasks && tasks.length > 0) {
          tasks.forEach((t: any) => {
            const taskDate =
              toDateKey(t.due_date) ||
              toDateKey(t.date) ||
              toDateKey(t.created_at);
            if (!taskDate) return;

            const clientName = t.project_name || t.project || t.client || "";
            const taskTime =
              t.time || t.due_time || extractRealTime(t.due_date);

            const rawStatus = (t.status || "").toLowerCase().trim();
            const normalizedStatus =
              rawStatus === "completed" || rawStatus === "done"
                ? "Completed"
                : t.status || "In Progress";

            items.push({
              id: `task-${t.id}`,
              title: t.title || t.name || "Task",
              client: clientName,
              date: taskDate,
              time: taskTime || null,
              category: t.category || "Task",
              status: normalizedStatus,
              type: "task",
            });
          });
        }
      } catch {}

      setCalendarItems(items);
    } catch (err: any) {
      console.error("Calendar data error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateKey(toDateKey(today));
  };

  // Calendar Grid Cells (Sunday Start)
  const calendarGrid = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonthIndex, 1);
    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0,
    ).getDate();
    const startDayIndex = firstDayOfMonth.getDay();
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

    // Previous month
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

    // Current month
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

    // Next month padding
    const totalSlots = Math.ceil(cells.length / 7) * 7;
    const nextDaysCount = totalSlots - cells.length;

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

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarItem[]> = {};
    calendarItems.forEach((item) => {
      if (!map[item.date]) map[item.date] = [];
      map[item.date].push(item);
    });
    return map;
  }, [calendarItems]);

  const selectedDayEvents = useMemo(() => {
    return eventsByDate[selectedDateKey] || [];
  }, [eventsByDate, selectedDateKey]);

  // STRICT ORDINAL / CHRONOLOGICAL UPCOMING LIST
  // EXCLUDES COMPLETED & DONE ITEMS
  const upcomingEvents = useMemo(() => {
    const todayStr = toDateKey(new Date());

    return calendarItems
      .filter((item) => {
        const status = (item.status || "").toLowerCase().trim();
        const isCompleted = status === "completed" || status === "done";
        return item.date >= todayStr && !isCompleted;
      })
      .sort((a, b) => {
        // 1. Ordinal date order (ascending)
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        // 2. Time order if time exists
        if (a.time && b.time) {
          return a.time.localeCompare(b.time);
        }
        return a.time ? -1 : 1;
      })
      .slice(0, 6);
  }, [calendarItems]);

  const selectedDateFormatted = useMemo(() => {
    try {
      const [y, m, d] = selectedDateKey.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d);
      return {
        weekday: dateObj
          .toLocaleDateString("en-US", { weekday: "long" })
          .toUpperCase(),
        display: `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getDate()}`,
        isToday: selectedDateKey === toDateKey(new Date()),
      };
    } catch {
      return { weekday: "TODAY", display: "Selected Date", isToday: true };
    }
  }, [selectedDateKey]);

  // Relative ordinal label helper
  const getOrdinalDateLabel = (dateKey: string) => {
    const todayStr = toDateKey(new Date());
    if (dateKey === todayStr) return "Today";

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (dateKey === toDateKey(tomorrow)) return "Tomorrow";

    try {
      const [y, m, d] = dateKey.split("-").map(Number);
      return new Date(y, m - 1, d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateKey;
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    setIsSubmitting(true);
    try {
      const itemAmount = newEvent.amount ? parseFloat(newEvent.amount) : 0;
      const clientName = newEvent.client.trim();

      const projectPayload: any = {
        title: newEvent.title.trim(),
        client: clientName || null,
        category: newEvent.category,
        budget: itemAmount || null,
        status: newEvent.status,
        date: newEvent.date,
        time: newEvent.time.trim() || null,
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
        time: newEvent.time.trim() || null,
        category: newEvent.category,
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
        date: selectedDateKey,
        time: "",
        category: "Deliverable",
        status: "In Progress",
        amount: "",
      });
    } catch (err: any) {
      alert(`Could not schedule work: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans not-italic antialiased text-slate-900 space-y-6 pb-20 max-w-[1500px] mx-auto px-4 sm:px-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
            Calendar
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1 font-sans">
            Meetings, reviews and deadlines across the team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#2563eb] text-white font-medium text-sm transition shadow-sm font-sans"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Schedule</span>
          </button>

          <button
            onClick={handleToday}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 hover:bg-slate-50 text-slate-800 font-medium text-sm transition font-sans"
          >
            <CalendarIcon className="w-4 h-4 text-slate-700" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CALENDAR MAIN */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
              {MONTH_NAMES[currentMonthIndex]} {currentYear}
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4 text-center">
            {WEEKDAY_NAMES.map((day) => (
              <span
                key={day}
                className="text-xs font-semibold tracking-wider text-slate-400 uppercase font-sans"
              >
                {day}
              </span>
            ))}
          </div>

          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#2563eb]" />
              <span className="text-xs font-medium font-sans">
                Loading live calendar data...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-2">
              {calendarGrid.map((cell, idx) => {
                const dayEvents = eventsByDate[cell.dateKey] || [];
                const isSelected = cell.dateKey === selectedDateKey;

                return (
                  <div
                    key={`${cell.dateKey}-${idx}`}
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    className={`min-h-[105px] sm:min-h-[115px] p-2 rounded-2xl transition cursor-pointer flex flex-col justify-start relative select-none ${
                      isSelected
                        ? "border-2 border-[#2563eb] bg-white shadow-sm ring-2 ring-[#2563eb]/10"
                        : cell.isCurrentMonth
                          ? "bg-slate-50/50 hover:bg-slate-100/70 border border-transparent"
                          : "bg-slate-50/20 text-slate-300 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-start mb-1.5">
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-[#2563eb] text-white font-bold text-xs flex items-center justify-center font-sans">
                          {cell.dayNumber}
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-medium pl-1 font-sans ${
                            cell.isCurrentMonth
                              ? "text-slate-800"
                              : "text-slate-300"
                          }`}
                        >
                          {cell.dayNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 overflow-hidden">
                      {dayEvents.slice(0, 2).map((item) => {
                        const color = getEventColor(item.title);
                        const status = (item.status || "").toLowerCase().trim();
                        const isCompleted =
                          status === "completed" || status === "done";

                        return (
                          <div
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(item);
                            }}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-medium truncate cursor-pointer transition font-sans ${
                              color.bg
                            } ${color.text} hover:opacity-85 ${
                              isCompleted
                                ? "line-through opacity-70 decoration-slate-400"
                                : ""
                            }`}
                            title={`${item.title} (${item.status})`}
                          >
                            {item.title}
                          </div>
                        );
                      })}

                      {dayEvents.length > 2 && (
                        <span className="text-[9px] font-medium text-slate-400 pl-1 font-sans">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          {/* TODAY / SELECTED DAY */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb] font-sans">
                {selectedDateFormatted.isToday
                  ? `TODAY · ${selectedDateFormatted.weekday}`
                  : selectedDateFormatted.weekday}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5 font-sans tracking-tight">
                {selectedDateFormatted.display}
              </h3>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl p-4">
                <p className="text-xs font-medium font-sans">
                  No events scheduled for this day
                </p>
                <button
                  onClick={() => {
                    setNewEvent((prev) => ({ ...prev, date: selectedDateKey }));
                    setShowAddModal(true);
                  }}
                  className="mt-2 text-xs font-semibold text-[#2563eb] hover:underline font-sans"
                >
                  + Add deliverable
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {selectedDayEvents.map((item) => {
                  const color = getEventColor(item.title);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`relative bg-slate-50/70 hover:bg-slate-100/80 p-4 rounded-2xl border border-slate-100 transition cursor-pointer flex items-start gap-4 overflow-hidden border-l-4 ${color.border}`}
                    >
                      <div className="text-[11px] font-medium text-slate-500 min-w-[55px] pt-0.5 font-sans">
                        {item.time ? (
                          item.time
                        ) : (
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>All-day</span>
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate font-sans tracking-tight">
                          {item.title}
                        </h4>

                        {item.client && (
                          <p className="text-xs text-[#2563eb] font-medium mt-0.5 truncate font-sans">
                            {item.client}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 mt-2.5">
                          {item.client && (
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold flex items-center justify-center font-sans">
                              {item.client.substring(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-medium font-sans">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COMING UP: EXCLUDES COMPLETED DELIVERABLES */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
            <h3 className="text-base font-bold text-slate-900 mb-4 font-sans tracking-tight">
              Coming up
            </h3>

            {upcomingEvents.length === 0 ? (
              <div className="py-6 text-center text-slate-400 font-sans">
                <p className="text-xs font-medium">
                  All caught up! No pending work.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((item) => {
                  const parts = item.date.split("-");
                  const monthShort = parts[1]
                    ? MONTH_NAMES[parseInt(parts[1], 10) - 1]
                        ?.slice(0, 3)
                        .toUpperCase()
                    : "OCT";
                  const dayNum = parts[2] ? parseInt(parts[2], 10) : "01";

                  const ordinalLabel = getOrdinalDateLabel(item.date);
                  const detailInfo = [ordinalLabel, item.time, item.client]
                    .filter(Boolean)
                    .join(" · ");

                  return (
                    <div
                      key={`upcoming-${item.id}`}
                      onClick={() => setSelectedItem(item)}
                      className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition cursor-pointer font-sans"
                    >
                      {/* Date Badge */}
                      <div className="w-10 h-11 rounded-xl bg-slate-100/90 text-slate-700 flex flex-col items-center justify-center shrink-0 border border-slate-200/50">
                        <span className="text-[9px] font-bold text-slate-500 uppercase leading-none font-sans">
                          {monthShort}
                        </span>
                        <span className="text-sm font-extrabold text-slate-800 leading-tight font-sans">
                          {dayNum}
                        </span>
                      </div>

                      {/* Authentic Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate font-sans tracking-tight">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 font-sans">
                          {detailInfo}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl max-w-sm w-full space-y-4 font-sans">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  {selectedItem.type}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5 font-sans">
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

            <div className="space-y-2.5 text-xs font-sans">
              {selectedItem.client && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    Client / Project:
                  </span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-emerald-800" />
                    <span>{selectedItem.client}</span>
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Scheduled Date:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedItem.date}{" "}
                  {selectedItem.time ? `· ${selectedItem.time}` : ""}
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

              {selectedItem.amount !== undefined && selectedItem.amount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Amount:</span>
                  <span className="font-bold text-slate-900">
                    ₹{selectedItem.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100">
              {selectedItem.projectId ? (
                <Link
                  href={`/dashboard/freelancer/projects/${selectedItem.projectId}`}
                  className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition font-sans"
                >
                  <span>Open in Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition font-sans"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl max-w-md w-full space-y-4 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
                <CalendarIcon className="w-4 h-4 text-emerald-800" />
                <span>Schedule Work</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateEvent}
              className="space-y-3.5 font-sans"
            >
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Presentation"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Client / Project (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Food & Link"
                  value={newEvent.client}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, client: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 am"
                    value={newEvent.time}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, time: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4 font-sans"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save to Calendar</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
