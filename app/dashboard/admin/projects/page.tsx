"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function OrgProjectsPage() {
  const [projects] = useState([
    {
      id: 1,
      name: "Orvixa AI Engine v2.0",
      pm: "Alex Mercer",
      dept: "Engineering",
      budget: "$45,000",
      deadline: "Sep 30, 2026",
      progress: 92,
    },
    {
      id: 2,
      name: "Enterprise Design System",
      pm: "Sarah Jenkins",
      dept: "Design",
      budget: "$28,000",
      deadline: "Oct 15, 2026",
      progress: 64,
    },
    {
      id: 3,
      name: "Q3 Global Growth Campaign",
      pm: "Priya Sharma",
      dept: "Growth",
      budget: "$35,000",
      deadline: "Aug 28, 2026",
      progress: 88,
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Organization </span>
            <span className="font-heading italic text-[#0047AB]">
              Projects.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Cross-department project milestones, budgets, and project managers.
          </p>
        </div>

        <button className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Org Project</span>
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">{p.name}</h3>
                <span className="text-[10px] font-bold bg-blue-50 text-[#0047AB] px-2.5 py-0.5 rounded-full">
                  {p.dept}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Project Manager:{" "}
                <strong className="text-slate-800">{p.pm}</strong> • Deadline:{" "}
                {p.deadline}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 uppercase block">
                  Budget
                </span>
                <span className="text-lg font-black text-[#0047AB]">
                  {p.budget}
                </span>
              </div>

              <div className="w-32 space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Progress</span>
                  <span>{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${p.progress}%` }}
                    className="bg-[#0047AB] h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
