"use client";

import React from "react";
import { Calendar as CalendarIcon, Clock, Video } from "lucide-react";

export default function EmployeeCalendarPage() {
  const events = [
    {
      time: "10:00 AM",
      title: "Sprint Release Meeting",
      type: "Zoom",
      status: "Confirmed",
    },
    {
      time: "02:30 PM",
      title: "UI Animation Code Review",
      type: "Orvixa Meet",
      status: "Upcoming",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Calendar & Schedule
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Your daily meetings, code reviews, and project deadlines.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <h3 className="font-bold text-lg text-slate-900 font-sans border-b border-slate-100 pb-3">
          Today's Schedule
        </h3>

        <div className="space-y-3 font-sans">
          {events.map((e, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between font-sans"
            >
              <div className="flex items-center gap-3.5 font-sans">
                <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold text-xs">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 font-sans">
                    {e.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 font-sans">
                    {e.time} • {e.type}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-sans">
                {e.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
