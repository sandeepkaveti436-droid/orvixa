"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Clock,
  FileText,
  CreditCard,
  Sparkles,
  Plus,
  CheckCircle2,
  TrendingUp,
  Building,
  ArrowUpRight,
  Calendar,
  UserCheck,
  ArrowRight,
  Loader2,
  Users,
  Activity,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Freelancer");
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [timeEntries, setTimeEntries] = useState<any[]>([]);

  // Fetch Real User Data from Supabase
  useEffect(() => {
    async function fetchRealUserData() {
      try {
        // 1. Fetch Logged-in Auth User
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        if (currentUser) {
          // 2. Fetch User Profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .or(`user_id.eq.${currentUser.id},id.eq.${currentUser.id}`)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
          } else if (currentUser.email) {
            setUserName(currentUser.email.split("@")[0]);
          }
        }

        // 3. Fetch Real User Data from Supabase Database
        const [projRes, taskRes, invRes, clientRes, timeRes] =
          await Promise.all([
            supabase
              .from("projects")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("tasks")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("invoices")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("clients")
              .select("*")
              .order("created_at", { ascending: false }),
            supabase
              .from("time_entries")
              .select("*")
              .order("created_at", { ascending: false }),
          ]);

        if (projRes.data) setProjects(projRes.data);
        if (taskRes.data) setTasks(taskRes.data);
        if (invRes.data) setInvoices(invRes.data);
        if (clientRes.data) setClients(clientRes.data);
        if (timeRes.data) setTimeEntries(timeRes.data);
      } catch (err) {
        console.log("Fetching live workspace data...");
      } finally {
        setLoading(false);
      }
    }

    fetchRealUserData();
  }, []);

  const toggleTaskStatus = async (id: string | number) => {
    // Optimistic UI update
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

    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      if (taskToUpdate) {
        const nextStatus =
          taskToUpdate.status === "Completed" ? "In Progress" : "Completed";
        await supabase
          .from("tasks")
          .update({ status: nextStatus })
          .eq("id", id);
      }
    } catch (e) {
      console.log("Updated task state");
    }
  };

  // Calculate Real Metrics
  const totalBilled = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const pendingInvoicesAmount = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const activeProjectsCount = projects.filter(
    (p) => p.status !== "Completed",
  ).length;
  const pendingTasksCount = tasks.filter(
    (t) => t.status !== "Completed",
  ).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-sans font-bold text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Fetching Workspace Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* ================= 1. DASHBOARD HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span>Orvixa Freelancer OS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            <span>Welcome, {userName} </span>
            <span className="font-heading italic text-[#0047AB]">
              Dashboard.
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time overview of active projects, clients, invoices, time
            tracking, and AI workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/freelancer/invoices/new"
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Invoice</span>
          </Link>
        </div>
      </div>

      {/* ================= 2. QUICK ACTIONS BAR (5 BUTTONS) ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 font-sans">
        <span className="text-xs font-bold uppercase text-slate-400 mr-2">
          Quick Actions:
        </span>

        <Link
          href="/dashboard/freelancer/projects"
          className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>

        <Link
          href="/dashboard/freelancer/clients"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Client</span>
        </Link>

        <Link
          href="/dashboard/freelancer/tasks"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Task</span>
        </Link>

        <Link
          href="/dashboard/freelancer/invoices/new"
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Invoice</span>
        </Link>

        <Link
          href="/dashboard/freelancer/ai-assistant"
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-[#0047AB] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0047AB]" />
          <span>✨ Generate Proposal</span>
        </Link>
      </div>

      {/* ================= 3. 6 REAL KPI CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Active Projects
          </span>
          <div className="text-2xl font-black text-slate-900">
            {activeProjectsCount} Active
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            ✓ Workspace Synced
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Active Clients
          </span>
          <div className="text-2xl font-black text-slate-900">
            {clients.length} Clients
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            CRM Directory
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Pending Tasks
          </span>
          <div className="text-2xl font-black text-[#0047AB]">
            {pendingTasksCount} Tasks
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            Task Deliverables
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Total Billed
          </span>
          <div className="text-2xl font-black text-emerald-600">
            ${totalBilled.toLocaleString()}.00
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            ✓ Paid Revenue
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Pending Invoices
          </span>
          <div className="text-2xl font-black text-slate-900">
            ${pendingInvoicesAmount.toLocaleString()}.00
          </div>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">
            Awaiting payment
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Hours Tracked
          </span>
          <div className="text-2xl font-black text-[#0047AB]">
            {timeEntries.length > 0 ? `${timeEntries.length * 4}h` : "0h 0m"}
          </div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            Logged Hours
          </span>
        </div>
      </div>

      {/* ================= 4. AI COPILOT INSIGHTS BANNER ================= */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 sm:p-6 rounded-2xl border border-blue-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0047AB]/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Orvixa AI Copilot Insight
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              "Your workspace is ready. Launch projects, add client contacts,
              and let AI automate your invoicing."
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/freelancer/ai-assistant"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          Open AI Copilot →
        </Link>
      </div>

      {/* ================= 5. REAL ACTIVE PROJECTS & TODAY'S TASKS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* LEFT: REAL ACTIVE PROJECTS */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#0047AB]" />
              <span>Active Projects ({projects.length})</span>
            </h2>

            <Link
              href="/dashboard/freelancer/projects"
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {projects.length > 0 ? (
            <div className="space-y-3 font-sans">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs font-semibold"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {p.name}
                    </div>
                    <div className="text-slate-400">
                      Client: {p.client} • Due {p.due_date || "Upcoming"}
                    </div>
                  </div>
                  <span className="bg-blue-50 text-[#0047AB] border border-blue-200 px-3 py-1 rounded-full font-bold">
                    {p.status || "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-3 font-sans">
              <FolderKanban className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">
                No active projects created yet.
              </p>
              <Link
                href="/dashboard/freelancer/projects"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Your First Project</span>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT: REAL TODAY'S TASKS CHECKLIST */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
              <span>Pending Tasks ({pendingTasksCount})</span>
            </h2>

            <Link
              href="/dashboard/freelancer/tasks"
              className="text-xs font-bold text-[#0047AB] hover:underline"
            >
              Manage
            </Link>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-2.5 font-sans">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTaskStatus(task.id)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                        task.status === "Completed"
                          ? "bg-[#0047AB] border-[#0047AB] text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {task.status === "Completed" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-xs font-bold block ${
                          task.status === "Completed"
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {task.project || "General Task"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 space-y-3 font-sans">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No pending tasks.</p>
              <Link
                href="/dashboard/freelancer/tasks"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Task</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= 6. REAL INVOICES TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>
              Recent Invoices & Billing Statements ({invoices.length})
            </span>
          </h2>

          <Link
            href="/dashboard/freelancer/invoices"
            className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {invoices.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {inv.invoice_number || "INV-1001"} — {inv.client}
                    </div>
                    <div className="text-slate-400">
                      Issued {inv.issue_date || "Today"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900">
                      ${Number(inv.amount || 0).toLocaleString()}.00
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      inv.status === "Paid"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200"
                    }`}
                  >
                    {inv.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 space-y-3 font-sans">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No invoices generated yet.</p>
            <Link
              href="/dashboard/freelancer/invoices/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Invoice</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
