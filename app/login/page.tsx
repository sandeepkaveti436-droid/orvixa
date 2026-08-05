"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  User,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // ⚡ 1-Click Instant Demo Login Handler
  const handleQuickDemoLogin = (
    email: string,
    role: "freelancer" | "organization" | "employee",
  ) => {
    localStorage.setItem("orvixa_user", JSON.stringify({ email, role }));

    if (role === "organization") {
      window.location.href = "/dashboard/admin";
    } else if (role === "employee") {
      window.location.href = "/dashboard/employee";
    } else {
      window.location.href = "/dashboard/freelancer";
    }
  };

  // Main Form Submit Handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const cleanEmail = loginData.email.trim().toLowerCase();

    // 1. Direct Instant Demo Logins (Bypasses any Auth setup issues)
    if (
      cleanEmail === "sarah@orvixa.com" ||
      cleanEmail.includes("freelancer")
    ) {
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "freelancer" }),
      );
      window.location.href = "/dashboard/freelancer";
      return;
    }
    if (cleanEmail === "alex@orvixa.com" || cleanEmail.includes("admin")) {
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "organization" }),
      );
      window.location.href = "/dashboard/admin";
      return;
    }
    if (cleanEmail === "john@orvixa.com" || cleanEmail.includes("employee")) {
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "employee" }),
      );
      window.location.href = "/dashboard/employee";
      return;
    }

    // 2. Live Supabase Auth Login
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: loginData.password,
        });

      if (authError) {
        setErrorMessage(authError.message || "Invalid email or password.");
        return;
      }

      if (authData?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role === "organization") {
          window.location.href = "/dashboard/admin";
        } else if (profile?.role === "employee") {
          window.location.href = "/dashboard/employee";
        } else {
          window.location.href = "/dashboard/freelancer";
        }
      }
    } catch (err: any) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[600px] pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#0047AB]/15 via-indigo-300/15 to-purple-400/10 blur-[140px] rounded-full" />
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 font-sans">
        {/* Header Logo Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100 font-sans">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/orviax.jpg"
              alt="Orvixa Logo"
              width={34}
              height={34}
              className="rounded-xl object-contain"
              priority
            />
            <span className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Orvixa
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </Link>
        </div>

        {/* ⚡ 1-CLICK INSTANT DEMO LOGIN BUTTONS */}
        <div className="mb-6 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0047AB]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test Demo Login:</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() =>
                handleQuickDemoLogin("sarah@orvixa.com", "freelancer")
              }
              className="bg-white hover:bg-blue-100 text-slate-800 text-[10px] font-bold py-2 px-1.5 rounded-lg border border-blue-200 flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <User className="w-3 h-3 text-[#0047AB]" />
              <span>Freelancer</span>
            </button>

            <button
              onClick={() =>
                handleQuickDemoLogin("alex@orvixa.com", "organization")
              }
              className="bg-white hover:bg-blue-100 text-slate-800 text-[10px] font-bold py-2 px-1.5 rounded-lg border border-blue-200 flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Building2 className="w-3 h-3 text-[#0047AB]" />
              <span>Admin</span>
            </button>

            <button
              onClick={() =>
                handleQuickDemoLogin("john@orvixa.com", "employee")
              }
              className="bg-white hover:bg-blue-100 text-slate-800 text-[10px] font-bold py-2 px-1.5 rounded-lg border border-blue-200 flex items-center justify-center gap-1 shadow-sm transition-all"
            >
              <Users className="w-3 h-3 text-[#0047AB]" />
              <span>Employee</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-sans">
            <span>Welcome </span>
            <span className="font-heading italic text-[#0047AB]">Back</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Sign in with email or use quick test login above.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4 font-sans text-left"
        >
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="alex@orvixa.com"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-600 pt-4 border-t border-slate-100 mt-6">
          Don't have an account?{" "}
          <Link
            href="/get-started"
            className="text-[#0047AB] font-bold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
