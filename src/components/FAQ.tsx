"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Building2,
  Zap,
} from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? index : index);
  };

  const faqs = [
    {
      question: "What is Orvixa and how does it help my business?",
      answer:
        "Orvixa is an intelligent, AI-powered work management platform that unifies project tracking, time logging, client invoicing, team communication, and automated reporting into one seamless workspace. It replaces multiple scattered tools to save time and boost productivity.",
      badge: "Platform Overview",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80",
      caption: "Orvixa Unified Collaborative Glass Workspace",
    },
    {
      question: "How does the 14-day free trial work?",
      answer:
        "You get full, unrestricted access to all Orvixa features for 14 days. No credit card is required to sign up. Once your trial ends, you can choose a plan that best fits your workflow or continue with our free Starter tier.",
      badge: "Pricing & Billing",
      icon: CreditCard,
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80",
      caption: "Transparent Billing & Free Trial Access",
    },
    {
      question:
        "What is the difference between Freelancer App and Admin Dashboard?",
      answer:
        "The Freelancer App is built specifically for solopreneurs with client portals, time tracking, invoicing, and portfolio management. The Admin Dashboard is engineered for growing teams and enterprises to manage staff directories, RBAC permissions, and team performance metrics.",
      badge: "Specialized Products",
      icon: Building2,
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
      caption: "Tailored Platforms for Solopreneurs & Enterprises",
    },
    {
      question: "How secure is my data on Orvixa?",
      answer:
        "Security is our highest priority. Orvixa utilizes enterprise-grade SOC2 compliance, AES-256 encrypted storage at rest and in transit, role-based access control (RBAC), and secure Single Sign-On (SSO) / Passkey authentication.",
      badge: "Enterprise Security",
      icon: ShieldCheck,
      image:
        "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80",
      caption: "SOC2 Compliant & AES-256 Encrypted Infrastructure",
    },
    {
      question: "Can I integrate Orvixa with my existing tools?",
      answer:
        "Yes! Orvixa integrates seamlessly with Google Workspace, Slack, Zoom, Stripe, Figma, Notion, and custom webhooks via our developer REST API.",
      badge: "Ecosystem Integrations",
      icon: Zap,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      caption: "Connected Tech Ecosystem & REST API",
    },
    {
      question: "Can I switch plans or cancel anytime?",
      answer:
        "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account billing settings. There are no lock-in contracts or cancellation penalties.",
      badge: "Flexible Subscriptions",
      icon: HelpCircle,
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
      caption: "Zero Contracts, Total Billing Flexibility",
    },
  ];

  const currentFaq = faqs[openIndex];

  return (
    <section
      id="faq"
      className="relative py-12 sm:py-18 px-4 sm:px-6 lg:px-8 bg-[#ffffff] overflow-hidden font-sans border-b border-slate-200/80"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[750px] h-[400px] bg-gradient-to-tr from-[#0047AB]/10 via-indigo-300/15 to-purple-400/10 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 font-sans">
        {/* ================= 1. SECTION HEADER ================= */}
        <div className="text-center max-w-8xl mx-auto mb-6 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#0047AB]/20 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#0047AB] font-sans">
              Got Questions?
            </span>
          </div>

          <h2 className="text-[20px] sm:text-[24px] lg:text-[32px] font-black leading-[1.15] text-slate-900 mb-6 font-sans">
            <span>Frequently <br/> </span>
            <span className="inline-block font-heading italic text-[#0047AB] pr-2 pb-1">
              asked questions.
            </span>
          </h2>

          <p className="text-base sm:text-lg font-medium text-slate-600 leading-relaxed text-balance font-sans">
            Everything you need to know about Orvixa, subscription plans,
            integrations, and enterprise security.
          </p>
        </div>

        {/* ================= 2. SPLIT LAYOUT: EQUAL HEIGHT STRETCH ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch font-sans">
          {/* LEFT COLUMN: AUTO-EXPANDING FULL-HEIGHT IMAGE CONTAINER */}
          <div className="lg:col-span-5 font-sans h-full flex flex-col">
            <div className="bg-white p-3 rounded-[18px] border border-slate-200/90 relative overflow-hidden font-sans h-full flex flex-col">
              <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] rounded-[18px] overflow-hidden flex-1">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentFaq.image}
                    src={currentFaq.image}
                    alt={currentFaq.badge}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full object-cover object-center absolute inset-0"
                  />
                </AnimatePresence>

                {/* Top Badge Overlay */}
                <div className="absolute top-4 left-4 font-sans z-10">
                  <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-900">
                    <span className="text-[#0047AB]">✨</span>
                    <span>{currentFaq.badge}</span>
                  </span>
                </div>

                {/* Bottom Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 text-white font-sans z-10">
                  <p className="text-xs font-bold text-slate-200">
                    {currentFaq.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACCORDION QUESTIONS LIST */}
          <div className="lg:col-span-7 space-y-4 font-sans flex flex-col justify-between">
            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                const IconComp = faq.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden font-sans ${
                      isOpen
                        ? "bg-white border-[#0047AB]/50 shadow-lg shadow-[#0047AB]/5 ring-2 ring-[#0047AB]/10"
                        : "bg-white/80 hover:bg-white border-slate-200/90"
                    }`}
                  >
                    {/* Accordion Question Header */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full text-left p-3 sm:p-4 flex items-center justify-between gap-4 focus:outline-none font-sans"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? "bg-[#0047AB] text-white"
                              : "bg-[#0047AB]/10 text-[#0047AB]"
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="font-sans font-medium text-base sm:text-lg text-slate-900 leading-snug">
                          {faq.question}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                            isOpen
                              ? "rotate-180 bg-[#0047AB]/10 text-[#0047AB]"
                              : "text-slate-400"
                          }`}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </button>

                    {/* Animated Answer Dropdown Body */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden font-sans"
                        >
                          <div className="px-6 sm:px-6 pb-6 pt-1 text-[16px] sm:text-[16px] font-regular  font-sans">
                            <p className="pt-2">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= 3. SUPPORT CONTACT BANNER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-2xl p-6 sm:p-4 text-center flex flex-col sm:flex-row items-center justify-between gap-6 font-sans"
        >
          <div className="flex items-center gap-4 text-left font-sans">
            <div className="w-12 h-12 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 ">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-lg text-slate-900">
                Still have questions?
              </h3>
              <p className="font-sans text-xs sm:text-sm font-medium text-slate-500">
                Our support team is available 24/7 to help you set up your
                workspace.
              </p>
            </div>
          </div>

          <a
            href="/contact-sales"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#0047AB] hover:bg-[#003680] text-white font-medium text-sm shadow-md shadow-[#0047AB]/25 transition-all active:scale-95 shrink-0 font-sans"
          >
            <span>Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
