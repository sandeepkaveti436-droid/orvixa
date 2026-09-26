"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Briefcase,
  Layers,
  FileText,
  Check,
  X,
  PauseCircle,
  Receipt,
  Sparkles,
  ChevronRight,
  FolderOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CreativeWork {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  status: "In Progress" | "Completed" | "Pending";
}

const CREATIVE_TYPES = [
  "Flyer",
  "Poster",
  "Brochure",
  "Menu Card",
  "Logo Design",
  "Social Media Post",
  "Instagram Reel / Video",
  "Business Card",
  "Packaging Design",
  "Banner / Hoarding",
];

const INDUSTRY_LIST = [
  "Restaurant & Food",
  "Healthcare & Hospitals",
  "E-Commerce & Retail",
  "Real Estate & Architecture",
  "Technology & SaaS",
  "Fashion, Beauty & Salons",
  "Education & Coaching",
  "Fitness, Gym & Wellness",
  "Corporate, Finance & Legal",
  "Entertainment & Media",
  "Travel & Hospitality",
  "Automobile & Logistics",
  "Other / General",
];

const CATEGORY_OPTIONS: Record<string, string[]> = {
  "Graphic Design": [
    "Logo Design",
    "Brochure",
    "Poster",
    "Flyer",
    "Social Media Designs",
    "Menu Card Design",
    "Business Card & Stationery",
    "Packaging Design",
  ],
  "Video Editing & Reels": [
    "Instagram Reels / Shorts",
    "YouTube Long-form Video",
    "Promotional / Ad Video",
    "Motion Graphics & Intro",
    "Podcast Video Editing",
    "Color Grading & Audio Sync",
  ],
  "Web Development": [
    "Full Website (Next.js / React)",
    "Landing Page Architecture",
    "Backend & REST API",
    "Supabase / DB Integration",
    "Bug Fixing & Maintenance",
  ],
  "UI/UX Design": [
    "Mobile App UI (Figma)",
    "SaaS Dashboard UI",
    "Wireframing & User Flow",
    "Design System & Components",
  ],
  "Landing Page Design": [
    "High-Converting Sales Page",
    "Product Launch Page",
    "Lead Generation Funnel",
  ],
  "SEO & Marketing": [
    "Meta & Instagram Ads Setup",
    "Google Ads Campaign",
    "SEO Audit & Keywords",
  ],
  "Mobile App": [
    "iOS & Android App Build",
    "React Native / Flutter",
    "App UI & Screen Flow",
  ],
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<any>(null);
  const [creativeWorks, setCreativeWorks] = useState<CreativeWork[]>([]);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal states
  const [showAddWorkModal, setShowAddWorkModal] = useState(false);
  const [editingWork, setEditingWork] = useState<CreativeWork | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Add work form state
  const [newWork, setNewWork] = useState({
    name: "",
    type: "Flyer",
    amount: "1500",
    date: new Date().toISOString().split("T")[0],
    status: "In Progress" as "In Progress" | "Completed" | "Pending",
  });

  // Master edit form state
  const [editForm, setEditForm] = useState<any>({});

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error("Error fetching project:", error.message);
      } else if (data) {
        setProject(data);
        setEditForm(data);
        parseDeliverables(
          data.deliverables || data.description || "",
          data.budget,
          data.status,
        );
      }
    } catch (err: any) {
      console.error("Error fetching project:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Safe parse: handles structured JSON or legacy text strings (e.g. "Flyer")
  const parseDeliverables = (
    raw: any,
    currentBudget?: number,
    projectStatus?: string,
  ) => {
    if (!raw) {
      setCreativeWorks([]);
      return;
    }
    const isProjDone = projectStatus?.toLowerCase() === "completed";
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // If master project is marked completed, ensure works are shown as completed
        const synced = parsed.map((item: any) => ({
          ...item,
          status: isProjDone ? "Completed" : item.status || "In Progress",
        }));
        setCreativeWorks(synced);
        return;
      }
    } catch {
      const items = String(raw)
        .split(/[,;\n]+/)
        .map((item, idx) => ({
          id: `item-${idx}-${Date.now()}`,
          name: item.trim(),
          type: item.trim(),
          amount: Number(currentBudget) || 0,
          date: new Date().toISOString().split("T")[0],
          status: isProjDone
            ? ("Completed" as const)
            : ("In Progress" as const),
        }))
        .filter((x) => Boolean(x.name));
      setCreativeWorks(items);
    }
  };

  // Sync creative works & project status to Supabase
  const syncWorksToSupabase = async (
    updatedWorks: CreativeWork[],
    updatedBudget?: number,
    updatedProjectStatus?: string,
  ) => {
    try {
      const payload: any = {
        deliverables: JSON.stringify(updatedWorks),
      };
      if (updatedBudget !== undefined) {
        payload.budget = updatedBudget;
      }
      if (updatedProjectStatus !== undefined) {
        payload.status = updatedProjectStatus;
      }

      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", project.id);

      if (error) throw error;
      setCreativeWorks(updatedWorks);
      if (updatedBudget !== undefined) {
        setProject((prev: any) => ({ ...prev, budget: updatedBudget }));
      }
      if (updatedProjectStatus !== undefined) {
        setProject((prev: any) => ({ ...prev, status: updatedProjectStatus }));
      }
    } catch (err: any) {
      console.error("Failed to sync changes:", err.message);
    }
  };

  // TOGGLE STATUS FOR INDIVIDUAL CREATIVE WORK (AUTO-SYNC WITH FOLDER STATUS)
  const handleToggleWorkStatus = async (id: string) => {
    const updatedWorks = creativeWorks.map((w) => {
      if (w.id === id) {
        const nextStatus =
          w.status === "Completed"
            ? ("In Progress" as const)
            : ("Completed" as const);
        return { ...w, status: nextStatus };
      }
      return w;
    });

    // Check if ALL creative deliverables are now completed
    const allCompleted =
      updatedWorks.length > 0 &&
      updatedWorks.every((w) => w.status === "Completed");

    const newProjectStatus = allCompleted ? "Completed" : "In Progress";

    // Instant optimistic update
    setCreativeWorks(updatedWorks);
    setProject((prev: any) => ({ ...prev, status: newProjectStatus }));

    // Sync to Supabase
    await syncWorksToSupabase(updatedWorks, undefined, newProjectStatus);
  };

  // FOLDER STATUS CHANGE (AUTO-SYNC TO ALL DELIVERABLES)
  const handleStatusChange = async (newStatus: string) => {
    if (!project) return;
    setIsUpdatingStatus(true);

    // If Folder marked Completed -> Mark all deliverables Completed
    // If Folder marked In Progress -> Mark all deliverables In Progress
    let updatedWorks = [...creativeWorks];
    if (newStatus === "Completed") {
      updatedWorks = creativeWorks.map((w) => ({
        ...w,
        status: "Completed" as const,
      }));
    } else if (newStatus === "In Progress") {
      updatedWorks = creativeWorks.map((w) => ({
        ...w,
        status: "In Progress" as const,
      }));
    }

    // Instant optimistic update
    setProject((prev: any) => ({ ...prev, status: newStatus }));
    setCreativeWorks(updatedWorks);

    try {
      await syncWorksToSupabase(updatedWorks, undefined, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // ADD NEW CREATIVE WORK WITH DATE
  const handleAddCreativeWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWork.name.trim()) return;

    setIsAddingWork(true);
    try {
      const workAmount = parseFloat(newWork.amount) || 0;
      const createdItem: CreativeWork = {
        id: `work-${Date.now()}`,
        name: newWork.name.trim(),
        type: newWork.type,
        amount: workAmount,
        date: newWork.date || new Date().toISOString().split("T")[0],
        status: newWork.status,
      };

      const updatedWorks = [...creativeWorks, createdItem];
      const totalBudget = updatedWorks.reduce(
        (acc, curr) => acc + (curr.amount || 0),
        0,
      );

      // Re-evaluate if project should be completed or in progress
      const allCompleted = updatedWorks.every((w) => w.status === "Completed");
      const nextProjStatus = allCompleted ? "Completed" : "In Progress";

      setCreativeWorks(updatedWorks);
      setProject((prev: any) => ({
        ...prev,
        budget: totalBudget,
        status: nextProjStatus,
      }));

      await syncWorksToSupabase(updatedWorks, totalBudget, nextProjStatus);

      setNewWork({
        name: "",
        type: "Flyer",
        amount: "1500",
        date: new Date().toISOString().split("T")[0],
        status: "In Progress",
      });
      setShowAddWorkModal(false);
    } finally {
      setIsAddingWork(false);
    }
  };

  // SAVE EDITED CREATIVE WORK
  const handleSaveEditedWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWork) return;

    try {
      const updatedWorks = creativeWorks.map((w) =>
        w.id === editingWork.id
          ? {
              ...editingWork,
              amount: parseFloat(String(editingWork.amount)) || 0,
            }
          : w,
      );

      const totalBudget = updatedWorks.reduce(
        (acc, curr) => acc + (curr.amount || 0),
        0,
      );
      const allCompleted = updatedWorks.every((w) => w.status === "Completed");
      const nextProjStatus = allCompleted ? "Completed" : "In Progress";

      setCreativeWorks(updatedWorks);
      setProject((prev: any) => ({
        ...prev,
        budget: totalBudget,
        status: nextProjStatus,
      }));

      await syncWorksToSupabase(updatedWorks, totalBudget, nextProjStatus);
      setEditingWork(null);
    } catch (err: any) {
      alert(`Failed to update creative work: ${err.message}`);
    }
  };

  // REMOVE CREATIVE WORK ANYTIME
  const handleRemoveCreativeWork = async (id: string, name: string) => {
    const confirmRemove = window.confirm(
      `Remove "${name}" from ${project.client}'s deliverables?`,
    );
    if (!confirmRemove) return;

    const updatedWorks = creativeWorks.filter((w) => w.id !== id);
    const totalBudget = updatedWorks.reduce(
      (acc, curr) => acc + (curr.amount || 0),
      0,
    );
    const allCompleted =
      updatedWorks.length > 0 &&
      updatedWorks.every((w) => w.status === "Completed");
    const nextProjStatus = allCompleted ? "Completed" : "In Progress";

    setCreativeWorks(updatedWorks);
    setProject((prev: any) => ({
      ...prev,
      budget: totalBudget,
      status: nextProjStatus,
    }));

    await syncWorksToSupabase(updatedWorks, totalBudget, nextProjStatus);
  };

  // DELETE MASTER PROJECT
  const handleDeleteProject = async () => {
    if (!project) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (error) throw error;
      router.push("/dashboard/freelancer/projects");
    } catch (err: any) {
      alert(`Failed to delete project: ${err.message}`);
      setIsDeleting(false);
    }
  };

  // SAVE MASTER PROJECT EDITS
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedBudget = parseFloat(editForm.budget) || 0;
      const updatePayload: any = {
        name: editForm.name.trim(),
        client: editForm.client.trim(),
        industry: editForm.industry || "General",
        category: editForm.category,
        budget: updatedBudget,
        description: editForm.description?.trim() || "",
        status: editForm.status,
        priority: editForm.priority,
        start_date: editForm.start_date || null,
        due_date: editForm.due_date || null,
      };

      let { error } = await supabase
        .from("projects")
        .update(updatePayload)
        .eq("id", project.id);

      if (
        error &&
        (error.message?.includes("industry") ||
          error.details?.includes("industry"))
      ) {
        delete updatePayload.industry;
        const res2 = await supabase
          .from("projects")
          .update(updatePayload)
          .eq("id", project.id);
        error = res2.error;
      }

      if (error) throw error;

      setProject((prev: any) => ({
        ...prev,
        ...editForm,
        budget: updatedBudget,
      }));
      setShowEditModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update project.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[450px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-7 h-7 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Client Workspace...</span>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4 font-sans">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
        <Link
          href="/dashboard/freelancer/projects"
          className="inline-flex items-center gap-2 bg-[#0047AB] text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  const isCompleted = project.status?.toLowerCase() === "completed";
  const isStopped =
    project.status?.toLowerCase() === "stopped" ||
    project.status?.toLowerCase().includes("hold");
  const completedWorksCount = creativeWorks.filter(
    (w) => w.status === "Completed",
  ).length;

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16">
      {/* CLEAN BREADCRUMB */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-sans">
        <Link href="/dashboard" className="hover:text-slate-800">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href="/dashboard/freelancer/projects"
          className="hover:text-slate-800"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#0047AB] font-bold truncate max-w-xs">
          {project.client} Folder
        </span>
      </div>

      {/* TOP HEADER BAR */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans">
        <div className="flex items-start sm:items-center gap-4">
          <Link
            href="/dashboard/freelancer/projects"
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition mt-1 sm:mt-0"
            title="Back to Projects"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="bg-blue-50 text-[#0047AB] border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                <FolderOpen className="w-3 h-3" />
                <span>Client Creative Workspace</span>
              </span>
              <span className="text-xs font-bold text-slate-700">
                {project.client}
              </span>
              {project.industry && (
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                  {project.industry}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {project.name}
            </h1>
          </div>
        </div>

        {/* STATUS SELECTOR & ACTIONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Status Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-slate-500">
              Folder Status:
            </span>
            <select
              value={project.status || "In Progress"}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdatingStatus}
              className={`text-xs font-bold bg-transparent outline-none cursor-pointer ${
                isCompleted
                  ? "text-emerald-600"
                  : isStopped
                    ? "text-rose-600"
                    : "text-[#0047AB]"
              }`}
            >
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Stopped / On Hold">Stopped / On Hold</option>
              <option value="Completed">Completed</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Add Creative Work Button */}
          <button
            onClick={() => setShowAddWorkModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Creative Work</span>
          </button>

          {/* Edit Master Details Button */}
          <button
            onClick={() => {
              setEditForm({ ...project });
              setShowEditModal(true);
            }}
            title="Edit Master Project Details"
            className="p-2.5 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 border border-slate-200 rounded-xl transition"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete Project Button */}
          <button
            onClick={handleDeleteProject}
            disabled={isDeleting}
            title="Delete Project"
            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-600" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* COMPLETED BANNER NOTIFICATION */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">
              This project is marked as Completed! All creative deliverables are
              archived.
            </span>
          </div>
          <Link
            href="/dashboard/freelancer/invoices"
            className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Generate Final Invoice</span>
          </Link>
        </div>
      )}

      {/* STOPPED NOTIFICATION */}
      {isStopped && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex items-center gap-3 font-sans">
          <PauseCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span className="text-xs font-bold">
            Project is currently Stopped / On Hold. You can resume anytime by
            changing status back to In Progress.
          </span>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Total Combined Fee
          </span>
          <div className="text-2xl font-black text-[#0047AB]">
            ₹{Number(project.budget || 0).toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            Auto-summed from {creativeWorks.length} creative works
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Deliverables Completed
          </span>
          <div className="text-2xl font-black text-slate-900">
            {completedWorksCount} / {creativeWorks.length} Done
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {completedWorksCount === creativeWorks.length &&
            creativeWorks.length > 0
              ? "✓ 100% Completed"
              : "Posters, Flyers, Menus, Reels"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Client Details
          </span>
          <div className="text-base font-bold text-slate-900 truncate">
            {project.client}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {project.industry || "General Industry"}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
            Category & Timeline
          </span>
          <div className="text-sm font-bold text-[#0047AB] truncate">
            {project.category || "Graphic Design"}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold">
            {project.due_date
              ? `Due: ${project.due_date}`
              : "Flexible Timeline"}
          </p>
        </div>
      </div>

      {/* ================= CREATIVE WORKS MANAGER TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0047AB]" />
              <span>
                {project.client}'s Creative Deliverables ({creativeWorks.length}
                )
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click on the status pill to mark Completed or In Progress.
            </p>
          </div>

          <button
            onClick={() => setShowAddWorkModal(true)}
            className="text-xs font-bold text-[#0047AB] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Deliverable (Poster, Flyer, Reel...)</span>
          </button>
        </div>

        {creativeWorks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-6">Status (Click to Toggle)</th>
                  <th className="py-3 px-6">Creative Item / Deliverable</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">Work Date</th>
                  <th className="py-3 px-6">Amount (₹ INR)</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {creativeWorks.map((work) => {
                  const isDone = work.status === "Completed";
                  return (
                    <tr
                      key={work.id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      {/* Checkbox toggle status */}
                      <td className="py-3.5 px-6">
                        <button
                          type="button"
                          onClick={() => handleToggleWorkStatus(work.id)}
                          className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition select-none ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-blue-50 text-[#0047AB] hover:bg-blue-100"
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition ${
                              isDone
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-slate-400 bg-white"
                            }`}
                          >
                            {isDone && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span>{isDone ? "Completed" : "In Progress"}</span>
                        </button>
                      </td>

                      {/* Work Name */}
                      <td className="py-3.5 px-6 font-bold text-slate-900">
                        <span
                          className={
                            isDone ? "line-through text-slate-400" : ""
                          }
                        >
                          {work.name}
                        </span>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                          {work.type}
                        </span>
                      </td>

                      {/* Work Date */}
                      <td className="py-3.5 px-6 font-semibold text-slate-600">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-[#0047AB]" />
                          <span>{work.date || "Not set"}</span>
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-6 font-black text-[#0047AB] text-sm">
                        ₹{Number(work.amount || 0).toLocaleString("en-IN")}
                      </td>

                      {/* Actions: Edit & Remove */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingWork({ ...work })}
                            title="Edit this creative work & date"
                            className="p-1.5 text-slate-400 hover:text-[#0047AB] hover:bg-blue-50 rounded-lg transition"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              handleRemoveCreativeWork(work.id, work.name)
                            }
                            title="Remove this creative work"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3 font-sans">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">
              No Creative Works Added Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Start adding your flyers, posters, menu cards, or reels for{" "}
              {project.client}.
            </p>
            <button
              onClick={() => setShowAddWorkModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#0047AB] text-white font-bold text-xs px-4 py-2 rounded-xl shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add First Work (Flyer / Poster / Menu)</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= PROJECT MASTER CONTRACT DETAILS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0047AB]" />
              <span>Project Contract & Master Details</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review all client specifications, agreed scope, and deliverables.
            </p>
          </div>

          <button
            onClick={() => {
              setEditForm({ ...project });
              setShowEditModal(true);
            }}
            className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Modify</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500 w-1/4">
                  Project / Workspace Name
                </td>
                <td className="py-3.5 px-6 font-bold text-slate-900">
                  {project.name}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Client Organization
                </td>
                <td className="py-3.5 px-6 font-bold text-slate-900 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.client}</span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Client Industry
                </td>
                <td className="py-3.5 px-6 font-semibold text-slate-800">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {project.industry || "General Industry"}
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Primary Category
                </td>
                <td className="py-3.5 px-6 font-bold text-[#0047AB]">
                  {project.category}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Total Budget Amount
                </td>
                <td className="py-3.5 px-6 font-black text-slate-900 text-sm">
                  ₹{Number(project.budget || 0).toLocaleString("en-IN")} INR
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Project Due Date
                </td>
                <td className="py-3.5 px-6 font-semibold text-slate-800">
                  {project.due_date || "Not set"}
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 transition">
                <td className="py-3.5 px-6 font-bold text-slate-500">
                  Current Phase
                </td>
                <td className="py-3.5 px-6 font-bold">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : isStopped
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-blue-50 text-[#0047AB] border border-blue-200"
                    }`}
                  >
                    {project.status || "In Progress"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: ADD CREATIVE WORK ================= */}
      {showAddWorkModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full space-y-4 my-8 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0047AB]" />
                <span>Add Creative Work to {project.client}</span>
              </h3>
              <button
                onClick={() => setShowAddWorkModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddCreativeWork}
              className="space-y-3.5 font-sans"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Creative Work Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinner Menu A4, Weekend Poster, Promo Reel"
                  value={newWork.name}
                  onChange={(e) =>
                    setNewWork({ ...newWork, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Deliverable Type
                  </label>
                  <select
                    value={newWork.type}
                    onChange={(e) => {
                      const selectedType = e.target.value;
                      setNewWork((prev) => ({
                        ...prev,
                        type: selectedType,
                        name: prev.name
                          ? prev.name
                          : `${project.client} - ${selectedType}`,
                      }));
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    {CREATIVE_TYPES.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Amount (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      placeholder="1500"
                      value={newWork.amount}
                      onChange={(e) =>
                        setNewWork({ ...newWork, amount: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>
              </div>

              {/* WORK DATE & STATUS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Work Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newWork.date}
                    onChange={(e) =>
                      setNewWork({ ...newWork, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newWork.status}
                    onChange={(e: any) =>
                      setNewWork({ ...newWork, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAddingWork}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 mt-3"
              >
                {isAddingWork ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding Creative Work...</span>
                  </>
                ) : (
                  <span>Add Creative Work & Update Fee</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: MODIFY / EDIT CREATIVE WORK ================= */}
      {editingWork && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full space-y-4 my-8 font-sans">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Pencil className="w-5 h-5 text-[#0047AB]" />
                <span>Modify Creative Work</span>
              </h3>
              <button
                onClick={() => setEditingWork(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveEditedWork}
              className="space-y-3.5 font-sans"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Creative Work Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingWork.name}
                  onChange={(e) =>
                    setEditingWork({ ...editingWork, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Deliverable Type
                  </label>
                  <select
                    value={editingWork.type}
                    onChange={(e) =>
                      setEditingWork({ ...editingWork, type: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    {CREATIVE_TYPES.map((t, idx) => (
                      <option key={idx} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Amount (₹ INR) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={editingWork.amount}
                      onChange={(e) =>
                        setEditingWork({
                          ...editingWork,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                    />
                  </div>
                </div>
              </div>

              {/* EDIT WORK DATE & STATUS */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Work Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editingWork.date || ""}
                    onChange={(e) =>
                      setEditingWork({ ...editingWork, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Status
                  </label>
                  <select
                    value={editingWork.status}
                    onChange={(e: any) =>
                      setEditingWork({ ...editingWork, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition mt-3"
              >
                <span>Save Changes & Update Fee</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: EDIT MASTER PROJECT ================= */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 my-8 font-sans">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 font-sans">
                <Pencil className="w-5 h-5 text-[#0047AB]" />
                <span>Modify Master Project</span>
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
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

            <form onSubmit={handleSaveEdit} className="space-y-3.5 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
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
                    value={editForm.client}
                    onChange={(e) =>
                      setEditForm({ ...editForm, client: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              {/* INDUSTRY & CATEGORY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-[#0047AB]" />
                    <span>Industry Type</span>
                  </label>
                  <select
                    value={editForm.industry || "Restaurant & Food"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, industry: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  >
                    {INDUSTRY_LIST.map((ind, i) => (
                      <option key={i} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Category / Service
                  </label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Video Editing & Reels">
                      Video Editing & Reels
                    </option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Landing Page Design">
                      Landing Page Design
                    </option>
                    <option value="SEO & Marketing">SEO & Marketing</option>
                    <option value="Mobile App">Mobile App</option>
                  </select>
                </div>
              </div>

              {/* DATES & BUDGET */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Project Due Date
                  </label>
                  <input
                    type="date"
                    value={editForm.due_date || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, due_date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Total Budget Amount (₹ INR) *
                  </label>
                  <div className="relative font-sans">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-xs font-sans">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      value={editForm.budget}
                      onChange={(e) =>
                        setEditForm({ ...editForm, budget: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Scope of Work & Notes
                </label>
                <textarea
                  rows={3}
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Status
                  </label>
                  <select
                    value={editForm.status || "In Progress"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Stopped / On Hold">Stopped / On Hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Priority
                  </label>
                  <select
                    value={editForm.priority || "High"}
                    onChange={(e) =>
                      setEditForm({ ...editForm, priority: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 mt-2 font-sans"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes (₹ INR)</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
