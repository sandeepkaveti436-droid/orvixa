"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Sparkles,
  Download,
  CheckCircle2,
  Filter,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<"7D" | "30D" | "90D" | "1Y">(
    "30D",
  );
  const [metricType, setMetricType] = useState<"revenue" | "hours">("revenue");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Dynamic Real-Time Data Maps for Each Timeframe
  const dataMap = {
    "7D": {
      totalRevenue: "$3,850.00",
      growth: "+14.2% vs last week",
      billableRatio: "91.2%",
      billableHours: "38h / 42h",
      avgProjectValue: "$1,925.00",
      aiScore: "96 / 100",
      aiHoursSaved: "4.5h saved this week",
      chart: [
        { label: "Mon", value: 450, hours: 6 },
        { label: "Tue", value: 680, hours: 8 },
        { label: "Wed", value: 520, hours: 7 },
        { label: "Thu", value: 890, hours: 9 },
        { label: "Fri", value: 710, hours: 8 },
        { label: "Sat", value: 300, hours: 3 },
        { label: "Sun", value: 300, hours: 3 },
      ],
      clients: [
        {
          name: "Acme Global Inc.",
          amount: "$2,100",
          percent: 54,
          color: "bg-[#0047AB]",
        },
        {
          name: "FinTech Labs",
          amount: "$1,250",
          percent: 32,
          color: "bg-indigo-500",
        },
        {
          name: "Solopreneur Studio",
          amount: "$500",
          percent: 14,
          color: "bg-purple-500",
        },
      ],
    },
    "30D": {
      totalRevenue: "$24,050.00",
      growth: "+28.4% vs last month",
      billableRatio: "88.2%",
      billableHours: "142h / 161h",
      avgProjectValue: "$4,150.00",
      aiScore: "94 / 100",
      aiHoursSaved: "18.5h saved this month",
      chart: [
        { label: "Jan", value: 3200, hours: 42 },
        { label: "Feb", value: 4100, hours: 55 },
        { label: "Mar", value: 3800, hours: 48 },
        { label: "Apr", value: 5200, hours: 64 },
        { label: "May", value: 4900, hours: 58 },
        { label: "Jun", value: 6100, hours: 72 },
        { label: "Jul", value: 5800, hours: 68 },
        { label: "Aug", value: 7400, hours: 85 },
      ],
      clients: [
        {
          name: "Acme Global Inc.",
          amount: "$11,350",
          percent: 47,
          color: "bg-[#0047AB]",
        },
        {
          name: "FinTech Labs",
          amount: "$8,200",
          percent: 34,
          color: "bg-indigo-500",
        },
        {
          name: "Solopreneur Studio",
          amount: "$4,500",
          percent: 19,
          color: "bg-purple-500",
        },
      ],
    },
    "90D": {
      totalRevenue: "$68,200.00",
      growth: "+32.1% vs Q1",
      billableRatio: "89.5%",
      billableHours: "410h / 458h",
      avgProjectValue: "$4,850.00",
      aiScore: "92 / 100",
      aiHoursSaved: "52h saved this quarter",
      chart: [
        { label: "Wk 1", value: 5200, hours: 60 },
        { label: "Wk 2", value: 6100, hours: 72 },
        { label: "Wk 3", value: 5800, hours: 68 },
        { label: "Wk 4", value: 7400, hours: 85 },
        { label: "Wk 5", value: 6900, hours: 78 },
        { label: "Wk 6", value: 8100, hours: 92 },
        { label: "Wk 7", value: 8800, hours: 98 },
        { label: "Wk 8", value: 9400, hours: 105 },
      ],
      clients: [
        {
          name: "Acme Global Inc.",
          amount: "$31,000",
          percent: 45,
          color: "bg-[#0047AB]",
        },
        {
          name: "FinTech Labs",
          amount: "$22,500",
          percent: 33,
          color: "bg-indigo-500",
        },
        {
          name: "Solopreneur Studio",
          amount: "$14,700",
          percent: 22,
          color: "bg-purple-500",
        },
      ],
    },
    "1Y": {
      totalRevenue: "$218,500.00",
      growth: "+45.8% YoY Growth",
      billableRatio: "91.0%",
      billableHours: "1,640h / 1,802h",
      avgProjectValue: "$5,200.00",
      aiScore: "95 / 100",
      aiHoursSaved: "210h saved this year",
      chart: [
        { label: "Q1 2025", value: 42000, hours: 320 },
        { label: "Q2 2025", value: 49000, hours: 380 },
        { label: "Q3 2025", value: 58000, hours: 420 },
        { label: "Q4 2025", value: 69500, hours: 520 },
      ],
      clients: [
        {
          name: "Acme Global Inc.",
          amount: "$98,000",
          percent: 45,
          color: "bg-[#0047AB]",
        },
        {
          name: "FinTech Labs",
          amount: "$72,000",
          percent: 33,
          color: "bg-indigo-500",
        },
        {
          name: "Solopreneur Studio",
          amount: "$48,500",
          percent: 22,
          color: "bg-purple-500",
        },
      ],
    },
  };

  const activeData = dataMap[timeframe];

  // Helper to calculate max value for chart height scaling
  const maxValue = Math.max(
    ...activeData.chart.map((d) =>
      metricType === "revenue" ? d.value : d.hours,
    ),
  );

  const handleExportReport = () => {
    alert(`Exporting ${timeframe} Analytics Report... CSV download generated!`);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* ================= 1. HEADER & CONTROLS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Analytics & </span>
            <span className="font-heading italic text-[#0047AB]">
              Insights.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Real-time financial performance, billable hours, and AI velocity
            metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export Button */}
          <button
            onClick={handleExportReport}
            className="bg-white border border-slate-300 hover:border-[#0047AB] text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4 text-[#0047AB]" />
            <span>Export Report</span>
          </button>

          {/* Timeframe Switcher Buttons */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
            {(["7D", "30D", "90D", "1Y"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeframe(period)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeframe === period
                    ? "bg-[#0047AB] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 2. DYNAMIC KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Total Billed Revenue
            </span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {activeData.totalRevenue}
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            {activeData.growth}
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Billable Hours Ratio
            </span>
            <Clock className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-[#0047AB]">
            {activeData.billableRatio}
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            {activeData.billableHours} logged
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Average Project Value
            </span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {activeData.avgProjectValue}
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Per client workspace
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              AI Productivity Score
            </span>
            <Sparkles className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-[#0047AB]">
            {activeData.aiScore}
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            {activeData.aiHoursSaved}
          </span>
        </div>
      </div>

      {/* ================= 3. DYNAMIC BAR CHART WITH METRIC TOGGLE ================= */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#0047AB]" />
              <span>
                {metricType === "revenue"
                  ? "Revenue Performance ($)"
                  : "Billable Hours Tracked (h)"}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live interactive chart data for period:{" "}
              <strong className="text-slate-800">{timeframe}</strong>
            </p>
          </div>

          {/* Metric Type Switcher */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setMetricType("revenue")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricType === "revenue"
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setMetricType("hours")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                metricType === "hours"
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Hours (h)
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Chart Bars */}
        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 relative">
          {activeData.chart.map((item, idx) => {
            const barValue = metricType === "revenue" ? item.value : item.hours;
            const heightPercent = (barValue / maxValue) * 100;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setHoveredBar(idx)}
                onMouseLeave={() => setHoveredBar(null)}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer relative"
              >
                {/* Interactive Tooltip on Hover */}
                {hoveredBar === idx && (
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg z-20 whitespace-nowrap animate-in fade-in">
                    {item.label}:{" "}
                    {metricType === "revenue"
                      ? `$${item.value.toLocaleString()}`
                      : `${item.hours} hours`}
                  </div>
                )}

                <div className="w-full bg-slate-100 rounded-t-xl overflow-hidden h-full flex items-end">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      hoveredBar === idx ? "bg-[#003680]" : "bg-[#0047AB]"
                    }`}
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 4. CLIENT BREAKDOWN & AI REPORT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {/* Client Revenue Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0047AB]" />
            <span>Top Client Revenue Distribution ({timeframe})</span>
          </h3>

          <div className="space-y-4 text-xs font-semibold">
            {activeData.clients.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-800">{c.name}</span>
                  <span className="text-[#0047AB] font-bold">
                    {c.amount} ({c.percent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${c.percent}%` }}
                    className={`${c.color} h-full rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Productivity Report */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-6 rounded-2xl border border-blue-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0047AB]">
            <Sparkles className="w-4 h-4" />
            <span>AI Copilot Performance Audit</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700 font-semibold leading-relaxed">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {activeData.aiHoursSaved} through automated invoice drafting.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                100% On-Time Milestone completion across all active clients.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero overdue invoices for the selected timeframe.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
