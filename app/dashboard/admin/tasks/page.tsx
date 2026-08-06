"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  X,
} from "lucide-react";

export default function AdminTasksPage() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Review Q3 Marketing Campaign Budget",
      assignee: "Priya Sharma",
      dept: "Growth",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Implement Next.js App Router Authentication",
      assignee: "Alex Mercer",
      dept: "Engineering",
      status: "Completed",
      priority: "Urgent",
    },
    {
      id: 3,
      title: "Design Component System Tokens in Figma",
      assignee: "Sarah Jenkins",
      dept: "Design",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: 4,
      title: "Audit Database RLS Security Policies",
      assignee: "David Kim",
      dept: "Engineering",
      status: "To Do",
      priority: "High",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "Alex Mercer",
    dept: "Engineering",
    priority: "High",
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask.title,
          assignee: newTask.assignee,
          dept: newTask.dept,
          status: "In Progress",
          priority: newTask.priority,
        },
      ]);
      setShowModal(false);
      setNewTask({
        title: "",
        assignee: "Alex Mercer",
        dept: "Engineering",
        priority: "High",
      });
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Task Allocation
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Assign deliverables, priorities, and deadlines across departments.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Org Task</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative font-sans">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search task title or assignee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
        />
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <FolderKanban className="w-4 h-4 text-[#0047AB]" />
            <span>Assigned Tasks ({filteredTasks.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100 font-sans">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 text-xs font-semibold font-sans"
            >
              <div>
                <div className="font-bold text-sm text-slate-900 font-sans">
                  {task.title}
                </div>
                <div className="text-slate-400 mt-0.5 font-sans">
                  Assignee:{" "}
                  <strong className="text-slate-800 font-sans">
                    {task.assignee}
                  </strong>{" "}
                  ({task.dept})
                </div>
              </div>

              <div className="flex items-center gap-3 font-sans">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold font-sans ${
                    task.priority === "Urgent"
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : task.priority === "High"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {task.priority}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${
                    task.status === "Completed"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-blue-50 text-[#0047AB] border border-blue-200"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Assign New Org Task
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit SOC2 Compliance"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Assignee Name
                </label>
                <select
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 font-sans"
                >
                  <option>Alex Mercer</option>
                  <option>Sarah Jenkins</option>
                  <option>Priya Sharma</option>
                  <option>David Kim</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 font-sans"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md font-sans"
              >
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
