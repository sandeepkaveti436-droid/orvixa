"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  FileText,
  Mail,
  Calendar,
  Zap,
  Search,
  CheckCircle2,
  TrendingUp,
  Brain,
  MessageSquare,
  FileCode,
  Clock,
  Send,
  Copy,
  Check,
} from "lucide-react";

export default function AiWorkspacePage() {
  const [activeAiTool, setActiveAiTool] = useState<
    | "chat"
    | "planner"
    | "proposal"
    | "contract"
    | "email"
    | "meeting"
    | "summary"
    | "predictor"
    | "balancer"
    | "coach"
  >("chat");

  // AI Chat Assistant & Knowledge Search State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ sender: string; text: string }>
  >([] as any);

  // AI Generator Inputs
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Processing your request: "${userMsg}". Please wait for AI analysis.`,
        },
      ]);
    }, 800);
  };

  const handleRunAiTool = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const outputText = `✨ AI Generated Result for ${activeAiTool.toUpperCase()}:\nNo data available. Please load your projects and tasks first.`;
      setGeneratedResult(outputText);
      setIsGenerating(false);
    }, 1000);
  };

  const handleCopy = () => {
    if (generatedResult) {
      navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Orvixa AI Engine v2.0</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
            <span>AI Workspace </span>
            <span className="font-heading italic text-[#0047AB]">
              Command Center.
            </span>
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Intelligent copilot for project planning, proposal generation,
            workload balancing, and meeting notes.
          </p>
        </div>
      </div>

      {/* AI Tools Grid Selector (12 Tools) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-sans">
        {[
          { id: "chat", label: "AI Chat Assistant", icon: Bot },
          { id: "planner", label: "AI Project Planner", icon: Brain },
          { id: "proposal", label: "AI Proposal Writer", icon: FileText },
          { id: "contract", label: "AI Contract Gen", icon: FileCode },
          { id: "email", label: "AI Email Writer", icon: Mail },
          { id: "meeting", label: "AI Meeting Notes", icon: Calendar },
          { id: "summary", label: "AI Project Summary", icon: CheckCircle2 },
          { id: "predictor", label: "Deadline Predictor", icon: Clock },
          { id: "balancer", label: "Workload Balancer", icon: TrendingUp },
          { id: "coach", label: "Productivity Coach", icon: Zap },
        ].map((tool) => {
          const IconComp = tool.icon;
          const isActive = activeAiTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveAiTool(tool.id as any);
                setGeneratedResult(null);
              }}
              className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                isActive
                  ? "bg-[#0047AB] text-white border-[#0047AB] shadow-md shadow-[#0047AB]/25"
                  : "bg-white text-slate-800 border-slate-200 hover:border-[#0047AB]/40"
              }`}
            >
              <IconComp
                className={`w-5 h-5 ${isActive ? "text-white" : "text-[#0047AB]"}`}
              />
              <span className="text-xs font-bold leading-snug line-clamp-1">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* AI TOOL WORKSPACE INTERACTIVE STAGE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm font-sans space-y-6">
        {/* Tool Title */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0047AB]" />
            <h3 className="font-bold text-lg text-slate-900 capitalize">
              {activeAiTool.replace("-", " ")} Tool
            </h3>
          </div>

          <span className="text-xs font-bold bg-[#0047AB]/10 text-[#0047AB] px-3 py-1 rounded-full">
            ● AI Copilot Online
          </span>
        </div>

        {/* TOOL 1: CHAT ASSISTANT & KNOWLEDGE SEARCH */}
        {activeAiTool === "chat" ? (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 min-h-[280px] max-h-96 overflow-y-auto space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#0047AB] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask AI Copilot anything about your workspace, projects, or tasks..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
              <button
                type="submit"
                className="bg-[#0047AB] hover:bg-[#003680] text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md shadow-[#0047AB]/25 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* OTHER AI GENERATOR TOOLS */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleRunAiTool}
              className="lg:col-span-5 space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  AI Prompt Input / Context
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Describe what you want the AI ${activeAiTool} to generate...`}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {isGenerating
                    ? "Executing AI Engine..."
                    : `Run AI ${activeAiTool}`}
                </span>
              </button>
            </form>

            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase text-slate-400">
                    AI Output Result
                  </span>
                  {generatedResult && (
                    <button
                      onClick={handleCopy}
                      className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copied ? "Copied!" : "Copy Result"}</span>
                    </button>
                  )}
                </div>

                {generatedResult ? (
                  <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {generatedResult}
                  </pre>
                ) : (
                  <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                    Enter prompt details on the left and click "Run AI Tool".
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
