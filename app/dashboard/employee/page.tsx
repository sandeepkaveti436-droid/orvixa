"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Coffee,
  Calendar,
  MessageSquare,
  Megaphone,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Employee");
  const [userRole, setUserRole] = useState("Team Member");

  // Real Database Data
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([]);

  // Live Timer State
  const [clockedIn, setClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeAttendanceId, setActiveAttendanceId] = useState<string | null>(
    null,
  );

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchRealEmployeeData() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        let currentName = "Employee";

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, profession")
            .eq("id", user.id)
            .single();

          if (profile) {
            currentName =
              profile.full_name || user.email?.split("@")[0] || "Employee";
            setUserName(currentName);
            if (profile.profession) setUserRole(profile.profession);
          }
        }

        // Fetch Live DB Data Concurrent
        const [taskRes, projRes, annRes, attRes] = await Promise.all([
          supabase
            .from("organization_tasks")
            .select("*")
            .eq("assignee", currentName)
            .order("created_at", { ascending: false }),
          supabase
            .from("organization_projects")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("announcements")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(3),
          supabase
            .from("attendance")
            .select("*")
            .eq("user_name", currentName)
            .order("clock_in", { ascending: false }),
        ]);

        if (taskRes.data) setTasks(taskRes.data);
        if (projRes.data) setProjects(projRes.data);
        if (annRes.data) setAnnouncements(annRes.data);

        if (attRes.data) {
          setAttendanceLogs(attRes.data);
          // Check if currently clocked in
          const activeLog = attRes.data.find((log) => !log.clock_out);
          if (activeLog) {
            setClockedIn(true);
            setActiveAttendanceId(activeLog.id);
            // Calculate seconds elapsed since clock in
            const startTime = new Date(activeLog.clock_in).getTime();
            const now = new Date().getTime();
            setSeconds(Math.floor((now - startTime) / 1000));
          }
        }
      } catch (err) {
        console.error("Error loading workspace data");
      } finally {
        setLoading(false);
      }
    }

    fetchRealEmployeeData();
  }, []);

  // Live Ticker
  useEffect(() => {
    let interval: any = null;
    if (clockedIn && !isOnBreak) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [clockedIn, isOnBreak]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  // REAL SUPABASE PUNCH IN/OUT HANDLER
  const handlePunchToggle = async () => {
    if (!clockedIn) {
      // Punch In (Create new log)
      try {
        const { data } = await supabase
          .from("attendance")
          .insert([{ user_name: userName, status: "Active" }])
          .select()
          .single();

        if (data) {
          setClockedIn(true);
          setIsOnBreak(false);
          setSeconds(1);
          setActiveAttendanceId(data.id);
          setAttendanceLogs([data, ...attendanceLogs]);
        }
      } catch (err) {
        alert("Failed to clock in.");
      }
    } else {
      // Punch Out (Update existing log)
      if (
        confirm("Are you sure you want to Punch Out and log today's shift?")
      ) {
        try {
          if (activeAttendanceId) {
            await supabase
              .from("attendance")
              .update({
                clock_out: new Date().toISOString(),
                status: "Completed",
              })
              .eq("id", activeAttendanceId);
          }
          setClockedIn(false);
          setIsOnBreak(false);
          setSeconds(0);
          setActiveAttendanceId(null);
          alert("Shift logged successfully!");
          window.location.reload(); // Quick refresh to update tables
        } catch (err) {
          alert("Failed to log out.");
        }
      }
    }
  };

  const toggleTask = async (id: string | number) => {
    // Optimistic UI
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "In Progress" : "Completed",
            }
          : t,
      ),
    );

    // DB Sync
    try {
      const task = tasks.find((t) => t.id === id);
      if (task) {
        const nextStatus =
          task.status === "Completed" ? "In Progress" : "Completed";
        await supabase
          .from("organization_tasks")
          .update({ status: nextStatus })
          .eq("id", id);
      }
    } catch (e) {
      console.log("Synced task state");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return t.status !== "Completed";
    if (filter === "completed") return t.status === "Completed";
    return true;
  });

  const pendingTasksCount = tasks.filter(
    (t) => t.status !== "Completed",
  ).length;
  const completedTasksCount = tasks.filter(
    (t) => t.status === "Completed",
  ).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Workspace Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* 1. GREETING & SHIFT CONTROLS */}
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
            Welcome Back, {userName.split(" ")[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans capitalize">
            {userRole} • Orvixa Workspace
          </p>
        </div>

        {/* PUNCH IN / PUNCH OUT CONTROL CONSOLE */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4 font-sans">
          <div className="text-left font-sans pr-3 border-r border-slate-100 hidden sm:block">
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
            {pendingTasksCount} Tasks
          </div>
          <span className="text-xs text-slate-500 font-semibold block font-sans">
            Assigned to you
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Completed Today
          </span>
          <div className="text-2xl font-black text-emerald-600 font-sans">
            {completedTasksCount} Tasks
          </div>
          <span className="text-xs text-emerald-600 font-bold block font-sans">
            ✓ Quality pass
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Weekly Hours
          </span>
          <div className="text-2xl font-black text-slate-900 font-sans">
            {attendanceLogs.length * 8}h 0m
          </div>
          <span className="text-xs text-slate-500 font-semibold block font-sans">
            Tracked log count
          </span>
        </div>
      </div>

      {/* 3. AI COPILOT PRIORITY BANNER */}
      {pendingTasksCount > 0 && (
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
                "You have {pendingTasksCount} urgent tasks assigned. Starting
                them now is recommended to stay on schedule."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. REAL ASSIGNED TASKS CHECKLIST */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
            <span>My Assigned Tasks ({pendingTasksCount} Pending)</span>
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
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length > 0 ? (
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
                      task.status === "Completed"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {task.status === "Completed" && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`font-bold text-sm font-sans ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-900"}`}
                    >
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-1 font-sans">
                      <span>
                        Project:{" "}
                        <strong className="text-slate-700 font-sans">
                          {task.department || "General"}
                        </strong>
                      </span>
                      <span>•</span>
                      <span>
                        Priority:{" "}
                        <strong className="text-slate-700 font-sans">
                          {task.priority}
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
        ) : (
          <div className="text-center py-10 text-slate-400 font-sans">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">
              No assigned tasks right now. Great job!
            </p>
          </div>
        )}
      </div>

      {/* 5. REAL ORG PROJECTS & COMPANY ANNOUNCEMENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left: Real Org Projects Progress (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <FolderKanban className="w-4 h-4 text-[#0047AB]" />
              <span>Active Org Projects</span>
            </h2>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-3.5 font-sans">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-sans"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900 font-sans">
                      {p.name}
                    </span>
                    <span className="text-xs font-black text-[#0047AB] font-sans">
                      {p.progress}% Done
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${p.progress}%` }}
                      className="bg-[#0047AB] h-full rounded-full"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block font-sans">
                    Dept: {p.department}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 font-sans text-xs font-semibold">
              No active projects to display.
            </div>
          )}
        </div>

        {/* Right: Real Company Announcements (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <Megaphone className="w-4 h-4 text-[#0047AB]" />
              <span>Announcements</span>
            </h2>
          </div>

          {announcements.length > 0 ? (
            <div className="space-y-3 font-sans">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 font-sans"
                >
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 font-sans">
                    <span>From: {a.author}</span>
                    <span>{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 font-sans">
                    {a.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 font-medium font-sans leading-relaxed">
                    {a.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 font-sans text-xs font-semibold">
              No recent announcements.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
