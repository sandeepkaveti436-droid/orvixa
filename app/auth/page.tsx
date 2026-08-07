"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Building2,
  Mail,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type AuthView =
  | "welcome"
  | "role_select"
  | "freelancer_signup"
  | "freelancer_success"
  | "org_signup"
  | "org_success"
  | "login";

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const [view, setView] = useState<AuthView>(
    mode === "login" ? "login" : mode === "signup" ? "role_select" : "welcome",
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (mode === "login") {
      setView("login");
    } else if (mode === "signup") {
      setView("role_select");
    }
  }, [mode]);

  // Freelancer Form State
  const [freelancerData, setFreelancerData] = useState({
    fullName: "",
    email: "",
    country: "United States",
    profession: "UX Designer",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  // Organization Form State
  const [orgData, setOrgData] = useState({
    orgName: "",
    ownerName: "",
    companyEmail: "",
    employeeCount: "11-50 employees",
    industry: "Software & Tech",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // ⚡ Fast Instant Demo Login Handler
  const handleQuickDemoLogin = (
    email: string,
    role: "freelancer" | "organization" | "employee",
  ) => {
    // Set session cookie so middleware allows entry
    document.cookie = "orvixa_demo_session=true; path=/;";
    localStorage.setItem("orvixa_user", JSON.stringify({ email, role }));

    if (role === "organization") {
      window.location.href = "/dashboard/admin";
    } else if (role === "employee") {
      window.location.href = "/dashboard/employee";
    } else {
      window.location.href = "/dashboard/freelancer";
    }
  };

  // REAL-TIME FREELANCER REGISTRATION (WITH INSTANT PROFILE CACHING)
  const handleFreelancerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (freelancerData.password !== freelancerData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 1. Instantly cache details locally for persistent sidebar display
      localStorage.setItem("orvixa_user_name", freelancerData.fullName);
      localStorage.setItem("orvixa_user_prof", freelancerData.profession);

      // 2. Sign up in Supabase with User Metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: freelancerData.email,
        password: freelancerData.password,
        options: {
          data: {
            full_name: freelancerData.fullName,
            profession: freelancerData.profession,
            role: "freelancer",
          },
        },
      });

      if (authError) {
        setErrorMessage(authError.message || "Failed to create account.");
        return;
      }

      if (authData?.user) {
        await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            email: freelancerData.email,
            full_name: freelancerData.fullName,
            role: "freelancer",
            country: freelancerData.country,
            profession: freelancerData.profession,
          },
        ]);
      }

      document.cookie = "orvixa_demo_session=true; path=/;";
      setView("freelancer_success");
    } catch (err: any) {
      setErrorMessage("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // REAL-TIME ORGANIZATION REGISTRATION
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (orgData.password !== orgData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: orgData.companyEmail,
        password: orgData.password,
      });

      if (authError) {
        setErrorMessage(authError.message || "Failed to create organization.");
        return;
      }

      if (authData?.user) {
        await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            email: orgData.companyEmail,
            full_name: orgData.ownerName,
            role: "organization",
            org_name: orgData.orgName,
            owner_name: orgData.ownerName,
            employee_count: orgData.employeeCount,
            industry: orgData.industry,
          },
        ]);
      }

      document.cookie = "orvixa_demo_session=true; path=/;";
      setView("org_success");
    } catch (err: any) {
      setErrorMessage("Failed to create organization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // REAL-TIME LOGIN
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const cleanEmail = loginData.email.trim().toLowerCase();

    // ⚡ Direct Instant Demo Logins
    if (
      cleanEmail === "sarah@orvixa.com" ||
      cleanEmail.includes("freelancer")
    ) {
      document.cookie = "orvixa_demo_session=true; path=/;";
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "freelancer" }),
      );
      window.location.href = "/dashboard/freelancer";
      return;
    }
    if (cleanEmail === "alex@orvixa.com" || cleanEmail.includes("admin")) {
      document.cookie = "orvixa_demo_session=true; path=/;";
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "organization" }),
      );
      window.location.href = "/dashboard/admin";
      return;
    }
    if (cleanEmail === "john@orvixa.com" || cleanEmail.includes("employee")) {
      document.cookie = "orvixa_demo_session=true; path=/;";
      localStorage.setItem(
        "orvixa_user",
        JSON.stringify({ email: cleanEmail, role: "employee" }),
      );
      window.location.href = "/dashboard/employee";
      return;
    }

    // Live Supabase Auth Login
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
        document.cookie = "orvixa_demo_session=true; path=/;";

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name, profession")
          .eq("id", authData.user.id)
          .single();

        if (profile?.full_name) {
          localStorage.setItem("orvixa_user_name", profile.full_name);
        }
        if (profile?.profession) {
          localStorage.setItem("orvixa_user_prof", profile.profession);
        }

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
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] relative z-10 font-sans">
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

          {view !== "welcome" && (
            <button
              onClick={() => {
                setErrorMessage(null);
                setView("welcome");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold text-center">
            ⚠️ {errorMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ================= 1. WELCOME SCREEN ================= */}
          {view === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 font-sans text-center"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-sans">
                  <span>Welcome to </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Orvixa
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans">
                  Get your first 3 months completely free. No credit card
                  required.
                </p>
              </div>

              <div className="space-y-3 pt-2 font-sans">
                <button
                  onClick={() => {
                    setErrorMessage(null);
                    setView("role_select");
                  }}
                  className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Create Free Account</span>
                </button>

                <button
                  onClick={() => {
                    setErrorMessage(null);
                    setView("login");
                  }}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Sign In to Existing Account</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= 2. SIGNUP ROLE SELECTION ================= */}
          {view === "role_select" && (
            <motion.div
              key="role_select"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-6 font-sans text-center"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-sans">
                  <span>Create your </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Workspace
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 font-sans">
                  Select the account type that best matches your workflow.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 text-left pt-2 font-sans">
                <button
                  onClick={() => {
                    setErrorMessage(null);
                    setView("freelancer_signup");
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0047AB] bg-white hover:bg-blue-50/50 transition-all flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0047AB]/10 group-hover:bg-[#0047AB] text-[#0047AB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-900 group-hover:text-[#0047AB] transition-colors">
                      Freelancer
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                      Manage your personal business, clients, projects, and
                      productivity.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setErrorMessage(null);
                    setView("org_signup");
                  }}
                  className="p-5 rounded-2xl border-2 border-slate-200 hover:border-[#0047AB] bg-white hover:bg-blue-50/50 transition-all flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0047AB]/10 group-hover:bg-[#0047AB] text-[#0047AB] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-base text-slate-900 group-hover:text-[#0047AB] transition-colors">
                      Organization
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                      Manage teams, employees, departments, and company
                      operations.
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* ================= 3. FREELANCER REGISTRATION FORM ================= */}
          {view === "freelancer_signup" && (
            <motion.div
              key="freelancer_signup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Create your </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Freelancer Account
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Fill in your details to activate your 3-Month Free Early
                  Adopter Plan.
                </p>
              </div>

              <form
                onSubmit={handleFreelancerSubmit}
                className="space-y-4 font-sans text-left"
              >
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={freelancerData.fullName}
                    onChange={(e) =>
                      setFreelancerData({
                        ...freelancerData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@design.co"
                    value={freelancerData.email}
                    onChange={(e) =>
                      setFreelancerData({
                        ...freelancerData,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Country
                    </label>
                    <select
                      value={freelancerData.country}
                      onChange={(e) =>
                        setFreelancerData({
                          ...freelancerData,
                          country: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Canada</option>
                      <option>Germany</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Profession
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="UI/UX Designer"
                      value={freelancerData.profession}
                      onChange={(e) =>
                        setFreelancerData({
                          ...freelancerData,
                          profession: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={freelancerData.password}
                      onChange={(e) =>
                        setFreelancerData({
                          ...freelancerData,
                          password: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={freelancerData.confirmPassword}
                      onChange={(e) =>
                        setFreelancerData({
                          ...freelancerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    checked={freelancerData.agreed}
                    onChange={(e) =>
                      setFreelancerData({
                        ...freelancerData,
                        agreed: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#0047AB] rounded border-slate-300 focus:ring-[#0047AB]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs font-semibold text-slate-600"
                  >
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ================= 4. FREELANCER SUCCESS ================= */}
          {view === "freelancer_success" && (
            <motion.div
              key="freelancer_success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-center py-4 font-sans"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Welcome to </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Orvixa 👋
                  </span>
                </h1>
                <p className="text-xs font-bold text-slate-500">
                  Your workspace is ready.
                </p>
              </div>

              <Link
                href="/dashboard/freelancer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25"
              >
                <span>Go to Freelancer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* ================= 5. ORGANIZATION REGISTRATION FORM ================= */}
          {view === "org_signup" && (
            <motion.div
              key="org_signup"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-5 font-sans"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Create Organization </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Workspace
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Fill in your details to activate your 3-Month Free Early
                  Adopter Plan.
                </p>
              </div>

              <form
                onSubmit={handleOrgSubmit}
                className="space-y-4 font-sans text-left"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Orvixa Tech"
                      value={orgData.orgName}
                      onChange={(e) =>
                        setOrgData({ ...orgData, orgName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Mercer"
                      value={orgData.ownerName}
                      onChange={(e) =>
                        setOrgData({ ...orgData, ownerName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Company Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@orvixa.com"
                    value={orgData.companyEmail}
                    onChange={(e) =>
                      setOrgData({ ...orgData, companyEmail: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Employee Count
                    </label>
                    <select
                      value={orgData.employeeCount}
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          employeeCount: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    >
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Industry
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Software & Tech"
                      value={orgData.industry}
                      onChange={(e) =>
                        setOrgData({ ...orgData, industry: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={orgData.password}
                      onChange={(e) =>
                        setOrgData({ ...orgData, password: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={orgData.confirmPassword}
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="orgTerms"
                    required
                    checked={orgData.agreed}
                    onChange={(e) =>
                      setOrgData({ ...orgData, agreed: e.target.checked })
                    }
                    className="w-4 h-4 text-[#0047AB] rounded border-slate-300 focus:ring-[#0047AB]"
                  />
                  <label
                    htmlFor="orgTerms"
                    className="text-xs font-semibold text-slate-600"
                  >
                    I agree to the Terms of Service and Privacy Policy.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Create Workspace</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* ================= 6. ORGANIZATION SUCCESS ================= */}
          {view === "org_success" && (
            <motion.div
              key="org_success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 text-center py-4 font-sans"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h1 className="text-2xl font-black text-slate-900 mb-1 font-sans">
                  <span>Organization created </span>
                  <span className="font-heading italic text-[#0047AB]">
                    successfully.
                  </span>
                </h1>
                <p className="text-xs font-bold text-slate-500">
                  Welcome to Orvixa.
                </p>
              </div>

              <Link
                href="/dashboard/admin"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-[#0047AB]/25"
              >
                <span>Go to Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}

          {/* ================= 7. LOGIN SCREEN ================= */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-5 font-sans"
            >
              {/* ⚡ 1-CLICK INSTANT DEMO LOGIN BUTTONS */}
              <div className="mb-4 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 font-sans">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#0047AB]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>1-Click Test Demo Login:</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 font-sans">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin("sarah@orvixa.com", "freelancer")
                    }
                    className="bg-white hover:bg-blue-100 text-slate-800 text-[10px] font-bold py-2 px-1.5 rounded-lg border border-blue-200 flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <User className="w-3 h-3 text-[#0047AB]" />
                    <span>Freelancer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleQuickDemoLogin("alex@orvixa.com", "organization")
                    }
                    className="bg-white hover:bg-blue-100 text-slate-800 text-[10px] font-bold py-2 px-1.5 rounded-lg border border-blue-200 flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    <Building2 className="w-3 h-3 text-[#0047AB]" />
                    <span>Admin</span>
                  </button>

                  <button
                    type="button"
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

              <div className="text-center font-sans">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 font-sans">
                  <span>Welcome </span>
                  <span className="font-heading italic text-[#0047AB]">
                    Back
                  </span>
                </h1>
                <p className="text-xs font-semibold text-slate-500">
                  Sign in with email or use quick test login above.
                </p>
              </div>

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

                <div className="flex items-center justify-between text-xs font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          rememberMe: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-[#0047AB] rounded border-slate-300 focus:ring-[#0047AB]"
                    />
                    <span className="text-slate-600">Remember Me</span>
                  </label>

                  <Link
                    href="/auth/forgot-password"
                    className="text-[#0047AB] font-bold hover:underline"
                  >
                    Forgot Password?
                  </Link>
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
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setView("role_select");
                  }}
                  className="text-[#0047AB] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center font-bold text-slate-600">
          Loading Orvixa Auth...
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
