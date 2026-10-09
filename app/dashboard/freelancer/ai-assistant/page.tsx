"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  FileText,
  FileCode,
  Mail,
  Copy,
  Printer,
  Loader2,
  Check,
  FolderKanban,
  Eye,
  Code,
  Plus,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type DocumentType = "proposal" | "contract" | "pitch" | "sow";

interface GeneratedDocument {
  title: string;
  client: string;
  date: string;
  currency: string;
  executiveSummary: string;
  deliverables: { phase: string; timeline: string; details: string }[];
  terms: string[];
  budget: number;
}

export default function AiAssistantPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<"preview" | "markdown">(
    "preview",
  );
  const [docType, setDocType] = useState<DocumentType>("proposal");

  // Currency Selection State (Defaults to ₹ INR)
  const [selectedCurrency, setSelectedCurrency] = useState<string>("₹");

  // Form Parameters
  const [params, setParams] = useState({
    clientName: "",
    projectTitle: "",
    scope: "",
    budget: "",
    timeline: "",
  });

  // Generated Document State
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument>({
    title: "",
    client: "",
    date: "",
    currency: "₹",
    executiveSummary: "",
    deliverables: [],
    terms: [],
    budget: 0,
  });

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setProjects(data);
      } catch (e) {
        console.error(e);
      }
    }
    loadProjects();
  }, []);

  // 1. Create New Blank Proposal Handler
  const handleStartNewBlankProposal = () => {
    setParams({
      clientName: "",
      projectTitle: "",
      scope: "",
      budget: "25000",
      timeline: "3 Weeks",
    });
  };

  // 2. Auto-Fill from existing live project
  const handleAutoFillFromProject = (projectId: string) => {
    if (!projectId) {
      handleStartNewBlankProposal();
      return;
    }

    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setParams({
        clientName: proj.client || "",
        projectTitle: proj.name || "",
        scope: proj.description || "",
        budget: proj.budget == null ? "" : String(proj.budget),
        timeline: proj.due_date ? `Due: ${proj.due_date}` : "",
      });
    }
  };

  // AI Generator Engine
  const handleGenerate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (
      !params.clientName.trim() ||
      !params.projectTitle.trim() ||
      !params.scope.trim() ||
      !params.budget.trim()
    ) {
      return;
    }
    setIsGenerating(true);

    setTimeout(() => {
      const budgetNum = parseFloat(params.budget) || 0;
      const currCode =
        selectedCurrency === "₹"
          ? "INR"
          : selectedCurrency === "$"
            ? "USD"
            : selectedCurrency === "€"
              ? "EUR"
              : "INR";
      const clientDisplay = params.clientName.trim();
      const projectDisplay = params.projectTitle.trim();

      setGeneratedDoc({
        title: `Project Proposal for ${projectDisplay}`,
        client: clientDisplay,
        date: new Date().toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        currency: selectedCurrency,
        executiveSummary: `We are pleased to submit this proposal for ${params.scope}. Sky Nova Digitals specializes in architecting high-performance digital products and conversion-focused systems for ${clientDisplay}.`,
        deliverables: [
          {
            phase: "Phase 1: Wireframing & UX Architecture",
            timeline: "Week 1",
            details:
              "Complete wireframes, user flow mapping, and conversion-focused UI component hierarchy.",
          },
          {
            phase: "Phase 2: High-Fidelity UI & Responsive Design",
            timeline: "Week 1 - 2",
            details:
              "Figma design system in light/dark modes, custom illustrations, and responsive breakpoints.",
          },
          {
            phase: "Phase 3: Frontend Implementation & Launch",
            timeline: params.timeline,
            details:
              "Next.js 15, Tailwind CSS, Supabase backend integration, and SEO optimization.",
          },
        ],
        terms: [
          `Total Consideration: ${selectedCurrency}${budgetNum.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ${currCode}`,
          ...(params.timeline ? [`Timeline: ${params.timeline}`] : []),
          "Payment Terms: 50% upfront deposit, 50% upon milestone completion and deployment.",
        ],
        budget: budgetNum,
      });

      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    const textToCopy = `# ${generatedDoc.title}\nClient: ${generatedDoc.client}\nTotal Investment: ${generatedDoc.currency}${generatedDoc.budget.toLocaleString("en-IN")}\n\n## Executive Summary\n${generatedDoc.executiveSummary}\n\n## Scope of Work & Deliverables\n${generatedDoc.deliverables.map((d, i) => `${i + 1}. **${d.phase}:** ${d.details}`).join("\n")}\n\n## Proposed Investment\n${generatedDoc.terms.map((t) => `- ${t}`).join("\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16 max-w-7xl mx-auto">
      {/* ================= 1. HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-sans">
            <span className="text-[11px] font-bold text-[#9D00FF] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5 text-[#9D00FF]" />
              <span>Orvixa AI Copilot Engine</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            <span>AI Proposal & </span>
            <span className="italic text-[#9D00FF]">Contract Studio.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 font-sans">
            Draft professional client proposals, contracts, and pitch emails in
            seconds.
          </p>
        </div>

        {/* Header Action: + New Blank Proposal Button & Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2.5 font-sans">
          <button
            onClick={handleStartNewBlankProposal}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Blank Proposal</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl font-sans">
            {[
              { id: "proposal", label: "Proposal", icon: FileText },
              { id: "contract", label: "Agreement", icon: FileCode },
              { id: "pitch", label: "Pitch Email", icon: Mail },
            ].map((mode) => {
              const Icon = mode.icon;
              const isActive = docType === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => {
                    setDocType(mode.id as DocumentType);
                    setTimeout(() => handleGenerate(), 50);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 font-sans ${
                    isActive
                      ? "bg-white text-[#9D00FF] shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. TWO-COLUMN STUDIO ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
        {/* LEFT COLUMN: PARAMETERS */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 font-sans">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 font-sans">
              <FileText className="w-4 h-4 text-[#9D00FF]" />
              <span>Proposal Parameters</span>
            </h3>

            <button
              type="button"
              onClick={handleStartNewBlankProposal}
              className="text-[11px] font-bold text-[#9D00FF] hover:underline flex items-center gap-1 font-sans"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Form</span>
            </button>
          </div>

          {/* Project Auto-Fill Dropdown */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1.5 font-sans">
            <label className="text-[11px] font-bold text-[#9D00FF] block flex items-center gap-1.5 font-sans">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Auto-Fill from Live Workspace Project</span>
            </label>
            <select
              onChange={(e) => handleAutoFillFromProject(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#9D00FF] font-sans cursor-pointer"
            >
              <option value="">+ Create for New / Custom Client --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Client: {p.client} — {selectedCurrency}
                  {Number(p.budget).toLocaleString("en-IN")})
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 font-sans">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Client Business Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Global Inc."
                value={params.clientName}
                onChange={(e) =>
                  setParams({ ...params, clientName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#9D00FF] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Next.js SaaS Web App & Design System"
                value={params.projectTitle}
                onChange={(e) =>
                  setParams({ ...params, projectTitle: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#9D00FF] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Project Scope & Deliverables
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Landing pages, wireframes, component design system..."
                value={params.scope}
                onChange={(e) =>
                  setParams({ ...params, scope: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-[#9D00FF] font-sans leading-relaxed"
              />
            </div>

            {/* Currency Selector + Budget Field */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Proposed Budget & Currency
              </label>
              <div className="flex rounded-xl border border-slate-300 bg-slate-50 overflow-hidden focus-within:border-[#9D00FF] transition font-sans">
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-slate-100 border-r border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-800 outline-none cursor-pointer hover:bg-slate-200 transition shrink-0 font-sans"
                >
                  <option value="₹">₹ INR (₹)</option>
                  <option value="$">$ USD ($)</option>
                  <option value="€">€ EUR (€)</option>
                  <option value="£">£ GBP (£)</option>
                  <option value="AED">AED (AED)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={params.budget}
                  onChange={(e) =>
                    setParams({ ...params, budget: e.target.value })
                  }
                  className="w-full bg-transparent px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#9D00FF]/20 flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2 font-sans"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Proposal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Proposal ({selectedCurrency})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: DOCUMENT OUTPUT */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 font-sans">
            <div className="flex items-center gap-2 font-sans">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-bold text-slate-800 font-sans uppercase">
                GENERATED AI PROPOSAL
              </span>
              <span className="text-[10px] font-bold bg-blue-50 text-[#9D00FF] px-2 py-0.5 rounded-full font-sans">
                {selectedCurrency}
              </span>
            </div>

            <div className="flex items-center gap-2 font-sans">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl font-sans">
                <button
                  onClick={() => setActiveView("preview")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition font-sans ${
                    activeView === "preview"
                      ? "bg-white text-[#9D00FF] shadow-sm"
                      : "text-slate-500"
                  }`}
                  title="Document Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setActiveView("markdown")}
                  className={`p-1.5 rounded-lg text-xs font-bold transition font-sans ${
                    activeView === "markdown"
                      ? "bg-white text-[#9D00FF] shadow-sm"
                      : "text-slate-500"
                  }`}
                  title="Markdown"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 font-sans"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 font-sans shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {generatedDoc.title ? (
            activeView === "preview" ? (
              <div className="bg-[#FAF6EE]/50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-6 font-sans text-slate-900 shadow-inner">
                {/* Document Header with SND Logo */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-5 font-sans">
                  <div>
                    {/* Official SND Logo Image */}
                    <img
                      src="/snd-logo.png"
                      alt="SND - Sky Nova Digitals"
                      className="h-12 sm:h-14 w-auto object-contain mb-1"
                      onError={(e: any) => {
                        e.currentTarget.style.display = "none";
                        const fallback =
                          document.getElementById("proposal-text-logo");
                        if (fallback) fallback.style.display = "block";
                      }}
                    />

                    {/* Fallback if file not placed */}
                    <div id="proposal-text-logo" style={{ display: "none" }}>
                      <div className="text-3xl font-black text-[#F5B400] tracking-widest leading-none font-sans">
                        SND
                      </div>
                      <p className="text-[11px] italic text-slate-600 mt-1 font-medium font-sans">
                        We build software systems that grow with your business.
                      </p>
                    </div>

                    <h2 className="text-lg font-black text-slate-900 mt-2 font-sans">
                      {generatedDoc.title}
                    </h2>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5 font-sans">
                      Prepared by{" "}
                      <strong className="text-slate-700">
                        Sky Nova Digitals
                      </strong>{" "}
                      for{" "}
                      <strong className="text-slate-900">
                        {generatedDoc.client}
                      </strong>
                    </p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-xs font-bold text-slate-400 block font-sans">
                      {generatedDoc.date}
                    </span>
                    <span className="text-base font-black text-[#9D00FF] block mt-1 font-sans">
                      {generatedDoc.currency}
                      {generatedDoc.budget.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2 font-sans">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider font-sans">
                    Executive Summary
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200/70 font-sans">
                    {generatedDoc.executiveSummary}
                  </p>
                </div>

                {/* Scope & Deliverables */}
                <div className="space-y-2.5 font-sans">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider font-sans">
                    Scope of Work & Deliverables
                  </h4>
                  <div className="space-y-2 font-sans">
                    {generatedDoc.deliverables.map((del, i) => (
                      <div
                        key={i}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block font-sans">
                            {i + 1}. {del.phase}
                          </span>
                          <span className="text-[11px] text-slate-600 font-medium font-sans">
                            {del.details}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#9D00FF] border border-blue-100 shrink-0 font-sans">
                          {del.timeline}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proposed Investment */}
                <div className="space-y-2 font-sans">
                  <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider font-sans">
                    Proposed Investment
                  </h4>
                  <div className="bg-white p-4 rounded-xl border border-slate-200/70 space-y-1.5 text-xs text-slate-700 font-sans">
                    <div className="flex justify-between font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 font-sans">
                      <span>Total Fixed Consideration:</span>
                      <span className="text-sm font-black text-[#9D00FF] font-sans">
                        {generatedDoc.currency}
                        {generatedDoc.budget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {generatedDoc.terms.map((term, i) => (
                      <p key={i} className="flex items-start gap-1.5 font-sans">
                        <span className="text-[#9D00FF] font-bold">✓</span>
                        <span>{term}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre className="whitespace-pre-wrap">
                  {`# Project Proposal for ${generatedDoc.client}
Prepared by Sky Nova Digitals

## Executive Summary
${generatedDoc.executiveSummary}

## Scope of Work & Deliverables
${generatedDoc.deliverables.map((d, i) => `${i + 1}. **${d.phase}:** ${d.details}`).join("\n")}

## Proposed Investment
- Total Budget: ${generatedDoc.currency}${generatedDoc.budget.toLocaleString("en-IN")}.00
- Timeline: 2 Weeks
- Payment Terms: 50% upfront deposit, 50% upon milestone completion.`}
                </pre>
              </div>
            )
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-sm text-slate-500">
              Enter client and project details to generate a proposal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
