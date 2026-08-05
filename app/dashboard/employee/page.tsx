"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  MessageSquare,
  Sparkles,
  LogOut,
} from "lucide-react";

export default function EmployeeDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
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
            Team Member App
          </span>
          <span className="text-xs font-bold bg-[#0047AB]/10 text-[#0047AB] px-2.5 py-0.5 rounded-full">
            Orvixa Engineering
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

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Welcome Back 👋
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Here is your assigned work for today.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            ● Clocked In • 04h 12m
          </span>
        </div>

        {/* Assigned Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">
                Assigned Task
              </span>
              <span className="text-xs bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-full font-bold">
                In Progress
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Implement UI Animation for FAQ Accordion
            </h3>
            <p className="text-xs text-slate-500">
              Assigned by Alex Mercer • Due Today
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">
                AI Copilot Priority
              </span>
              <span className="text-xs bg-[#0047AB]/10 text-[#0047AB] px-2.5 py-0.5 rounded-full font-bold">
                ✨ AI Triage
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">
              Review Pull Request #42 for Next.js App
            </h3>
            <p className="text-xs text-slate-500">
              Auto-prioritized based on sprint deadline
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
