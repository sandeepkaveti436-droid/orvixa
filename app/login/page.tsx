"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
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
        window.location.replace(targetRoute);
      }
    } catch (err: any) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020B2D] via-[#001D6E] to-[#0A0526] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      {/* ================= PREMIUM AMBIENT GLOW & LIGHT ORBS ================= */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#0047AB] via-[#3B82F6]/30 to-purple-600/20 blur-[130px] rounded-full pointer-events-none opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/25 via-[#0047AB]/40 to-blue-600/20 blur-[140px] rounded-full pointer-events-none opacity-50" />

      {/* Decorative Grid Overlay Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* ================= MAIN GLASS CARD ================= */}
      <div className="w-full max-w-md bg-white/[0.95] backdrop-blur-2xl border border-white/40 rounded-3xl p-6 sm:p-10 relative z-10 font-sans">
        {/* Header Logo Bar */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100 font-sans">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/orviax.jpg"
              alt="Orvixa Logo"
              width={34}
              height={34}
              className="rounded-xl object-contain shadow-sm group-hover:scale-105 transition-transform"
              priority
            />
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                Orvixa
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0047AB]" />
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB] bg-slate-50 hover:bg-blue-50/60 px-3 py-1.5 rounded-xl border border-slate-200/80 transition-all font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-sans tracking-tight">
            <span>Welcome </span>
            <span className="italic text-[#0047AB]">Back</span>
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Sign in to continue to your workspace.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center flex items-center justify-center gap-1.5">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLoginSubmit}
          className="space-y-4 font-sans text-left"
        >
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] focus:bg-white transition font-sans shadow-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Password
            </label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] focus:bg-white transition font-sans shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
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
            className="w-full bg-gradient-to-r from-[#0047AB] to-[#003680] hover:from-[#003680] hover:to-[#00265C] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing into workspace...</span>
              </>
            ) : (
              <span>Sign In to Workspace</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs font-semibold text-slate-500 pt-4 border-t border-slate-100 mt-6 font-sans">
          Don&apos;t have an account?{" "}
          <Link
            href="/get-started"
            className="text-[#0047AB] font-bold hover:underline ml-1"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
