"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Users,
  CheckSquare,
  IndianRupee,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  Loader2,
  Building,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

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
        // Ignored if tasks table not yet created
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- LIVE CALCULATIONS ---
  // 1. Active Projects count
  const activeProjectsCount = projects.filter(
    (p) => (p.status || "").toLowerCase() !== "completed",
  ).length;

  // 2. Unique Active Clients count (Calculates from projects automatically!)
  const uniqueClients = Array.from(
    new Set(projects.map((p) => (p.client || "").trim()).filter(Boolean)),
  );
  const activeClientsCount = uniqueClients.length;

  // 3. Total Project Value / Billed in Indian Rupees (₹)
  const totalProjectValue = projects.reduce(
    (acc, curr) => acc + (Number(curr.budget) || 0),
    0,
  );

  // 4. Pending Tasks count
  const pendingTasksCount = tasks.length;

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
            {activeProjectsCount} Active
          </div>
          <span className="text-[11px] font-bold text-emerald-600">
            ✓ Workspace Synced
          </span>
        </div>

        {/* Active Clients (LIVE calculated from your projects!) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Active Clients
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {activeClientsCount}{" "}
            {activeClientsCount === 1 ? "Client" : "Clients"}
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            From Active Projects
          </span>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
            Pending Tasks
          </span>
          <div className="text-2xl font-black text-slate-900 mb-1">
            {pendingTasksCount} Tasks
          </div>
          <span className="text-[11px] font-bold text-slate-400">
            Task Deliverables
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

        {/* Invoices */}
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

      {/* RECENT PROJECTS & OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#0047AB]" />
              <span>Active Projects ({projects.length})</span>
            </h3>
            <Link
              href="/dashboard/freelancer/projects"
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((proj) => (
              <Link
                key={proj.id}
                href={`/dashboard/freelancer/projects/${proj.id}`}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white flex items-center justify-between transition group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-slate-900 group-hover:text-[#0047AB] transition">
                      {proj.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0047AB]">
                      {proj.status || "In Progress"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      Client:{" "}
                      <strong className="text-slate-700">{proj.client}</strong>
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-[#0047AB] block">
                    ₹{Number(proj.budget || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {proj.due_date ? `Due: ${proj.due_date}` : "Active"}
                  </span>
                </div>
              </Link>
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
              const clientProjectsCount = projects.filter(
                (p) => p.client === clientName,
              ).length;
              return (
                <div
                  key={index}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clientName}</span>
                  </div>
                  <span className="font-semibold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">
                    {clientProjectsCount}{" "}
                    {clientProjectsCount === 1 ? "Project" : "Projects"}
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
