"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Send, Copy, Check, RefreshCw } from "lucide-react";

export default function AiAssistantPage() {
  const [clientName, setClientName] = useState("");
  const [projectScope, setProjectScope] = useState("");
  const [budget, setBudget] = useState("5000");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const handleGenerateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedProposal(
        `# Project Proposal for ${clientName || "Client"}
Prepared by Sarah Jenkins (Orvixa Freelancer)

## Executive Summary
We are pleased to submit this proposal for ${projectScope || "UI/UX Design & Next.js Web Application Development"}. Our team specializes in high-performance digital products that scale.

## Scope of Work & Deliverables
1. **Discovery & Architecture:** Complete wireframes & UX component hierarchy.
2. **Design & Prototyping:** Figma design system in light/dark modes.
3. **Frontend Implementation:** Next.js 15, Tailwind CSS, & Supabase backend.

## Proposed Investment
- Total Budget: $${budget || "5,000"}.00 USD
- Timeline: 3 Weeks
- Payment Terms: 50% upfront, 50% upon milestone completion.`,
      );
      setIsGenerating(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (generatedProposal) {
      navigator.clipboard.writeText(generatedProposal);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Orvixa AI Copilot Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          AI Proposal & Contract Generator
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Draft professional client proposals, contracts, and pitch emails in
          seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Form */}
        <form
          onSubmit={handleGenerateProposal}
          className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>Proposal Parameters</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Client Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe Global"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Project Scope & Deliverables
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Mobile iOS app redesign with Figma design system and Next.js frontend."
              value={projectScope}
              onChange={(e) => setProjectScope(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Proposed Budget ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGenerating
                ? "Generating Proposal..."
                : "✨ Generate AI Proposal"}
            </span>
          </button>
        </form>

        {/* Generated Output Preview */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm min-h-[380px] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <span className="text-xs font-bold uppercase text-slate-400">
                Generated AI Proposal
              </span>
              {generatedProposal && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? "Copied!" : "Copy Markdown"}</span>
                </button>
              )}
            </div>

            {generatedProposal ? (
              <pre className="font-mono text-xs text-slate-800 bg-slate-50 p-4 rounded-xl whitespace-pre-wrap leading-relaxed border border-slate-200">
                {generatedProposal}
              </pre>
            ) : (
              <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                Fill in the client scope on the left and click "Generate AI
                Proposal".
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
