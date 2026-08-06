"use client";

import React, { useState } from "react";
import {
  Store,
  Sparkles,
  Zap,
  FileText,
  Download,
  Check,
  Search,
} from "lucide-react";

export default function MarketplacePage() {
  const [filter, setFilter] = useState("all");
  const [installed, setInstalled] = useState<{ [key: number]: boolean }>({});

  const items = [
    {
      id: 1,
      name: "Next.js SaaS Landing Page Template",
      category: "templates",
      author: "Orvixa Design",
      downloads: "1.4k",
      icon: FileText,
    },
    {
      id: 2,
      name: "AI Invoice Auto-Draft Recipe",
      category: "recipes",
      author: "AI Copilot Core",
      downloads: "3.2k",
      icon: Sparkles,
    },
    {
      id: 3,
      name: "Stripe Payment Gateway Plugin",
      category: "plugins",
      author: "FinTech Extensions",
      downloads: "5.8k",
      icon: Zap,
    },
    {
      id: 4,
      name: "Client Proposal Master Prompt",
      category: "prompts",
      author: "Growth Labs",
      downloads: "2.1k",
      icon: Sparkles,
    },
  ];

  const toggleInstall = (id: number) => {
    setInstalled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
          <Store className="w-3.5 h-3.5" />
          <span>Ecosystem Extensions</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          <span>Marketplace & </span>
          <span className="font-heading italic text-[#0047AB]">
            AI Prompts.
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Install pre-built templates, automation recipes, plugins, and AI
          prompt libraries into your workspace.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-bold text-slate-700">
        {[
          { id: "all", label: "All Items" },
          { id: "templates", label: "Templates" },
          { id: "recipes", label: "Automation Recipes" },
          { id: "plugins", label: "Plugins" },
          { id: "prompts", label: "AI Prompt Library" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all ${
              filter === tab.id
                ? "bg-[#0047AB] text-white shadow-sm"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => {
          const IconComp = item.icon;
          const isInst = installed[item.id];

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex justify-between items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4 text-[#0047AB]" />
                  <h3 className="font-bold text-base text-slate-900">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-semibold">
                  By {item.author} • {item.downloads} installs
                </p>
              </div>

              <button
                onClick={() => toggleInstall(item.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isInst
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-[#0047AB] hover:bg-[#003680] text-white shadow-md"
                }`}
              >
                {isInst ? "✓ Installed" : "Install"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
