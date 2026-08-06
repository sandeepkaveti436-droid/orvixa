"use client";

import React, { useState } from "react";
import {
  Building2,
  Upload,
  Globe,
  Save,
  CheckCircle2,
  Lock,
  Key,
} from "lucide-react";

export default function OrgSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>Organization </span>
          <span className="font-heading italic text-[#0047AB]">Settings.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage company profile, branding, API keys, and security policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Organization settings saved successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6"
      >
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4">
          Company Profile & Branding
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="Orvixa Workspace Inc."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Industry
            </label>
            <input
              type="text"
              defaultValue="Software & Artificial Intelligence"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0047AB]" />
            <span>Developer API Keys</span>
          </h3>
          <input
            type="text"
            readOnly
            value="orvixa_live_pk_9923812938129381923"
            className="w-full bg-slate-100 border border-slate-200 font-mono text-xs text-slate-600 px-3.5 py-2.5 rounded-xl"
          />
        </div>

        <button
          type="submit"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}
