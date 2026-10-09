"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Upload,
  Save,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrgSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [orgProfile, setOrgProfile] = useState({
    companyName: "",
    industry: "",
    companyEmail: "",
    companyPhone: "",
    timezone: "UTC - 05:00 (Eastern Time)",
    currency: "USD ($)",
    enforce2FA: true,
  });

  // Load Real Profile Data from Supabase
  useEffect(() => {
    async function loadOrgProfile() {
      // 1. Instant Cache Load
      const cachedAvatar = localStorage.getItem("orvixa_admin_avatar");
      if (cachedAvatar) setLogoPreview(cachedAvatar);

      try {
        // 2. Fetch from Database
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("org_name, avatar_url, email")
            .eq("id", authData.user.id)
            .single();

          if (profile) {
            setOrgProfile((prev) => ({
              ...prev,
              companyName: profile.org_name || "",
              companyEmail: profile.email || authData.user.email || "",
            }));

            if (profile.avatar_url) {
              setLogoPreview(profile.avatar_url);
              localStorage.setItem("orvixa_admin_avatar", profile.avatar_url);
            }
          }
        }
      } catch (e) {
        console.error("Error loading profile");
      } finally {
        setLoading(false);
      }
    }
    loadOrgProfile();
  }, []);

  // Handle Photo Selection & Cache Immediately
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setLogoPreview(base64Url);
        // Instantly update sidebar through local storage
        localStorage.setItem("orvixa_admin_avatar", base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Real Profile & Photo to Database
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        // Update Supabase Database
        await supabase
          .from("profiles")
          .update({
            org_name: orgProfile.companyName,
            avatar_url: logoPreview,
          })
          .eq("id", authData.user.id);
      }

      // Sync Local Storage for Sidebar
      localStorage.setItem("orvixa_admin_org", orgProfile.companyName);

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        window.location.reload(); // Refresh to update sidebar text globally
      }, 1000);
    } catch (err) {
      alert("Failed to save settings.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Organization Settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Organization Settings
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage company profile, branding, and security policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Organization settings saved to database successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 font-sans">
        {/* 1. COMPANY PROFILE & BRANDING CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-4 font-sans flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#9D00FF]" />
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
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9D00FF] text-white text-xs font-bold shadow-sm hover:bg-[#7A00CC]">
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
                required
                placeholder="Enter Organization Name"
                value={orgProfile.companyName}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, companyName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Industry
              </label>
              <input
                type="text"
                placeholder="Software & Technology"
                value={orgProfile.industry}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, industry: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Corporate Email
              </label>
              <input
                type="email"
                readOnly
                value={orgProfile.companyEmail}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed font-sans"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                Corporate Phone
              </label>
              <input
                type="text"
                placeholder="+1 (800) ORVIXA"
                value={orgProfile.companyPhone}
                onChange={(e) =>
                  setOrgProfile({ ...orgProfile, companyPhone: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
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
            <ShieldCheck className="w-4 h-4 text-[#9D00FF]" />
            <span>Organization Security Policies</span>
          </h3>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-sans">
            <div>
              <div className="font-bold text-xs text-slate-900 font-sans">
                Enforce Multi-Factor Authentication (2FA)
              </div>
              <p className="text-[11px] text-slate-500 font-medium font-sans">
                Require all staff members to use 2FA authentication.
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
                  ? "bg-[#9D00FF] text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {orgProfile.enforce2FA ? "● Enforced" : "Disabled"}
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          type="submit"
          className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-md shadow-[#9D00FF]/25 flex items-center gap-2 font-sans"
        >
          <Save className="w-4 h-4" />
          <span>Save Organization Settings</span>
        </button>
      </form>

      {/* 3. DANGER ZONE */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-3 font-sans mt-8">
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
