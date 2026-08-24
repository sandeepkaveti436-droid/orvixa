"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  IndianRupee,
  Paperclip,
  CheckCircle2,
  Tag,
  Loader2,
  AlertCircle,
  FileText,
  Upload,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (err: any) {
      console.error("Error fetching project:", err);
      setError(err.message || "Project not found.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Project Details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500">{error}</p>
        <Link
          href="/dashboard/freelancer/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0047AB] bg-blue-50 px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto pb-12">
      {/* TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/freelancer/projects"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0047AB] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* MAIN PROJECT OVERVIEW CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0047AB] border border-blue-200">
                {project.status || "In Progress"}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                {project.priority || "High"} Priority
              </span>
              {project.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {project.category}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {project.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-1.5">
              <Building className="w-4 h-4 text-slate-400" />
              <span>
                Client:{" "}
                <strong className="text-slate-700">{project.client}</strong>
              </span>
            </p>
          </div>

          {/* Budget in Indian Rupees */}
          <div className="text-left sm:text-right bg-slate-50 sm:bg-transparent p-4 sm:p-0 rounded-2xl">
            <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
              Total Budget
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#0047AB]">
              ₹{Number(project.budget || 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-slate-700">Overall Completion</span>
            <span className="text-[#0047AB]">{project.progress || 10}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0047AB] rounded-full transition-all duration-500"
              style={{ width: `${project.progress || 10}%` }}
            />
          </div>
        </div>

        {/* Scope & Description */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Scope & Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
            {project.description || "No project description provided."}
          </p>
        </div>

        {/* Metadata Grid (Timeline, Request Date) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#0047AB]" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Timeline
              </span>
              <span className="text-xs font-bold text-slate-800">
                {project.start_date || "Not set"} ➔{" "}
                {project.due_date || "Upcoming deadline"}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">
                Created / Requested On
              </span>
              <span className="text-xs font-bold text-slate-800">
                {project.created_at
                  ? new Date(project.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PROJECT ATTACHMENTS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Paperclip className="w-5 h-5 text-[#0047AB]" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Project Attachments (0)
            </h3>
            <p className="text-xs text-slate-500">
              Attach contracts, design files, or assets.
            </p>
          </div>
        </div>

        <button className="flex items-center gap-2 text-xs font-bold text-[#0047AB] hover:bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl transition">
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>
      </div>
    </div>
  );
}
