"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function OrgProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealProjects() {
      try {
        const { data } = await supabase
          .from("organization_projects")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setProjects(data);
      } catch (e) {
        console.log("Loading projects...");
      } finally {
        setLoading(false);
      }
    }
    fetchRealProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Real Organization Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Organization Projects
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Cross-department milestones, budgets, and project managers.
          </p>
        </div>
        <button className="bg-[#9D00FF] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans">
          <Plus className="w-4 h-4" />
          <span>New Org Project</span>
        </button>
      </div>

      <div className="space-y-4 font-sans">
        {projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-sans"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-sans">
                  <h3 className="font-bold text-lg text-slate-900 font-sans">
                    {p.name}
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#9D00FF] px-2.5 py-0.5 rounded-full font-sans">
                    {p.department || "General"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold font-sans">
                  Project Manager:{" "}
                  <strong className="text-slate-800 font-sans">
                    {p.project_manager || "Unassigned"}
                  </strong>{" "}
                  • Deadline: {p.deadline || "TBD"}
                </p>
              </div>

              <div className="flex items-center gap-6 font-sans">
                <div className="text-right font-sans">
                  <span className="text-xs font-bold text-slate-400 uppercase block font-sans">
                    Budget
                  </span>
                  <span className="text-lg font-black text-[#9D00FF] font-sans">
                    ${Number(p.budget || 0).toLocaleString()}
                  </span>
                </div>

                <div className="w-32 space-y-1 font-sans">
                  <div className="flex justify-between text-[10px] font-bold font-sans">
                    <span>Progress</span>
                    <span>{p.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden font-sans">
                    <div
                      style={{ width: `${p.progress || 0}%` }}
                      className="bg-[#9D00FF] h-full rounded-full font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900 font-sans">
              No Organization Projects Yet
            </h3>
            <p className="text-xs font-medium text-slate-500 font-sans">
              Create a project to allocate tasks to departments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
