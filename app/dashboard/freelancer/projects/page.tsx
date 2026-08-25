"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FolderKanban,
  LayoutGrid,
  List,
  Search,
  Plus,
  Building,
  Calendar,
  Clock,
  ArrowRight,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Copy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [projects, setProjects] = useState<any[]>([]);

  const [newProj, setNewProj] = useState({
    name: "",
    client: "",
    category: "Web Development",
    description: "",
    deliverables: "",
    status: "In Progress",
    priority: "High",
    budget: "5000",
    currency: "INR (₹)",
    start_date: new Date().toISOString().split("T")[0],
    due_date: "",
  });

  const existingClients = Array.from(
    new Set(projects.map((p) => (p.client || "").trim()).filter(Boolean)),
  );

  useEffect(() => {
    fetchRealProjects();
  }, []);

  const fetchRealProjects = async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading projects:", error.message);
      } else if (data) {
        setProjects(data);
      }
    } catch (err: any) {
      console.error("Error loading projects:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick Duplicate / Next Deliverable for Same Client
  const handleQuickAddForClient = (clientName: string) => {
    const clientProjectsCount = projects.filter(
      (p) => p.client === clientName,
    ).length;
    setNewProj({
      name: `${clientName} - Deliverable #${clientProjectsCount + 1}`,
      client: clientName,
      category: "Web Development",
      description: `High-performance digital system and landing page architecture for ${clientName}`,
      deliverables:
        "Wireframing, Responsive UI, Next.js Development, Database Integration",
      status: "In Progress",
      priority: "High",
      budget: "5000",
      currency: "INR (₹)",
      start_date: new Date().toISOString().split("T")[0],
      due_date: "",
    });
    setShowCreateModal(true);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    const clientName = newProj.client.trim();
    const projectName = newProj.name.trim();

    if (!projectName || !clientName) {
      setErrorMessage("Project Name and Client Name are required.");
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        name: projectName,
        client: clientName,
        category: newProj.category,
        description: newProj.description.trim(),
        deliverables: newProj.deliverables.trim(),
        status: newProj.status || "In Progress",
        priority: newProj.priority || "High",
        budget: parseFloat(newProj.budget) || 0,
        currency: "INR (₹)",
        start_date: newProj.start_date || null,
        due_date: newProj.due_date || null,
        progress: 10,
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setProjects((prev) => [data[0], ...prev]);
      } else {
        await fetchRealProjects();
      }

      setNewProj({
        name: "",
        client: "",
        category: "Web Development",
        description: "",
        deliverables: "",
        status: "In Progress",
        priority: "High",
        budget: "5000",
        currency: "INR (₹)",
        start_date: new Date().toISOString().split("T")[0],
        due_date: "",
      });
      setShowCreateModal(false);
    } catch (err: any) {
      console.error("Supabase Save Error:", err);
      setErrorMessage(err.message || "Failed to save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (id: string | number, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw new Error(error.message);
      setProjects((prev) => prev.filter((proj) => proj.id !== id));
    } catch (err: any) {
      alert(`Error deleting project: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (p.status || "").toLowerCase().replace(/\s+/g, "") ===
        statusFilter.toLowerCase();

    const matchesClient =
      clientFilter === "all" ||
      (p.client || "").toLowerCase() === clientFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesClient;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Real Projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Projects & </span>
            <span className="italic text-[#0047AB]">Workflows.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage client deliverables, multi-page campaigns, and deadlines in ₹
            INR.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage("");
            setShowCreateModal(true);
          }}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 transition font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full md:w-80 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, client, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 font-sans w-full md:w-auto">
          {/* Client Filter Dropdown */}
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#0047AB] font-sans"
          >
            <option value="all">All Clients ({existingClients.length})</option>
            {existingClients.map((clientName, i) => (
              <option key={i} value={clientName}>
                {clientName} (
                {projects.filter((p) => p.client === clientName).length}{" "}
                Deliverables)
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-[#0047AB] font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="inprogress">In Progress</option>
            <option value="review">Under Review</option>
            <option value="completed">Completed</option>
          </select>

          {/* Grid / List Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-sans">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all font-sans ${
                viewMode === "grid"
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-500"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all font-sans ${
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

      {/* PROJECTS DISPLAY */}
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
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition font-sans"
            >
              <div>
                <div className="flex justify-between items-start mb-3 font-sans">
                  <div className="flex gap-2 font-sans">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0047AB] border border-blue-200 font-sans">
                      {proj.status || "In Progress"}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 font-sans">
                      {proj.priority || "High"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 font-sans">
                    <button
                      onClick={() => handleQuickAddForClient(proj.client)}
                      title={`Add another deliverable for ${proj.client}`}
                      className="p-1.5 text-slate-400 hover:text-[#0047AB] hover:bg-blue-50 rounded-lg transition font-sans text-xs flex items-center gap-1 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="text-[10px] hidden sm:inline">
                        Add Deliverable
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj.id, proj.name)}
                      disabled={deletingId === proj.id}
                      title="Delete Project"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-sans"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Link
                  href={`/dashboard/freelancer/projects/${proj.id}`}
                  className="font-bold text-lg text-slate-900 hover:text-[#0047AB] block mb-1 font-sans"
                >
                  {proj.name}
                </Link>

                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mb-2 font-sans">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{proj.client}</span>
                  {proj.category && (
                    <span className="ml-auto bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium font-sans">
                      {proj.category}
                    </span>
                  )}
                </p>

                <p className="text-xs text-slate-600 font-medium line-clamp-2 mb-3 font-sans">
                  {proj.description || "No project description provided."}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2 font-sans">
                  {proj.due_date && (
                    <span className="flex items-center gap-1 font-sans">
                      <Calendar className="w-3 h-3 text-[#0047AB]" />
                      Due: {proj.due_date}
                    </span>
                  )}
                  {proj.created_at && (
                    <span className="flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(proj.created_at).toLocaleDateString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between font-sans">
                <span className="text-[#0047AB] font-black text-base flex items-center font-sans">
                  ₹{Number(proj.budget || 0).toLocaleString("en-IN")}
                </span>

                <Link
                  href={`/dashboard/freelancer/projects/${proj.id}`}
                  className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
          <FolderKanban className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            No Projects Found
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
            Launch your client projects, web deliverables, and landing pages to
            track milestones and earnings.
          </p>
          <button
            onClick={() => {
              setErrorMessage("");
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Project</span>
          </button>
        </div>
      )}

      {/* ================= CREATE PROJECT MODAL ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 my-8 font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 font-sans">
                <FolderKanban className="w-5 h-5 text-[#0047AB]" />
                <span>Create Project / Deliverable</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form
              onSubmit={handleCreateProject}
              className="space-y-3.5 font-sans"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Project / Page Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js SaaS Web App"
                    value={newProj.name}
                    onChange={(e) =>
                      setNewProj({ ...newProj, name: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    list="client-suggestions"
                    placeholder="e.g. Acme Global Inc."
                    value={newProj.client}
                    onChange={(e) =>
                      setNewProj({ ...newProj, client: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  />
                  <datalist id="client-suggestions">
                    {existingClients.map((c, i) => (
                      <option key={i} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Category / Service
                  </label>
                  <select
                    value={newProj.category}
                    onChange={(e) =>
                      setNewProj({ ...newProj, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="Landing Page Design">
                      Landing Page Design
                    </option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="SEO & Marketing">SEO & Marketing</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Budget Amount (₹ INR) *
                  </label>
                  <div className="relative font-sans">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs font-sans">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={newProj.budget}
                      onChange={(e) =>
                        setNewProj({ ...newProj, budget: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Scope of Work & Deliverables
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wireframes, component system, backend API, responsive design..."
                  value={newProj.description}
                  onChange={(e) =>
                    setNewProj({ ...newProj, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2 font-sans"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Project (₹ INR)</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
