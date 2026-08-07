"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Search,
  Video,
  Phone,
  MessageSquare,
  Loader2,
  UserPlus,
  Mail,
  CircleDot,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function PeopleDirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [coworkers, setCoworkers] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState("Organization");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active">("all");

  useEffect(() => {
    async function fetchCompanyDirectory() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          // 1. Get current user's organization
          const { data: myProfile } = await supabase
            .from("profiles")
            .select("org_name")
            .eq("id", user.id)
            .single();

          if (myProfile?.org_name) {
            setCurrentOrg(myProfile.org_name);

            // 2. Fetch all other users in the SAME organization
            const { data: colleagues } = await supabase
              .from("profiles")
              .select("*")
              .eq("org_name", myProfile.org_name)
              .neq("id", user.id) // Exclude self
              .order("full_name", { ascending: true });

            if (colleagues) setCoworkers(colleagues);
          }
        }
      } catch (err) {
        console.error("Error loading directory", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyDirectory();
  }, []);

  // Filter Logic
  const filteredCoworkers = coworkers.filter((c) => {
    const matchesSearch =
      (c.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.profession || "").toLowerCase().includes(searchQuery.toLowerCase());

    // Simulate "Active now" randomly for demo purposes if real status isn't tracked yet
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && c.id.charCodeAt(0) % 2 === 0);

    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] dark:text-cyan-400 mr-2" />
        <span>Syncing Company Directory...</span>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col font-sans">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            <span>People & </span>
            <span className="font-heading italic text-[#0047AB] dark:text-cyan-400">
              Directory.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            Connect with team members, project managers, and admins in{" "}
            {currentOrg}.
          </p>
        </div>
      </div>

      {/* Main UI Stage (Teams-style Split Layout) */}
      <div className="flex-1 bg-white/80 dark:bg-white/[0.04] backdrop-blur-3xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)] overflow-hidden flex flex-col md:flex-row font-sans">
        {/* LEFT SIDEBAR (Filters) */}
        <div className="w-full md:w-64 bg-slate-50/50 dark:bg-black/20 border-r border-slate-200 dark:border-white/5 p-4 flex flex-col justify-between shrink-0 font-sans">
          <div className="space-y-2">
            <h2 className="text-sm font-black text-slate-900 dark:text-white px-2 mb-4">
              Contacts
            </h2>

            <button
              onClick={() => setActiveTab("all")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "all"
                  ? "bg-[#0047AB] dark:bg-white/15 text-white dark:border dark:border-white/20 shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>All contacts</span>
            </button>

            <button
              onClick={() => setActiveTab("active")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "active"
                  ? "bg-[#0047AB] dark:bg-white/15 text-white dark:border dark:border-white/20 shadow-sm"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-white/5"
              }`}
            >
              <CircleDot className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>Active now</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all">
              <UserPlus className="w-4 h-4" />
              <span>Invite to Workspace</span>
            </button>
          </div>
        </div>

        {/* RIGHT MAIN AREA (Directory List) */}
        <div className="flex-1 flex flex-col font-sans">
          {/* Top Search Bar Area */}
          <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between font-sans">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {activeTab === "all" ? "All contacts" : "Active now"} (
              {filteredCoworkers.length})
            </h3>

            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find a contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/30 border border-transparent dark:border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0047AB] dark:focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Directory Content */}
          <div className="flex-1 p-6 overflow-y-auto font-sans">
            {filteredCoworkers.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredCoworkers.map((person) => {
                  const isOnline = person.id.charCodeAt(0) % 2 === 0; // Simulated online state

                  return (
                    <div
                      key={person.id}
                      className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-[#0047AB]/50 dark:hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-slate-100 dark:border-white/10">
                            {person.avatar_url ? (
                              <img
                                src={person.avatar_url}
                                alt={person.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              (person.full_name || "U")
                                .substring(0, 2)
                                .toUpperCase()
                            )}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 overflow-hidden">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {person.full_name}
                          </h4>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 line-clamp-1 capitalize">
                            {person.profession || person.role}
                          </p>
                        </div>
                      </div>

                      {/* Quick Actions (Chat, Call, Video, Mail) */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                        <Link
                          href={`/dashboard/employee/chat?user=${person.id}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#0047AB] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
                          title="Message"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#0047AB] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
                          title="Audio Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#0047AB] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
                          title="Video Call"
                        >
                          <Video className="w-4 h-4" />
                        </button>
                        <a
                          href={`mailto:${person.email}`}
                          className="p-2 rounded-lg bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-[#0047AB] hover:text-white dark:hover:bg-cyan-500 dark:hover:text-slate-900 transition-colors"
                          title="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 font-sans">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-3xl rotate-12 absolute -z-10" />
                  <Users className="w-16 h-16 text-[#0047AB] dark:text-cyan-400 drop-shadow-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    Bring your contacts with you
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Sync your device contacts, or invite folks to {currentOrg}.
                  </p>
                </div>
                <button className="bg-[#0047AB] dark:bg-white/20 hover:bg-[#003680] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all mt-2">
                  Sync device contacts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
