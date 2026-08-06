"use client";

import React, { useState } from "react";
import { User, Upload, Lock, ShieldAlert, CheckCircle2, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "Sarah Jenkins",
    profession: "UI/UX & Product Designer",
    country: "United States",
    timezone: "UTC - 05:00 (Eastern Time)",
    language: "English (US)",
    currency: "USD ($)",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      window.location.href = "/auth";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">User Profile & Account</h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage your personal details, billing currency, security, and account preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
          <User className="w-4 h-4 text-[#0047AB]" />
          <span>Personal Information</span>
        </h3>

        {/* Photo Upload */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-md">
            {photoPreview ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" /> : "SJ"}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680]">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Avatar</span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400 font-semibold mt-1">JPG or PNG up to 5MB</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Profession</label>
            <input
              type="text"
              value={profile.profession}
              onChange={(e) => setProfile({ ...profile, profession: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
            <select
              value={profile.country}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Germany</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Timezone</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            >
              <option>UTC - 05:00 (Eastern Time)</option>
              <option>UTC - 08:00 (Pacific Time)</option>
              <option>UTC + 00:00 (Greenwich Mean Time)</option>
              <option>UTC + 05:30 (India Standard Time)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Language</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            >
              <option>English (US)</option>
              <option>Spanish</option>
              <option>German</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Currency</label>
            <select
              value={profile.currency}
              onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            >
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
              <option>INR (₹)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>

      {/* Delete Account Danger Zone */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-rose-700 font-bold">
          <ShieldAlert className="w-5 h-5" />
          <span>Danger Zone</span>
        </div>
        <p className="text-xs font-medium text-rose-600">
          Deleting your account will permanently remove all your projects, invoices, and time logs.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}