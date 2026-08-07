"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  LayoutGrid,
  List,
  Search,
  Plus,
  Paperclip,
  Building,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);

  const [newProj, setNewProj] = useState({
    name: "",
    client: "",
    description: "",
    status: "In Progress",
    priority: "High",
    budget: "3500",
    currency: "USD ($)",
  });

  // Fetch Real Projects from Supabase on Load
  useEffect(() => {
    fetchRealProjects();
  }, []);

  const fetchRealProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setProjects(data);
    } catch (err) {
      console.log("Error loading projects");
    } finally {
      setLoading(false);
    }
  };

  // Save Real Project to Supabase Database
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProj.name && newProj.client) {
      try {
        const { data: userData } = await supabase.auth.getUser();

        const { data, error } = await supabase
          .from("projects")
          .insert([
            {
              name: newProj.name,
              client: newProj.client,
              description: newProj.description,
              status: newProj.status,
              priority: newProj.priority,
              budget: Number(newProj.budget) || 2500,
              currency: newProj.currency,
              progress: 10,
            },
          ])
          .select();

        if (data) {
          setProjects([data[0], ...projects]);
        } else {
          fetchRealProjects();
        }

        setShowCreateModal(false);
        setNewProj({
          name: "",
          client: "",
          description: "",
          status: "In Progress",
          priority: "High",
          budget: "3500",
          currency: "USD ($)",
        });
      } catch (err) {
        alert("Failed to save project.");
      }
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (p.status || "").toLowerCase().replace(" ", "") === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Projects & </span>
            <span className="font-heading italic text-[#0047AB]">
              Workflows.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage your real client projects, deliverables, and milestones.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full md:w-72 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
        </div>

        <div className="flex items-center gap-3 font-sans">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#0047AB] font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="inprogress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-sans">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PROJECTS DISPLAY OR REAL EMPTY STATE */}
      {filteredProjects.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans"
              : "space-y-3 font-sans"
          }
        >
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 font-sans"
            >
              <div>
                <div className="flex justify-between items-start mb-3 font-sans">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0047AB] border border-blue-200 font-sans">
                    {proj.status || "In Progress"}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-sans">
                    {proj.priority || "High"}
                  </span>
                </div>

                <Link
                  href={`/dashboard/freelancer/projects/${proj.id}`}
                  className="font-bold text-lg text-slate-900 hover:text-[#0047AB] block mb-1 font-sans"
                >
                  {proj.name}
                </Link>

                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-3 font-sans">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.client}</span>
                </p>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-4 font-sans">
                  {proj.description || "No project description provided."}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold font-sans">
                <span className="text-[#0047AB] text-sm font-sans">
                  ${Number(proj.budget || 0).toLocaleString()}{" "}
                  {proj.currency || "USD"}
                </span>
                <span className="text-slate-400 font-sans">
                  Due {proj.due_date || "Upcoming"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            No Projects Created Yet
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
            Launch your first client project to track deliverables, milestones,
            and progress.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Project</span>
          </button>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 font-sans">
                <FolderKanban className="w-5 h-5 text-[#0047AB]" />
                <span>Create Real Project</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateProject}
              className="space-y-4 font-sans"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js SaaS Web App"
                  value={newProj.name}
                  onChange={(e) =>
                    setNewProj({ ...newProj, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global Inc."
                  value={newProj.client}
                  onChange={(e) =>
                    setNewProj({ ...newProj, client: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Budget Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="3500"
                  value={newProj.budget}
                  onChange={(e) =>
                    setNewProj({ ...newProj, budget: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md font-sans"
              >
                Save Project to Database
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
