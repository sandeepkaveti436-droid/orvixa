"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Download, Copy, Check } from "lucide-react";

export default function AiProposalsPage() {
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("Next.js Web Application");
  const [budget, setBudget] = useState("5000");
  const [timeline, setTimeline] = useState("3 Weeks");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setOutput(
        `# Executive Proposal for ${clientName || "Client"}
Prepared by Orvixa AI Copilot

## 1. Executive Summary
We propose delivering a high-performance ${projectType} designed to scale your operational velocity and double user conversions.

## 2. Scope of Work & Deliverables
- Complete UX Wireframes & Figma Design System
- Frontend Implementation using Next.js 15 & Tailwind CSS
- Supabase Authentication & PostgreSQL Database Integration

## 3. Timeline & Investment
- Timeline: ${timeline}
- Total Project Budget: $${budget}.00 USD
- Terms: 50% Upfront, 50% upon final sign-off.`,
      );
      setIsGenerating(false);
    }, 1000);
  };

  const handleExport = (format: "pdf" | "docx") => {
    alert(
      `Exporting Proposal for ${clientName} as ${format.toUpperCase()}... File generated!`,
    );
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>AI Proposal </span>
          <span className="font-heading italic text-[#0047AB]">Generator.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Generate client proposals with Executive Summaries, Scope of Work, and
          PDF/DOCX export.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <form
          onSubmit={handleGenerate}
          className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 font-sans"
        >
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Client Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            >
              <option>Next.js Web Application</option>
              <option>iOS & Android Mobile App</option>
              <option>Brand Identity Package</option>
              <option>Growth Marketing Strategy</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Timeline
              </label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating ? "Generating..." : "✨ Generate Proposal"}
            </span>
          </button>
        </form>

        {/* Output */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[360px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase">
                AI Proposal Output
              </span>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => handleExport("docx")}
                    className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> DOCX
                  </button>
                </div>
              )}
            </div>

            {output ? (
              <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl whitespace-pre-wrap leading-relaxed border border-slate-200">
                {output}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                Fill in the client scope and click "Generate Proposal".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
