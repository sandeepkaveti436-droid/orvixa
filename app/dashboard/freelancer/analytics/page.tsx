"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  IndianRupee,
  FolderKanban,
  Users,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  BarChart3,
  Loader2,
  ArrowUpRight,
  PieChart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D" | "1Y">(
    "30D",
  );
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) {
        setProjects(data);
      }
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
    return 365;
  };

  const filteredProjects = projects.filter((p) => {
    if (!p.created_at) return true;
    const projDate = new Date(p.created_at);
    const diffDays = (now.getTime() - projDate.getTime()) / (1000 * 3600 * 24);
    return diffDays <= getDays();
  });

  // --- METRIC CALCULATIONS ---
  // 1. Total Pipeline & Project Revenue in ₹
  const totalRevenue = filteredProjects
    .filter((p) => (p.status || "").toLowerCase() !== "cancelled")
    .reduce((sum, p) => sum + (Number(p.budget) || 0), 0);

  // 2. Active, Completed, On Hold Breakdown
  const activeCount = filteredProjects.filter((p) =>
    ["in progress", "under review"].includes((p.status || "").toLowerCase()),
  ).length;

  const completedCount = filteredProjects.filter(
    (p) => (p.status || "").toLowerCase() === "completed",
  ).length;

  const onHoldCount = filteredProjects.filter((p) =>
    (p.status || "").toLowerCase().includes("hold"),
  ).length;

  // 3. Unique Clients
  const uniqueClients = Array.from(
    new Set(
      filteredProjects.map((p) => (p.client || "").trim()).filter(Boolean),
    ),
  );

  // 4. Revenue By Client
  const clientRevenueMap: { [client: string]: number } = {};
  filteredProjects.forEach((p) => {
    const c = p.client || "Other";
    clientRevenueMap[c] = (clientRevenueMap[c] || 0) + (Number(p.budget) || 0);
  });

  const clientRevenueList = Object.entries(clientRevenueMap)
    .map(([client, amount]) => ({ client, amount }))
    .sort((a, b) => b.amount - a.amount);

  // 5. Dynamic Workspace Score
  const workspaceScore = Math.min(
    100,
    Math.max(
      60,
      70 + uniqueClients.length * 5 + completedCount * 10 - onHoldCount * 5,
    ),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Live Analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Analytics & </span>
            <span className="italic text-[#0047AB]">Insights.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time performance metrics computed directly from your database
            records.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            Showing Live DB Only
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {(["7D", "30D", "90D", "1Y"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  timeRange === r
                    ? "bg-[#0047AB] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOP 3 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue in ₹ */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            TOTAL PROJECT PIPELINE REVENUE
          </span>
          <div className="text-3xl font-black text-[#0047AB]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Computed from{" "}
            {filteredProjects.length} live project
            {filteredProjects.length === 1 ? "" : "s"}
          </span>
        </div>

        {/* Active & Completed Deliverables */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            PROJECT STATUS RATIO
          </span>
          <div className="text-3xl font-black text-slate-900">
            {activeCount} Active / {completedCount} Done
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {onHoldCount > 0
              ? `⚠️ ${onHoldCount} project(s) on hold`
              : "✓ All projects healthy"}
          </span>
        </div>

        {/* AI Workspace Health Score */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            AI WORKSPACE SCORE
          </span>
          <div className="text-3xl font-black text-slate-900">
            {workspaceScore} / 100
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Real-time
            Workspace Active
          </span>
        </div>
      </div>

      {/* REVENUE GROWTH & CLIENT BREAKDOWN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Revenue Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#0047AB]" />
                <span>Project Revenue Distribution ({timeRange})</span>
              </h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Computed directly from your live database.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ● Live DB Mode
            </span>
          </div>

          {/* Dynamic Visual Graph from real projects */}
          {filteredProjects.length > 0 ? (
            <div className="space-y-4 pt-2">
              {filteredProjects.map((proj) => {
                const budgetNum = Number(proj.budget) || 0;
                const percentage =
                  totalRevenue > 0
                    ? Math.round((budgetNum / totalRevenue) * 100)
                    : 0;

                return (
                  <div key={proj.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-2">
                        {proj.name}
                        <span className="text-[10px] font-semibold text-slate-400">
                          ({proj.client})
                        </span>
                      </span>
                      <span className="text-[#0047AB]">
                        ₹{budgetNum.toLocaleString("en-IN")}{" "}
                        <span className="text-slate-400 font-normal">
                          ({percentage}%)
                        </span>
                      </span>
                    </div>

                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0047AB] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 space-y-3">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">
                No Projects in this time range
              </h4>
              <p className="text-xs text-slate-500">
                Create a project or switch the time range above to 1Y.
              </p>
            </div>
          )}
        </div>

        {/* Revenue by Client Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0047AB]" />
              <span>Revenue by Client</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {uniqueClients.length} Clients
            </span>
          </div>

          <div className="space-y-3">
            {clientRevenueList.map((item, idx) => {
              const clientShare =
                totalRevenue > 0
                  ? Math.round((item.amount / totalRevenue) * 100)
                  : 0;

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">
                      {item.client}
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {clientShare}% of total portfolio
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#0047AB] text-sm block">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}

            {clientRevenueList.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-400">
                No client data recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
