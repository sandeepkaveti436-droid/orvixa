"use client";

import React from "react";
import { Activity, Clock, CheckCircle2 } from "lucide-react";

export default function ActivityPage() {
  const logs = [
    {
      id: 1,
      user: "Sarah Jenkins",
      action: "Completed task 'Figma Design System Tokens'",
      time: "10 mins ago",
    },
    {
      id: 2,
      user: "Alex Mercer",
      action: "Merged Pull Request #42 into main branch",
      time: "25 mins ago",
    },
    {
      id: 3,
      user: "Priya Sharma",
      action: "Clocked in for workday (08h 15m session)",
      time: "1 hour ago",
    },
    {
      id: 4,
      user: "David Kim",
      action: "Updated database RLS security policies",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Activity & Attendance Monitor
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Real-time team execution feeds and clock-in logs.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Live Audit Feed</span>
          </h2>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
            ● 28 Members Active Now
          </span>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
            >
              <div className="flex items-center gap-3 font-sans">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-slate-900 font-sans">
                    {log.user}:{" "}
                  </strong>
                  <span className="text-slate-600 font-sans">{log.action}</span>
                </div>
              </div>
              <span className="text-slate-400 font-mono text-[11px] font-sans">
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
