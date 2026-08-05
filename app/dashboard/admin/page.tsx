"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Building2,
  Activity,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Copy,
  LogOut,
  Sparkles,
  X,
  Mail,
} from "lucide-react";

export default function AdminDashboard() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const [employees, setEmployees] = useState([
    { id: 1, name: "Sarah Jenkins", email: "sarah@orvixa.com", role: "Product Designer", status: "Active" },
    { id: 2, name: "Alex Mercer", email: "alex@orvixa.com", role: "Frontend Engineer", status: "Active" },
    { id: 3, name: "David Kim", email: "david@orvixa.com", role: "DevOps Engineer", status: "Invited" },
  ]);

  const generateInviteLink = () => {
    return `http://localhost:3000/invite?org=Orvixa%20Workspace&email=${encodeURIComponent(inviteEmail || "employee@orvixa.com")}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generateInviteLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      setEmployees([
        ...employees,
        {
          id: Date.now(),
          name: inviteEmail.split("@")[0],
          email: inviteEmail,
          role: "Team Member",
          status: "Invited",
        },
      ]);
      alert(`Invitation sent to ${inviteEmail}! Link copied.`);
      handleCopyLink();
      setInviteEmail("");
      setShowInviteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Image src="/orviax.jpg" alt="Orvixa" width={32} height={32} className="rounded-xl" />
          <span className="font-heading text-xl font-bold text-slate-900">Orvixa Admin</span>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full border border-indigo-200">
            Orvixa Workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Invite Employee</span>
          </button>

          <Link
            href="/auth"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8">
        
        {/* Header Pitch */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Organization Command Center
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Oversee team members, activity, permissions, and AI sprint reports.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-[#0047AB] shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Auto-Pilot Sync Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Total Employees</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{employees.length}</div>
            <span className="text-xs text-emerald-600 font-bold mt-2 block">✓ 3 Active, 1 Pending</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Sprint Execution</span>
            <div className="text-3xl font-black text-[#0047AB] mt-1">94.8%</div>
            <span className="text-xs text-slate-500 font-semibold mt-2 block">+12% faster than last week</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-400">Security & RBAC</span>
            <div className="text-3xl font-black text-slate-900 mt-1">SOC2</div>
            <span className="text-xs text-emerald-600 font-bold mt-2 block">✓ All Accounts Encrypted</span>
          </div>
        </div>

        {/* Employee Directory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0047AB]" />
              <span>Employee Roster</span>
            </h2>

            <button
              onClick={() => setShowInviteModal(true)}
              className="text-xs font-bold text-[#0047AB] hover:underline"
            >
              + Add Member
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <div key={emp.id} className="p-4 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold">
                    {emp.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-slate-400">{emp.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium">{emp.role}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                    emp.status === "Active" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}>
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* INVITE EMPLOYEE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0047AB]" />
                <span>Invite Employee to Team</span>
              </h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Employee Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="employee@orvixa.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Generated Invite Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generateInviteLink()}
                    className="bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600 px-3 py-2 rounded-xl w-full"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shrink-0 flex items-center gap-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#0047AB]/25"
              >
                Send Invite Email
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}