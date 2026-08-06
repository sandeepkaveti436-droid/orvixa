"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Play,
  Pause,
  Square,
  Plus,
  Download,
  FileText,
  Calendar,
} from "lucide-react";

export default function TimeTrackerPage() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [reportTab, setReportTab] = useState<"daily" | "weekly" | "monthly">(
    "weekly",
  );
  const [activeProject, setActiveProject] = useState(
    "Acme Corp iOS App Redesign",
  );

  const [timeLogs] = useState([
    {
      id: 1,
      project: "Acme Corp iOS App Redesign",
      task: "Figma Component System",
      duration: "03h 45m",
      date: "Today",
      billable: "$300.00",
    },
    {
      id: 2,
      project: "Stripe API Integration",
      task: "Webhook Endpoint Testing",
      duration: "02h 30m",
      date: "Yesterday",
      billable: "$187.50",
    },
    {
      id: 3,
      project: "Brand Identity Package",
      task: "Logo Export Asset Package",
      duration: "04h 15m",
      date: "Aug 03",
      billable: "$340.00",
    },
  ]);

  // Live Timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleExport = (type: "csv" | "pdf") => {
    alert(
      `Exporting ${reportTab} time logs as ${type.toUpperCase()}... Download generated!`,
    );
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Time Tracker & </span>
            <span className="font-heading italic text-[#0047AB]">
              Timesheets.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Log billable hours, generate daily/weekly reports, and export
            timesheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="bg-white border border-slate-300 hover:border-[#0047AB] text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-[#0047AB]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport("pdf")}
            className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* STOPWATCH TIMER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase text-slate-400">
            Live Stopwatch Timer
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-wider">
            {formatTime(seconds)}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 justify-center md:justify-start">
            <span>Project:</span>
            <select
              value={activeProject}
              onChange={(e) => setActiveProject(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#0047AB]"
            >
              <option>Acme Corp iOS App Redesign</option>
              <option>Stripe API Integration</option>
              <option>Brand Identity Package</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#0047AB]/25 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Timer</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md flex items-center gap-2"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={() => {
              setSeconds(0);
              setIsRunning(false);
            }}
            disabled={seconds === 0}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-sm flex items-center gap-2"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Timesheet Reports Tab */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0047AB]" />
            <span>Billable Hours Report</span>
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(["daily", "weekly", "monthly"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setReportTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg capitalize transition-all ${
                  reportTab === tab
                    ? "bg-white text-[#0047AB] shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {timeLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{log.project}</div>
                  <div className="text-slate-400">
                    {log.task} • {log.date}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-black text-sm text-[#0047AB]">
                  {log.billable}
                </div>
                <div className="text-[10px] text-slate-400 font-bold">
                  {log.duration}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
