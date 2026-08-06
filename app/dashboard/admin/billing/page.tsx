"use client";

import React from "react";
import { CreditCard, Users, ShieldCheck, Download } from "lucide-react";

export default function AdminBillingPage() {
  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>Organization </span>
          <span className="font-heading italic text-[#0047AB]">
            Billing & Licenses.
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage seat allocations, active plan licenses, and payment statements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Active License Plan
          </span>
          <div className="text-3xl font-black text-slate-900">
            Enterprise Pro
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ Annual Subscription
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Seat Utilization
          </span>
          <div className="text-3xl font-black text-[#0047AB]">
            32 / 50 Seats
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            18 Available Seats
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Renewal Date
          </span>
          <div className="text-2xl font-black text-slate-900">Dec 31, 2026</div>
          <span className="text-xs text-slate-500 font-semibold block">
            Auto-renew enabled
          </span>
        </div>
      </div>
    </div>
  );
}
