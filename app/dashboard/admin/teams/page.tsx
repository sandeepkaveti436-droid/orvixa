"use client";

import React, { useState, useEffect } from "react";
import { Users2, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TeamsPage() {
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealTeams() {
      try {
        const { data } = await supabase
          .from("teams")
          .select("*")
          .order("created_at", { ascending: true });
        if (data) setTeams(data);
      } catch (e) {
        console.log("Loading teams...");
      } finally {
        setLoading(false);
      }
    }
    fetchRealTeams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Real Teams...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Teams & Department Leads
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Create teams, assign team leads, and track department output.
          </p>
        </div>
        <button className="bg-[#9D00FF] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans">
          <Plus className="w-4 h-4" />
          <span>Create New Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {teams.length > 0 ? (
          teams.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-100 font-sans">
                <div className="flex items-center gap-3 font-sans">
                  <div className="w-10 h-10 rounded-xl bg-[#9D00FF]/10 text-[#9D00FF] flex items-center justify-center font-bold">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 font-sans">
                      {t.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold font-sans">
                      Lead:{" "}
                      <strong className="text-slate-800 font-sans">
                        {t.team_lead || "Unassigned"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-600 pt-2 font-sans">
                <span>{t.members_count || 0} Members</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-slate-400 font-sans">
            <p className="text-xs font-bold">No teams configured yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
