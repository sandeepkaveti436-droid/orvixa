"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        { redirectTo: `${window.location.origin}/reset-password` },
      );

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setSent(true);
    } catch (error: unknown) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not send the reset email. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020B2D] via-[#001D6E] to-[#0A0526] flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      <section className="w-full max-w-md bg-white/[0.95] border border-white/40 rounded-3xl p-6 sm:p-10 relative z-10">
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/orviax.jpg"
              alt="Orvixa Logo"
              width={34}
              height={34}
              className="rounded-xl object-contain"
              priority
            />
            <span className="text-xl font-black text-slate-900">Orvixa</span>
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#9D00FF]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sign in
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#9D00FF]/10 text-[#9D00FF] flex items-center justify-center mx-auto mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
            Reset your password
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            We&apos;ll email a secure link to the address on your account.
          </p>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center"
          >
            {errorMessage}
          </p>
        )}

        {sent ? (
          <div role="status" className="space-y-4 text-center">
            <p className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold">
              If an account exists for {email.trim()}, a password reset link is
              on its way. Check your inbox.
            </p>
            <Link
              href="/login"
              className="w-full inline-flex justify-center bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-sm py-3 px-4 rounded-xl"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="recovery-email"
                className="text-xs font-bold text-slate-700 block mb-1"
              >
                Email address
              </label>
              <input
                id="recovery-email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] focus:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#9D00FF] to-[#7A00CC] text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
