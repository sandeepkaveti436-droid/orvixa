"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  FolderKanban,
  MessageSquare,
  Sparkles,
  Clock,
  BarChart3,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export default function Features() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const featuresList = [
    {
      id: "projects",
      title: "Smart Project Management",
      description:
        "Plan, organize, and deliver projects efficiently with intuitive boards, milestones, and timelines.",
      icon: FolderKanban,
      badge: "Agile Boards",
      isAiHighlighted: false,
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      description:
        "Communicate effortlessly through built-in chat, comments, mentions, and shared workspaces.",
      icon: MessageSquare,
      badge: "Real-Time Chat",
      isAiHighlighted: false,
    },
    {
      id: "ai",
      title: "AI Productivity",
      description:
        "Use AI to generate tasks, summarize meetings, prioritize work, and automate repetitive workflows.",
      icon: Sparkles,
      badge: "Powered by Orvixa AI",
      isAiHighlighted: true, // Special glowing featured card
    },
    {
      id: "time",
      title: "Time Tracking",
      description:
        "Track work hours accurately for freelancers and teams with automatic reports.",
      icon: Clock,
      badge: "Auto Timesheets",
      isAiHighlighted: false,
    },
    {
      id: "analytics",
      title: "Analytics",
      description:
        "Gain actionable insights with real-time dashboards, productivity metrics, and performance reports.",
      icon: BarChart3,
      badge: "Live Dashboards",
      isAiHighlighted: false,
    },
    {
      id: "security",
      title: "Secure Workspace",
      description:
        "Enterprise-grade authentication, encrypted storage, and role-based access control keep your data protected.",
      icon: ShieldCheck,
      badge: "Encrypted & Compliant",
      isAiHighlighted: false,
    },
  ];

  return (
    <section
      id="features"
      className="relative py-12 sm:py-18 px-4 sm:px-6 lg:px-8 bg-slate-50 overflow-hidden font-sans border-b border-slate-200/80"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#0047AB]/10 via-indigo-400/10 to-purple-500/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-8xl mx-auto relative z-10">
        {/* ================= HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#0047AB]/20 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0047AB]">
              Features & Capabilities
            </span>
          </div>

          <div className="text-base text-[20px] sm:text-[22px] lg:text-[32px] font-bold text-slate-900 mb-6">
            Everything your business needs
            <h2>
              <span className="block italic pr-2 pb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#0047AB] via-indigo-600 to-purple-600">
                in one platform.
              </span>
            </h2>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed text-balance">
            Replace scattered tools with Orvixa's unified suite. Built for
            speed, collaboration, and effortless scaling.
          </p>
        </div>

        {/* ================= 3x2 FEATURES GRID ================= */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-3"
        >
          {featuresList.map((feature) => {
            const IconComponent = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className={`group relative rounded-2xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between ${
                  feature.isAiHighlighted
                    ? "bg-gradient-to-b from-white via-white to-blue-50/50 border-2 border-[#0047AB]/40 shadow-xl shadow-[#0047AB]/10"
                    : "bg-white/80 hover:bg-white border border-slate-200/80 hover:border-[#0047AB]/30 shadow-md shadow-slate-900/5 hover:shadow-xl hover:shadow-[#0047AB]/10"
                }`}
              >
                {/* AI Card Ambient Glow Accent */}
                {feature.isAiHighlighted && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0047AB]/20 via-indigo-500/10 to-transparent rounded-tr-2xl pointer-events-none" />
                )}

                <div>
                  {/* Top Bar inside Card: Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        feature.isAiHighlighted
                          ? "bg-[#0047AB] text-white shadow-lg shadow-[#0047AB]/30"
                          : "bg-[#0047AB]/10 text-[#0047AB] group-hover:bg-[#0047AB] group-hover:text-white"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        feature.isAiHighlighted
                          ? "bg-[#0047AB]/10 text-[#0047AB] border-[#0047AB]/30 font-extrabold"
                          : "bg-slate-100 text-slate-600 border-slate-200/60"
                      }`}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  <div className="text-[18px] sm:text-[18px] font-bold text-slate-900 mb-3 group-hover:text-[#0047AB] transition-colors">
                    {feature.title}
                  </div>

                  <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0047AB] opacity-80 group-hover:opacity-100 transition-opacity">
                  <span>Explore Capability</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
