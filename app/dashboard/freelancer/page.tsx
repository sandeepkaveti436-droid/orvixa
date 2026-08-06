"use client";

import React, { useState } from "react";
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
  Activity,
  Users,
} from "lucide-react";

export default function FreelancerDashboardPage() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Wireframe Mobile Dashboard for Acme Corp",
      project: "Acme iOS Redesign",
      completed: true,
    },
    {
      id: 2,
      title: "Finalize Figma Component Design System",
      project: "Acme iOS Redesign",
      completed: false,
    },
    {
      id: 3,
      title: "Test Stripe Payment Gateway Sandbox",
      project: "Stripe API Integration",
      completed: false,
    },
    {
      id: 4,
      title: "Export Assets for Solopreneur Brand Package",
      project: "Brand Identity",
      completed: true,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

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
            <span>Solo Workspace </span>
            <span className="font-heading italic text-[#0047AB]">
              Dashboard.
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Overview of active projects, clients, invoices, time tracking, and
            AI workflows.
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

      {/* ================= 3. 6 KPI CARDS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 font-sans">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Active Projects
          </span>
          <div className="text-2xl font-black text-slate-900">3 Active</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            ✓ 100% on schedule
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Active Clients
          </span>
          <div className="text-2xl font-black text-slate-900">4 Clients</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            $8,016 avg value
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Pending Tasks
          </span>
          <div className="text-2xl font-black text-[#0047AB]">8 Tasks</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            2 due today
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Revenue (This Month)
          </span>
          <div className="text-2xl font-black text-emerald-600">$4,850.00</div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            ✓ 100% Paid
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Outstanding Invoices
          </span>
          <div className="text-2xl font-black text-slate-900">$3,200.00</div>
          <span className="text-[10px] text-amber-600 font-bold mt-1 block">
            1 Invoice pending
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">
            Hours Tracked
          </span>
          <div className="text-2xl font-black text-[#0047AB]">24h 10m</div>
          <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
            This week
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
              "You have 12 billable hours logged for Acme Corp. Would you like
              me to auto-generate and draft Invoice #INV-1045?"
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/freelancer/invoices/new"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0"
        >
          Draft AI Invoice →
        </Link>
      </div>

      {/* ================= 5. ACTIVE PROJECTS & TODAY'S TASKS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* LEFT: ACTIVE PROJECTS PROGRESS (7 COLUMNS) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#0047AB]" />
              <span>Active Projects (3)</span>
            </h2>

            <Link
              href="/dashboard/freelancer/projects"
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Project 1 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Acme Corp iOS App Redesign
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Client: Acme Global Inc. • Due Aug 25
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#0047AB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  $6,500
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Sprint Completion</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0047AB] h-full rounded-full w-[92%]" />
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Stripe Payment Gateway Integration
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Client: FinTech Labs • Due Aug 18
                  </p>
                </div>
                <span className="text-xs font-extrabold text-[#0047AB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                  $3,200
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>Sprint Completion</span>
                  <span>64%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full w-[64%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: TODAY'S TASKS CHECKLIST (5 COLUMNS) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
              <span>
                Today's Tasks ({tasks.filter((t) => !t.completed).length}{" "}
                Pending)
              </span>
            </h2>

            <Link
              href="/dashboard/freelancer/tasks"
              className="text-xs font-bold text-[#0047AB] hover:underline"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      task.completed
                        ? "bg-[#0047AB] border-[#0047AB] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        task.completed
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {task.project}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 6. WIDGETS GRID (6 WIDGETS) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {/* Widget 1: Pending Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
              <span>Pending Tasks</span>
            </h3>
            <Link
              href="/dashboard/freelancer/tasks"
              className="text-[11px] font-bold text-[#0047AB]"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2 text-xs font-semibold">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>Wireframe Mobile Dashboard</span>
              <span className="text-[#0047AB] font-bold">In Progress</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>Figma Component System</span>
              <span className="text-slate-400">To Do</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Upcoming Deadlines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0047AB]" />
              <span>Upcoming Deadlines</span>
            </h3>
          </div>
          <div className="space-y-2 text-xs font-semibold">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>Stripe Integration Sandbox</span>
              <span className="text-amber-600 font-bold">Aug 18</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex justify-between">
              <span>Acme iOS App Sign-off</span>
              <span className="text-slate-600 font-bold">Aug 25</span>
            </div>
          </div>
        </div>

        {/* Widget 3: AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-5 rounded-2xl border border-blue-200/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0047AB]">
            <Sparkles className="w-4 h-4" />
            <span>AI Copilot Summary</span>
          </div>
          <p className="text-xs text-slate-700 font-semibold leading-relaxed">
            "You have $3,200 in pending invoices. Send an automated AI reminder
            to FinTech Labs to speed up payment."
          </p>
        </div>

        {/* Widget 4: Recent Activity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Recent Activity</span>
            </h3>
          </div>
          <div className="space-y-2 text-xs font-medium text-slate-600">
            <p>✓ Paid $4,850.00 invoice for Acme Corp</p>
            <p>⏱️ Logged 3h 45m on Figma System</p>
          </div>
        </div>

        {/* Widget 5: Recent Clients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0047AB]" />
              <span>Recent Clients</span>
            </h3>
            <Link
              href="/dashboard/freelancer/clients"
              className="text-[11px] font-bold text-[#0047AB]"
            >
              View All
            </Link>
          </div>
          <div className="space-y-2 text-xs font-bold text-slate-800">
            <div className="flex justify-between">
              <span>Acme Global Inc.</span>
              <span className="text-[#0047AB]">$11,350</span>
            </div>
            <div className="flex justify-between">
              <span>FinTech Labs</span>
              <span className="text-[#0047AB]">$8,200</span>
            </div>
          </div>
        </div>

        {/* Widget 6: Calendar Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0047AB]" />
              <span>Calendar Preview</span>
            </h3>
          </div>
          <div className="text-xs font-semibold text-slate-600 space-y-1">
            <p>📅 10:00 AM • Client Design Sync</p>
            <p>📅 02:30 PM • Sprint Review</p>
          </div>
        </div>
      </div>

      {/* ================= 7. RECENT INVOICES TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>Recent Invoices & Billing Statements</span>
          </h2>

          <Link
            href="/dashboard/freelancer/invoices"
            className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
          >
            <span>View All Invoices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            {
              id: "INV-1042",
              client: "Acme Global Inc.",
              project: "iOS App Redesign",
              amount: "$4,850.00",
              status: "Paid",
              date: "Aug 01, 2026",
            },
            {
              id: "INV-1043",
              client: "FinTech Labs",
              project: "Stripe API Integration",
              amount: "$3,200.00",
              status: "Pending",
              date: "Aug 04, 2026",
            },
            {
              id: "INV-1044",
              client: "Solopreneur Studio",
              project: "Brand Identity Package",
              amount: "$1,800.00",
              status: "Paid",
              date: "Jul 20, 2026",
            },
          ].map((inv) => (
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
                    {inv.id} — {inv.client}
                  </div>
                  <div className="text-slate-400">
                    {inv.project} • Issued {inv.date}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">
                    {inv.amount}
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inv.status === "Paid"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
