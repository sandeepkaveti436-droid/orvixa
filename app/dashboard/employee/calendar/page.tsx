"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);

  // Dynamic Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    async function fetchCalendarData() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          const myName = profile?.full_name || user.email?.split("@")[0];

          // Fetch ONLY real tasks assigned to this employee
          const { data: myTasks } = await supabase
            .from("organization_tasks")
            .select("*")
            .ilike("assignee", `%${myName}%`);

          if (myTasks) setTasks(myTasks);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalendarData();
  }, []);

  // Calendar Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Dynamic Calendar Computations
  const monthNames = [
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
  const currentMonthName = monthNames[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(
    currentYear,
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Calendar...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Calendar & Schedule
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Your daily task deadlines and meetings mapped out from the database.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        {/* Dynamic Month/Year Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            {currentMonthName} {currentYear}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border rounded-xl transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="py-2 font-sans">
              {d}
            </div>
          ))}
        </div>

        {/* Dynamic Month Grid Cells */}
        <div className="grid grid-cols-7 gap-2 text-xs font-semibold min-h-[384px] font-sans">
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNum = i + 1;

            // Map ONLY real DB tasks to this specific day (no fake scattering)
            const dayTasks = tasks.filter((t) => {
              if (!t.due_date) return false;

              // Parse standard dates (e.g., "2026-08-15")
              const taskDate = new Date(t.due_date);
              if (!isNaN(taskDate.getTime())) {
                return (
                  taskDate.getDate() === dayNum &&
                  taskDate.getMonth() === currentDate.getMonth() &&
                  taskDate.getFullYear() === currentDate.getFullYear()
                );
              }

              // Fallback for manual strings like "Aug 15"
              const match = String(t.due_date).match(/\d+/);
              if (match) {
                return parseInt(match[0], 10) === dayNum;
              }

              return false;
            });

            return (
              <div
                key={i}
                className="p-2 bg-slate-50/60 rounded-xl border border-slate-100 flex flex-col justify-start gap-1 text-left hover:bg-slate-100/50 transition-colors font-sans min-h-[80px]"
              >
                <span className="text-[10px] font-bold text-slate-400 font-sans mb-1">
                  {dayNum}
                </span>

                <div className="space-y-1 font-sans w-full">
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className="bg-[#9D00FF] text-white text-[9px] font-bold p-1 rounded line-clamp-1 shadow-xs font-sans w-full truncate"
                      title={t.title}
                    >
                      {t.title}
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
