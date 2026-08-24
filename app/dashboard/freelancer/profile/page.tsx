"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  Globe,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    profession: "Full Stack Developer",
    country: "India",
    avatarUrl: "",
  });

  // Fetch logged in user's real auth data
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw new Error("Could not find logged-in user.");
      }

      // Check if user has data stored in Supabase profiles table or auth metadata
      let fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      let profession =
        user.user_metadata?.profession || "Full Stack Freelancer";
      let country = user.user_metadata?.country || "India";
      let avatarUrl = user.user_metadata?.avatar_url || "";

      // Try fetching from 'profiles' table if it exists
      try {
        const { data: dbProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (dbProfile) {
          if (dbProfile.full_name) fullName = dbProfile.full_name;
          if (dbProfile.profession) profession = dbProfile.profession;
          if (dbProfile.country) country = dbProfile.country;
          if (dbProfile.avatar_url) avatarUrl = dbProfile.avatar_url;
        }
      } catch (dbErr) {
        console.log("Profiles table check:", dbErr);
      }

      setProfile({
        id: user.id,
        fullName: fullName,
        email: user.email || "",
        profession: profession,
        country: country,
        avatarUrl: avatarUrl,
      });
    } catch (err: any) {
      console.error("Profile load error:", err);
      setErrorMessage(err.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // Save updated profile to Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1. Update Supabase Auth User Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName.trim(),
          profession: profile.profession.trim(),
          country: profile.country,
          avatar_url: profile.avatarUrl,
        },
      });

      if (authError) throw authError;

      // 2. Try updating or inserting into 'profiles' table (if exists)
      try {
        await supabase.from("profiles").upsert({
          id: profile.id,
          full_name: profile.fullName.trim(),
          email: profile.email,
          profession: profile.profession.trim(),
          country: profile.country,
          avatar_url: profile.avatarUrl,
          updated_at: new Date().toISOString(),
        });
      } catch (dbError) {
        // Ignored if profiles table doesn't exist
      }

      setSuccessMessage("Profile updated successfully!");
    } catch (err: any) {
      console.error("Profile update error:", err);
      setErrorMessage(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Get Initials for Avatar
  const getInitials = () => {
    if (profile.fullName.trim()) {
      const parts = profile.fullName.trim().split(" ");
      return parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }
    if (profile.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return "ME";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real User Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>User Profile & </span>
          <span className="italic text-[#0047AB]">Account.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Manage your real name, avatar photo, billing currency, and regional
          settings.
        </p>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* AVATAR SECTION */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#0047AB]/20">
            {getInitials()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">
              {profile.fullName || profile.email}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {profile.email}
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Profession / Specialization */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Profession / Specialization</span>
              </label>
              <input
                type="text"
                placeholder="e.g. UI/UX Designer & Full Stack Dev"
                value={profile.profession}
                onChange={(e) =>
                  setProfile({ ...profile, profession: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Country</span>
              </label>
              <select
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0047AB]"
              >
                <option value="India">India (₹ INR)</option>
                <option value="United States">United States ($ USD)</option>
                <option value="United Kingdom">United Kingdom (£ GBP)</option>
                <option value="Canada">Canada ($ CAD)</option>
                <option value="Australia">Australia ($ AUD)</option>
                <option value="Germany">Germany (€ EUR)</option>
                <option value="United Arab Emirates">UAE (AED)</option>
                <option value="Singapore">Singapore ($ SGD)</option>
              </select>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <span>Save Real Profile To Database</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
