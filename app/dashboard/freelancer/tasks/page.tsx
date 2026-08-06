"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  List as ListIcon,
  Search,
  MessageSquare,
  Paperclip,
  X,
  Sparkles,
  Tag,
  Send,
} from "lucide-react";

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list" | "calendar">(
    "kanban",
  );
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTaskComments, setSelectedTaskComments] = useState<any | null>(
    null,
  );
  const [newCommentText, setNewCommentText] = useState("");

  const [tasks, setTasks] = useState([
    {
      id: "t-1",
      title: "Wireframe Mobile Dashboard for Acme Corp",
      description: "Complete Figma wireframe component hierarchy for iOS app.",
      project: "Acme iOS App",
      priority: "High",
      dueDate: "2026-08-12",
      status: "In Progress",
      labels: ["UI/UX", "Mobile"],
      attachmentsCount: 2,
      comments: ["Alex: Looks great! Add dark mode toggle.", "Sarah: Done!"],
    },
    {
      id: "t-2",
      title: "Finalize Figma Component Design System",
      description: "Export color tokens and button variant library.",
      project: "Acme iOS App",
      priority: "Urgent",
      dueDate: "2026-08-15",
      status: "To Do",
      labels: ["Figma"],
      attachmentsCount: 1,
      comments: [],
    },
    {
      id: "t-3",
      title: "Test Stripe Payment Gateway Sandbox",
      description: "Verify webhook 200 OK callbacks for checkout.",
      project: "Stripe API Integration",
      priority: "Medium",
      dueDate: "2026-08-05",
      status: "Completed",
      labels: ["API", "Backend"],
      attachmentsCount: 3,
      comments: ["Sarah: All sandbox payment callbacks verified."],
    },
    {
      id: "t-4",
      title: "Export Assets for Solopreneur Brand Package",
      description: "PNG, SVG, and vector PDF logo exports.",
      project: "Brand Identity",
      priority: "Low",
      dueDate: "2026-07-30",
      status: "Completed",
      labels: ["Branding"],
      attachmentsCount: 4,
      comments: ["David: Received and approved!"],
    },
    {
      id: "t-5",
      title: "Draft Q3 Marketing Proposal for FinTech Labs",
      description: "AI-assisted pitch proposal for Q3 campaign.",
      project: "Growth Marketing",
      priority: "High",
      dueDate: "2026-08-18",
      status: "To Do",
      labels: ["AI Draft", "Proposal"],
      attachmentsCount: 1,
      comments: [],
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    project: "",
    priority: "Medium",
    dueDate: "Tomorrow",
    labels: "UI/UX",
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title) {
      setTasks([
        {
          id: `t-${Date.now()}`,
          title: newTask.title,
          description: newTask.description || "Deliverable description.",
          project: newTask.project || "General Project",
          priority: newTask.priority,
          dueDate: newTask.dueDate || "Tomorrow",
          status: "To Do",
          labels: newTask.labels.split(",").map((l) => l.trim()),
          attachmentsCount: 0,
          comments: [],
        },
        ...tasks,
      ]);
      setNewTask({
        title: "",
        description: "",
        project: "",
        priority: "Medium",
        dueDate: "Tomorrow",
        labels: "UI/UX",
      });
      setShowModal(false);
    }
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "Completed" ? "In Progress" : "Completed",
            }
          : t,
      ),
    );
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentText.trim() && selectedTaskComments) {
      const updatedComments = [
        ...selectedTaskComments.comments,
        `You: ${newCommentText}`,
      ];
      setTasks(
        tasks.map((t) =>
          t.id === selectedTaskComments.id
            ? { ...t, comments: updatedComments }
            : t,
        ),
      );
      setSelectedTaskComments({
        ...selectedTaskComments,
        comments: updatedComments,
      });
      setNewCommentText("");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesFilter =
      filter === "all" || t.status.toLowerCase().replace(" ", "") === filter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Task </span>
            <span className="font-heading italic text-[#0047AB]">Studio.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Organize, prioritize, and manage deliverables across List, Kanban,
            and Calendar views.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "list"
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ListIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "kanban"
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === "calendar"
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks or projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {["all", "todo", "inprogress", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                filter === tab
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "todo"
                ? "To Do"
                : tab === "inprogress"
                  ? "In Progress"
                  : tab}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {["To Do", "In Progress", "Completed"].map((colStatus) => {
            const colTasks = filteredTasks.filter(
              (t) => t.status === colStatus,
            );

            return (
              <div
                key={colStatus}
                className="bg-slate-100/70 rounded-2xl p-4 space-y-3 border border-slate-200/80"
              >
                <div className="flex justify-between items-center px-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    {colStatus}
                  </h3>
                  <span className="text-xs font-extrabold bg-white text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3 hover:border-[#0047AB]/40 transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-slate-400">
                          {task.project}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            task.priority === "Urgent"
                              ? "bg-rose-50 text-rose-600 border border-rose-200"
                              : task.priority === "High"
                                ? "bg-amber-50 text-amber-600 border border-amber-200"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            task.status === "Completed"
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {task.status === "Completed" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                        </button>

                        <h4
                          className={`font-bold text-sm leading-snug ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-900"}`}
                        >
                          {task.title}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-500 font-medium line-clamp-2">
                        {task.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                        <span>Due {task.dueDate}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            <span>{task.attachmentsCount}</span>
                          </span>
                          <button
                            onClick={() => setSelectedTaskComments(task)}
                            className="flex items-center gap-1 hover:text-[#0047AB]"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{task.comments.length}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="divide-y divide-slate-100">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs font-semibold"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      task.status === "Completed"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white hover:border-[#0047AB]"
                    }`}
                  >
                    {task.status === "Completed" && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <div>
                    <h3
                      className={`font-bold text-sm ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-900"}`}
                    >
                      {task.title}
                    </h3>
                    <div className="text-slate-400 mt-0.5">
                      Project:{" "}
                      <strong className="text-slate-700">{task.project}</strong>{" "}
                      • Due {task.dueDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <button
                    onClick={() => setSelectedTaskComments(task)}
                    className="text-slate-400 hover:text-[#0047AB] flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{task.comments.length} Comments</span>
                  </button>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
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
      )}

      {/* CALENDAR VIEW */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-center font-sans">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 text-left">
                Task Deadlines Calendar
              </h3>
              <p className="text-xs text-slate-500 font-semibold text-left mt-0.5">
                August 2026 Deadlines Synced
              </p>
            </div>
            <span className="text-xs font-bold text-[#0047AB] bg-[#0047AB]/10 px-3 py-1 rounded-full">
              ● Live Sync
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 text-xs font-bold text-slate-600">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs font-semibold h-64">
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className="p-2 bg-slate-50/50 rounded-xl border border-slate-100/80 flex flex-col justify-between text-left"
              >
                <span className="text-[10px] font-bold text-slate-400">
                  {i + 1}
                </span>
                {i === 11 && (
                  <span className="text-[9px] font-bold bg-[#0047AB] text-white p-1 rounded line-clamp-1">
                    Acme Wireframe
                  </span>
                )}
                {i === 14 && (
                  <span className="text-[9px] font-bold bg-amber-500 text-white p-1 rounded line-clamp-1">
                    Figma Tokens
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMENTS DRAWER */}
      {selectedTaskComments && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                Comments: {selectedTaskComments.title}
              </h3>
              <button
                onClick={() => setSelectedTaskComments(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-700 max-h-60 overflow-y-auto">
              {selectedTaskComments.comments.length > 0 ? (
                selectedTaskComments.comments.map((c: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    {c}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-6">
                  No comments yet. Start the thread below!
                </p>
              )}
            </div>

            <form
              onSubmit={handleAddComment}
              className="flex gap-2 pt-2 border-t border-slate-100"
            >
              <input
                type="text"
                required
                placeholder="Write a comment..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
              <button
                type="submit"
                className="bg-[#0047AB] hover:bg-[#003680] text-white p-2.5 rounded-xl transition-all shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#0047AB]" />
                <span>Create New Task</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design Landing Page Hero"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Task details and scope..."
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Project
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme iOS App"
                  value={newTask.project}
                  onChange={(e) =>
                    setNewTask({ ...newTask, project: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomorrow"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-md shadow-[#0047AB]/25"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
