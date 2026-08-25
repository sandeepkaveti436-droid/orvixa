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
  Trash2,
  Sparkles,
  Camera,
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
    profession: "Full Stack Freelancer",
    country: "India (₹ INR)",
    avatarUrl: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Could not find logged-in user session.");
      }

      let fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      let profession =
        user.user_metadata?.profession || "Full Stack Freelancer";
      let country = user.user_metadata?.country || "India (₹ INR)";
      let avatarUrl = user.user_metadata?.avatar_url || "";

      // Fetch permanent data from Supabase 'profiles' table
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
        console.log("Profiles DB sync check:", dbErr);
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

  // Handle Image / Branding Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert(
          "File size exceeds 5MB. Please upload an image smaller than 5MB.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfile((prev) => ({
          ...prev,
          avatarUrl: base64String,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove Logo
  const handleRemoveLogo = () => {
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
  };

  // Save Permanently to Supabase Database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // 1. Update Supabase Auth User Metadata (Persists across sessions)
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName.trim(),
          profession: profile.profession.trim(),
          country: profile.country,
          avatar_url: profile.avatarUrl,
        },
      });

      if (authUpdateError) throw authUpdateError;

      // 2. Permanently Upsert into Supabase 'profiles' table
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
        console.log("Database table sync:", dbError);
      }

      // 3. Cache locally for instantaneous reloads
      localStorage.setItem("orvixa_user_name", profile.fullName.trim());
      localStorage.setItem("orvixa_user_prof", profile.profession.trim());
      if (profile.avatarUrl) {
        localStorage.setItem("orvixa_avatar_photo", profile.avatarUrl);
      } else {
        localStorage.removeItem("orvixa_avatar_photo");
      }

      setSuccessMessage(
        "✓ Branding logo and profile saved permanently to database!",
      );
    } catch (err: any) {
      console.error("Save error:", err);
      setErrorMessage(err.message || "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (profile.fullName.trim()) {
      const parts = profile.fullName.trim().split(/[\s._-]+/);
      return parts.length > 1
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0].slice(0, 2).toUpperCase();
    }
    if (profile.email) {
      return profile.email.slice(0, 2).toUpperCase();
    }
    return "SK";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Real User Profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16 max-w-4xl">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
          <span>User Profile & </span>
          <span className="italic text-[#0047AB]">Account.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage your real name, branding logo, billing currency, and regional
          settings.
        </p>
      </div>

      {/* FEEDBACK BANNERS */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-2 font-sans">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MAIN PROFILE CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans">
        {/* BRANDING LOGO / AVATAR UPLOAD SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 font-sans">
          <div className="flex items-center gap-4 font-sans">
            {/* Display uploaded branding logo or initials */}
            <div className="relative group font-sans">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center font-black text-xl overflow-hidden border border-slate-200 shrink-0 font-sans">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials()}</span>
                )}
              </div>
            </div>

            <div>
              <div className="text-base font-bold text-slate-900 font-sans">
                {profile.fullName || profile.email}
              </div>
              <p className="text-xs text-slate-500 font-medium font-sans">
                {profile.email}
              </p>
              <span className="text-[11px] font-bold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-md mt-1 inline-block font-sans">
                {profile.profession}
              </span>
            </div>
          </div>

          {/* Upload & Remove Actions */}
          <div className="flex items-center gap-2.5 font-sans">
            <label
              htmlFor="branding-logo-upload"
              className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition font-sans"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Branding Logo</span>
            </label>
            <input
              type="file"
              id="branding-logo-upload"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />

            {profile.avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1 font-sans"
                title="Remove Logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSaveProfile} className="space-y-5 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            {/* Full Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5 font-sans">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name / Brand Name</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. skynovadigitals"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            {/* Email Address (Read-only) */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5 font-sans">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Read-only)</span>
              </label>
              <input
                type="email"
                readOnly
                disabled
                value={profile.email}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
            {/* Profession */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5 font-sans">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Profession / Specialization</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Freelancer & UI/UX"
                value={profile.profession}
                onChange={(e) =>
                  setProfile({ ...profile, profession: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5 font-sans">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Country & Currency</span>
              </label>
              <select
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#0047AB] font-sans cursor-pointer"
              >
                <option value="India (₹ INR)">India (₹ INR)</option>
                <option value="United States ($ USD)">
                  United States ($ USD)
                </option>
                <option value="United Kingdom (£ GBP)">
                  United Kingdom (£ GBP)
                </option>
                <option value="UAE (AED)">UAE (AED)</option>
                <option value="Germany (€ EUR)">Germany (€ EUR)</option>
              </select>
            </div>
          </div>

          {/* SAVE BUTTON */}
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition disabled:opacity-50 font-sans"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
