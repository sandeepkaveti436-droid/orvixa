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
  RefreshCw,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

export default function OrgSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [orgProfile, setOrgProfile] = useState({
    companyName: "Orvixa Workspace Inc.",
    industry: "Software & Artificial Intelligence",
    companyEmail: "admin@orvixa.com",
    companyPhone: "+1 (800) ORVIXA-AI",
    country: "United States",
    timezone: "UTC - 05:00 (Eastern Time)",
    currency: "USD ($)",
    enforce2FA: true,
    sessionTimeout: "30 Minutes",
  });

  const [apiKey, setApiKey] = useState("orvixa_live_pk_9923812938129381923");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRegenerateKey = () => {
    const newKey = `orvixa_live_pk_${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 8)}`;
    setApiKey(newKey);
    alert("New Developer API Key generated successfully!");
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* HEADER (NORMAL FONT ONLY) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Organization Settings
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage company profile, branding, API keys, and security policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Organization settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-sans">
        {/* 1. COMPANY PROFILE & BRANDING CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4 font-sans flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0047AB]" />
            <span>Company Profile & Branding</span>
          </h3>

          {/* Logo Upload Box */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 font-sans">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680]">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Brand Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                PNG, JPG or SVG up to 5MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Company Name
              </label>
              <input
                type="text"
                value={orgProfile.companyName}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, companyName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Industry
              </label>
              <input
                type="text"
                value={orgProfile.industry}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, industry: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Corporate Email
              </label>
              <input
                type="email"
                value={orgProfile.companyEmail}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, companyEmail: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Corporate Phone
              </label>
              <input
                type="text"
                value={orgProfile.companyPhone}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, companyPhone: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Timezone
              </label>
              <select
                value={orgProfile.timezone}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, timezone: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              >
                <option>UTC - 05:00 (Eastern Time)</option>
                <option>UTC - 08:00 (Pacific Time)</option>
                <option>UTC + 00:00 (Greenwich Mean Time)</option>
                <option>UTC + 05:30 (India Standard Time)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Primary Currency
              </label>
              <select
                value={orgProfile.currency}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, currency: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              >
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. SECURITY POLICIES CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4 font-sans flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0047AB]" />
            <span>Organization Security Policies</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-sans">
            <div>
              <div className="font-bold text-xs text-slate-900 font-sans">
                Enforce Multi-Factor Authentication (2FA)
              </div>
              <p className="text-[11px] text-slate-500 font-medium font-sans">
                Require all 32 staff members to use 2FA hardware key or
                authenticator app.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setOrgProfile({
                  ...orgProfile,
                  enforce2FA: !orgProfile.enforce2FA,
                })
              }
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all font-sans ${
                orgProfile.enforce2FA
                  ? "bg-[#0047AB] text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {orgProfile.enforce2FA ? "● Enforced" : "Disabled"}
            </button>
          </div>
        </div>

        {/* 3. DEVELOPER API KEYS CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4 font-sans flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0047AB]" />
            <span>Developer API Keys</span>
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Live Production Key
            </label>
            <div className="flex gap-2 font-sans">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="w-full bg-slate-100 border border-slate-200 font-mono text-xs text-slate-600 px-3.5 py-2.5 rounded-xl font-sans"
              />
              <button
                type="button"
                onClick={handleCopyKey}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 flex items-center gap-1 font-sans"
              >
                {copiedKey ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey ? "Copied" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleRegenerateKey}
                className="bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 text-xs font-bold px-3 py-2.5 rounded-xl shrink-0 flex items-center gap-1 font-sans"
                title="Regenerate API Key"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 font-sans"
        >
          <Save className="w-4 h-4" />
          <span>Save Organization Settings</span>
        </button>
      </form>

      {/* 4. DANGER ZONE */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-3 font-sans">
        <div className="flex items-center gap-2 text-rose-700 font-bold font-sans">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs font-medium text-rose-600 font-sans">
          Deleting your organization will permanently erase all employee
          records, department projects, and audit logs.
        </p>
        <button
          onClick={() => {
            if (
              confirm(
                "Are you sure you want to delete this organization workspace? This action cannot be undone.",
              )
            ) {
              window.location.href = "/auth";
            }
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm font-sans"
        >
          Delete Organization Workspace
        </button>
      </div>
    </div>
  );
}
