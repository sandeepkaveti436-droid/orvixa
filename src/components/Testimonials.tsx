"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Testimonials loaded from database
  const testimonials: Array<{id: string; quote: string; role: string; company: string; grade: string; rating: number; photo: string}> = [];

  // Auto-scroll logic (5 seconds interval)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeIndex, isPaused]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const current = testimonials[activeIndex];

  // Show placeholder when no testimonials are available
  if (testimonials.length === 0) {
    return (
      <section
        id="testimonials"
        className="relative py-12 sm:py-18 px-4 sm:px-8 lg:px-12 bg-[#FAF6EE] overflow-hidden font-sans border-b border-slate-200/80"
      >
        <div className="max-w-8xl mx-auto relative z-10">
          <div className="text-center py-12">
            <p className="text-xs sm:text-sm font-bold text-[#0047AB] uppercase tracking-wider mb-2 font-sans">
              Testimonials
            </p>
            <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-black text-slate-900 leading-tight font-sans mb-4">
              Client Success Stories
            </h2>
            <p className="text-slate-500 font-semibold text-sm">
              Testimonials will appear here as your clients share their experiences.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="relative py-12 sm:py-18 px-4 sm:px-8 lg:px-12 bg-[#FAF6EE] overflow-hidden font-sans border-b border-slate-200/80"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-8xl mx-auto relative z-10">
        {/* ================= 1. TOP HEADER & NAV BUTTONS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 font-sans">
          {/* Left Title Block */}
          <div>
            <p className="text-xs sm:text-sm font-bold text-[#0047AB] uppercase tracking-wider mb-2 font-sans">
              Testimonials
            </p>
            <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-black text-slate-900 leading-tight font-sans">
              <span>What our </span>
              <span className="inline-block font-heading italic text-[#0047AB] pr-2 pb-1">
                Clients Say
              </span>
            </h2>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto font-sans">
            <button
              onClick={handlePrev}
              aria-label="Previous Testimonial"
              className="inline-flex items-center gap-2 px-8 py-2 rounded-[12px] bg-white border border-slate-300 hover:border-[#0047AB] hover:text-[#0047AB] text-slate-700 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              aria-label="Next Testimonial"
              className="inline-flex items-center gap-2 px-8 py-2 rounded-[12px] bg-[#0047AB] hover:bg-[#003680] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0047AB]/25 transition-all active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 2. SINGLE CARD SHOWCASE ================= */}
        <div className="min-h-[380px] sm:min-h-[350px] relative font-sans">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-lg shadow-slate-900/5 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10 font-sans w-full"
            >
              {/* Left Quote & Meta Text */}
              <div className="flex-1 flex flex-col justify-between h-full space-y-6 sm:space-y-8">
                {/* REVIEWS & RATING ON TOP OF QUOTE */}
                <div className="space-y-1 font-sans">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 gap-0.5">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {current.grade}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      • Verified Review
                    </span>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-xl font-medium text-slate-800 leading-relaxed font-sans">
                  "{current.quote}"
                </p>

                {/* Author Info */}
                <div className="pt-2 font-sans">
                  <h3 className="font-bold text-base sm:text-xl text-slate-900 font-sans leading-tight">
                    {current.role}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-[#0047AB] font-sans mt-1">
                    {current.company}
                  </p>
                </div>
              </div>

              {/* Right Image Block - FIXED OBJECT-TOP POSITIONING */}
              <div className="w-full sm:w-[44%] h-64 sm:h-80 relative overflow-hidden rounded-2xl sm:rounded-r-3xl shrink-0">
                <div
                  className="w-full h-full relative"
                  style={{
                    clipPath: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <img
                    src={current.photo}
                    alt={current.role}
                    className="w-full h-full object-cover object-top rounded-2xl sm:rounded-r-3xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= 3. BOTTOM PAGINATION INDICATORS ================= */}
        <div className="flex items-center justify-center gap-2.5 mt-8 font-sans">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                activeIndex === idx
                  ? "w-8 h-2.5 bg-[#0047AB] shadow-md shadow-[#0047AB]/30"
                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
