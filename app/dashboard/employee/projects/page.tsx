"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, Building2, Loader2, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealProjects() {
      try {
        // Fetch real organization projects from Supabase
        const { data } = await supabase
          .from("organization_projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (data) setProjects(data);
      } catch (err) {
        console.error("Error fetching projects", err);
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
        <span>Loading Department Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Department Projects
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Real-time projects and sprint milestones assigned to your
          organization.
        </p>
      </div>

      <div className="space-y-4 font-sans">
        {projects.length > 0 ? (
          projects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans"
            >
              <div className="flex justify-between items-start font-sans">
                <div>
                  <span className="text-xs font-bold text-[#9D00FF] uppercase tracking-wider block font-sans mb-1">
                    {p.department || "General Department"}
                  </span>
                  <h3 className="font-bold text-xl text-slate-900 font-sans">
                    {p.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 font-sans mt-1">
                    Lead:{" "}
                    <strong className="text-slate-800">
                      {p.project_manager || "Unassigned"}
                    </strong>{" "}
                    • Due {p.deadline || "TBD"}
                  </p>
                </div>

                <span className="text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-sans">
                  Active
                </span>
              </div>

              <div className="space-y-1.5 font-sans pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-700 font-sans">
                  <span>Sprint Progress</span>
                  <span>{p.progress || 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${p.progress || 0}%` }}
                    className="bg-[#9D00FF] h-full rounded-full"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900 font-sans">
              No Projects Assigned
            </h3>
            <p className="text-xs font-medium text-slate-500 font-sans">
              Your organization admins have not created any projects yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
