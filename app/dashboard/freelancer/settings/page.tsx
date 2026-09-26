"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  CheckCircle2,
  Upload,
  Trash2,
  Sparkles,
  ShieldCheck,
  Save,
  Briefcase,
  DollarSign,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function ProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [profile, setProfile] = useState({
    brandName: "Sky Nova Digitals",
    tagline: "Build What's Next.",
    ownerName: "SANDEEP KAVETI",
    role: "Founder | CEO",
    email: "skynovadigitals@gmail.com",
    phone: "+91- 9392525043",
    website: "https://skynovadigitals.vercel.app",
    address: "Beeramguda, Hyderabad, Telangana - 502032",
    currency: "INR (₹)",
    currencySymbol: "₹",
    timezone: "Asia/Kolkata (IST +5:30)",
    // Bank & Invoicing Payouts
    accountHolder: "SANDEEP KAVETI",
    bankName: "Yes Bank",
    accountNumber: "018391600022849",
    ifscCode: "YESB0000183",
    upiId: "9392525043@upi",
    // Logo
    logoUrl: "/snd-logo.png",
  });

  const [activeTab, setActiveTab] = useState<"brand" | "invoice" | "bank">(
    "brand",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Safe Supabase client creator
  const getSupabase = () => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) return createClient(url, key);
    } catch (e) {
      console.warn("Supabase not configured");
    }
    return null;
  };

  // Load profile from localStorage & Supabase
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orvixa_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setProfile((prev) => ({ ...prev, ...parsed }));
        } catch (e) {
          console.error("Failed to parse local profile:", e);
        }
      }
    }

    const fetchFromSupabase = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .limit(1)
          .single();
        if (data) {
          setProfile((prev) => ({
            ...prev,
            brandName: data.brand_name || prev.brandName,
            ownerName: data.full_name || prev.ownerName,
            phone: data.phone || prev.phone,
            address: data.address || prev.address,
            bankName: data.bank_name || prev.bankName,
            accountNumber: data.account_number || prev.accountNumber,
            ifscCode: data.ifsc_code || prev.ifscCode,
          }));
        }
      } catch (err) {
        // Fallback to local
      }
    };

    fetchFromSupabase();
  }, []);

  // Handle Logo Upload via File Input
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert("File size exceeds 3MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setProfile((prev) => ({ ...prev, logoUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // 1. Save to LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("orvixa_profile", JSON.stringify(profile));
      }

      // 2. Try saving to Supabase if table exists
      const supabase = getSupabase();
      if (supabase) {
        try {
          await supabase.from("profiles").upsert({
            brand_name: profile.brandName,
            full_name: profile.ownerName,
            role: profile.role,
            phone: profile.phone,
            website: profile.website,
            address: profile.address,
            bank_name: profile.bankName,
            account_number: profile.accountNumber,
            ifsc_code: profile.ifscCode,
            updated_at: new Date().toISOString(),
          });
        } catch (dbErr) {
          console.warn("Supabase profile save skipped:", dbErr);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20 font-sans">
      {/* Plus Jakarta Sans Google Font */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        .font-sans, h1, h2, h3, h4, h5, h6, p, span, button, input, select, textarea {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }
      `,
        }}
      />

      {/* Hidden File Input for Logo */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLogoUpload}
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span>Freelancer</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Profile & Agency</span>
        </div>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Agency & Profile <span className="text-blue-600">Settings.</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Manage your brand identity, contact details, and banking presets
              for automated invoicing.
            </p>
          </div>

          {/* Save Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved Successfully!
                </>
              ) : isSaving ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Brand Card Hero / Quick Overview */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm mb-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {/* Logo Preview & Core Brand Info */}
            <div className="flex items-center gap-5">
              {/* Logo Box */}
              <div className="relative group">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-2.5 overflow-hidden shadow-sm border border-slate-100 transition"
                  style={{ backgroundColor: "#F5A623" }}
                >
                  <img
                    src={profile.logoUrl}
                    alt="Agency Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                      const fallback =
                        document.getElementById("hero-logo-fallback");
                      if (fallback) fallback.style.display = "block";
                    }}
                  />
                  <div
                    id="hero-logo-fallback"
                    style={{ display: "none" }}
                    className="text-center"
                  >
                    <span className="text-xl font-black text-white tracking-tighter">
                      SND
                    </span>
                  </div>
                </div>

                {/* Edit overlay icon */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition cursor-pointer"
                  title="Change Logo"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Email */}
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {profile.brandName}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {profile.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {profile.role}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold italic">
                    "{profile.tagline}"
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Branding Logo
              </button>
              <button
                type="button"
                onClick={() =>
                  setProfile((prev) => ({ ...prev, logoUrl: "/snd-logo.png" }))
                }
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
                title="Reset to default SND logo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-7 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("brand")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "brand"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Brand & Identity
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoice")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "invoice"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoice & Agency Details
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === "bank"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank & Payouts (Auto-Sync)
          </button>
        </div>

        {/* TAB 1: Brand & Identity */}
        {activeTab === "brand" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Brand & Professional Profile
              </h3>

              {/* Brand Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Brand Name / Agency Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.brandName}
                    onChange={(e) =>
                      setProfile({ ...profile, brandName: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Founder / Real Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Full Name / Founder
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.ownerName}
                    onChange={(e) =>
                      setProfile({ ...profile, ownerName: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Tagline / Slogan
                </label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) =>
                      setProfile({ ...profile, tagline: e.target.value })
                    }
                    placeholder="e.g. Build What's Next."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Profession / Role */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Profession / Role Title
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) =>
                      setProfile({ ...profile, role: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* Regional & Financial Preferences */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Regional & Invoicing Currency
              </h3>

              {/* Country & Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Country & Primary Currency
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={profile.currency}
                    onChange={(e) =>
                      setProfile({ ...profile, currency: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                  >
                    <option value="INR (₹)">India (₹ INR)</option>
                    <option value="USD ($)">United States ($ USD)</option>
                    <option value="EUR (€)">European Union (€ EUR)</option>
                    <option value="GBP (£)">United Kingdom (£ GBP)</option>
                    <option value="AED (د.إ)">
                      United Arab Emirates (AED)
                    </option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Timezone
                </label>
                <input
                  type="text"
                  value={profile.timezone}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Client Live Badge Preview */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Client Document Live Preview
                </label>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center font-bold text-white text-xs">
                      SND
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {profile.brandName}
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        {profile.tagline}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Invoice & Agency Details */}
        {activeTab === "invoice" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                Invoice "BILL FROM:" Header Information
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                These details automatically populate the BILL FROM section and
                footer on all generated invoices.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Agency Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Official Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Email (Read-only or editable) */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Website / Portfolio */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Website / Portfolio Link
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Location / Registered Address */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Business Location / Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Bank & Payouts (Directly syncs to Invoice Bank Box) */}
        {activeTab === "bank" && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#F5A623]" />
                  Bank Account & Payout Presets
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  These bank details appear inside the golden box on your PDF
                  invoices for client transfers.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                Auto-Synced with Invoices
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Account Holder Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Account Beneficiary Name
                </label>
                <input
                  type="text"
                  value={profile.accountHolder}
                  onChange={(e) =>
                    setProfile({ ...profile, accountHolder: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={profile.bankName}
                  onChange={(e) =>
                    setProfile({ ...profile, bankName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Account Number
                </label>
                <input
                  type="text"
                  value={profile.accountNumber}
                  onChange={(e) =>
                    setProfile({ ...profile, accountNumber: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono"
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  IFSC Code
                </label>
                <input
                  type="text"
                  value={profile.ifscCode}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      ifscCode: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-mono uppercase"
                />
              </div>

              {/* UPI ID */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  UPI ID (Optional for fast mobile transfers)
                </label>
                <input
                  type="text"
                  value={profile.upiId}
                  onChange={(e) =>
                    setProfile({ ...profile, upiId: e.target.value })
                  }
                  placeholder="e.g. 9392525043@upi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            {/* Live Invoice Bank Box Preview */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                How It Appears on Your Generated PDF Invoices:
              </label>
              <div
                className="p-4 rounded-2xl bg-white max-w-md shadow-xs"
                style={{ border: "2px solid #F5A623" }}
              >
                <div className="grid grid-cols-[100px_1fr] gap-y-1.5 text-xs font-medium">
                  <span className="text-slate-500">Name</span>
                  <span className="text-slate-900 font-bold">
                    {profile.accountHolder}
                  </span>

                  <span className="text-slate-500">Bank details</span>
                  <span className="text-slate-900 font-bold">
                    {profile.bankName}
                  </span>

                  <span className="text-slate-500">Account #</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {profile.accountNumber}
                  </span>

                  <span className="text-slate-500">IFS code</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {profile.ifscCode}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Bar */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Changes are saved locally and synced to your database and invoice
            templates.
          </p>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                Saved Successfully!
              </>
            ) : isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
