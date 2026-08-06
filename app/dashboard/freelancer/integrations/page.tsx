"use client";

import React, { useState } from "react";
import { Zap, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

export default function IntegrationsPage() {
  const [connectedApps, setConnectedApps] = useState<{
    [key: string]: boolean;
  }>({
    gcal: true,
    slack: true,
    stripe: true,
    github: true,
    figma: true,
    zapier: false,
    zoom: false,
    paypal: false,
  });

  const toggleConnection = (key: string) => {
    setConnectedApps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const integrationsList = [
    {
      category: "Calendar",
      apps: [
        {
          key: "gcal",
          name: "Google Calendar",
          desc: "Sync meeting schedules & invoice due dates",
        },
        {
          key: "outlook",
          name: "Outlook Calendar",
          desc: "Sync Microsoft Office meeting threads",
        },
      ],
    },
    {
      category: "Communication",
      apps: [
        {
          key: "slack",
          name: "Slack",
          desc: "Broadcast instant task triage notification alerts",
        },
        {
          key: "msteams",
          name: "Microsoft Teams",
          desc: "Sync departmental team channels",
        },
        {
          key: "zoom",
          name: "Zoom",
          desc: "Auto-generate AI meeting summaries from calls",
        },
        {
          key: "gmeet",
          name: "Google Meet",
          desc: "Transcribe live client meetings into tasks",
        },
      ],
    },
    {
      category: "Storage & Documents",
      apps: [
        {
          key: "gdrive",
          name: "Google Drive",
          desc: "Store client proposals, contracts, & assets",
        },
        {
          key: "dropbox",
          name: "Dropbox",
          desc: "Sync project files & deliverable exports",
        },
      ],
    },
    {
      category: "Payments & Invoicing",
      apps: [
        {
          key: "stripe",
          name: "Stripe",
          desc: "Process credit card invoice payouts instantly",
        },
        {
          key: "paypal",
          name: "PayPal",
          desc: "Accept international client payments",
        },
        {
          key: "razorpay",
          name: "Razorpay",
          desc: "Process local & global client invoices",
        },
      ],
    },
    {
      category: "Development & Design",
      apps: [
        {
          key: "github",
          name: "GitHub",
          desc: "Link commits & PRs directly to Orvixa tasks",
        },
        {
          key: "figma",
          name: "Figma",
          desc: "Embed design tokens & wireframe files",
        },
      ],
    },
    {
      category: "Automation",
      apps: [
        {
          key: "zapier",
          name: "Zapier",
          desc: "Automate 5,000+ custom app workflows",
        },
        {
          key: "make",
          name: "Make.com",
          desc: "Visual automation scenarios for tasks",
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
          <Zap className="w-3.5 h-3.5" />
          <span>Ecosystem Marketplace</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          <span>Integrations </span>
          <span className="font-heading italic text-[#0047AB]">Hub.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Connect Orvixa with Google Calendar, Slack, Stripe, GitHub, Figma, and
          10+ business tools.
        </p>
      </div>

      {/* Integrations Category Sections */}
      <div className="space-y-8">
        {integrationsList.map((cat) => (
          <div key={cat.category} className="space-y-4 font-sans">
            <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">
              {cat.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cat.apps.map((app) => {
                const isConnected = connectedApps[app.key];

                return (
                  <div
                    key={app.key}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4 font-sans"
                  >
                    <div>
                      <div className="font-bold text-base text-slate-900">
                        {app.name}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                        {app.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleConnection(app.key)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isConnected
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-[#0047AB] hover:bg-[#003680] text-white shadow-sm"
                      }`}
                    >
                      {isConnected ? "● Connected" : "Connect"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
