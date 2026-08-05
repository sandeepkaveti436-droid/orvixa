"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Upload, CheckCircle2, ArrowRight } from "lucide-react";

export default function FreelancerOnboardingPage() {
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [setupData, setFreelancerSetupData] = useState({
    skills: "UI/UX Design, Figma, Next.js, React",
    hourlyRate: "65",
    currency: "USD ($)",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleComplete = () => {
    window.location.href = "/dashboard/freelancer";
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
              Freelancer Setup
            </span>
          </div>

          <span className="text-xs font-bold text-[#0047AB] bg-[#0047AB]/10 px-3 py-1 rounded-full">
            Step {step} of 3
          </span>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: PHOTO & SKILLS */}
          {step === 1 && (
            <motion.div
              key="fstep1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Upload Photo & </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Skills
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Set up your professional portfolio profile.
                </p>
              </div>

              {/* Photo Box */}
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">
                    JPG or PNG up to 5MB
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Key Skills & Services
                </label>
                <input
                  type="text"
                  value={setupData.skills}
                  onChange={(e) =>
                    setFreelancerSetupData({
                      ...setupData,
                      skills: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
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

          {/* STEP 2: RATES & CURRENCY */}
          {step === 2 && (
            <motion.div
              key="fstep2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Billing Rates & </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Currency
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Configure default invoice currency and target hourly rate.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={setupData.hourlyRate}
                    onChange={(e) =>
                      setFreelancerSetupData({
                        ...setupData,
                        hourlyRate: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Currency
                  </label>
                  <select
                    value={setupData.currency}
                    onChange={(e) =>
                      setFreelancerSetupData({
                        ...setupData,
                        currency: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
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
                  <span>Complete Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPLETE */}
          {step === 3 && (
            <motion.div
              key="fstep3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 text-center py-4 font-sans"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Profile Setup </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Complete!
                  </span>
                </h1>
                <p className="text-xs font-bold text-slate-500">
                  Your Freelancer workspace is ready.
                </p>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
              >
                <span>Go to Freelancer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
