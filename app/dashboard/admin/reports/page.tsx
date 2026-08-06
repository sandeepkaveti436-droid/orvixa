"use client";

import React from "react";
import { BarChart3, Sparkles, TrendingUp, Download } from "lucide-react";

export default function ReportsPage() {
  const handleExport = () => {
    alert("Generating AI Sprint Performance Audit PDF... Download complete!");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            AI Sprint Reports & Analytics
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Automated AI performance insights and department velocity metrics.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans"
        >
          <Download className="w-4 h-4" />
          <span>Export Report PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-sans">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold uppercase text-slate-400 font-sans">
              Department Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-[#0047AB] font-sans">
            +42.8%
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Engineering & Growth sprints running 12% ahead of schedule.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold uppercase text-slate-400 font-sans">
              AI Standup Report
            </span>
            <Sparkles className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-sm font-bold text-slate-800 font-sans">
            14 Tasks Auto-prioritized Today
          </div>
          <p className="text-xs text-emerald-600 font-bold font-sans">
            ✓ Zero Active Bottlenecks
          </p>
        </div>
      </div>
    </div>
  );
}
