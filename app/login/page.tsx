"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const cleanEmail = loginData.email.trim().toLowerCase();

    try {
      // 1. Real Supabase Authentication
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
        // Set session cookie
        document.cookie = "orvixa_demo_session=true; path=/;";

        // 2. Fetch User Profile Role from Database
        let targetRoute = "/dashboard/freelancer";

        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", authData.user.id)
            .maybeSingle();

          if (profile?.role === "organization") {
            targetRoute = "/dashboard/admin";
          } else if (profile?.role === "employee") {
            targetRoute = "/dashboard/employee";
          }
        } catch (roleErr) {
          console.log("Defaulting to freelancer route:", roleErr);
        }

        // 3. USE REPLACE so the login page is removed from browser history
        // This prevents the browser back button from returning to the website/login
        window.location.replace(targetRoute);
      }
    } catch (err: any) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0047AB] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* Background Ambient Glow */}
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
            <span>Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-sans">
            <span>Welcome </span>
            <span className="font-heading italic text-[#0047AB]">Back</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Sign in to continue to your workspace.
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
              placeholder="you@domain.com"
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
            <div className="relative mb-6">
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
            className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs font-semibold text-slate-600 pt-4 border-t border-slate-100 mt-6">
          Don&apos;t have an account?{" "}
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
