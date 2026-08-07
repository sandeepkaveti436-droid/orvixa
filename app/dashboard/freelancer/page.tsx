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
  Building,
  ArrowUpRight,
  Calendar,
  UserCheck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Freelancer");
  const [realProjects, setRealProjects] = useState<any[]>([]);
  const [realInvoices, setRealInvoices] = useState<any[]>([]);
  const [realTasks, setRealTasks] = useState<any[]>([]);

  // Fetch Real User Data from Supabase
  useEffect(() => {
    async function loadRealUserData() {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          // Fetch Real Profile Name
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", userData.user.id)
            .single();

          if (profile?.full_name) {
            setUserName(profile.full_name);
          } else {
            setUserName(userData.user.email?.split("@")[0] || "Freelancer");
          }

          // Fetch Real Projects
          const { data: projs } = await supabase.from("projects").select("*");
          if (projs) setRealProjects(projs);

          // Fetch Real Invoices
          const { data: invs } = await supabase.from("invoices").select("*");
          if (invs) setRealInvoices(invs);

          // Fetch Real Tasks
          const { data: tsks } = await supabase.from("tasks").select("*");
          if (tsks) setRealTasks(tsks);
        }
      } catch (err) {
        console.log("Loading dashboard...");
      } finally {
        setLoading(false);
      }
    }

    loadRealUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Workspace Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span>Orvixa Freelancer OS</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            <span>Welcome, {userName} </span>
            <span className="font-heading italic text-[#0047AB]">
              Workspace.
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time overview of your projects, invoices, clients, and tasks.
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

      {/* QUICK ACTIONS BAR */}
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

      {/* REAL METRICS (4 STATS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">
            Total Billed
          </span>
          <div className="text-3xl font-black text-slate-900">
            $
            {realInvoices
              .reduce((acc, i) => acc + (Number(i.amount) || 0), 0)
              .toLocaleString()}
            .00
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            {realInvoices.length} Invoices Issued
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">
            Active Projects
          </span>
          <div className="text-3xl font-black text-[#0047AB]">
            {realProjects.length} Active
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Real-time Workspace
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">
            Pending Tasks
          </span>
          <div className="text-2xl font-black text-slate-900">
            {realTasks.length} Tasks
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Deliverables Queue
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold uppercase text-slate-400">
            AI Assistant Status
          </span>
          <div className="text-2xl font-black text-slate-900">Active</div>
          <span className="text-xs text-[#0047AB] font-bold block">
            ✨ Auto-triage ready
          </span>
        </div>
      </div>

      {/* REAL PROJECTS DISPLAY OR EMPTY STATE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-[#0047AB]" />
            <span>Active Projects ({realProjects.length})</span>
          </h2>

          <Link
            href="/dashboard/freelancer/projects"
            className="text-xs font-bold text-[#0047AB] hover:underline"
          >
            View All →
          </Link>
        </div>

        {realProjects.length > 0 ? (
          <div className="space-y-3">
            {realProjects.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center text-xs font-semibold"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {p.name}
                  </div>
                  <div className="text-slate-400">
                    Client: {p.client} • Due {p.due_date || "Aug 25"}
                  </div>
                </div>
                <span className="bg-blue-50 text-[#0047AB] border border-blue-200 px-3 py-1 rounded-full font-bold">
                  {p.status || "In Progress"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 space-y-3 font-sans">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No active projects yet.</p>
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
    </div>
  );
}
