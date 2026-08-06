"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Globe,
  Building2,
  Save,
  CheckCircle2,
} from "lucide-react";

export default function EnterpriseSecurityPage() {
  const [ssoEnabled, setSsoEnabled] = useState(true);
  const [ipAllowlist, setIpAllowlist] = useState("192.168.1.1, 10.0.0.1/24");
  const [retentionDays, setRetentionDays] = useState("365");
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
          <span>Enterprise Security & </span>
          <span className="font-heading italic text-[#0047AB]">
            Governance.
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Configure SAML 2.0 SSO, SCIM provisioning, IP allowlisting, and data
          retention rules.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Enterprise security policy updated successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans"
      >
        {/* Single Sign-On */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                SAML 2.0 Single Sign-On (SSO)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Enforce Okta, Azure AD, or Google Workspace SSO.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSsoEnabled(!ssoEnabled)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                ssoEnabled
                  ? "bg-[#0047AB] text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {ssoEnabled ? "● SSO Enforced" : "Disabled"}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value="https://orvixa.com/sso/saml2/metadata.xml"
            className="w-full bg-slate-50 border border-slate-200 font-mono text-xs text-slate-600 px-3.5 py-2.5 rounded-xl"
          />
        </div>

        {/* IP Allowlisting */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">
            IP Address Allowlisting
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Restrict employee login access to specific corporate IP subnets.
          </p>
          <input
            type="text"
            value={ipAllowlist}
            onChange={(e) => setIpAllowlist(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
          />
        </div>

        {/* Data Retention */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <h3 className="font-bold text-base text-slate-900">
            Data Retention & Compliance
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Automatic audit log and project file retention policy (in days).
          </p>
          <select
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900"
          >
            <option value="90">90 Days</option>
            <option value="180">180 Days</option>
            <option value="365">365 Days (1 Year)</option>
            <option value="unlimited">Indefinite Retention</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Policy</span>
        </button>
      </form>
    </div>
  );
}
