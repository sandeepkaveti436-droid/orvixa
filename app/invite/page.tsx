"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function InviteContent() {
  const searchParams = useSearchParams();
  const orgName = searchParams.get("org") || "Orvixa Workspace";
  const email = searchParams.get("email") || "employee@orvixa.com";

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            email: email,
            full_name: fullName,
            role: "employee",
            org_name: orgName,
          },
        ]);
      }

      setJoined(true);
    } catch (err: any) {
      alert(err.message || "Failed to accept invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl relative z-10 font-sans">
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
            <span className="font-heading text-xl font-bold tracking-tight text-slate-900">
              Orvixa
            </span>
          </Link>
          <span className="text-xs font-bold text-[#0047AB] bg-[#0047AB]/10 px-3 py-1 rounded-full">
            Team Invitation
          </span>
        </div>

        {joined ? (
          <div className="text-center py-4 space-y-5 font-sans">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                <span>Joined </span>
                <span className="font-heading italic text-[#0047AB]">
                  {orgName}!
                </span>
              </h1>
              <p className="text-xs font-bold text-slate-500 font-sans">
                Your employee account is created and synced.
              </p>
            </div>

            <Link
              href="/dashboard/employee"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25"
            >
              <span>Go to Team Member App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-5 font-sans">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0047AB] mb-2">
                <Building2 className="w-4 h-4" />
                <span>Invited by {orgName}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                <span>Accept Team </span>
                <span className="font-heading italic text-[#0047AB]">
                  Invitation
                </span>
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                Set up your password to join{" "}
                <strong className="text-slate-800">{email}</strong>.
              </p>
            </div>

            <form
              onSubmit={handleAcceptInvite}
              className="space-y-4 font-sans text-left"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <span>Accept & Join Team</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center font-bold text-slate-600">
          Loading Invitation...
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
