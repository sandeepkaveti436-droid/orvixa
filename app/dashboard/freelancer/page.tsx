"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  Clock,
  FileText,
  CreditCard,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function FreelancerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image
            src="/orviax.jpg"
            alt="Orvixa"
            width={32}
            height={32}
            className="rounded-xl"
          />
          <span className="font-heading text-xl font-bold text-slate-900">
            Freelancer App
          </span>
          <span className="text-xs font-bold bg-[#0047AB]/10 text-[#0047AB] px-2.5 py-0.5 rounded-full">
            Solo Suite
          </span>
        </div>

        <Link
          href="/auth"
          className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </header>

      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Solo Workspace Dashboard
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Invoices, time tracking, projects, and clients.
            </p>
          </div>
          <button className="bg-[#0047AB] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
            + New Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">
              Total Billed This Month
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              $4,850.00
            </div>
            <span className="text-xs text-emerald-600 font-bold mt-2 block">
              ✓ 100% Paid
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">
              Hours Tracked
            </span>
            <div className="text-3xl font-black text-[#0047AB] mt-1">
              24h 10m
            </div>
            <span className="text-xs text-slate-500 font-semibold mt-2 block">
              Across 3 active clients
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">
              AI Assistant Status
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1">
              Active
            </div>
            <span className="text-xs text-[#0047AB] font-bold mt-2 block">
              ✨ Auto-generating invoices
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
