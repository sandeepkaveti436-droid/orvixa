"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<
    "projects" | "calendar" | "tasks" | "messages" | "analytics" | "ai"
  >("projects");

  return (
    <section className="relative min-h-screen pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#0047AB]/20 via-indigo-400/20 to-purple-500/20 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
        {/* ================= 1. BADGE ================= */}
        <div className="animate-blur-1 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#0047AB]/20 shadow-sm">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              ✨ AI Powered Work Management Platform
            </span>
          </div>
        </div>

        {/* ================= 2. HEADING ================= */}
        <h1 className="animate-blur-2 text-[24px] sm:text-[32px] md:text-[48px] leading-[1.15] text-slate-900 mb-8 max-w-4xl">
          <span className="block font-sans font-black tracking-tight">
            Work smarter.
          </span>
          <span className="block font-sans font-black tracking-tight">
            Organize everything.
          </span>

          <span className="block font-heading italic font-bold pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#0047AB] via-indigo-600 to-purple-600">
            Scale without limits.
          </span>
        </h1>

        {/* ================= 3. DESCRIPTION ================= */}
        <p className="animate-blur-3 text-base sm:text-lg text-slate-700 font-medium leading-relaxed max-w-2xl mb-10 text-balance">
          <strong className="font-bold text-slate-900 font-heading text-xl">
            Orvixa
          </strong>{" "}
          brings projects, tasks, communication, time tracking, reporting, and
          collaboration into one intelligent platform. Whether you're an
          independent freelancer or a growing organization, Orvixa helps you
          work faster, stay organized, and scale confidently.
        </p>

        {/* ================= 4. BUTTONS ================= */}
        <div className="animate-blur-4 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10">
          <Link
            href="/get-started"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:px-10 md:py-2.5 py-2 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-base shadow-lg shadow-[#0047AB]/25 transition-all duration-200"
          >
            <span>Start Free</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>

          <button
            onClick={() => alert("Watch Demo Clicked")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 md:px-8 md:py-2 py-2 rounded-xl bg-white text-[#0047AB] border-2 border-[#0047AB] font-bold text-base shadow-sm hover:bg-[#0047AB]/5 transition-all duration-200"
          >
            <div className="w-6 h-6 rounded-full bg-[#0047AB]/10 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#0047AB">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <span>Watch Demo</span>
          </button>
        </div>

        {/* ================= 5. TRUST BADGES ================= */}
        <div className="animate-blur-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs sm:text-sm font-semibold text-slate-600 mb-16">
          <div className="flex items-center gap-1.5">
            <span className="text-[#0047AB] font-bold">✓</span> No credit card
            required
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0047AB] font-bold">✓</span> 3-Month Free
            Trial (Launch Offer)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0047AB] font-bold">✓</span> Setup in 2
            minutes
          </div>
        </div>

        {/* ================= 6. HERO STATS BAR ================= */}
        <div className="animate-blur-5 w-full max-w-5xl mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/5">
            <div className="flex flex-col items-center justify-center p-2 border-r border-slate-100 last:border-r-0 md:border-r">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0047AB]">
                50K+
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Active Users
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-r-0 md:border-r border-slate-100">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
                500K+
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Tasks Completed
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2 border-r border-slate-100 last:border-r-0 md:border-r">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0047AB]">
                99.9%
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Platform Uptime
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
                150+
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-600 mt-1">
                Countries
              </span>
            </div>
          </div>
        </div>

        {/* ================= 7. DASHBOARD MOCKUP ================= */}
        <div className="animate-blur-6 w-full max-w-5xl relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB]/20 via-indigo-500/20 to-purple-500/20 blur-3xl rounded-3xl -z-10 transform scale-95" />

          <div
            className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-6 shadow-2xl ${
              themeMode === "dark"
                ? "bg-slate-950/95 text-slate-100 border-slate-800 shadow-slate-950/50"
                : "bg-white/95 text-slate-900 border-slate-200/90 shadow-slate-900/10"
            }`}
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 mb-5 border-b border-slate-200/20 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span
                  className={`ml-2 text-xs font-bold tracking-wide ${themeMode === "dark" ? "text-slate-400" : "text-slate-500"}`}
                >
                  app.orvixa.com / workspace
                </span>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold opacity-75 mr-1">
                  Preview Theme:
                </span>
                <div
                  className={`flex items-center p-1 rounded-xl border ${themeMode === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"}`}
                >
                  <button
                    onClick={() => setThemeMode("light")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      themeMode === "light"
                        ? "bg-white text-[#0047AB] shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ☀️ Light
                  </button>
                  <button
                    onClick={() => setThemeMode("dark")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      themeMode === "dark"
                        ? "bg-[#0047AB] text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    🌙 Dark
                  </button>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
              <div
                className={`md:col-span-3 p-2 rounded-xl flex flex-row md:flex-col overflow-x-auto gap-1 border ${
                  themeMode === "dark"
                    ? "bg-slate-900/60 border-slate-800/80"
                    : "bg-slate-50 border-slate-200/80"
                }`}
              >
                {[
                  { id: "projects", label: "Projects", icon: "📁" },
                  { id: "calendar", label: "Calendar", icon: "📅" },
                  { id: "tasks", label: "Tasks", icon: "✅" },
                  { id: "messages", label: "Messages", icon: "💬" },
                  { id: "analytics", label: "Analytics", icon: "📊" },
                  { id: "ai", label: "AI Assistant", icon: "✨" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-[#0047AB] text-white shadow-md shadow-[#0047AB]/20"
                        : themeMode === "dark"
                          ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="md:col-span-9 flex flex-col gap-4">
                {activeTab === "projects" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading text-lg font-bold">
                        Active Sprint Projects
                      </h3>
                      <span className="text-xs bg-[#0047AB]/15 text-[#0047AB] px-3 py-1 rounded-full font-bold">
                        4 In Progress
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        className={`p-4 rounded-xl border ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm">
                            Orvixa AI Engine v2.0
                          </span>
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-500 font-bold px-2 py-0.5 rounded">
                            92% Done
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/20 h-2 rounded-full overflow-hidden mt-3">
                          <div className="bg-[#0047AB] h-full w-[92%]" />
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-xl border ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm">
                            Mobile iOS Redesign
                          </span>
                          <span className="text-[10px] bg-indigo-500/15 text-indigo-400 font-bold px-2 py-0.5 rounded">
                            64% Done
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/20 h-2 rounded-full overflow-hidden mt-3">
                          <div className="bg-indigo-500 h-full w-[64%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "calendar" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-heading text-lg font-bold">
                        Today's AI Schedule
                      </h3>
                      <span className="text-xs text-slate-400">
                        Wednesday, Aug 5
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-[#0047AB] rounded-full" />
                        <div>
                          <div className="text-xs font-bold">
                            Product Strategy & AI Roadmap
                          </div>
                          <div className="text-[11px] opacity-60">
                            10:00 AM - 11:00 AM • Zoom
                          </div>
                        </div>
                      </div>
                      <span className="text-xs bg-emerald-500/15 text-emerald-500 px-2 py-1 rounded font-bold">
                        Confirmed
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "tasks" && (
                  <div className="space-y-2">
                    <h3 className="font-heading text-lg font-bold mb-3">
                      AI Auto-Prioritized Tasks
                    </h3>
                    {[
                      {
                        title: "Review Q3 Analytics Export",
                        tag: "High Priority",
                        bg: "bg-rose-500/15 text-rose-500",
                      },
                      {
                        title: "Approve Figma UI Components",
                        tag: "In Progress",
                        bg: "bg-amber-500/15 text-amber-500",
                      },
                      {
                        title: "Sync Database Backup Schedule",
                        tag: "Completed",
                        bg: "bg-emerald-500/15 text-emerald-500",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center justify-between ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                      >
                        <span className="text-xs font-bold">{item.title}</span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${item.bg}`}
                        >
                          {item.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "messages" && (
                  <div className="space-y-3">
                    <h3 className="font-heading text-lg font-bold mb-2">
                      Team Communication
                    </h3>
                    <div
                      className={`p-3 rounded-xl border flex gap-3 ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        JD
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">Jane Doe</span>
                          <span className="text-[10px] opacity-50">
                            10:42 AM
                          </span>
                        </div>
                        <p className="text-xs mt-1 opacity-80">
                          Orvixa AI just auto-generated our sprint retrospective
                          report! Check it out in Analytics.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-heading text-lg font-bold">
                        Real-time Performance
                      </h3>
                      <span className="text-xs font-bold text-[#0047AB]">
                        +48.2% Growth
                      </span>
                    </div>
                    <div
                      className={`p-4 rounded-xl border flex flex-col justify-end h-28 ${themeMode === "dark" ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                    >
                      <div className="flex items-end justify-between gap-2 h-full pt-4">
                        {[40, 65, 50, 85, 70, 95, 100].map((h, i) => (
                          <div
                            key={i}
                            className="w-full bg-slate-200/20 rounded-t h-full flex items-end"
                          >
                            <div
                              style={{ height: `${h}%` }}
                              className="w-full bg-[#0047AB] rounded-t transition-all"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ai" && (
                  <div
                    className={`p-4 rounded-xl border space-y-3 ${themeMode === "dark" ? "bg-gradient-to-r from-indigo-950/60 to-slate-900 border-indigo-800/50" : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"}`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0047AB]">
                      <span>✨</span>
                      <span>Orvixa AI Copilot</span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      "I've re-prioritized 12 backlog tasks and assigned them
                      based on current team bandwidth. Efficiency score is up by
                      34%."
                    </p>
                    <div className="flex gap-2 pt-1">
                      <button className="bg-[#0047AB] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        Apply AI Schedule
                      </button>
                      <button className="bg-transparent border border-slate-400/30 text-[11px] font-bold px-3 py-1.5 rounded-lg">
                        Customize Prompt
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`p-3 rounded-xl border flex items-center justify-between shadow-lg ${
                    themeMode === "dark"
                      ? "bg-slate-900/90 border-slate-800 text-slate-200"
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#0047AB] text-white flex items-center justify-center text-xs font-bold">
                      ✨
                    </div>
                    <span className="text-xs font-bold">
                      AI Assistant active in background
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-[#0047AB]/15 text-[#0047AB] px-2.5 py-1 rounded-full">
                    Live Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
