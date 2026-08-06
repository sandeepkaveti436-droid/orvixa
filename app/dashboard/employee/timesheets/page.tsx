"use client";

import React from "react";
import { Clock, CheckCircle2, Download } from "lucide-react";

export default function EmployeeTimesheetsPage() {
  const logs = [
    {
      day: "Monday, Aug 03",
      clockIn: "09:00 AM",
      clockOut: "05:15 PM",
      total: "08h 15m",
      status: "Verified",
    },
    {
      day: "Tuesday, Aug 04",
      clockIn: "08:55 AM",
      clockOut: "05:00 PM",
      total: "08h 05m",
      status: "Verified",
    },
    {
      day: "Wednesday, Aug 05",
      clockIn: "09:02 AM",
      clockOut: "05:30 PM",
      total: "08h 28m",
      status: "Verified",
    },
    {
      day: "Thursday, Aug 06",
      clockIn: "09:00 AM",
      clockOut: "05:00 PM",
      total: "08h 00m",
      status: "Verified",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Timesheets & Punch Logs
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            View your verified daily clock-in/clock-out logs and total billable
            work hours.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading Timesheet CSV...")}
          className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans"
        >
          <Download className="w-4 h-4" />
          <span>Export Timesheet</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-[#0047AB]" />
            <span>Weekly Work Hours Log</span>
          </h2>
          <span className="text-xs font-bold text-[#0047AB] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full font-sans">
            Total: 32h 48m
          </span>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {logs.map((log) => (
            <div
              key={log.day}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 font-sans">
                  {log.day}
                </div>
                <div className="text-slate-400 font-sans">
                  Clock In: {log.clockIn} • Clock Out: {log.clockOut}
                </div>
              </div>

              <div className="flex items-center gap-4 font-sans">
                <span className="font-mono font-bold text-sm text-slate-900 font-sans">
                  {log.total}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 font-sans">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
