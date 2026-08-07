"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function Pricing() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section
      id="pricing"
      className="relative py-12 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#ffffff] overflow-hidden font-sans border-b border-slate-200/80"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[650px] pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-[#0047AB]/10 via-indigo-300/15 to-purple-400/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ================= 1. HEADER ================= */}
        <div className="text-center max-w-9xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#0047AB]/20 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0047AB] font-sans">
              Transparent Pricing
            </span>
          </div>

          <h2 className="text-[20px] sm:text-[22px] lg:text-[32px] font-black leading-[1.15] text-slate-900 mb-6 font-sans">
            <span>
              Simple, predictable <br />{" "}
            </span>
            <span className="inline-block font-heading italic pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#0047AB] via-indigo-600 to-purple-600">
              plans for everyone.
            </span>
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed text-balance font-sans">
            Start for free and scale seamlessly as your workflow grows. No
            hidden fees or lock-in contracts.
          </p>
        </div>

        {/* ================= 2. PRICING 3-CARD GRID ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch font-sans max-w-9xl mx-auto"
        >
          {/* CARD 1: STARTER (FREE) */}
          <motion.div
            variants={cardVariants}
            className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-xl transition-all duration-300 font-sans"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Freelancer Basic
                </span>
                <span className="text-[12px] font-medium bg-[#0047AB] text-white px-3 py-1 rounded-full border border-slate-200">
                  Starter
                </span>
              </div>

              <h3 className="font-sans text-2xl font-black text-slate-900 mb-2">
                Starter
              </h3>

              <div className="mb-4">
                <span className="font-sans text-4xl sm:text-5xl font-black text-slate-900">
                  Free
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500 mb-8 leading-relaxed">
                Perfect for freelancers getting started.
              </p>

              {/* Feature List */}
              <div className="space-y-3.5 mb-8 border-t border-slate-100 pt-6">
                {[
                  "3 Projects",
                  "Task Management",
                  "Calendar",
                  "Time Tracking",
                  "AI Assistant (Limited)",
                  "1 Workspace",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-xs font-bold text-slate-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/get-started?plan=starter"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 font-bold text-sm shadow-sm transition-all duration-200 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* CARD 2: PROFESSIONAL ($12/MONTH) - HIGHLIGHTED COBALT BLUE */}
          <motion.div
            variants={cardVariants}
            className="bg-[#0047AB] text-white rounded-3xl p-8 shadow-2xl shadow-[#0047AB]/35 border-2 border-[#0047AB] flex flex-col justify-between relative transform md:-translate-y-4 font-sans"
          >
            {/* Top Glow & Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-[#0047AB] text-[11px] font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-md border border-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#0047AB]" />
              <span>Most Popular</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  Full Freelance Suite
                </span>
                <span className="text-xs font-bold bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md">
                  Pro
                </span>
              </div>

              <h3 className="font-sans text-2xl font-black text-white mb-2">
                Professional
              </h3>

              <div className="mb-2 flex items-baseline gap-1">
                <span className="font-sans text-4xl sm:text-5xl font-black text-white">
                  $0
                </span>
                <span className="text-sm font-semibold opacity-80">
                  for 3 months
                </span>
              </div>

              <p className="text-xs font-semibold text-blue-100 mb-8 leading-relaxed">
                Then $12/mo. Everything freelancers need to scale.
              </p>

              {/* Feature List */}
              <div className="space-y-3.5 mb-8 border-t border-white/20 pt-6">
                {[
                  "Unlimited Projects",
                  "Invoices",
                  "Client Portal",
                  "Advanced AI",
                  "Storage",
                  "Priority Support",
                  "Analytics",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-xs font-bold text-white"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/get-started?plan=pro"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#0047AB] font-bold text-sm shadow-md transition-all duration-200 active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* CARD 3: BUSINESS (CUSTOM PRICING) */}
          <motion.div
            variants={cardVariants}
            className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-xl transition-all duration-300 font-sans"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Enterprise Suite
                </span>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-200">
                  Business
                </span>
              </div>

              <h3 className="font-sans text-2xl font-black text-slate-900 mb-2">
                Business
              </h3>

              <div className="mb-4">
                <span className="font-sans text-3xl sm:text-4xl font-black text-slate-900">
                  Custom
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-500 mb-8 leading-relaxed">
                Designed for organizations.
              </p>

              {/* Feature List */}
              <div className="space-y-3.5 mb-8 border-t border-slate-100 pt-6">
                {[
                  "Unlimited Employees",
                  "Advanced Reports",
                  "Role Permissions",
                  "Admin Dashboard",
                  "Audit Logs",
                  "API Access",
                  "Dedicated Support",
                  "Single Sign-On",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-xs font-bold text-slate-800"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="/contact-sales"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm shadow-lg shadow-[#0047AB]/25 transition-all duration-200 active:scale-95"
            >
              <span>Contact Sales</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
