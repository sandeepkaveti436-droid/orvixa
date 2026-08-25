"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  Plus,
  ArrowUpRight,
  Loader2,
  Building,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch real projects from Supabase
      const { data: projData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (projData) {
        setProjects(projData);
      }

      // 2. Fetch tasks if tasks table exists
      try {
        const { data: taskData } = await supabase
          .from("tasks")
          .select("*")
          .eq("status", "Pending");
        if (taskData) setTasks(taskData);
      } catch (e) {
        // Ignored if tasks table is not yet created
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. CHANGE STATUS (On Hold, Cancelled, In Progress, etc.) ---
  const handleStatusChange = async (
    projectId: string | number,
    newStatus: string,
  ) => {
    setUpdatingId(projectId);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", projectId);

      if (error) throw error;

      // Update state locally immediately
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)),
      );
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- 2. DELETE PROJECT PERMANENTLY ---
  const handleDeleteProject = async (
    projectId: string | number,
    name: string,
  ) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}" permanently?`,
    );
    if (!confirmDelete) return;

    setDeletingId(projectId);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      // Remove from UI immediately
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err: any) {
      alert(`Failed to delete project: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  // --- LIVE STAT CALCULATIONS ---
  // 1. Active Projects = In Progress or Under Review
  const activeProjects = projects.filter((p) =>
    ["in progress", "under review"].includes(
      (p.status || "").toLowerCase().trim(),
    ),
  );

  // 2. On Hold / Payment Issues Count
  const onHoldCount = projects.filter((p) =>
    (p.status || "").toLowerCase().includes("hold"),
  ).length;

  // 3. Unique Active Clients count
  const uniqueClients = Array.from(
    new Set(projects.map((p) => (p.client || "").trim()).filter(Boolean)),
  );
  const activeClientsCount = uniqueClients.length;

  // 4. Total Pipeline Value in Indian Rupees (₹) excluding cancelled
  const totalProjectValue = projects
    .filter((p) => (p.status || "").toLowerCase() !== "cancelled")
    .reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0);

  // 5. Pending Tasks count
  const pendingTasksCount = tasks.length;

  // Status Badge Styling Helper
  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("hold")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (s.includes("cancel") || s.includes("stopped")) {
      return "bg-red-50 text-red-700 border-red-200";
    }
    if (s.includes("complete")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s.includes("review")) {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-blue-50 text-[#0047AB] border-blue-200";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Live Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* WELCOME HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#0047AB] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            ● Orvixa Freelancer OS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            <span>Welcome, </span>
            <span className="font-heading italic text-[#0047AB]">
              skynovadigitals
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time overview of active projects, clients, and earnings in ₹
            INR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/freelancer/projects"
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase text-slate-400 mr-2 tracking-wider">
          Quick Actions:
        </span>
        <Link
          href="/dashboard/freelancer/projects"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Project
        </Link>
        <Link
          href="/dashboard/freelancer/clients"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Client
        </Link>
        <Link
          href="/dashboard/freelancer/tasks"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" /> Task
        </Link>
      </div>

      {/* --- LIVE STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Active Projects
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {activeProjects.length} Active
          </div>
          <span className="text-[11px] font-bold text-emerald-600">
            ✓ Workspace Synced
          </span>
        </div>

        {/* Active Clients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Active Clients
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {activeClientsCount}{" "}
            {activeClientsCount === 1 ? "Client" : "Clients"}
          </div>
          <span className="text-[11px] font-bold text-slate-500">
            From Real Projects
          </span>
        </div>

        {/* On Hold / Payment Issues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            On Hold / Issues
          </span>
          <div className="text-2xl font-black text-amber-600 mb-1">
            {onHoldCount} Projects
          </div>
          <span className="text-[11px] font-bold text-amber-600">
            Payment / Paused
          </span>
        </div>

        {/* Total Project Value (Indian Rupees ₹) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Total Pipeline Value
          </span>
          <div className="text-2xl font-black text-[#0047AB] mb-1">
            ₹{totalProjectValue.toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] font-bold text-emerald-600">
            ✓ Total Project Budgets
          </span>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Pending Invoices
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">₹0.00</div>
          <span className="text-[11px] font-bold text-amber-600">
            Awaiting payment
          </span>
        </div>

        {/* Hours Tracked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Hours Tracked
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">0h 0m</div>
          <span className="text-[11px] font-bold text-slate-400">
            Logged Hours
          </span>
        </div>
      </div>

      {/* RECENT PROJECTS & CLIENT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#0047AB]" />
              <span>All Projects ({projects.length})</span>
            </h3>
            <Link
              href="/dashboard/freelancer/projects"
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
            >
              View Grid <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 6).map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Link
                      href={`/dashboard/freelancer/projects/${proj.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-[#0047AB] transition"
                    >
                      {proj.name}
                    </Link>

                    {/* STATUS SELECTOR */}
                    <select
                      value={proj.status || "In Progress"}
                      disabled={updatingId === proj.id}
                      onChange={(e) =>
                        handleStatusChange(proj.id, e.target.value)
                      }
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-none ${getStatusBadge(
                        proj.status,
                      )}`}
                    >
                      <option value="In Progress">🟢 In Progress</option>
                      <option value="On Hold (Payment Pending)">
                        🟠 On Hold (Payment Issue)
                      </option>
                      <option value="Under Review">🟣 Under Review</option>
                      <option value="Completed">🔵 Completed</option>
                      <option value="Cancelled">🔴 Cancelled / Stopped</option>
                    </select>

                    {updatingId === proj.id && (
                      <Loader2 className="w-3 h-3 animate-spin text-[#0047AB]" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Client:{" "}
                      <strong className="text-slate-700">{proj.client}</strong>
                    </span>
                    {proj.due_date && (
                      <span className="text-slate-400 ml-2">
                        • Due: {proj.due_date}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="text-sm font-black text-[#0047AB]">
                    ₹{Number(proj.budget || 0).toLocaleString("en-IN")}
                  </span>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.name)}
                    disabled={deletingId === proj.id}
                    title="Delete Project Permanently"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    {deletingId === proj.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No active projects yet. Create one to see live data here.
              </div>
            )}
          </div>
        </div>

        {/* Client Summary Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0047AB]" />
              <span>Clients Summary</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {activeClientsCount} Total
            </span>
          </div>

          <div className="space-y-2.5">
            {uniqueClients.map((clientName, index) => {
              const clientProjects = projects.filter(
                (p) => p.client === clientName,
              );
              const hasHold = clientProjects.some((p) =>
                (p.status || "").toLowerCase().includes("hold"),
              );

              return (
                <div
                  key={index}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clientName}</span>
                    {hasHold && (
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">
                        Hold
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                    {clientProjects.length}{" "}
                    {clientProjects.length === 1 ? "Project" : "Projects"}
                  </span>
                </div>
              );
            })}

            {uniqueClients.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No clients found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
