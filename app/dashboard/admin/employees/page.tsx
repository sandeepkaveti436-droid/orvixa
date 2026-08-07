"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  Mail,
  ShieldCheck,
  Copy,
  X,
  Search,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeesPage() {
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    fetchRealEmployees();
  }, []);

  const fetchRealEmployees = async () => {
    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .in("role", ["employee", "organization", "admin"])
        .order("created_at", { ascending: false });

      if (data) setEmployees(data);
    } catch (e) {
      console.log("Loading employees...");
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = () => {
    return `https://orvixa.com/invite?org=Orvixa%20Workspace&email=${encodeURIComponent(inviteEmail || "employee@orvixa.com")}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateInviteLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail) {
      alert(`Invitation sent to ${inviteEmail}! Link copied.`);
      handleCopy();
      setInviteEmail("");
      setShowInviteModal(false);
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      (e.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Employee Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Employee Directory
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage organization staff roster, roles, and invitation magic links.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 font-sans"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Invite Employee</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-[#0047AB]" />
            <span>Staff Roster ({filteredEmployees.length} Members)</span>
          </h2>
        </div>

        {filteredEmployees.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 text-xs font-semibold font-sans"
              >
                <div className="flex items-center gap-3 font-sans">
                  <div className="w-10 h-10 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs font-sans">
                    {emp.full_name
                      ? emp.full_name.substring(0, 2).toUpperCase()
                      : "EMP"}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 font-sans">
                      {emp.full_name || "Pending User"}
                    </div>
                    <div className="text-slate-400 font-sans">{emp.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-sans">
                  <span className="text-slate-600 font-semibold font-sans capitalize">
                    {emp.role}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-sans bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 space-y-3 font-sans">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">No employees found.</p>
          </div>
        )}
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 font-sans">
                <UserPlus className="w-5 h-5 text-[#0047AB]" />
                <span>Invite Employee to Workspace</span>
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Employee Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="employee@orvixa.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Magic Invite Link
                </label>
                <div className="flex gap-2 font-sans">
                  <input
                    type="text"
                    readOnly
                    value={generateInviteLink()}
                    className="bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600 px-3 py-2 rounded-xl w-full"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl shrink-0 flex items-center gap-1 font-sans"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#0047AB]/25 font-sans"
              >
                Send Invite Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
