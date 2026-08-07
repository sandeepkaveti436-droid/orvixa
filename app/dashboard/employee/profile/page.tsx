"use client";

import React, { useState, useEffect } from "react";
import { User, Upload, CheckCircle2, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    profession: "Team Member",
  });

  // Fetch Real Profile Data from Supabase
  useEffect(() => {
    async function loadRealProfile() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (prof) {
            setProfile({
              fullName:
                prof.full_name || user.email?.split("@")[0] || "Employee",
              email: user.email || "",
              profession: prof.profession || "Team Member",
            });
            if (prof.avatar_url) setPhotoPreview(prof.avatar_url);
          }
        }
      } catch (e) {
        console.error("Loading profile error");
      } finally {
        setLoading(false);
      }
    }
    loadRealProfile();
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setPhotoPreview(base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;

      if (user) {
        // FIX: Using .update() instead of .upsert() prevents database constraint errors
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: profile.fullName,
            avatar_url: photoPreview,
          })
          .eq("id", user.id);

        if (error) throw error;
      }

      // Sync Local Storage so the layout.tsx sidebar instantly updates!
      localStorage.setItem("orvixa_emp_name", profile.fullName);
      if (photoPreview) localStorage.setItem("orvixa_emp_avatar", photoPreview);

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        window.location.reload(); // Refresh to ensure layout catches the new name
      }, 1000);
    } catch (err: any) {
      alert("Failed to save profile: " + (err.message || "Unknown error"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Profile Details...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Employee Profile & Account
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage your team profile and preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile updated and synced successfully!</span>
        </div>
      )}

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans"
      >
        {/* Photo Upload */}
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100 font-sans">
          <div className="w-16 h-16 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-md shrink-0 font-sans">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              profile.fullName.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680] font-sans">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 font-semibold mt-1 font-sans">
              JPG or PNG up to 5MB
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4 font-sans">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Work Email (Read Only)
            </label>
            <input
              type="email"
              readOnly
              value={profile.email}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Job Title / Role (Managed by Organization)
            </label>
            <input
              type="text"
              readOnly
              value={profile.profession}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-500 cursor-not-allowed font-sans"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              If your role has changed, please contact your workspace
              administrator.
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md font-sans flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </form>
    </div>
  );
}
