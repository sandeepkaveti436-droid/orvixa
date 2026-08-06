"use client";

import React, { useState } from "react";
import { User, Lock, Save, CheckCircle2 } from "lucide-react";

export default function EmployeeProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@orvixa.com",
    role: "Senior Frontend Engineer",
    department: "Orvixa Engineering",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Employee Profile & Account
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage your team profile and preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-lg">
            JD
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {profile.fullName}
            </h3>
            <p className="text-xs text-slate-500 font-semibold">
              {profile.role} • {profile.department}
            </p>
          </div>
        </div>

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
            Work Email
          </label>
          <input
            type="email"
            readOnly
            value={profile.email}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className="bg-[#0047AB] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
