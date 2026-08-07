"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(true);
  const [employeeCount, setEmployeeCount] = useState(0);

  useEffect(() => {
    async function fetchBillingData() {
      try {
        // Fetch Real Count of Employees from database
        const { count } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", [
            "employee",
            "organization",
            "admin",
            "manager",
            "team_lead",
          ]);

        setEmployeeCount(count || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBillingData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Billing Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Organization Billing & Licenses
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage seat allocations, active plan licenses, and payment statements.
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-sm font-sans">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-1">
            <Sparkles className="w-5 h-5" />
            <span>Early Adopter Program Active</span>
          </div>
          <p className="text-xs font-medium text-emerald-800">
            Thank you for being one of our first users! Your organization gets 3
            full months of Enterprise access for free.
          </p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-2xl font-black text-emerald-700">
            90 Days Free
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Active License Plan
          </span>
          <div className="text-3xl font-black text-slate-900">
            Enterprise Pro
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ 3-Month Free Trial Active
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Seat Utilization
          </span>
          {/* REAL SEAT UTILIZATION COUNT */}
          <div className="text-3xl font-black text-[#0047AB]">
            {employeeCount} / Unlimited
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Add as many users as you need.
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Next Billing Date
          </span>
          <div className="text-2xl font-black text-slate-900">Nov 07, 2026</div>
          <span className="text-xs text-slate-500 font-semibold block">
            You will not be charged today.
          </span>
        </div>
      </div>
    </div>
  );
}
