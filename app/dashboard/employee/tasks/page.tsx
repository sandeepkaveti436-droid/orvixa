"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Filter,
  MessageSquare,
  Paperclip,
} from "lucide-react";

export default function EmployeeTasksPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Implement UI Animation for FAQ Accordion",
      project: "Next.js Web App",
      assignedBy: "Alex Mercer",
      dueDate: "Today",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Review Pull Request #42 for Next.js App",
      project: "Engineering Sprint",
      assignedBy: "AI Copilot Triage",
      dueDate: "Today",
      priority: "Urgent",
      completed: false,
    },
    {
      id: 3,
      title: "Update Figma Design System Color Tokens",
      project: "Design System",
      assignedBy: "Sarah Jenkins",
      dueDate: "Tomorrow",
      priority: "Medium",
      completed: false,
    },
    {
      id: 4,
      title: "Audit Database RLS Security Policies",
      project: "Security Audit",
      assignedBy: "Alex Mercer",
      dueDate: "Aug 10",
      priority: "High",
      completed: true,
    },
  ]);

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !t.completed) ||
      (filter === "completed" && t.completed);
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          My Assigned Tasks
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Track and complete all deliverables assigned to you by your department
          manager.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search my tasks or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold font-sans">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all font-sans ${
                filter === tab
                  ? "bg-white text-[#0047AB] shadow-sm"
                  : "text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <CheckCircle2 className="w-4 h-4 text-[#0047AB]" />
            <span>Assigned Deliverables ({filteredTasks.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer font-sans"
            >
              <div className="flex items-start gap-3 font-sans">
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    task.completed
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <h3
                    className={`font-bold text-sm font-sans ${task.completed ? "line-through text-slate-400" : "text-slate-900"}`}
                  >
                    {task.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-1 font-sans">
                    <span>
                      Project:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.project}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Assigned by:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.assignedBy}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>
                      Due:{" "}
                      <strong className="text-slate-700 font-sans">
                        {task.dueDate}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${
                  task.priority === "Urgent"
                    ? "bg-rose-50 text-rose-600 border border-rose-200"
                    : task.priority === "High"
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-blue-50 text-[#0047AB] border border-blue-200"
                }`}
              >
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
