"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Calendar,
  Clock,
  DollarSign,
  Paperclip,
  CheckCircle2,
  Edit3,
  Tag,
  Plus,
  X,
} from "lucide-react";

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [progress, setProgress] = useState(92);

  const project: {
    id: string;
    name: string;
    client: string;
    description: string;
    status: string;
    priority: string;
    budget: string;
    startDate: string;
    dueDate: string;
    tags: string[];
    attachments: Array<{name: string; size: string}>;
  } = {
    id: params.id || "",
    name: "",
    client: "",
    description: "",
    status: "Draft",
    priority: "Medium",
    budget: "$0.00",
    startDate: "",
    dueDate: "",
    tags: [],
    attachments: [],
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/freelancer/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <button
          onClick={() => setShowEditDrawer(true)}
          className="bg-white border border-slate-300 hover:border-[#0047AB] text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#0047AB]" />
          <span>Edit Project</span>
        </button>
      </div>

      {/* Main Project Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold bg-blue-50 text-[#0047AB] border border-blue-200 px-3 py-1 rounded-full">
                {project.status}
              </span>
              <span className="text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1 rounded-full">
                {project.priority} Priority
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {project.name}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Client:{" "}
                <strong className="text-slate-800">{project.client}</strong>
              </span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              Total Budget
            </span>
            <span className="text-2xl font-black text-[#0047AB]">
              {project.budget}
            </span>
          </div>
        </div>

        {/* Progress Slider Display */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700">
            <span>Overall Completion</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="bg-[#0047AB] h-full rounded-full transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-2">
            Scope & Description
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {project.description}
          </p>
        </div>

        {/* Dates & Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <Calendar className="w-4 h-4 text-[#0047AB]" />
            <span>
              Timeline: {project.startDate} ➔ {project.dueDate}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <Tag className="w-4 h-4 text-[#0047AB] shrink-0" />
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-bold text-[#0047AB] bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-[#0047AB]" />
            <span>Project Attachments ({project.attachments.length})</span>
          </h3>
          <button className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {project.attachments.map((file) => (
            <div
              key={file.name}
              className="py-3 flex justify-between items-center text-xs font-semibold"
            >
              <span className="text-slate-800 font-bold">{file.name}</span>
              <span className="text-slate-400">{file.size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Drawer Modal */}
      {showEditDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Edit Project Progress
              </h3>
              <button
                onClick={() => setShowEditDrawer(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">
                Update Completion %
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-[#0047AB]"
              />
              <span className="text-xs font-bold text-[#0047AB] block mt-1 text-center">
                {progress}% Complete
              </span>
            </div>

            <button
              onClick={() => setShowEditDrawer(false)}
              className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
