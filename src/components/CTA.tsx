"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2, Play } from "lucide-react";

export default function CTA() {
  return (
    <section
      id="cta"
      className="relative py-12 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#ffffff] overflow-hidden font-sans"
    >
      <div className="max-w-8xl mx-auto relative z-10 font-sans">
        {/* ================= GRAND FROSTED GLASS CTA CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white p-8 sm:p-14 lg:p-6 relative overflow-hidden text-center flex flex-col items-center font-sans"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#9D00FF]/10 border border-[#9D00FF]/20 text-[#9D00FF] text-xs font-bold mb-6 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-[#9D00FF]" />
            <span className="font-sans">Start Your 14-Day Free Trial</span>
          </div>

          {/* Main Heading */}
          <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-black leading-[1.15] text-slate-900 mb-6 max-w-3xl font-sans">
            <span>
              Ready to transform <br />
            </span>
            <span className="inline-block font-heading italic pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#9D00FF] via-indigo-600 to-purple-600">
              the way you work?
            </span>
          </h2>

          {/* Description */}
          <p className="text-[16px] sm:text-[16px] font-medium text-slate-600 leading-relaxed max-w-2xl mb-10 text-balance font-sans">
            Join thousands of professionals and organizations using Orvixa to
            simplify work, boost productivity, and scale faster.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-10 font-sans">
            {/* Primary Button */}
            <a
              href="/get-started"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-2.5 rounded-xl bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-medium text-base shadow-lg shadow-[#9D00FF]/25 hover:shadow-xl transition-all duration-200 active:scale-95 font-sans"
            >
              <span>Start Free</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            {/* Secondary Button */}
            <button
              onClick={() => alert("Book Demo clicked")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-2 rounded-xl bg-white text-[#9D00FF] border-2 border-[#9D00FF] hover:bg-[#9D00FF]/5 font-medium text-base shadow-sm transition-all duration-200 active:scale-95 font-sans"
            >
              <div className="w-6 h-6 rounded-full bg-[#9D00FF]/10 flex items-center justify-center">
                <Play className="w-3 h-3 text-[#9D00FF] fill-current ml-0.5" />
              </div>
              <span>Book Demo</span>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs sm:text-sm font-semibold text-slate-500 font-sans">
            <div className="flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
              <span>Instant 2-minute setup</span>
            </div>
            <div className="flex items-center gap-1.5 font-sans">
              <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
