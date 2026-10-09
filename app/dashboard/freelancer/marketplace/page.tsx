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
  const items: Array<{
    id: number;
    name: string;
    category: string;
    author: string;
    downloads: string;
    icon: any;
  }> = [];

  const toggleInstall = (id: number) => {
    setInstalled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9D00FF]/10 text-[#9D00FF] text-xs font-bold mb-2">
          <Store className="w-3.5 h-3.5" />
          <span>Ecosystem Extensions</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          <span>Marketplace & </span>
          <span className="font-heading italic text-[#9D00FF]">
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
                ? "bg-[#9D00FF] text-white shadow-sm"
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
                  <IconComp className="w-4 h-4 text-[#9D00FF]" />
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
                    : "bg-[#9D00FF] hover:bg-[#7A00CC] text-white shadow-md"
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
