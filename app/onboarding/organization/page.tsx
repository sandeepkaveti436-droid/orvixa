"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Upload, CheckCircle2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrgOnboardingPage() {
  const [step, setStep] = useState(1);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [setupData, setOrgSetupData] = useState({
    timezone: "UTC - 05:00 (Eastern Time)",
    firstTeamName: "Engineering & Product",
    employeeEmails: "",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFinishSetup = async () => {
    try {
      const storedUser = localStorage.getItem("orvixa_user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        await supabase
          .from("profiles")
          .update({
            timezone: setupData.timezone,
            setup_completed: true,
          })
          .eq("id", user.id);
      }
    } catch (e) {
      console.log("Saving onboarding state...");
    }
    window.location.href = "/dashboard/admin";
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#0047AB]/15 via-indigo-300/15 to-purple-400/10 blur-[140px] rounded-full" />
      </div>

      <div className="w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl relative z-10 font-sans">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 font-sans">
          <div className="flex items-center gap-2.5">
            <Image
              src="/orviax.jpg"
              alt="Orvixa Logo"
              width={32}
              height={32}
              className="rounded-xl object-contain"
              priority
            />
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
              Orvixa Setup
            </span>
          </div>

          <span className="text-xs font-bold text-[#0047AB] bg-[#0047AB]/10 px-3 py-1 rounded-full">
            Step {step} of 4
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: LOGO & TIMEZONE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Upload Logo & </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Timezone
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Customize your organization branding and regional settings.
                </p>
              </div>

              {/* Logo Upload Box */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">
                    PNG, JPG or SVG up to 5MB
                  </p>
                </div>
              </div>

              {/* Timezone Select */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company Timezone
                </label>
                <select
                  value={setupData.timezone}
                  onChange={(e) =>
                    setOrgSetupData({ ...setupData, timezone: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                >
                  <option>UTC - 08:00 (Pacific Time)</option>
                  <option>UTC - 05:00 (Eastern Time)</option>
                  <option>UTC + 00:00 (Greenwich Mean Time)</option>
                  <option>UTC + 05:30 (India Standard Time)</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: CREATE FIRST TEAM */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Create First </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Department Team
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Organize your employees into functional project teams.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Engineering"
                  value={setupData.firstTeamName}
                  onChange={(e) =>
                    setOrgSetupData({
                      ...setupData,
                      firstTeamName: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3.5 px-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: INVITE EMPLOYEES */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Invite </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Employees
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Enter team member emails to send workspace invitations.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Employee Email Addresses
                </label>
                <textarea
                  rows={3}
                  placeholder="alex@acme.com, sarah@acme.com"
                  value={setupData.employeeEmails}
                  onChange={(e) =>
                    setOrgSetupData({
                      ...setupData,
                      employeeEmails: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm py-3.5 px-4 rounded-xl transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="w-2/3 bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Finish Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: SETUP COMPLETE */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4 font-sans"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Workspace Setup </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Complete!
                  </span>
                </h1>
                <p className="text-xs font-bold text-slate-500">
                  Your Orvixa Admin Dashboard is configured and ready to go.
                </p>
              </div>

              <button
                onClick={handleFinishSetup}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
              >
                <span>Go to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
