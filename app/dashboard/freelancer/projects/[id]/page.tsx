"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  FileText,
  ExternalLink,
  Tag,
  CheckSquare,
  Sparkles,
  X,
  Globe,
  Layers,
  AlertTriangle,
  Code,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ProjectPortal {
  id: string;
  project_id: string;
  page_number: number;
  title: string;
  location_tag: string;
  status: string;
  live_url: string;
  figma_url?: string;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [portals, setPortals] = useState<ProjectPortal[]>([]);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Portal Modals
  const [showAddPortalModal, setShowAddPortalModal] = useState(false);
  const [editingPortal, setEditingPortal] = useState<ProjectPortal | null>(
    null,
  );
  const [portalForm, setPortalForm] = useState({
    title: "",
    location_tag: "Main Branch",
    status: "In Progress",
    live_url: "https://",
    figma_url: "",
  });

  // Edit Project Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    client: "",
    category: "",
    budget: "",
    status: "",
    priority: "",
    progress: 10,
    start_date: "",
    due_date: "",
    description: "",
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Master Project
      const { data: projData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (projError || !projData) throw new Error("Project not found.");
      setProject(projData);

      setEditForm({
        name: projData.name || "",
        client: projData.client || "",
        category: projData.category || "Web Development",
        budget: projData.budget ? String(projData.budget) : "0",
        status: projData.status || "In Progress",
        priority: projData.priority || "High",
        progress: projData.progress || 10,
        start_date: projData.start_date || "",
        due_date: projData.due_date || "",
        description: projData.description || "",
      });

      // 2. Fetch Live Portals / Landing Pages for this Project
      const { data: portalsData } = await supabase
        .from("project_portals")
        .select("*")
        .eq("project_id", id)
        .order("page_number", { ascending: true });

      if (portalsData) setPortals(portalsData);

      // 3. Fetch Tasks
      const { data: tasksData } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_name", projData.name)
        .order("created_at", { ascending: false });

      if (tasksData) setProjectTasks(tasksData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load project.");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD / EDIT PORTAL HANDLERS ---
  const handleSavePortal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portalForm.title.trim() || !id) return;

    setIsUpdating(true);
    try {
      if (editingPortal) {
        // Update existing portal
        const { data, error } = await supabase
          .from("project_portals")
          .update({
            title: portalForm.title.trim(),
            location_tag: portalForm.location_tag.trim(),
            status: portalForm.status,
            live_url: portalForm.live_url.trim(),
            figma_url: portalForm.figma_url?.trim(),
          })
          .eq("id", editingPortal.id)
          .select()
          .single();

        if (error) throw error;
        setPortals(portals.map((p) => (p.id === editingPortal.id ? data : p)));
      } else {
        // Insert new portal
        const nextNumber = portals.length + 1;
        const { data, error } = await supabase
          .from("project_portals")
          .insert([
            {
              project_id: id,
              page_number: nextNumber,
              title: portalForm.title.trim(),
              location_tag: portalForm.location_tag.trim(),
              status: portalForm.status,
              live_url: portalForm.live_url.trim(),
              figma_url: portalForm.figma_url?.trim(),
            },
          ])
          .select()
          .single();

        if (error) throw error;
        if (data) setPortals([...portals, data]);
      }

      // Auto-recalculate progress
      const updatedPortals = editingPortal
        ? portals.map((p) =>
            p.id === editingPortal.id ? { ...p, status: portalForm.status } : p,
          )
        : [...portals, { status: portalForm.status } as any];

      const liveCount = updatedPortals.filter(
        (p) => p.status === "Live / Done",
      ).length;
      const newProgress = Math.round((liveCount / updatedPortals.length) * 100);

      await supabase
        .from("projects")
        .update({ progress: newProgress })
        .eq("id", id);
      setProject((prev: any) => ({ ...prev, progress: newProgress }));

      setShowAddPortalModal(false);
      setEditingPortal(null);
      setPortalForm({
        title: "",
        location_tag: "Main Branch",
        status: "In Progress",
        live_url: "https://",
        figma_url: "",
      });
    } catch (err: any) {
      alert(`Error saving portal: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeletePortal = async (portalId: string) => {
    if (!window.confirm("Are you sure you want to delete this portal?")) return;
    try {
      await supabase.from("project_portals").delete().eq("id", portalId);
      const remaining = portals.filter((p) => p.id !== portalId);
      setPortals(remaining);

      if (remaining.length > 0) {
        const liveCount = remaining.filter(
          (p) => p.status === "Live / Done",
        ).length;
        const newProgress = Math.round((liveCount / remaining.length) * 100);
        await supabase
          .from("projects")
          .update({ progress: newProgress })
          .eq("id", id);
        setProject((prev: any) => ({ ...prev, progress: newProgress }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Status Badge Colors for Portals
  const getPortalStatusBadge = (status: string) => {
    if (status === "Live / Done") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status === "Content Pending") {
      return "bg-amber-50 text-amber-800 border-amber-300";
    }
    if (status === "In Review") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    return "bg-blue-50 text-[#0047AB] border-blue-200";
  };

  // Helper Badge Colors for Master Project
  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("hold"))
      return "bg-amber-50 text-amber-700 border-amber-200";
    if (s.includes("cancel")) return "bg-red-50 text-red-700 border-red-200";
    if (s.includes("complete"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s.includes("review"))
      return "bg-purple-50 text-purple-700 border-purple-200";
    return "bg-blue-50 text-[#0047AB] border-blue-200";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Project Workspace...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-12 text-center space-y-4 font-sans bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 font-sans">
          Project Not Found
        </h2>
        <p className="text-xs text-slate-500 font-sans">{error}</p>
        <Link
          href="/dashboard/freelancer/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0047AB] bg-blue-50 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition font-sans"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  const livePortalsCount = portals.filter(
    (p) => p.status === "Live / Done",
  ).length;
  const livePercent =
    portals.length > 0
      ? Math.round((livePortalsCount / portals.length) * 100)
      : project.progress || 0;

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16 max-w-7xl mx-auto">
      {/* ================= 1. TOP HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3 font-sans">
          <Link
            href="/dashboard/freelancer/projects"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 font-sans">
              <span className="text-xs font-bold text-slate-400 font-sans">
                Master Project Workspace
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-[#0047AB] font-sans">
                {project.client}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
              {project.name}
            </h1>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 font-sans">
          <Link
            href={`/dashboard/freelancer/invoices?projectId=${project.id}`}
            className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-[#0047AB]/20 flex items-center gap-1.5 transition font-sans"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      {/* ================= 2. DEPLOYMENT TRACKER BANNER (MATCHES SCREENSHOT) ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 font-sans">
        <div className="flex items-center gap-4 font-sans">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-xl shrink-0 shadow-sm">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-sans">
              <h2 className="text-lg font-black text-slate-900 font-sans">
                {project.client}
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-sans">
                Web Deployment Tracker
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5 font-sans">
              {portals.length} tracked landing pages & portals across client
              branches ({livePercent}% live)
            </p>
          </div>
        </div>

        {/* Master Action Buttons */}
        <div className="flex items-center gap-2.5 font-sans">
          <button
            onClick={() => {
              setEditingPortal(null);
              setPortalForm({
                title: "",
                location_tag: "Main Branch",
                status: "In Progress",
                live_url: "https://",
                figma_url: "",
              });
              setShowAddPortalModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Add Portal / Landing Page</span>
          </button>
        </div>
      </div>

      {/* ================= 3. LIVE PORTALS & LANDING PAGES GRID ================= */}
      <div className="space-y-4 font-sans">
        <div className="flex items-center justify-between font-sans">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 font-sans">
            <Layers className="w-4 h-4 text-[#0047AB]" />
            <span>Tracked Portals & Landing Pages ({portals.length})</span>
          </h3>
          <span className="text-xs font-bold text-emerald-600 font-sans">
            {livePortalsCount} Live / {portals.length - livePortalsCount} In
            Progress
          </span>
        </div>

        {portals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-sans">
            {portals.map((portal) => (
              <div
                key={portal.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between space-y-4 transition hover:shadow-md font-sans ${
                  portal.status === "Content Pending"
                    ? "border-amber-200 bg-amber-50/20"
                    : "border-slate-200/90"
                }`}
              >
                <div>
                  {/* Top Tags: Number, Location, Status */}
                  <div className="flex items-center justify-between gap-2 font-sans mb-3">
                    <div className="flex items-center gap-1.5 font-sans">
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md font-sans">
                        #{portal.page_number}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-sans">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{portal.location_tag || "Main"}</span>
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 font-sans ${getPortalStatusBadge(
                        portal.status,
                      )}`}
                    >
                      {portal.status === "Live / Done" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {portal.status === "Content Pending" && (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      <span>{portal.status}</span>
                    </span>
                  </div>

                  {/* Portal Title */}
                  <h4 className="font-black text-sm text-slate-900 font-sans leading-snug">
                    {portal.title}
                  </h4>
                </div>

                {/* Bottom Action Buttons: Visit Portal, Edit, Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between font-sans">
                  {portal.live_url && portal.live_url !== "https://" ? (
                    <a
                      href={
                        portal.live_url.startsWith("http")
                          ? portal.live_url
                          : `https://${portal.live_url}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1.5 font-sans"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit Portal</span>
                    </a>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 italic">
                      No URL set
                    </span>
                  )}

                  <div className="flex items-center gap-1 font-sans">
                    <button
                      onClick={() => {
                        setEditingPortal(portal);
                        setPortalForm({
                          title: portal.title,
                          location_tag: portal.location_tag || "Main Branch",
                          status: portal.status,
                          live_url: portal.live_url || "https://",
                          figma_url: portal.figma_url || "",
                        });
                        setShowAddPortalModal(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition font-sans"
                      title="Edit Portal"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeletePortal(portal.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition font-sans"
                      title="Delete Portal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
            <Globe className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base font-sans">
              No Landing Pages / Portals Added Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Add your branch landing pages, clinic portals, or specialty
              websites to track their live deployments.
            </p>
            <button
              onClick={() => {
                setEditingPortal(null);
                setPortalForm({
                  title: "",
                  location_tag: "Main Branch",
                  status: "In Progress",
                  live_url: "https://",
                  figma_url: "",
                });
                setShowAddPortalModal(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Portal / Landing Page</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD / EDIT PORTAL ================= */}
      {showAddPortalModal && (
        <div
          onClick={() => setShowAddPortalModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl font-sans"
          >
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                {editingPortal
                  ? "Edit Portal / Landing Page"
                  : "Add Portal / Landing Page"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddPortalModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePortal} className="space-y-3.5 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Portal / Page Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gachibowli - Landing Page / Pain Clinic"
                  value={portalForm.title}
                  onChange={(e) =>
                    setPortalForm({ ...portalForm, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Location / Branch Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gachibowli"
                    value={portalForm.location_tag}
                    onChange={(e) =>
                      setPortalForm({
                        ...portalForm,
                        location_tag: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-emerald-600 font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Deployment Status
                  </label>
                  <select
                    value={portalForm.status}
                    onChange={(e) =>
                      setPortalForm({ ...portalForm, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-600 font-sans cursor-pointer"
                  >
                    <option value="Live / Done">🟢 Live / Done</option>
                    <option value="In Progress">🔵 In Progress</option>
                    <option value="Content Pending">🟡 Content Pending</option>
                    <option value="In Review">🟣 In Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Live Portal URL (e.g. website or staging link)
                </label>
                <input
                  type="text"
                  placeholder="https://gachibowli.clientportal.com"
                  value={portalForm.live_url}
                  onChange={(e) =>
                    setPortalForm({ ...portalForm, live_url: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2 font-sans"
              >
                {isUpdating
                  ? "Saving to Database..."
                  : "Save Portal / Landing Page"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
