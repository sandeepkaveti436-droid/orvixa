"use client";

import React, { useState } from "react";
import {
  Code2,
  Key,
  Webhook,
  Copy,
  Check,
  Plus,
  Trash2,
  ShieldCheck,
  Download,
} from "lucide-react";

export default function DeveloperPortalPage() {
  const [copiedKey, setCopiedKey] = useState(false);
  const [apiKeys, setApiKeys] = useState<Array<{id: number; name: string; key: string; created: string; lastUsed: string}>>([] as any);
  const [webhooks, setWebhooks] = useState<Array<{id: number; url: string; events: string[]; status: string}>>([] as any);

  const [newWebhookUrl, setNewWebhookUrl] = useState("");

  const handleCreateKey = () => {
    const newKey = {
      id: Date.now(),
      name: "New Developer Key",
      key: `orvixa_live_pk_${Math.random().toString(36).substring(2, 18)}`,
      created: "Today",
      lastUsed: "Never",
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWebhookUrl) {
      setWebhooks([
        ...webhooks,
        {
          id: Date.now(),
          url: newWebhookUrl,
          events: ["task.created", "invoice.paid"],
          status: "Active",
        },
      ]);
      setNewWebhookUrl("");
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer Platform v1.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            <span>Developer </span>
            <span className="font-heading italic text-[#0047AB]">
              Platform & API.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Build third-party integrations, manage API keys, webhooks, and
            official SDKs.
          </p>
        </div>

        <button
          onClick={handleCreateKey}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New API Key</span>
        </button>
      </div>

      {/* SDK Downloads Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
          Official Developer SDKs
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Node.js / TypeScript SDK",
              ver: "v2.1.0",
              cmd: "npm install @orvixa/sdk",
            },
            {
              name: "Flutter / Dart SDK",
              ver: "v1.4.0",
              cmd: "flutter pub add orvixa_sdk",
            },
            {
              name: "Python SDK",
              ver: "v2.0.1",
              cmd: "pip install orvixa-python",
            },
          ].map((sdk) => (
            <div
              key={sdk.name}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
            >
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-900">{sdk.name}</span>
                <span className="text-[10px] bg-blue-50 text-[#0047AB] px-2 py-0.5 rounded">
                  {sdk.ver}
                </span>
              </div>
              <code className="text-[11px] font-mono text-slate-600 block bg-white p-2 rounded-lg border border-slate-200">
                {sdk.cmd}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Key className="w-4 h-4 text-[#0047AB]" />
          <span>Active API Keys ({apiKeys.length})</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {apiKeys.map((item) => (
            <div
              key={item.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold"
            >
              <div>
                <div className="font-bold text-slate-900">{item.name}</div>
                <code className="font-mono text-slate-500 text-[11px]">
                  {item.key}
                </code>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-400">Created: {item.created}</span>
                <button
                  onClick={() => copyKey(item.key)}
                  className="p-2 text-[#0047AB] hover:bg-blue-50 rounded-lg flex items-center gap-1 font-bold"
                >
                  {copiedKey ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedKey ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Webhook className="w-4 h-4 text-[#0047AB]" />
          <span>Webhook Endpoints</span>
        </h3>

        <form onSubmit={handleAddWebhook} className="flex gap-2">
          <input
            type="url"
            required
            placeholder="https://api.yourdomain.com/webhooks/orvixa"
            value={newWebhookUrl}
            onChange={(e) => setNewWebhookUrl(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
          />
          <button
            type="submit"
            className="bg-[#0047AB] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
          >
            Add Webhook
          </button>
        </form>

        <div className="space-y-2">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center text-xs font-semibold"
            >
              <div>
                <code className="font-mono font-bold text-slate-900">
                  {wh.url}
                </code>
                <div className="text-slate-400 mt-0.5">
                  Events: {wh.events.join(", ")}
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-bold">
                {wh.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
