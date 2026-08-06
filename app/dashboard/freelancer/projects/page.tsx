"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  X,
  Building,
} from "lucide-react";

export default function ProjectsPage() {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Acme Corp iOS App Redesign",
      client: "Acme Global",
      status: "In Progress",
      budget: "$6,500",
      deadline: "Aug 25, 2026",
      tasks: [
        { id: 101, title: "Wireframe Mobile Dashboard", status: "Completed" },
        {
          id: 102,
          title: "Figma Component Design System",
          status: "In Progress",
        },
        { id: 103, title: "Client Feedback Sync", status: "To Do" },
      ],
    },
    {
      id: 2,
      name: "Stripe Payment Gateway Integration",
      client: "FinTech Labs",
      status: "In Progress",
      budget: "$3,200",
      deadline: "Aug 18, 2026",
      tasks: [
        { id: 201, title: "Webhook Endpoint Security", status: "In Progress" },
        { id: 202, title: "Test Checkout Sandbox", status: "To Do" },
      ],
    },
    {
      id: 3,
      name: "Brand Design System & Style Guide",
      client: "Solopreneur Studio",
      status: "Completed",
      budget: "$2,800",
      deadline: "Jul 30, 2026",
      tasks: [
        {
          id: 301,
          title: "Typography & Palette Selection",
          status: "Completed",
        },
        { id: 302, title: "Export Assets & Logo Package", status: "Completed" },
      ],
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    client: "",
    budget: "",
    deadline: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name && newProject.client) {
      setProjects([
        ...projects,
        {
          id: Date.now(),
          name: newProject.name,
          client: newProject.client,
          status: "In Progress",
          budget: newProject.budget ? `$${newProject.budget}` : "$2,500",
          deadline: newProject.deadline || "Sep 15, 2026",
          tasks: [
            {
              id: Date.now() + 1,
              title: "Project Onboarding & Brief",
              status: "To Do",
            },
            {
              id: Date.now() + 2,
              title: "Initial Concept Draft",
              status: "To Do",
            },
          ],
        },
      ]);
      setNewProject({ name: "", client: "", budget: "", deadline: "" });
      setShowNewProjectModal(false);
    }
  };

  const handleAiAutoGenerateTasks = (projectId: number) => {
    setIsAiGenerating(true);
    setTimeout(() => {
      setProjects(
        projects.map((p) => {
          if (p.id === projectId) {
            return {
              ...p,
              tasks: [
                ...p.tasks,
                {
                  id: Date.now(),
                  title: "✨ AI Suggested: QA & Bug Audit",
                  status: "To Do",
                },
                {
                  id: Date.now() + 1,
                  title: "✨ AI Suggested: Final Client Sign-off Document",
                  status: "To Do",
                },
              ],
            };
          }
          return p;
        }),
      );
      setIsAiGenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Projects & Workflows
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Manage your active client projects, milestones, and AI task
            breakdown.
          </p>
        </div>

        <button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Active Projects
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {projects.filter((p) => p.status === "In Progress").length}
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">
            ✓ On schedule
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Active Pipeline Value
          </span>
          <div className="text-3xl font-black text-[#0047AB] mt-1">$9,700</div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            Across 2 clients
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Completed Projects
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {projects.filter((p) => p.status === "Completed").length}
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            100% Client Satisfaction
          </span>
        </div>
      </div>

      {/* Projects List with AI Task Breakdown */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="font-bold text-lg text-slate-900">
                    {project.name}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      project.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-blue-50 text-[#0047AB] border border-blue-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{project.client}</span>
                  </span>
                  <span>•</span>
                  <span>
                    Budget:{" "}
                    <strong className="text-slate-900">{project.budget}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Deadline:{" "}
                    <strong className="text-slate-900">
                      {project.deadline}
                    </strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleAiAutoGenerateTasks(project.id)}
                disabled={isAiGenerating}
                className="bg-[#0047AB]/10 hover:bg-[#0047AB] text-[#0047AB] hover:text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isAiGenerating ? "Generating..." : "✨ AI Auto-Add Tasks"}
                </span>
              </button>
            </div>

            {/* Sub-tasks list */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Tasks & Milestones ({project.tasks.length})
              </h4>
              <div className="space-y-2">
                {project.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          task.status === "Completed"
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                      />
                      <span
                        className={
                          task.status === "Completed"
                            ? "line-through text-slate-400"
                            : "text-slate-800"
                        }
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#0047AB]" />
                <span>Create New Project</span>
              </h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. E-Commerce Web App"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Global"
                  value={newProject.client}
                  onChange={(e) =>
                    setNewProject({ ...newProject, client: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="3500"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Deadline Date
                  </label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) =>
                      setNewProject({ ...newProject, deadline: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#0047AB]/25"
              >
                Launch Project
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
