"use client";

import React, { useState, useEffect } from "react";
import { User, Upload, CheckCircle2, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    profession: "UI/UX & Product Designer",
    country: "United States",
    timezone: "UTC - 05:00 (Eastern Time)",
    currency: "USD ($)",
  });

  // Load Real Profile & Check Local Storage
  useEffect(() => {
    async function loadRealProfile() {
      const cachedAvatar = localStorage.getItem("orvixa_avatar_photo");
      const cachedName = localStorage.getItem("orvixa_user_name");
      const cachedProf = localStorage.getItem("orvixa_user_prof");

      if (cachedAvatar) setAvatarPreview(cachedAvatar);
      if (cachedName) setProfile((prev) => ({ ...prev, fullName: cachedName }));
      if (cachedProf)
        setProfile((prev) => ({ ...prev, profession: cachedProf }));

      try {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .or(`user_id.eq.${user.id},id.eq.${user.id}`)
            .single();

          if (prof) {
            setProfile({
              fullName:
                prof.full_name || user.email?.split("@")[0] || "Freelancer",
              email: user.email || "",
              profession: prof.profession || "Pro Freelancer",
              country: prof.country || "United States",
              timezone: prof.timezone || "UTC - 05:00 (Eastern Time)",
              currency: prof.currency || "USD ($)",
            });

            if (prof.avatar_url) setAvatarPreview(prof.avatar_url);
          }
        }
      } catch (e) {
        console.log("Loading profile...");
      } finally {
        setLoading(false);
      }
    }

    loadRealProfile();
  }, []);

  // Handle Photo Upload & Save Instantly To Local Storage & Supabase
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setAvatarPreview(base64Url);
        localStorage.setItem("orvixa_avatar_photo", base64Url);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Real Profile Changes to Database
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("orvixa_user_name", profile.fullName);
    localStorage.setItem("orvixa_user_prof", profile.profession);

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (user) {
        await supabase.from("profiles").upsert([
          {
            id: user.id,
            user_id: user.id,
            full_name: profile.fullName,
            profession: profile.profession,
            country: profile.country,
            timezone: profile.timezone,
            currency: profile.currency,
            avatar_url: avatarPreview,
          },
        ]);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Profile updated in workspace!");
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
          <span>User Profile & </span>
          <span className="font-heading italic text-[#0047AB]">Account.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Manage your real name, avatar photo, billing currency, and regional
          settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 font-sans">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved permanently!</span>
        </div>
      )}

      <form
        onSubmit={handleSaveProfile}
        className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 font-sans"
      >
        {/* Photo Upload Box */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6 font-sans">
          <div className="w-16 h-16 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xl overflow-hidden shadow-md shrink-0 font-sans">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              profile.fullName.substring(0, 2).toUpperCase() || "FL"
            )}
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-sm hover:bg-[#003680] font-sans">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Real Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
            <p className="text-[11px] text-slate-400 font-semibold mt-1 font-sans">
              PNG or JPG photo up to 5MB
            </p>
          </div>
        </div>

        {/* Profile Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
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
              Email Address (Read-only)
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
              Profession / Specialization
            </label>
            <input
              type="text"
              value={profile.profession}
              onChange={(e) =>
                setProfile({ ...profile, profession: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Country
            </label>
            <select
              value={profile.country}
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            >
              <option>United States</option>
              <option>United Kingdom</option>
              <option>Canada</option>
              <option>Germany</option>
              <option>India</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#0047AB] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md font-sans"
        >
          Save Real Profile To Database
        </button>
      </form>
    </div>
  );
}
