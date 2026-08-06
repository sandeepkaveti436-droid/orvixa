"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  Calendar,
  ArrowRight,
  Coffee,
  Play,
  Square,
  Check,
} from "lucide-react";

export default function EmployeeDashboardPage() {
  const [clockedIn, setClockedIn] = useState(false); // Starts OFF shift when logging in!
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [seconds, setSeconds] = useState(0); // Starts at 0 seconds
  const [filter, setFilter] = useState("all");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Implement UI Animation for FAQ Accordion",
      project: "Next.js Web App",
      assignedBy: "Alex Mercer",
      dueDate: "Today",
      status: "In Progress",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Review Pull Request #42 for Next.js App",
      project: "Engineering Sprint",
      assignedBy: "AI Copilot Triage",
      dueDate: "Today",
      status: "In Progress",
      priority: "Urgent",
      completed: false,
    },
    {
      id: 3,
      title: "Update Figma Design System Color Tokens",
      project: "Design System",
      assignedBy: "Sarah Jenkins",
      dueDate: "Tomorrow",
      status: "To Do",
      priority: "Medium",
      completed: false,
    },
    {
      id: 4,
      title: "Audit Database RLS Security Policies",
      project: "Security Audit",
      assignedBy: "Alex Mercer",
      dueDate: "Aug 10",
      status: "Completed",
      priority: "High",
      completed: true,
    },
  ]);

  const [timesheetLogs, setTimesheetLogs] = useState([
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
  ]);

  // Punch In Timer
  useEffect(() => {
    let interval: any = null;
    if (clockedIn && !isOnBreak) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [clockedIn, isOnBreak]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  // Punch In / Punch Out Handler
  const handlePunchToggle = () => {
    if (!clockedIn) {
      // Punch In
      setClockedIn(true);
      setIsOnBreak(false);
      if (seconds === 0) setSeconds(1);
    } else {
      // Punch Out
      if (
        confirm("Are you sure you want to Punch Out and log today's shift?")
      ) {
        setTimesheetLogs([
          {
            day: "Today (Thursday)",
            clockIn: "09:00 AM",
            clockOut: "Just Now",
            total: formatTime(seconds),
            status: "Verified",
          },
          ...timesheetLogs,
        ]);
        setClockedIn(false);
        setIsOnBreak(false);
        setSeconds(0);
      }
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              status: !t.completed ? "Completed" : "In Progress",
            }
          : t,
      ),
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* 1. GREETING & PUNCH IN / PUNCH OUT BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2 font-sans">
            <span
              className={`w-2 h-2 rounded-full ${clockedIn ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
            />
            <span>
              {clockedIn
                ? "Shift Active • Clocked In"
                : "Off Shift • Please Punch In"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-sans">
            Welcome Back, John 👋
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Senior Frontend Engineer • Orvixa Engineering Team
          </p>
        </div>

        {/* PUNCH IN / PUNCH OUT CONTROL CONSOLE */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 font-sans">
          <div className="text-left font-sans pr-3 border-r border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
              Shift Timer
            </span>
            <span className="font-mono text-sm font-black text-slate-900 font-sans">
              {formatTime(seconds)}
            </span>
          </div>

          {clockedIn && (
            <button
              onClick={() => setIsOnBreak(!isOnBreak)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 font-sans ${
                isOnBreak
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{isOnBreak ? "Resume Shift" : "Take Break"}</span>
            </button>
          )}

          <button
            onClick={handlePunchToggle}
            className={`px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2 font-sans ${
              clockedIn
                ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
                : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>
              {clockedIn ? "🔴 Punch Out Shift" : "🟢 Punch In Workday"}
            </span>
          </button>
        </div>
      </div>

      {/* 2. DAILY WORK METRICS (4 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Shift Duration
          </span>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {formatTime(seconds)}
          </div>
          <span className="text-xs text-emerald-600 font-bold block font-sans">
            {clockedIn ? "✓ Shift Active" : "Off Shift"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Pending Tasks
          </span>
          <div className="text-2xl font-black text-[#0047AB] font-sans">
            {tasks.filter((t) => !t.completed).length} Tasks
          </div>
          <span className="text-xs text-slate-500 font-semibold block font-sans">
            2 Due Today
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Completed Today
          </span>
          <div className="text-2xl font-black text-emerald-600 font-sans">
            {tasks.filter((t) => t.completed).length} Completed
          </div>
          <span className="text-xs text-emerald-600 font-bold block font-sans">
            ✓ 100% Quality Pass
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Weekly Hours
          </span>
          <div className="text-2xl font-black text-slate-900 font-sans">
            32h 45m
          </div>
          <span className="text-xs text-slate-500 font-semibold block font-sans">
            On track for 40h goal
          </span>
        </div>
      </div>

      {/* 3. AI COPILOT PRIORITY BANNER */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 sm:p-6 rounded-2xl border border-blue-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 text-left font-sans">
          <div className="w-10 h-10 rounded-xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0047AB]/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-sans">
              AI Daily Task Priority
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5 font-sans">
              "Review Pull Request #42 has been auto-prioritized based on
              today's engineering sprint release deadline."
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/employee/tasks"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0 font-sans"
        >
          Start Priority Task →
        </Link>
      </div>

      {/* 4. MY ASSIGNED TASKS CHECKLIST */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
            <span>My Assigned Tasks ({filteredTasks.length})</span>
          </h2>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold font-sans">
            {[
              { id: "all", label: "All" },
              { id: "pending", label: "Pending" },
              { id: "completed", label: "Completed" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 rounded-lg transition-all font-sans ${
                  filter === tab.id
                    ? "bg-white text-[#0047AB] shadow-sm"
                    : "text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 font-sans">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-100/60 transition-colors font-sans"
            >
              <div className="flex items-start gap-3 font-sans">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <h3
                    className={`font-bold text-sm font-sans ${
                      task.completed
                        ? "line-through text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-1 font-sans">
                    <span>
                      Project:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.project}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Assigned by:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.assignedBy}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Due:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.dueDate}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 font-sans ${
                  task.priority === "Urgent"
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : task.priority === "High"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-blue-50 text-[#0047AB] border border-blue-200"
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. WEEKLY TIMESHEETS LOGS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-[#0047AB]" />
            <span>Weekly Punch-In Timesheet Logs</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {timesheetLogs.map((log) => (
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
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
