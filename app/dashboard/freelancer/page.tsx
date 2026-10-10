"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Calendar,
  IndianRupee,
  Users,
  AlertCircle,
  FileText,
  Loader2,
  CalendarDays,
  Bell,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [projRes, taskRes] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (taskRes.data) setTasks(taskRes.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 1. Live Metrics
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    // Assigned / In-Progress Tasks
    const pendingTasks = tasks.filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s !== "done" && s !== "completed";
    }).length;

    // Financial Pipeline (Sum of project budgets in INR)
    let totalPipeline = 0;
    let completedRevenue = 0;
    let inProgressRevenue = 0;
    let overdueRevenue = 0;

    projects.forEach((p) => {
      const budget = parseFloat(String(p.budget)) || 0;
      totalPipeline += budget;

      const s = (p.status || "").toLowerCase();
      if (s === "completed" || p.payment_status === "paid") {
        completedRevenue += budget;
      } else if (s === "on hold" || s === "stopped") {
        overdueRevenue += budget;
      } else {
        inProgressRevenue += budget;
      }
    });

    const uniqueClients = new Set(
      projects.map((p) => p.client?.trim()).filter(Boolean),
    ).size;

    return {
      totalProjects,
      totalTasks,
      pendingTasks,
      totalPipeline,
      completedRevenue,
      inProgressRevenue,
      overdueRevenue,
      uniqueClients,
    };
  }, [projects, tasks]);

  // 2. Today's Items
  const todayStr = new Date().toISOString().split("T")[0];

  const todaysTasks = useMemo(() => {
    return tasks.filter((t) => {
      const d = t.due_date || t.date;
      return d && String(d).startsWith(todayStr);
    });
  }, [tasks, todayStr]);

  const todaysProjects = useMemo(() => {
    return projects.filter((p) => {
      const d = p.date || p.due_date || p.deadline;
      return d && String(d).startsWith(todayStr);
    });
  }, [projects, todayStr]);

  return (
    <div className="font-sans space-y-6 pb-20 text-slate-900 not-italic">
      {/* 1. TOP 4 INTERACTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CARD 1: Total Project -> /projects */}
        <Link
          href="/dashboard/freelancer/projects"
          className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                Total Project
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Active
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#9D00FF]/10 group-hover:text-[#9D00FF] flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-3xl font-black text-slate-900 group-hover:text-[#9D00FF] transition-colors tabular-nums">
                {loading ? "..." : metrics.totalProjects}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>All registered projects</span>
            <span className="text-[#9D00FF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View Workflows →
            </span>
          </div>
        </Link>

        {/* CARD 2: Total Task -> /tasks */}
        <Link
          href="/dashboard/freelancer/tasks"
          className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                Total Task
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                  Tracked
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#9D00FF]/10 group-hover:text-[#9D00FF] flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-3xl font-black text-slate-900 group-hover:text-[#9D00FF] transition-colors tabular-nums">
                {loading ? "..." : metrics.totalTasks}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>All workspace deliverables</span>
            <span className="text-[#9D00FF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Open Board →
            </span>
          </div>
        </Link>

        {/* CARD 3: Assigned Task -> /tasks */}
        <Link
          href="/dashboard/freelancer/tasks"
          className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                Assigned Task
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
                  Pending
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#9D00FF]/10 group-hover:text-[#9D00FF] flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-3xl font-black text-slate-900 group-hover:text-[#9D00FF] transition-colors tabular-nums">
                {loading ? "..." : metrics.pendingTasks}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Tasks in progress</span>
            <span className="text-[#9D00FF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              View Tasks →
            </span>
          </div>
        </Link>

        {/* CARD 4: Total Pipeline -> /clients */}
        <Link
          href="/dashboard/freelancer/clients"
          className="group relative bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                Total Pipeline
              </span>
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-[#9D00FF] border border-purple-200/60">
                  ₹ INR
                </span>
                <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-[#9D00FF]/10 group-hover:text-[#9D00FF] flex items-center justify-center transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>

            <div className="mt-3">
              <h2 className="text-3xl font-black text-[#9D00FF] tabular-nums tracking-tight">
                {loading
                  ? "..."
                  : `₹${metrics.totalPipeline.toLocaleString("en-IN")}`}
              </h2>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>{metrics.uniqueClients} Total Clients</span>
            <span className="text-[#9D00FF] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Client Directory →
            </span>
          </div>
        </Link>
      </div>

      {/* 2. MIDDLE ROW: TODAY'S TASKS, TODAY'S MEETINGS, PROJECT WORK */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Today&apos;s Tasks
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  {todaysTasks.length}
                </span>
              </div>
              <Link
                href="/dashboard/freelancer/tasks"
                className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </Link>
            </div>

            <div className="mt-4 space-y-2">
              {todaysTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs font-medium">
                    No tasks today. Click &quot;Add&quot; above.
                  </p>
                </div>
              ) : (
                todaysTasks.slice(0, 3).map((task) => (
                  <Link
                    key={task.id}
                    href="/dashboard/freelancer/tasks"
                    className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition flex items-center justify-between group"
                  >
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {task.title || task.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#9D00FF]">
                      {task.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-right">
            <Link
              href="/dashboard/freelancer/tasks"
              className="text-xs font-bold text-slate-600 hover:text-[#9D00FF] transition inline-flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Today's Meetings / Schedule */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Today&apos;s Meetings
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                  {todaysProjects.length}
                </span>
              </div>
              <Link
                href="/dashboard/freelancer/calendar"
                className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Schedule</span>
              </Link>
            </div>

            <div className="mt-4">
              {todaysProjects.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <p className="text-xs font-medium">
                    No scheduled calls today.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todaysProjects.slice(0, 3).map((proj) => (
                    <div
                      key={proj.id}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {proj.title || proj.name}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {proj.client || "Client"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4">
            <Link
              href="/dashboard/freelancer/calendar"
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule meeting</span>
            </Link>
          </div>
        </div>

        {/* Project Work (Radial indicator) */}
        <Link
          href="/dashboard/freelancer/projects"
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9D00FF] transition-colors">
              Project Work
            </h3>
            <span className="text-xs font-medium text-slate-400">
              {metrics.totalProjects} Total
            </span>
          </div>

          <div className="py-8 flex flex-col items-center justify-center">
            {/* Circular Ring Indicator */}
            <div className="relative w-28 h-28 rounded-full border-8 border-slate-100 group-hover:border-purple-100 flex flex-col items-center justify-center transition-colors">
              <span className="text-2xl font-black text-slate-900 group-hover:text-[#9D00FF] transition-colors tabular-nums">
                {metrics.totalProjects}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Projects
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-[#9D00FF] transition-colors">
              {metrics.totalProjects === 0
                ? "No active projects"
                : "Open Workspaces & Folders →"}
            </span>
          </div>
        </Link>
      </div>

      {/* 3. BOTTOM ROW: REVENUE OVERVIEW, TIMELINE, REMINDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Invoice / Revenue Overview */}
        <Link
          href="/dashboard/freelancer/invoices"
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9D00FF] transition-colors">
                Invoice / Revenue Overview
              </h3>
              <span className="text-sm font-black text-[#9D00FF] tabular-nums">
                ₹{metrics.totalPipeline.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {/* Overdue */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-purple-700">
                  Overdue / On Hold
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  ₹{metrics.overdueRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 w-[15%]" />
              </div>

              {/* In Progress */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-purple-700">
                  In Progress Active
                </span>
                <span className="text-xs font-bold text-slate-900 tabular-nums">
                  ₹{metrics.inProgressRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[45%]" />
              </div>

              {/* Completed */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-emerald-600">
                  Fully Completed
                </span>
                <span className="text-xs font-bold text-emerald-600 tabular-nums">
                  ₹{metrics.completedRevenue.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[40%]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#9D00FF]">
            <span>Manage billing & invoices</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Schedule Timeline */}
        <Link
          href="/dashboard/freelancer/calendar"
          className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-[#9D00FF] hover:shadow-lg hover:shadow-[#9D00FF]/15 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#9D00FF] transition-colors">
                Schedule Timeline
              </h3>
              <span className="text-xs font-medium text-slate-400">Today</span>
            </div>

            <div className="py-12 text-center text-slate-400">
              <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2 group-hover:text-[#9D00FF] transition-colors" />
              <p className="text-xs font-medium">
                No scheduled timeline items.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-[#9D00FF]">
            <span>Open Calendar Schedule</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Reminders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Reminders</h3>
              <button
                onClick={() => alert("Reminder feature: Syncing with alerts")}
                className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add</span>
              </button>
            </div>

            <div className="py-12 text-center text-slate-400">
              <p className="text-xs font-medium">No active reminders.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => alert("Create reminder modal")}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reminder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
