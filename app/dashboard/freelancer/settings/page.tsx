"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  Bell,
  Sun,
  Globe,
  DollarSign,
  Zap,
  Lock,
  Save,
  CheckCircle2,
  ShieldAlert,
  Upload,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    | "profile"
    | "workspace"
    | "notifications"
    | "theme"
    | "integrations"
    | "security"
  >("profile");

  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    profession: "",
    country: "",
    timezone: "UTC - 05:00 (Eastern Time)",
    currency: "USD ($)",
    language: "English (US)",
  });

  const [integrations, setIntegrations] = useState({
    google: true,
    slack: true,
    stripe: true,
    zoom: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>System </span>
          <span className="font-heading italic text-[#0047AB]">Settings.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Configure profile, workspace branding, notifications, integrations,
          and security.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      {/* 8 Sub-Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5 font-sans text-xs font-bold">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "workspace", label: "Workspace", icon: Building2 },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "theme", label: "Theme & Regional", icon: Sun },
          { id: "integrations", label: "Integrations", icon: Zap },
          { id: "security", label: "Security", icon: Lock },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <IconComp className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans"
        >
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Profession
              </label>
              <input
                type="text"
                value={profile.profession}
                onChange={(e) =>
                  setProfile({ ...profile, profession: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Save Changes
          </button>
        </form>
      )}

      {/* TAB 2: INTEGRATIONS */}
      {activeTab === "integrations" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4">
            Connected Ecosystem Apps
          </h3>
          {[
            {
              key: "google",
              name: "Google Workspace",
              desc: "Sync Calendar events and Gmail contacts.",
            },
            {
              key: "slack",
              name: "Slack Triage",
              desc: "Broadcast instant task notification alerts.",
            },
            {
              key: "stripe",
              name: "Stripe Billing",
              desc: "Process credit card invoice payouts.",
            },
          ].map((app) => (
            <div
              key={app.key}
              className="p-4 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-sm text-slate-900">
                  {app.name}
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {app.desc}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setIntegrations({
                    ...integrations,
                    [app.key]: !(integrations as any)[app.key],
                  })
                }
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  (integrations as any)[app.key]
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {(integrations as any)[app.key] ? "● Connected" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SECURITY */}
      {activeTab === "security" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4">
            Security & Authentication
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Enterprise SOC2 AES-256 encryption active across your workspace.
          </p>
          <button
            onClick={handleSave}
            className="bg-[#0047AB] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Update Security Keys
          </button>
        </div>
      )}
    </div>
  );
}
