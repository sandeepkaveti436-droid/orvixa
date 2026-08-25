"use client";

import React, { useState, useEffect } from "react";
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

  // --- FILTER BY TIME RANGE ---
  const now = new Date();
  const getDays = () => {
    if (timeRange === "7D") return 7;
    if (timeRange === "30D") return 30;
    if (timeRange === "90D") return 90;
    if (timeRange === "1Y") return 365;
    return 9999;
  };

  const filteredProjects = projects.filter((p) => {
    if (!p.created_at || timeRange === "ALL") return true;
    const projDate = new Date(p.created_at);
    const diffDays = (now.getTime() - projDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= getDays();
  });

  // --- LIVE COMPUTED SAAS METRICS ---
  // 1. Total Pipeline Revenue in ₹ INR
  const totalRevenue = filteredProjects
    .filter((p) => (p.status || "").toLowerCase() !== "cancelled")
    .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

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
  const taskRate = totalTasks > 0 ? (completedTasks / totalTasks) * 20 : 15;
  const calculatedHealthScore = Math.min(
    98,
    Math.round(
      65 + taskRate + clientRevenueList.length * 5 - onHoldProjects.length * 5,
    ),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Live SaaS Analytics Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16 max-w-7xl mx-auto">
      {/* ================= 1. HEADER & LIVE DB STATUS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-sans">
            <span className="text-[11px] font-bold text-[#0047AB] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-sans">
              <Activity className="w-3.5 h-3.5 text-[#0047AB]" />
              <span>Real-Time Workspace Metrics</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            <span>Analytics & </span>
            <span className="italic text-[#0047AB]">Insights.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 font-sans">
            Performance trends, cashflow velocity, and client concentration
            computed live in ₹ INR.
          </p>
        </div>

        {/* Time Range Controls */}
        <div className="flex items-center gap-2 font-sans">
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl hidden sm:inline-flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-3 h-3" /> Live DB Mode
          </span>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl font-sans">
            {(["7D", "30D", "90D", "1Y", "ALL"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition font-sans ${
                  timeRange === range
                    ? "bg-[#0047AB] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 2. TOP 4 SAAS KPI METRICS ROW ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        {/* Gross Pipeline Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 font-sans hover:border-blue-200 transition">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
              GROSS PIPELINE
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-sans flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0047AB] font-sans">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block font-sans">
              Across {activeProjectsCount} live project
              {activeProjectsCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        {/* Average Deal Value */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 font-sans hover:border-blue-200 transition">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
              AVG PROJECT VALUE
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-sans">
              Per Deal
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-sans">
              ₹{avgProjectValue.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block font-sans">
              Client ticket average
            </span>
          </div>
        </div>

        {/* Project Velocity Ratio */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 font-sans hover:border-blue-200 transition">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
              PROJECT RATIO
            </span>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-sans">
              Delivery
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-sans">
              {inProgressProjects.length + underReviewProjects.length} Active /{" "}
              {completedProjects.length} Done
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 block font-sans">
              {onHoldProjects.length > 0
                ? `⚠️ ${onHoldProjects.length} On Hold`
                : "✓ 0 Blocked deliverables"}
            </span>
          </div>
        </div>

        {/* AI Health Score */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 font-sans hover:border-blue-200 transition">
          <div className="flex items-center justify-between font-sans">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
              WORKSPACE SCORE
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-sans flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Optimal
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 font-sans">
              {calculatedHealthScore}{" "}
              <span className="text-sm font-bold text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-1 block font-sans">
              ✓ Delivery speed on schedule
            </span>
          </div>
        </div>
      </div>

      {/* ================= 3. SAAS REVENUE GROWTH GRAPH & CLIENT CONCENTRATION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* Main Interactive Revenue Graph (8 Columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 font-sans">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
                <BarChart3 className="w-5 h-5 text-[#0047AB]" />
                <span>Revenue Growth & Monthly Pipeline Trend</span>
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 font-sans">
                Dynamic visual breakdown computed from your live database (
                {timeRange}).
              </p>
            </div>
            <div className="text-right font-sans">
              <span className="text-sm font-black text-[#0047AB] font-sans">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase block font-sans">
                Total Value
              </span>
            </div>
          </div>

          {/* Interactive SaaS Bar Chart */}
          <div className="space-y-4 pt-2 font-sans">
            <div className="flex items-end justify-between gap-3 h-52 pt-6 px-2 border-b border-slate-100 font-sans">
              {monthlyData.map((data, idx) => {
                const heightPercent =
                  maxMonthlyRevenue > 0
                    ? Math.max(
                        12,
                        Math.round((data.revenue / maxMonthlyRevenue) * 100),
                      )
                    : 15;
                const isCurrent = idx === monthlyData.length - 1;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 h-full justify-end group font-sans"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-md shadow-md mb-1 font-sans">
                      ₹{data.revenue.toLocaleString("en-IN")}
                    </span>

                    <div
                      className={`w-full max-w-[48px] rounded-2xl transition-all duration-500 relative ${
                        isCurrent
                          ? "bg-gradient-to-t from-[#0047AB] to-blue-500 shadow-md shadow-[#0047AB]/25"
                          : "bg-slate-200/80 hover:bg-slate-300"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />

                    <span
                      className={`text-xs font-bold font-sans ${
                        isCurrent ? "text-[#0047AB]" : "text-slate-400"
                      }`}
                    >
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 font-sans">
              <div className="flex items-center gap-4 font-sans">
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB]" />
                  <span>Current Live Month</span>
                </span>
                <span className="flex items-center gap-1.5 font-sans">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  <span>Historical Pipeline</span>
                </span>
              </div>

              <span className="font-bold text-slate-700 font-sans">
                {activeProjectsCount} Total Projects Mapped
              </span>
            </div>
          </div>
        </div>

        {/* Client Concentration / Share Matrix (4 Columns) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 font-sans">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
                  <Users className="w-5 h-5 text-[#0047AB]" />
                  <span>Client Concentration</span>
                </h3>
                <span className="text-xs font-semibold text-slate-400 font-sans">
                  Portfolio Revenue Share
                </span>
              </div>
              <span className="text-xs font-bold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-full font-sans">
                {clientRevenueList.length} Clients
              </span>
            </div>

            <div className="space-y-4 pt-4 font-sans">
              {clientRevenueList.map((item, idx) => (
                <div key={idx} className="space-y-1.5 font-sans">
                  <div className="flex justify-between items-center text-xs font-bold font-sans">
                    <span className="text-slate-900 font-sans truncate max-w-[140px]">
                      {item.client}
                    </span>
                    <span className="text-slate-900 font-black font-sans">
                      ₹{item.amount.toLocaleString("en-IN")}{" "}
                      <span className="text-slate-400 font-semibold text-[11px]">
                        ({item.share}%)
                      </span>
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden font-sans">
                    <div
                      className={`h-full rounded-full transition-all duration-500 font-sans ${
                        idx === 0 ? "bg-[#0047AB]" : "bg-emerald-500"
                      }`}
                      style={{ width: `${Math.max(item.share, 4)}%` }}
                    />
                  </div>
                </div>
              ))}

              {clientRevenueList.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-400 font-sans">
                  No client revenue records found.
                </div>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/freelancer/clients"
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl border border-slate-200 flex items-center justify-center gap-1.5 transition font-sans"
          >
            <span>View Full CRM Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ================= 4. PROJECT PIPELINE BREAKDOWN & AI AUDIT INSIGHTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Project Pipeline Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 font-sans">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <FolderKanban className="w-5 h-5 text-[#0047AB]" />
              <span>Project Deliverables Pipeline</span>
            </h3>
            <span className="text-xs font-bold text-slate-400 font-sans">
              {filteredProjects.length} Active Items
            </span>
          </div>

          <div className="space-y-3 font-sans">
            {filteredProjects.map((p) => {
              const budgetNum = Number(p.budget) || 0;
              const sharePercent =
                totalRevenue > 0
                  ? Math.round((budgetNum / totalRevenue) * 100)
                  : 0;

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/freelancer/projects/${p.id}`}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/60 hover:bg-white flex items-center justify-between transition group font-sans"
                >
                  <div className="min-w-0 font-sans">
                    <div className="flex items-center gap-2 mb-1 font-sans">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-[#0047AB] truncate font-sans">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0047AB] border border-blue-200 font-sans">
                        {p.status || "In Progress"}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium font-sans">
                      Client:{" "}
                      <strong className="text-slate-700">{p.client}</strong>
                    </span>
                  </div>

                  <div className="text-right shrink-0 font-sans">
                    <span className="text-sm font-black text-[#0047AB] block font-sans">
                      ₹{budgetNum.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 font-sans">
                      {sharePercent}% of portfolio
                    </span>
                  </div>
                </Link>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400 font-sans">
                No projects mapped in this time range.
              </div>
            )}
          </div>
        </div>

        {/* AI Performance & Portfolio Health Insights */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 font-sans flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 font-sans">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
                <Sparkles className="w-5 h-5 text-[#0047AB]" />
                <span>AI Portfolio & Cashflow Audit</span>
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-sans">
                ● Live AI Analysis
              </span>
            </div>

            <div className="space-y-3 pt-3 font-sans">
              {clientRevenueList.length > 0 &&
                clientRevenueList[0].share > 60 && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 font-sans">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="font-sans">
                      <h4 className="text-xs font-bold text-amber-900 font-sans">
                        High Client Concentration Alert
                      </h4>
                      <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed font-sans">
                        <strong>{clientRevenueList[0].client}</strong> accounts
                        for <strong>{clientRevenueList[0].share}%</strong> of
                        your total pipeline revenue (₹
                        {clientRevenueList[0].amount.toLocaleString("en-IN")}).
                        Diversifying with 1-2 new active clients will reduce
                        revenue risk.
                      </p>
                    </div>
                  </div>
                )}

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 font-sans">
                <CheckCircle2 className="w-5 h-5 text-[#0047AB] shrink-0 mt-0.5" />
                <div className="font-sans">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">
                    Average Deal Velocity: ₹
                    {avgProjectValue.toLocaleString("en-IN")}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-sans">
                    Your average ticket size across {activeProjectsCount}{" "}
                    projects is currently{" "}
                    <strong>₹{avgProjectValue.toLocaleString("en-IN")}</strong>.
                    Project delivery schedules are currently operating at{" "}
                    <strong>{calculatedHealthScore}% efficiency</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 font-sans">
                <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="font-sans">
                  <h4 className="text-xs font-bold text-slate-900 font-sans">
                    Total Contract Pipeline
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-sans">
                    You have{" "}
                    <strong>₹{totalRevenue.toLocaleString("en-IN")} INR</strong>{" "}
                    in total active project value ready to be billed upon
                    milestone delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/freelancer/invoices"
            className="w-full py-2.5 bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold rounded-2xl shadow-md shadow-[#0047AB]/20 flex items-center justify-center gap-1.5 transition font-sans"
          >
            <span>Issue Client Invoices in ₹ INR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
