"use client";

import React, { useState } from "react";
import { Users2, Plus, UserCheck, FolderKanban } from "lucide-react";

export default function TeamsPage() {
  const [teams] = useState([
    {
      id: 1,
      name: "Engineering & Dev",
      lead: "Alex Mercer",
      membersCount: 12,
      projects: 4,
      velocity: "96%",
    },
    {
      id: 2,
      name: "Product Design",
      lead: "Sarah Jenkins",
      membersCount: 8,
      projects: 3,
      velocity: "92%",
    },
    {
      id: 3,
      name: "Growth & Marketing",
      lead: "Priya Sharma",
      membersCount: 7,
      projects: 2,
      velocity: "88%",
    },
    {
      id: 4,
      name: "Sales & Operations",
      lead: "David Kim",
      membersCount: 5,
      projects: 2,
      velocity: "94%",
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Team </span>
            <span className="font-heading italic text-[#0047AB]">
              Management.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Create teams, assign team leads, and track department output.
          </p>
        </div>

        <button className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Create New Team</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold">
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    Lead: <strong className="text-slate-800">{t.lead}</strong>
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-[#0047AB] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                {t.velocity} Velocity
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-600 pt-2">
              <span>{t.membersCount} Members</span>
              <span>{t.projects} Active Projects</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
