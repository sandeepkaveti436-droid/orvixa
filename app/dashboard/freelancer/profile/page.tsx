"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Crop,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessingCrop, setIsProcessingCrop] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    profession: "UI/UX Designer",
    country: "India (₹ INR)",
    avatarUrl: "",
  });

  // --- CROP MODAL STATES ---
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);

      // 1. Read cached storage first so UI is instant
      const cachedAvatar = localStorage.getItem("orvixa_avatar_photo") || "";
      const cachedName = localStorage.getItem("orvixa_user_name") || "";
      const cachedProf =
        localStorage.getItem("orvixa_user_prof") || "UI/UX Designer";

      // 2. Safely get Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        // If session not found, gracefully load cached profile instead of crashing
        if (cachedName || cachedAvatar) {
          setProfile((prev) => ({
            ...prev,
            fullName: cachedName,
            profession: cachedProf,
            avatarUrl: cachedAvatar,
          }));
        }
        setLoading(false);
        return;
      }

      let fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        cachedName ||
        "";

      let profession =
        user.user_metadata?.profession || cachedProf || "UI/UX Designer";
      let country = user.user_metadata?.country || "India (₹ INR)";
      let avatarUrl = user.user_metadata?.avatar_url || cachedAvatar || "";

      // 3. Fetch from Supabase 'profiles' database table
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
        console.log("Profiles DB check:", dbErr);
      }

      setProfile({
        id: user.id,
        fullName: fullName,
        email: user.email || "",
        profession: profession,
        country: country,
        avatarUrl: avatarUrl,
      });

      if (avatarUrl) localStorage.setItem("orvixa_avatar_photo", avatarUrl);
      if (fullName) localStorage.setItem("orvixa_user_name", fullName);
      if (profession) localStorage.setItem("orvixa_user_prof", profession);

      window.dispatchEvent(new Event("profilePhotoUpdated"));
    } catch (err: any) {
      console.error("Profile load:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result as string);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdjustExisting = () => {
    if (profile.avatarUrl) {
      setRawImageSrc(profile.avatarUrl);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setShowCropModal(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleApplyCropAndSave = async () => {
    if (!rawImageSrc) return;

    setIsProcessingCrop(true);
    try {
      const canvas = document.createElement("canvas");
      const size = 320;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Canvas context not available");

      const img = new Image();
      img.src = rawImageSrc;
      await new Promise((resolve) => (img.onload = resolve));

      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const imgAspect = img.width / img.height;
      let drawWidth = size * zoom;
      let drawHeight = size * zoom;

      if (imgAspect > 1) {
        drawWidth = size * imgAspect * zoom;
      } else {
        drawHeight = (size / imgAspect) * zoom;
      }

      ctx.drawImage(
        img,
        -drawWidth / 2 + pan.x,
        -drawHeight / 2 + pan.y,
        drawWidth,
        drawHeight,
      );

      ctx.restore();

      const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);

      setProfile((prev) => ({ ...prev, avatarUrl: croppedBase64 }));

      // Save to Supabase Auth & Profiles table
      await supabase.auth.updateUser({
        data: { avatar_url: croppedBase64 },
      });

      if (profile.id) {
        await supabase.from("profiles").upsert({
          id: profile.id,
          email: profile.email,
          avatar_url: croppedBase64,
          updated_at: new Date().toISOString(),
        });
      }

      localStorage.setItem("orvixa_avatar_photo", croppedBase64);
      window.dispatchEvent(new Event("profilePhotoUpdated"));

      setShowCropModal(false);
      setSuccessMessage("✓ Photo cropped, adjusted, and saved permanently!");
    } catch (err: any) {
      console.error("Crop error:", err);
      setErrorMessage("Failed to crop and save image.");
    } finally {
      setIsProcessingCrop(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm("Are you sure you want to remove your photo?")) return;
    setProfile((prev) => ({ ...prev, avatarUrl: "" }));
    localStorage.removeItem("orvixa_avatar_photo");

    try {
      await supabase.auth.updateUser({ data: { avatar_url: "" } });
      if (profile.id) {
        await supabase
          .from("profiles")
          .update({ avatar_url: null })
          .eq("id", profile.id);
      }
      window.dispatchEvent(new Event("profilePhotoUpdated"));
      setSuccessMessage("Photo removed successfully.");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const fullNameClean = profile.fullName.trim();
      const professionClean = profile.profession.trim();

      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: fullNameClean,
          profession: professionClean,
          country: profile.country,
          avatar_url: profile.avatarUrl,
        },
      });

      if (authError) throw authError;

      await supabase.from("profiles").upsert({
        id: profile.id,
        full_name: fullNameClean,
        email: profile.email,
        profession: professionClean,
        country: profile.country,
        avatar_url: profile.avatarUrl,
        updated_at: new Date().toISOString(),
      });

      localStorage.setItem("orvixa_user_name", fullNameClean);
      localStorage.setItem("orvixa_user_prof", professionClean);
      if (profile.avatarUrl) {
        localStorage.setItem("orvixa_avatar_photo", profile.avatarUrl);
      }

      window.dispatchEvent(new Event("profilePhotoUpdated"));
      setSuccessMessage("✓ Profile & branding details saved permanently!");
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
          Manage your real name, branding logo, photo cropping, and regional
          currency settings.
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
        {/* ================= AVATAR DISPLAY & CROP ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 font-sans">
          <div className="flex items-center gap-4 font-sans">
            {/* Cropped Full Cover Display */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-2xl shadow-sm overflow-hidden border border-slate-200 shrink-0 font-sans relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white bg-[#0047AB] w-full h-full flex items-center justify-center font-black">
                  {getInitials()}
                </span>
              )}
            </div>

            <div>
              <div className="text-base font-bold text-slate-900 font-sans">
                {profile.fullName || profile.email}
              </div>
              <p className="text-xs text-slate-500 font-medium font-sans">
                {profile.email}
              </p>
              <span className="text-[11px] font-bold text-[#0047AB] bg-blue-50 px-2.5 py-0.5 rounded-md mt-1 inline-block font-sans">
                {profile.profession}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 font-sans">
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
              onChange={handleSelectFile}
              className="hidden"
            />

            {profile.avatarUrl && (
              <>
                <button
                  type="button"
                  onClick={handleAdjustExisting}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 font-sans"
                  title="Adjust crop, zoom or position"
                >
                  <Crop className="w-3.5 h-3.5" />
                  <span>Adjust</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold p-2.5 rounded-xl transition font-sans"
                  title="Remove Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* ================= FORM INPUTS ================= */}
        <form onSubmit={handleSaveProfile} className="space-y-5 font-sans">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
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
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1.5 font-sans">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Profession / Specialization</span>
              </label>
              <input
                type="text"
                placeholder="e.g. UI/UX Designer"
                value={profile.profession}
                onChange={(e) =>
                  setProfile({ ...profile, profession: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
            </div>

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

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition disabled:opacity-50 font-sans"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </button>
        </form>
      </div>

      {/* ================= 🖼️ INTERACTIVE IMAGE CROP & ADJUST MODAL ================= */}
      {showCropModal && rawImageSrc && (
        <div
          onClick={() => setShowCropModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl font-sans"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-2 font-sans">
                <Crop className="w-5 h-5 text-[#0047AB]" />
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  Crop & Adjust Profile Photo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-sans">
              Drag to position your face/logo, and use the zoom slider to fill
              the circle.
            </p>

            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
            >
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <div className="w-52 h-52 rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]" />
              </div>

              <img
                ref={imageRef}
                src={rawImageSrc}
                alt="Crop preview"
                draggable={false}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transition: isDragging ? "none" : "transform 0.1s ease-out",
                  maxWidth: "none",
                  maxHeight: "none",
                }}
                className="pointer-events-none origin-center"
              />
            </div>

            <div className="space-y-3 font-sans pt-1">
              <div className="flex items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-sans flex-1">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
                  <input
                    type="range"
                    min="0.8"
                    max="3.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#0047AB] cursor-pointer"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition flex items-center gap-1 text-xs font-bold font-sans"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 font-sans">
              <button
                type="button"
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition font-sans"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleApplyCropAndSave}
                disabled={isProcessingCrop}
                className="px-5 py-2.5 bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 font-sans disabled:opacity-50"
              >
                {isProcessingCrop ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Photo...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Crop & Save Photo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
