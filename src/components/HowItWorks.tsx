"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  UserPlus,
  Building2,
  Users,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Check,
  ChevronRight,
  User,
  Building,
  Copy,
} from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  // Split Blur Text Animation Variants for Header
  const blurWordVariants: Variants = {
    hidden: {
      opacity: 0,
      filter: "blur(16px)",
      y: 20,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const steps = [
    {
      id: 0,
      number: "01",
      title: "Create your account.",
      subtitle: "Instant Single Sign-On",
      description:
        "Sign up in seconds with Google or Enterprise SSO. Zero credit card required to start your free 14-day trial.",
      icon: UserPlus,
      badge: "Fast Signup",
    },
    {
      id: 1,
      number: "02",
      title: "Choose Freelancer or Organization.",
      subtitle: "Tailored Experience",
      description:
        "Select your operational scale to automatically configure pre-built AI workspace templates for your team.",
      icon: Building2,
      badge: "Tailored Setup",
    },
    {
      id: 2,
      number: "03",
      title: "Invite your team or set up your workspace.",
      subtitle: "One-Click Sync",
      description:
        "Dispatch magic link invitations to teammates or launch your personalized solo productivity dashboard.",
      icon: Users,
      badge: "Seamless Sync",
    },
    {
      id: 3,
      number: "04",
      title: "Start managing work with AI tools.",
      subtitle: "AI Engine Active",
      description:
        "Orvixa AI immediately organizes backlogs, prioritizes daily tasks, and automates status reporting.",
      icon: Sparkles,
      badge: "AI Activated",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-16 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#ffffff] overflow-hidden font-sans border-b border-slate-200/80"
    >
      {/* Background Ambient Lighting Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#9D00FF]/10 via-indigo-300/15 to-purple-400/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* ================= 1. HEADER WITH SPLIT BLUR TEXT ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#9D00FF]/20 shadow-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#9D00FF] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#9D00FF] font-sans">
              Simple 4-Step Onboarding
            </span>
          </motion.div>

          {/* MAIN HEADING */}
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ staggerChildren: 0.1 }}
            className="text-[20px] sm:text-[32px] font-black leading-[1.15] text-slate-900 mb-6"
          >
            <motion.span
              variants={blurWordVariants}
              className="inline-block mr-3 font-sans font-black"
            >
              How
            </motion.span>

            <motion.span
              variants={blurWordVariants}
              className="inline-block font-heading italic pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#9D00FF] via-indigo-600 to-purple-600"
            >
              Orvixa Works.
            </motion.span>
          </motion.h2>

          <p className="text-[16px] sm:text-[18px] font-medium text-slate-600 leading-relaxed text-balance font-sans">
            Get up and running in less than 2 minutes. Click through the steps
            below to see how Orvixa transforms team productivity.
          </p>
        </div>

        {/* ================= 2. TOP STEPPER PILL NAVIGATION ================= */}
        <div className="bg-[#9D00FF] backdrop-blur-xl rounded-2xl p-2 shadow-lg shadow-slate-900/5 mb-10 flex flex-wrap sm:flex-nowrap gap-2 font-sans">
          {steps.map((step, idx) => {
            const isActive = activeStep === idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`flex-1 min-w-[140px] py-3.5 px-4 rounded-xl text-left transition-all duration-300 relative flex items-center justify-between gap-3 font-sans ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md shadow-[#fff]/25 ring-2 ring-[#9D00FF]/30"
                    : "hover:bg-[#fff]/20 text-white hover:text-black hover:shadow-sm hover:shadow-[#fff]/25"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[14px] font-black transition-colors ${
                      isActive ? "text-[#9D00FF]" : "text-white"
                    }`}
                  >
                    {step.number}
                  </span>
                  <span className="text-[14px] font-bold line-clamp-1">
                    {step.title}
                  </span>
                </div>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#9D00FF] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* ================= 3. MAIN LIGHT FROSTED GLASS SHOWCASE ================= */}
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative overflow-hidden font-sans">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -15, filter: "blur(10px)" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* LEFT COLUMN: STEP TEXT DETAILS */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-[#9D00FF]">
                    {steps[activeStep].number}
                  </span>
                  <div className="h-4 w-px bg-slate-200" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {steps[activeStep].subtitle}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                  {steps[activeStep].title}
                </h3>

                <p className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
                    <span>Instant deployment without technical setup</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
                    <span>Full enterprise SOC2 encryption & security</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <a
                    href="/get-started"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-sm shadow-lg shadow-[#9D00FF]/25 transition-all duration-200 active:scale-95"
                  >
                    <span>Execute Step {activeStep + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  {activeStep < steps.length - 1 && (
                    <button
                      onClick={() => setActiveStep((prev) => prev + 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: LIGHT GLASS INTERACTIVE PREVIEW WIDGET */}
              <div className="lg:col-span-7 bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
                {/* Mockup Window Top Header */}
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-bold text-slate-400">
                      app.orvixa.com / setup / step-0{activeStep + 1}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold bg-[#9D00FF]/10 text-[#9D00FF] px-3 py-1 rounded-full">
                    Live UI Simulation
                  </span>
                </div>

                {/* STEP 1 PREVIEW: SSO & Passkey */}
                {activeStep === 0 && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900">
                            Passkey & SSO Verification
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            Instant secure access to Orvixa Cloud
                          </div>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-[#9D00FF]" />
                      </div>

                      <div className="space-y-2.5">
                        <div className="w-full bg-slate-900 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between shadow-sm cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <Globe className="w-4 h-4 text-blue-400" />
                            <span>Continue with Google Single Sign-On</span>
                          </div>
                          <Check className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="w-full bg-white text-slate-800 font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-between border border-slate-200 hover:bg-slate-50 cursor-pointer">
                          <div className="flex items-center gap-2.5">
                            <Zap className="w-4 h-4 text-amber-500" />
                            <span>Passkey / Hardware Security Key</span>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            Ready
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2 PREVIEW: Mode Selector */}
                {activeStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white border-2 border-[#9D00FF] p-5 rounded-xl shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <User className="w-6 h-6 text-[#9D00FF]" />
                        <span className="text-[10px] bg-[#9D00FF] text-white font-bold px-2.5 py-0.5 rounded">
                          Active
                        </span>
                      </div>
                      <div className="font-bold text-sm text-slate-900">
                        Freelancer Mode
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Solo task management, client portal sharing & time
                        tracking.
                      </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl opacity-75">
                      <div className="flex justify-between items-center mb-3">
                        <Building className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div className="font-bold text-sm text-slate-900">
                        Organization Mode
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                        Multi-team sprints, custom RBAC & enterprise reporting.
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 3 PREVIEW: Team Magic Invite */}
                {activeStep === 2 && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-xs font-bold text-slate-900">
                        Workspace Magic Invite Link
                      </div>
                      <Users className="w-4 h-4 text-[#9D00FF]" />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value="https://app.orvixa.com/join/workspace-sprint-v2"
                        className="bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 px-3 py-2.5 rounded-xl w-full"
                      />
                      <button className="bg-[#9D00FF] text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 hover:bg-[#7A00CC] transition-colors flex items-center gap-1.5">
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold pt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>3 Team slots pre-allocated and ready to sync</span>
                    </div>
                  </div>
                )}

                {/* STEP 4 PREVIEW: AI Engine Terminal */}
                {activeStep === 3 && (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#9D00FF]">
                        <Sparkles className="w-4 h-4 text-[#9D00FF]" />
                        <span>Orvixa AI Engine Initialized</span>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                        100% Active
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <span>
                          Indexed 14 project boards & task dependencies
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <span>
                          Created automated daily team standup schedule
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </div>
                        <span>Workload balancing & sprint triage active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
