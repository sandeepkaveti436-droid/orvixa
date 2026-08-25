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
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [project, setProject] = useState<any>(null);
  const [projectTasks, setProjectTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Edit Modal State
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

  // Quick Task Input
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Project Record
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

      // 2. Fetch Tasks linked to this project
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

  // --- LIVE STATUS CHANGER ---
  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("projects")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      setProject({ ...project, status: newStatus });
      setEditForm((prev) => ({ ...prev, status: newStatus }));
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- LIVE PROGRESS UPDATER ---
  const handleUpdateProgress = async (newProgress: number) => {
    try {
      await supabase
        .from("projects")
        .update({ progress: newProgress })
        .eq("id", id);

      setProject({ ...project, progress: newProgress });
      setEditForm((prev) => ({ ...prev, progress: newProgress }));
    } catch (err) {
      console.error(err);
    }
  };

  // --- SAVE EDIT PROJECT FORM ---
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const payload = {
        name: editForm.name.trim(),
        client: editForm.client.trim(),
        category: editForm.category,
        budget: parseFloat(editForm.budget) || 0,
        status: editForm.status,
        priority: editForm.priority,
        progress: Number(editForm.progress) || 10,
        start_date: editForm.start_date || null,
        due_date: editForm.due_date || null,
        description: editForm.description.trim(),
      };

      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      setProject(data);
      setShowEditModal(false);
    } catch (err: any) {
      alert(`Failed to update project: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- QUICK TASK ACTIONS FOR THIS PROJECT ---
  const handleAddProjectTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !project) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: newTaskTitle.trim(),
            project_name: project.name,
            priority: "High",
            status: "Pending",
          },
        ])
        .select();

      if (error) throw error;
      if (data) setProjectTasks([data[0], ...projectTasks]);
      setNewTaskTitle("");
    } catch (err: any) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      await supabase
        .from("tasks")
        .update({ status: nextStatus })
        .eq("id", taskId);

      setProjectTasks(
        projectTasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setProjectTasks(projectTasks.filter((t) => t.id !== taskId));
  };

  // Helper Badge Colors
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

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16 max-w-6xl mx-auto">
      {/* ================= 1. TOP HEADER & CONTROLS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3 font-sans">
          <Link
            href="/dashboard/freelancer/projects"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition flex items-center justify-center shadow-sm"
            title="Back to all projects"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 font-sans">
              <span className="text-xs font-bold text-slate-400 font-sans">
                Project Workspace
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

        {/* Action Buttons */}
        <div className="flex items-center gap-2 font-sans">
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition font-sans"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>

          {/* CREATE INVOICE WITH LIVE PROJECT PREFILL */}
          <Link
            href={`/dashboard/freelancer/invoices?projectId=${project.id}`}
            className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-[#0047AB]/20 flex items-center gap-1.5 transition font-sans"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      {/* ================= 2. TWO-COLUMN WORKSPACE LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
        {/* ================= LEFT MAIN COLUMN (70%) ================= */}
        <div className="lg:col-span-2 space-y-6 font-sans">
          {/* Main Status & Overview Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5 font-sans">
            {/* Status & Priority Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 font-sans pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2 font-sans">
                {/* Live Status Dropdown */}
                <select
                  value={project.status || "In Progress"}
                  disabled={isUpdating}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer focus:outline-none font-sans ${getStatusBadge(
                    project.status,
                  )}`}
                >
                  <option value="In Progress">🟢 In Progress</option>
                  <option value="On Hold (Payment Pending)">
                    🟠 On Hold (Payment Issue)
                  </option>
                  <option value="Under Review">🟣 Under Review</option>
                  <option value="Completed">🔵 Completed</option>
                  <option value="Cancelled">🔴 Cancelled</option>
                </select>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-sans">
                  {project.priority || "High"} Priority
                </span>

                {project.category && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-sans">
                    {project.category}
                  </span>
                )}
              </div>

              <span className="text-xs font-bold text-slate-400 font-sans">
                Currency: <strong className="text-slate-700">₹ INR</strong>
              </span>
            </div>

            {/* Live Progress Bar with Quick Controls */}
            <div className="space-y-2 font-sans">
              <div className="flex items-center justify-between text-xs font-bold font-sans">
                <span className="text-slate-700 font-sans">
                  Overall Project Completion
                </span>
                <span className="text-[#0047AB] font-sans">
                  {project.progress || 10}% Done
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden font-sans">
                <div
                  className="h-full bg-[#0047AB] rounded-full transition-all duration-500 font-sans"
                  style={{ width: `${project.progress || 10}%` }}
                />
              </div>

              {/* Progress preset buttons */}
              <div className="flex items-center gap-2 pt-1 font-sans">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-sans">
                  Set Progress:
                </span>
                {[10, 25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleUpdateProgress(val)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition font-sans ${
                      project.progress === val
                        ? "bg-[#0047AB] text-white border-[#0047AB]"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            {/* Scope of Work & Description */}
            <div className="space-y-2 pt-2 font-sans">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                SCOPE & CLIENT REQUIREMENTS
              </span>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {project.description ||
                  "No scope description provided yet. Click 'Edit Details' above to add requirements."}
              </div>
            </div>
          </div>

          {/* Project Deliverables & Tasks Section */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 font-sans">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
              <div className="flex items-center gap-2 font-sans">
                <CheckSquare className="w-4 h-4 text-[#0047AB]" />
                <h3 className="font-bold text-sm text-slate-900 font-sans">
                  Deliverables & Tasks ({projectTasks.length})
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-sans">
                {projectTasks.filter((t) => t.status === "Completed").length}{" "}
                Completed
              </span>
            </div>

            {/* Add Task Input */}
            <form
              onSubmit={handleAddProjectTask}
              className="flex gap-2 font-sans"
            >
              <input
                type="text"
                required
                placeholder="Add new project task (e.g. Design Landing Page Wireframes)..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 font-sans"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-2 pt-1 font-sans">
              {projectTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-3 bg-slate-50/80 hover:bg-blue-50/30 border border-slate-100 rounded-xl flex items-center justify-between gap-3 group transition font-sans"
                >
                  <div className="flex items-center gap-2.5 min-w-0 font-sans">
                    <button
                      onClick={() => handleToggleTask(t.id, t.status)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 font-sans ${
                        t.status === "Completed"
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-[#0047AB] bg-white"
                      }`}
                    >
                      {t.status === "Completed" && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span
                      className={`text-xs font-bold font-sans truncate ${
                        t.status === "Completed"
                          ? "line-through text-slate-400"
                          : "text-slate-800"
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition p-1 font-sans"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {projectTasks.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400 font-sans">
                  No specific tasks created for this project yet. Add your first
                  deliverable above.
                </div>
              )}
            </div>
          </div>

          {/* Project Attachments & Files */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between font-sans">
            <div className="space-y-1 font-sans">
              <h4 className="font-bold text-sm text-slate-900 font-sans">
                Project Assets & Contracts (0)
              </h4>
              <p className="text-xs text-slate-400 font-sans">
                Store design assets, Figma links, contracts, and briefs.
              </p>
            </div>
            <button className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 font-sans">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Asset</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT SIDEBAR (30%) ================= */}
        <div className="space-y-6 font-sans">
          {/* Financial Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 font-sans">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
              TOTAL PROJECT BUDGET
            </span>
            <div className="text-3xl font-black text-[#0047AB] font-sans">
              ₹{Number(project.budget || 0).toLocaleString("en-IN")}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5 font-sans">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-slate-500 font-sans">Payment Terms:</span>
                <span className="text-slate-800 font-sans">
                  Milestone Based
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-slate-500 font-sans">
                  Billing Status:
                </span>
                <span className="text-emerald-600 font-sans">
                  ✓ Verified in DB
                </span>
              </div>
            </div>
          </div>

          {/* Client & Timeline Metadata Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 font-sans">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider font-sans">
              Project Information
            </h4>

            <div className="space-y-3 font-sans">
              {/* Client */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                <Building className="w-4 h-4 text-[#0047AB] mt-0.5" />
                <div className="font-sans">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                    Client
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    {project.client}
                  </span>
                </div>
              </div>

              {/* Timeline Dates */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                <Calendar className="w-4 h-4 text-[#0047AB] mt-0.5" />
                <div className="font-sans">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                    Timeline
                  </span>
                  <span className="text-xs font-bold text-slate-900 font-sans">
                    {project.start_date || "Start"} ➔{" "}
                    {project.due_date || "Deadline not set"}
                  </span>
                </div>
              </div>

              {/* Created Timestamp */}
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 font-sans">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="font-sans">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                    Created On
                  </span>
                  <span className="text-xs font-bold text-slate-700 font-sans">
                    {project.created_at
                      ? new Date(project.created_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Recently"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT PROJECT MODAL ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-lg w-full space-y-4 shadow-2xl my-8 font-sans">
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-sm text-slate-900 font-sans">
                Edit Project Workspace
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.client}
                    onChange={(e) =>
                      setEditForm({ ...editForm, client: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Budget (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editForm.budget}
                    onChange={(e) =>
                      setEditForm({ ...editForm, budget: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={editForm.start_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, start_date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editForm.due_date}
                    onChange={(e) =>
                      setEditForm({ ...editForm, due_date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Scope & Requirements
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdating}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 font-sans"
              >
                {isUpdating
                  ? "Saving Changes..."
                  : "Save Project Changes (₹ INR)"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
