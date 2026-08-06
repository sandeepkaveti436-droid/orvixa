"use client";

import React from "react";
import { FolderKanban, Building2, CheckCircle2, User } from "lucide-react";

export default function EmployeeProjectsPage() {
  const projects = [
    {
      id: 1,
      name: "Orvixa Next.js 15 Web App",
      lead: "Alex Mercer",
      dept: "Engineering",
      progress: 92,
      deadline: "Aug 25, 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Figma Component System Tokens",
      lead: "Sarah Jenkins",
      dept: "Design",
      progress: 64,
      deadline: "Aug 18, 2026",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Department Projects
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Projects and sprint milestones assigned to your department.
        </p>
      </div>

      <div className="space-y-4 font-sans">
        {projects.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans"
          >
            <div className="flex justify-between items-start font-sans">
              <div>
                <span className="text-xs font-bold text-[#0047AB] uppercase tracking-wider block font-sans mb-1">
                  {p.dept}
                </span>
                <h3 className="font-bold text-xl text-slate-900 font-sans">
                  {p.name}
                </h3>
                <p className="text-xs font-semibold text-slate-500 font-sans mt-1">
                  Lead: <strong className="text-slate-800">{p.lead}</strong> •
                  Due {p.deadline}
                </p>
              </div>

              <span className="text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-sans">
                {p.status}
              </span>
            </div>

            <div className="space-y-1.5 font-sans pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-700 font-sans">
                <span>Sprint Progress</span>
                <span>{p.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${p.progress}%` }}
                  className="bg-[#0047AB] h-full rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
