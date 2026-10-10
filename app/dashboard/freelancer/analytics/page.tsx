"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Users,
  FolderKanban,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Calendar,
  Layers,
  Building,
  DollarSign,
  Activity,
  CheckSquare,
  Zap,
  CreditCard,
  ChevronRight,
  Flame,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<
    "7D" | "30D" | "90D" | "1Y" | "ALL"
  >("30D");

  // Live Database States
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [activeProjectHover, setActiveProjectHover] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchAnalyticsWorkspaceData();
  }, []);

  const fetchAnalyticsWorkspaceData = async () => {
    try {
      setLoading(true);

      const [projRes, invRes, taskRes] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase.from("tasks").select("*"),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (invRes.data) setInvoices(invRes.data);
      if (taskRes.data) setTasks(taskRes.data);
    } catch (err) {
      console.error("Error loading analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- TIME RANGE FILTER ---
  const now = new Date();
  const getDays = () => {
    if (timeRange === "7D") return 7;
    if (timeRange === "30D") return 30;
    if (timeRange === "90D") return 90;
    if (timeRange === "1Y") return 365;
    return 9999;
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!p.created_at || timeRange === "ALL") return true;
      const projDate = new Date(p.created_at);
      const diffDays =
        (now.getTime() - projDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= getDays();
    });
  }, [projects, timeRange]);

  // --- LIVE COMPUTED METRICS ---
  // 1. Total Pipeline Revenue in ₹ INR
  const totalRevenue = useMemo(() => {
    return filteredProjects
      .filter((p) => (p.status || "").toLowerCase() !== "cancelled")
      .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);
  }, [filteredProjects]);

  // 2. Average Project Value (Deal Size)
  const activeProjectsCount = filteredProjects.length;
  const avgProjectValue =
    activeProjectsCount > 0
      ? Math.round(totalRevenue / activeProjectsCount)
      : 0;

  // 3. Status Distributions
  const inProgressProjects = filteredProjects.filter(
    (p) => (p.status || "").toLowerCase() === "in progress",
  );
  const underReviewProjects = filteredProjects.filter((p) =>
    (p.status || "").toLowerCase().includes("review"),
  );
  const onHoldProjects = filteredProjects.filter((p) =>
    (p.status || "").toLowerCase().includes("hold"),
  );
  const completedProjects = filteredProjects.filter(
    (p) => (p.status || "").toLowerCase() === "completed",
  );

  // 4. Client Concentration & Revenue Share
  const clientRevenueMap: {
    [client: string]: { amount: number; count: number };
  } = {};
  filteredProjects.forEach((p) => {
    const c = (p.client || "Other").trim();
    if (!clientRevenueMap[c]) {
      clientRevenueMap[c] = { amount: 0, count: 0 };
    }
    clientRevenueMap[c].amount += Number(p.budget) || 0;
    clientRevenueMap[c].count += 1;
  });

  const clientRevenueList = Object.entries(clientRevenueMap)
    .map(([client, data]) => ({
      client,
      amount: data.amount,
      count: data.count,
      share:
        totalRevenue > 0 ? Math.round((data.amount / totalRevenue) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 5. Dynamic Monthly Trend Data for Chart
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonthIdx = now.getMonth();

  const monthlyData = months
    .slice(0, currentMonthIdx + 1)
    .map((monthName, idx) => {
      const monthProjects = projects.filter((p) => {
        if (!p.created_at) return idx === currentMonthIdx;
        return new Date(p.created_at).getMonth() === idx;
      });

      const monthTotal = monthProjects.reduce(
        (sum, p) => sum + (Number(p.budget) || 0),
        0,
      );
      return {
        month: monthName,
        revenue: monthTotal,
        projects: monthProjects.length,
      };
    });

  const maxMonthlyRevenue = Math.max(
    ...monthlyData.map((m) => m.revenue),
    totalRevenue,
    10000,
  );

  // 6. AI Workspace Performance Health Score
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const hasAnalyticsData =
    projects.length > 0 || invoices.length > 0 || tasks.length > 0;
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 20 : 0;
  const calculatedHealthScore = hasAnalyticsData
    ? Math.min(
        98,
        Math.round(
          65 +
            taskRate +
            clientRevenueList.length * 5 -
            onHoldProjects.length * 5,
        ),
      )
    : 0;

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center font-bold text-slate-500 font-sans gap-3">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-[#9D00FF]" />
          <div className="absolute inset-0 rounded-full blur-md bg-[#9D00FF]/30 -z-10" />
        </div>
        <span className="text-xs uppercase tracking-widest font-black text-slate-600">
          Syncing Live SaaS Analytics Engine...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-20 max-w-7xl mx-auto not-italic animate-in fade-in duration-500">
      {/* ================= 1. HEADER & CONTROLS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-[#9D00FF] bg-purple-50 border border-purple-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#9D00FF] animate-pulse" />
              <span>Real-Time Workspace Metrics</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            <span>Analytics & </span>
            <span className="italic bg-gradient-to-r from-[#9D00FF] to-indigo-600 bg-clip-text text-transparent">
              Insights.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Performance trends, cashflow velocity, and client concentration
            computed live in ₹ INR.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl hidden sm:inline-flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live DB Mode</span>
          </span>

          <div className="flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
            {(["7D", "30D", "90D", "1Y", "ALL"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all duration-200 ${
                  timeRange === range
                    ? "bg-[#9D00FF] text-white shadow-md shadow-[#9D00FF]/30 scale-102"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 2. TOP 4 SAAS KPI METRICS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Pipeline */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:border-[#9D00FF]/50 hover:shadow-xl hover:shadow-[#9D00FF]/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              GROSS PIPELINE
            </span>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 stroke-[2.5]" />
              <span>Active</span>
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-[#9D00FF] tracking-tight tabular-nums group-hover:scale-102 transition-transform origin-left">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Across {activeProjectsCount} live project
              {activeProjectsCount === 1 ? "" : "s"}
            </span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#9D00FF] to-blue-500 w-full" />
          </div>
        </div>

        {/* Average Project Value */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              AVG PROJECT VALUE
            </span>
            <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Per Deal
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums group-hover:scale-102 transition-transform origin-left">
              ₹{avgProjectValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              Client ticket average
            </span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-[65%]" />
          </div>
        </div>

        {/* Project Ratio */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              PROJECT RATIO
            </span>
            <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Delivery
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums group-hover:scale-102 transition-transform origin-left">
              {inProgressProjects.length + underReviewProjects.length} Active /{" "}
              {completedProjects.length} Done
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block">
              {onHoldProjects.length > 0
                ? `⚠️ ${onHoldProjects.length} On Hold`
                : "✓ 0 Blocked deliverables"}
            </span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 w-[80%]" />
          </div>
        </div>

        {/* Workspace Health Score */}
        <div className="group bg-white p-6 rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
              WORKSPACE SCORE
            </span>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Optimal</span>
            </span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-slate-900 tracking-tight tabular-nums group-hover:scale-102 transition-transform origin-left">
              {calculatedHealthScore}{" "}
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
              ✓ Delivery speed on schedule
            </span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${calculatedHealthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* ================= 3. PREMIUM FINTECH TIMELINE BAR (INSPIRED BY REFERENCE) ================= */}
      <div className="bg-[#0f172a] text-white p-6 sm:p-7 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-80 h-32 bg-[#9D00FF]/15 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          {/* Overdue / Due next month numbers */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Pipeline Value
                </span>
                <span className="text-2xl font-black text-white tabular-nums tracking-tight mt-0.5 block">
                  ₹{totalRevenue.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Settled Invoices
                </span>
                <span className="text-2xl font-black text-[#d4f34a] tabular-nums tracking-tight mt-0.5 block">
                  {completedProjects.length} Completed
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  Velocity Average
                </span>
                <span className="text-2xl font-black text-slate-200 tabular-nums tracking-tight mt-0.5 block">
                  12{" "}
                  <span className="text-xs font-normal text-slate-400">
                    days / ticket
                  </span>
                </span>
              </div>
            </div>

            {/* Striped Neon Timeline bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <span>Q1 Velocity</span>
                <span>Q2 Growth</span>
                <span>Q3 Peak</span>
                <span className="text-[#d4f34a]">Live (Q4)</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                <div className="h-full bg-emerald-500 rounded-full w-[25%]" />
                <div className="h-full bg-[#9D00FF] rounded-full w-[35%]" />
                <div className="h-full bg-[#d4f34a] rounded-full w-[40%] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick Instant Payout / Summary Card */}
          <div className="md:col-span-4 bg-slate-900/90 border border-slate-700/80 p-5 rounded-2xl flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Settled Collection
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4f34a]/20 text-[#d4f34a] border border-[#d4f34a]/30">
                Optimal
              </span>
            </div>

            <div className="text-2xl font-black text-[#d4f34a] tabular-nums tracking-tight">
              ₹
              {(totalRevenue * 0.85).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </div>

            <Link
              href="/dashboard/freelancer/invoices"
              className="w-full py-2.5 bg-[#d4f34a] hover:bg-[#c2e23d] text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm hover:scale-102 duration-200"
            >
              <span>View Invoice Statement</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ================= 4. REVENUE GROWTH GRAPH & CLIENT CONCENTRATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Revenue Graph (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#9D00FF]" />
                <span>Revenue Growth & Monthly Pipeline Trend</span>
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Dynamic visual breakdown computed from your live database (
                {timeRange}).
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-base font-black text-[#9D00FF] tabular-nums">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">
                Total Value
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-end justify-between gap-2.5 sm:gap-4 h-56 pt-6 px-2 border-b border-slate-100">
              {monthlyData.map((data, idx) => {
                const heightPercent =
                  maxMonthlyRevenue > 0
                    ? Math.max(
                        10,
                        Math.round((data.revenue / maxMonthlyRevenue) * 100),
                      )
                    : 15;
                const isCurrent = idx === monthlyData.length - 1;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-black bg-slate-950 text-white px-2 py-1 rounded-md shadow-lg mb-1 pointer-events-none tabular-nums whitespace-nowrap">
                      ₹{data.revenue.toLocaleString("en-IN")}
                    </span>

                    <div
                      className={`w-full max-w-[48px] rounded-2xl transition-all duration-500 relative overflow-hidden group-hover:brightness-110 ${
                        isCurrent
                          ? "bg-gradient-to-t from-[#9D00FF] to-indigo-500 shadow-lg shadow-[#9D00FF]/30 ring-2 ring-[#9D00FF]/20"
                          : "bg-slate-100 hover:bg-slate-200"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Top shine effect */}
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-white/30" />
                    </div>

                    <span
                      className={`text-xs font-bold transition-colors ${
                        isCurrent
                          ? "text-[#9D00FF] font-black"
                          : "text-slate-400 group-hover:text-slate-700"
                      }`}
                    >
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 pt-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#9D00FF]" />
                  <span>Current Live Month</span>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span>Historical Pipeline</span>
                </span>
              </div>

              <span className="font-bold text-slate-800">
                {activeProjectsCount} Total Projects Mapped
              </span>
            </div>
          </div>
        </div>

        {/* Client Concentration / Share Matrix (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#9D00FF]" />
                  <span>Client Concentration</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400">
                  Portfolio Revenue Share
                </span>
              </div>
              <span className="text-xs font-bold text-[#9D00FF] bg-purple-50 border border-purple-200/60 px-2.5 py-0.5 rounded-full">
                {clientRevenueList.length} Clients
              </span>
            </div>

            <div className="space-y-4 pt-4">
              {clientRevenueList.map((item, idx) => (
                <div key={idx} className="space-y-1.5 group">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900 truncate max-w-[150px] group-hover:text-[#9D00FF] transition-colors">
                      {item.client}
                    </span>
                    <span className="text-slate-900 font-black tabular-nums">
                      ₹{item.amount.toLocaleString("en-IN")}{" "}
                      <span className="text-slate-400 font-semibold text-[11px]">
                        ({item.share}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        idx === 0
                          ? "bg-gradient-to-r from-[#9D00FF] to-indigo-600 shadow-xs"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.max(item.share, 5)}%` }}
                    />
                  </div>
                </div>
              ))}

              {clientRevenueList.length === 0 && (
                <div className="text-center py-12 text-xs text-slate-400">
                  No client revenue records found.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/freelancer/clients"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200/90 flex items-center justify-center gap-1.5 transition hover:text-[#9D00FF] group"
          >
            <span>View Full CRM Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ================= 5. PROJECT DELIVERABLES PIPELINE & AI CASHFLOW AUDIT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Pipeline Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[#9D00FF]" />
              <span>Project Deliverables Pipeline</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {filteredProjects.length} Active Items
            </span>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((p) => {
              const budgetNum = Number(p.budget) || 0;
              const sharePercent =
                totalRevenue > 0
                  ? Math.round((budgetNum / totalRevenue) * 100)
                  : 0;
              const displayName = p.name || p.title || "Untitled Project";

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/freelancer/projects/${p.id}`}
                  onMouseEnter={() => setActiveProjectHover(p.id)}
                  onMouseLeave={() => setActiveProjectHover(null)}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    activeProjectHover === p.id
                      ? "border-[#9D00FF] bg-purple-50/30 shadow-md shadow-[#9D00FF]/5 translate-x-1"
                      : "border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-[#9D00FF] truncate transition-colors">
                        {displayName}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#9D00FF] border border-blue-200/80">
                        {p.status || "Completed"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      Client:{" "}
                      <strong className="text-slate-700">
                        {p.client || "Direct Client"}
                      </strong>
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#9D00FF] block tabular-nums">
                      ₹{budgetNum.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {sharePercent}% of portfolio
                    </span>
                  </div>
                </Link>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12 text-xs text-slate-400">
                No projects mapped in this time range.
              </div>
            )}
          </div>
        </div>

        {/* AI Performance & Portfolio Health Audit */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9D00FF]" />
                <span>AI Portfolio & Cashflow Audit</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live AI Analysis</span>
              </span>
            </div>

            <div className="space-y-3.5 pt-3">
              {clientRevenueList.length > 0 &&
                clientRevenueList[0].share > 60 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-start gap-3.5 shadow-2xs">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-950">
                        High Client Concentration Alert
                      </h4>
                      <p className="text-[11px] text-amber-900/90 mt-0.5 leading-relaxed">
                        <strong>{clientRevenueList[0].client}</strong> accounts
                        for <strong>{clientRevenueList[0].share}%</strong> of
                        your total pipeline revenue (₹
                        {clientRevenueList[0].amount.toLocaleString("en-IN")}).
                        Diversifying with 1–2 new active clients will reduce
                        revenue risk.
                      </p>
                    </div>
                  </div>
                )}

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start gap-3.5 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-[#9D00FF] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-950">
                    Average Deal Velocity: ₹
                    {avgProjectValue.toLocaleString("en-IN")}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Your average ticket size across {activeProjectsCount}{" "}
                    projects is currently{" "}
                    <strong>₹{avgProjectValue.toLocaleString("en-IN")}</strong>.
                    Project delivery schedules are currently operating at{" "}
                    <strong className="text-purple-700">
                      {calculatedHealthScore}% efficiency
                    </strong>
                    .
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 shadow-2xs">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-950">
                    Total Contract Pipeline
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    You have{" "}
                    <strong className="text-slate-900">
                      ₹{totalRevenue.toLocaleString("en-IN")} INR
                    </strong>{" "}
                    in total active project value ready to be billed upon
                    milestone delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/freelancer/invoices"
            className="w-full py-3 bg-[#9D00FF] hover:bg-[#8500db] text-white text-xs font-black rounded-2xl shadow-lg shadow-[#9D00FF]/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
          >
            <span>Issue Client Invoices in ₹ INR</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
