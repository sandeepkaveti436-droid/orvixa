"use client";

import React from "react";
import { DollarSign, Building2, Users, PieChart, Download } from "lucide-react";

export default function AdminFinancePage() {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Organization </span>
            <span className="font-heading italic text-[#9D00FF]">
              Payroll & Finance.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Department cost allocations, team payroll overview, and corporate
            budget tracking.
          </p>
        </div>

        <button
          onClick={() => alert("Downloading Payroll Audit PDF...")}
          className="bg-[#9D00FF] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Export Payroll Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Monthly Team Payroll
          </span>
          <div className="text-3xl font-black text-slate-900">$124,500.00</div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ 32 Employees Processed
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Q3 Operating Budget
          </span>
          <div className="text-3xl font-black text-[#9D00FF]">$450,000.00</div>
          <span className="text-xs text-slate-500 font-semibold block">
            68.2% Budget Utilized
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Tax Reserve Fund
          </span>
          <div className="text-3xl font-black text-purple-600">$31,125.00</div>
          <span className="text-xs text-slate-500 font-semibold block">
            Auto-allocated
          </span>
        </div>
      </div>
    </div>
  );
}
