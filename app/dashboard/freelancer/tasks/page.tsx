"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Clock,
  MessageSquare,
  MoreHorizontal,
  Flag,
  Loader2,
  X,
  Trash2,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface Task {
  id: string;
  title: string;
  status: "To do" | "In progress" | "In review" | "Done" | string;
  category: "Frontend" | "Backend" | "Design" | "QA" | "Marketing" | string;
  priority: "High" | "Medium" | "Low" | string;
  progress?: number;
  due_date?: string | null;
  comments_count: number;
  assignees: string[];
}

const COLUMNS = [
  { key: "To do", label: "To do", dot: "bg-slate-400" },
  { key: "In progress", label: "In progress", dot: "bg-amber-500" },
  { key: "In review", label: "In review", dot: "bg-indigo-600" },
  { key: "Done", label: "Done", dot: "bg-emerald-600" },
];

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Frontend: {
    bg: "bg-[#2563eb]",
    text: "text-[#ffffff]",
    border: "border-[#a7f3d0]",
  },
  Backend: {
    bg: "bg-[#eff6ff]",
    text: "text-[#2563eb]",
    border: "border-[#bfdbfe]",
  },
  Design: {
    bg: "bg-[#fdf2f8]",
    text: "text-[#db2777]",
    border: "border-[#fbcfe8]",
  },
  QA: {
    bg: "bg-[#f5f3ff]",
    text: "text-[#7c3aed]",
    border: "border-[#ddd6fe]",
  },
  Marketing: {
    bg: "bg-[#fffbeb]",
    text: "text-[#d97706]",
    border: "border-[#fde68a]",
  },
};

const AVATAR_COLORS: Record<string, string> = {
  HK: "bg-[#dbeafe] text-[#1e40af]",
  PR: "bg-[#fed7aa] text-[#9a3412]",
  MK: "bg-[#cffafe] text-[#0e7490]",
  SS: "bg-[#ede9fe] text-[#6d28d9]",
  MS: "bg-[#d1fae5] text-[#047857]",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "All" | "My tasks" | "High priority" | "Due this week"
  >("All");

  // Drag & drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Card menu dropdown state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "Frontend",
    priority: "Medium",
    status: "To do",
    due_date: "",
    assignees: "HK",
    progress: 50,
  });

  // 1. Fetch live tasks and subscribe to realtime Postgres changes
  useEffect(() => {
    fetchLiveTasks();

    const channel = supabase
      .channel("realtime-tasks-board")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const normalized = normalizeTask(payload.new);
            setTasks((prev) => {
              if (prev.some((t) => t.id === normalized.id)) return prev;
              return [normalized, ...prev];
            });
          } else if (payload.eventType === "UPDATE") {
            const updated = normalizeTask(payload.new);
            setTasks((prev) =>
              prev.map((t) => (t.id === updated.id ? updated : t)),
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Normalizer to guarantee uniform format
  const normalizeTask = (db: any): Task => {
    const rawStatus = (db.status || "To do").trim();
    let status = "To do";
    if (/done|completed/i.test(rawStatus)) status = "Done";
    else if (/review/i.test(rawStatus)) status = "In review";
    else if (/progress/i.test(rawStatus)) status = "In progress";

    let assignees: string[] = ["HK"];
    if (Array.isArray(db.assignees) && db.assignees.length > 0) {
      assignees = db.assignees;
    } else if (typeof db.assignee === "string" && db.assignee.trim()) {
      assignees = db.assignee.split(",").map((s: string) => s.trim());
    }

    return {
      id: String(db.id),
      title: db.title || db.name || "Untitled Task",
      status,
      category: db.category || "Frontend",
      priority: db.priority || "Medium",
      progress:
        typeof db.progress === "number"
          ? db.progress
          : status === "Done"
            ? 100
            : 0,
      due_date: db.due_date || null,
      comments_count: db.comments_count ?? 2,
      assignees,
    };
  };

  const fetchLiveTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.warn("Could not query tasks table:", error.message);
      }

      if (data && data.length > 0) {
        setTasks(data.map(normalizeTask));
      } else {
        // Fallback default tasks matching the screenshot if table is freshly created
        setTasks(initialScreenshotTasks);
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
      setTasks(initialScreenshotTasks);
    } finally {
      setLoading(false);
    }
  };

  // Close menus on outside click
  useEffect(() => {
    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Format date relative display like in the screenshot
  const formatDueText = (due?: string | null) => {
    if (!due) return "In 6 days";
    try {
      const target = new Date(due);
      const today = new Date();
      const diffDays = Math.round(
        (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays > 1 && diffDays <= 14) return `In ${diffDays} days`;
      if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}d ago`;

      return target.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return due;
    }
  };

  // Move status with optimistic update and Supabase sync
  const handleUpdateStatus = async (taskId: string, targetStatus: string) => {
    const computedProgress =
      targetStatus === "Done"
        ? 100
        : targetStatus === "In review"
          ? 80
          : targetStatus === "In progress"
            ? 50
            : 0;

    // 1. Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: targetStatus, progress: computedProgress }
          : t,
      ),
    );
    setOpenMenuId(null);

    // 2. Supabase update
    try {
      await supabase
        .from("tasks")
        .update({ status: targetStatus, progress: computedProgress })
        .eq("id", taskId);
    } catch (err) {
      console.error("Failed to update status in Supabase:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setOpenMenuId(null);
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  // HTML5 Drag and Drop
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, columnKey: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedTaskId;
    if (id) {
      handleUpdateStatus(id, columnKey);
    }
    setDraggedTaskId(null);
  };

  // Filters logic
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "High priority")
        return (t.priority || "").toLowerCase() === "high";
      if (activeFilter === "My tasks") {
        return (t.assignees || []).some((a) => a === "HK" || a === "PR");
      }
      if (activeFilter === "Due this week") {
        if (!t.due_date) return true;
        const target = new Date(t.due_date).getTime();
        const now = new Date().getTime();
        const diff = (target - now) / (1000 * 60 * 60 * 24);
        return diff >= -1 && diff <= 7;
      }
      return true;
    });
  }, [tasks, activeFilter]);

  // Create new task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setIsSaving(true);
    const assigneesList = newTask.assignees
      .split(",")
      .map((a) => a.trim().toUpperCase())
      .filter(Boolean);

    const taskPayload = {
      title: newTask.title.trim(),
      category: newTask.category,
      priority: newTask.priority,
      status: newTask.status,
      due_date: newTask.due_date || new Date().toISOString().split("T")[0],
      progress: newTask.status === "Done" ? 100 : newTask.progress,
      assignees: assigneesList.length > 0 ? assigneesList : ["HK"],
      comments_count: 2,
    };

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([taskPayload])
        .select();

      if (error) throw error;
      if (data && data[0]) {
        setTasks((prev) => [normalizeTask(data[0]), ...prev]);
      } else {
        setTasks((prev) => [
          { ...taskPayload, id: `local-${Date.now()}` } as Task,
          ...prev,
        ]);
      }

      setShowAddModal(false);
      setNewTask({
        title: "",
        category: "Frontend",
        priority: "Medium",
        status: "To do",
        due_date: "",
        assignees: "HK",
        progress: 50,
      });
    } catch (err: any) {
      alert(`Could not create task: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 pb-20 max-w-[1600px] mx-auto px-4 sm:px-6 space-y-6">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tasks
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Drag a card to another stage, or use its menu to move it.
          </p>
        </div>

        {/* Forest Green Pill Button matching screenshot */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#2563eb] hover:bg-[#103d30] text-white font-medium text-sm transition shadow-sm w-fit"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>

      {/* 2. FILTER ROW: Rounded Capsule Filter + Task Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Rounded Capsule Bar */}
        <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-full p-1 shadow-xs w-fit">
          <button
            onClick={() => setActiveFilter("All")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeFilter === "All"
                ? "bg-[#2563eb] text-white ring-2 ring-[#2563eb] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setActiveFilter("My tasks")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeFilter === "My tasks"
                ? "bg-[#2563eb] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            My tasks
          </button>

          <button
            onClick={() => setActiveFilter("High priority")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeFilter === "High priority"
                ? "bg-[#2563eb] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            High priority
          </button>

          <button
            onClick={() => setActiveFilter("Due this week")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeFilter === "Due this week"
                ? "bg-[#2563eb] text-white"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Due this week
          </button>
        </div>

        {/* Counter */}
        <div className="text-sm text-slate-500 font-normal">
          <strong className="text-slate-900 font-bold">
            {filteredTasks.length}
          </strong>{" "}
          tasks shown
        </div>
      </div>

      {/* 3. KANBAN COLUMNS */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-slate-400 gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#154c3c]" />
          <span className="text-xs font-medium">Syncing live tasks...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter(
              (t) =>
                (t.status || "To do").toLowerCase() ===
                column.key.toLowerCase(),
            );

            return (
              <div
                key={column.key}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.key)}
                className="bg-slate-50/50 rounded-3xl p-3 sm:p-3.5 border border-slate-200/80 min-h-[640px] flex flex-col justify-start space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                    <h3 className="font-semibold text-sm text-slate-800">
                      {column.label}
                    </h3>
                  </div>

                  <span className="w-6 h-6 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 flex items-center justify-center shadow-xs">
                    {columnTasks.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {columnTasks.map((task) => {
                    const catStyle =
                      CATEGORY_STYLES[task.category] ||
                      CATEGORY_STYLES.Frontend;
                    const isDone = column.key === "Done";

                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`bg-white rounded-2xl p-4 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md transition-all space-y-3 cursor-grab active:cursor-grabbing select-none relative group ${
                          draggedTaskId === task.id ? "opacity-30 scale-95" : ""
                        }`}
                      >
                        {/* Top: Category Tag + Priority Flag + Menu */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-md text-[11px] font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                            >
                              {task.category || "Frontend"}
                            </span>

                            {task.priority && (
                              <span
                                className={`flex items-center gap-1 text-[11px] font-medium ${
                                  task.priority === "High"
                                    ? "text-rose-600"
                                    : task.priority === "Medium"
                                      ? "text-amber-700"
                                      : "text-slate-500"
                                }`}
                              >
                                <Flag className="w-3 h-3 stroke-[2]" />
                                <span>{task.priority}</span>
                              </span>
                            )}
                          </div>

                          {/* Action Menu (•••) */}
                          <div
                            className="relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() =>
                                setOpenMenuId(
                                  openMenuId === task.id ? null : task.id,
                                )
                              }
                              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {openMenuId === task.id && (
                              <div className="absolute right-0 top-6 z-20 w-44 bg-white rounded-xl shadow-lg border border-slate-100 p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                                <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 block">
                                  Move to
                                </span>
                                {COLUMNS.map((col) => (
                                  <button
                                    key={col.key}
                                    onClick={() =>
                                      handleUpdateStatus(task.id, col.key)
                                    }
                                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                                      task.status === col.key
                                        ? "bg-slate-100 text-slate-900 font-bold"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span>{col.label}</span>
                                    {task.status === col.key && (
                                      <Check className="w-3 h-3 text-[#154c3c]" />
                                    )}
                                  </button>
                                ))}

                                <div className="border-t border-slate-100 my-1" />
                                <button
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete task</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4
                          className={`text-[13.5px] font-medium leading-snug tracking-tight ${
                            isDone
                              ? "line-through text-slate-400 decoration-slate-300"
                              : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </h4>

                        {/* Solid Green Progress Line (matching screenshot) */}
                        {task.progress !== undefined && task.progress > 0 && (
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#1b6b50] rounded-full transition-all duration-300"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        )}

                        {/* Bottom Row: Clock/Time, Comment Count, Avatars */}
                        <div className="flex items-center justify-between pt-0.5 text-slate-500 text-[11px] font-medium">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{formatDueText(task.due_date)}</span>
                            </span>

                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-slate-400" />
                              <span>{task.comments_count ?? 2}</span>
                            </span>
                          </div>

                          {/* Overlapping Initials Avatars */}
                          <div className="flex items-center -space-x-1.5">
                            {(task.assignees && task.assignees.length > 0
                              ? task.assignees
                              : ["HK"]
                            ).map((name, i) => {
                              const color =
                                AVATAR_COLORS[name] ||
                                "bg-slate-100 text-slate-700";
                              return (
                                <span
                                  key={i}
                                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-semibold ${color}`}
                                >
                                  {name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {columnTasks.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-2xl flex items-center justify-center text-xs text-slate-400 font-medium">
                      No cards in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. MODAL: CREATE NEW TASK */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Create New Task
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design login & sign-up screens"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) =>
                      setNewTask({ ...newTask, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Design">Design</option>
                    <option value="QA">QA</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Stage
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                  >
                    <option value="To do">To do</option>
                    <option value="In progress">In progress</option>
                    <option value="In review">In review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Assignee Initials (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. HK, PR, MK"
                  value={newTask.assignees}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignees: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#154c3c]"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#2563eb] hover:bg-[#2563eb] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Save Task</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Initial tasks matching your exact screenshot
const initialScreenshotTasks: Task[] = [
  {
    id: "scr-1",
    title: "Saved filters for projects",
    status: "To do",
    category: "Frontend",
    priority: "Medium",
    due_date: new Date(Date.now() + 6 * 86400000).toISOString(),
    comments_count: 2,
    assignees: ["HK"],
  },
  {
    id: "scr-2",
    title: "Write API endpoint docs",
    status: "To do",
    category: "Backend",
    priority: "Low",
    due_date: new Date(Date.now() + 9 * 86400000).toISOString(),
    comments_count: 1,
    assignees: ["MS"],
  },
  {
    id: "scr-3",
    title: "Onboarding email sequence",
    status: "To do",
    category: "Marketing",
    priority: "Low",
    due_date: new Date(Date.now() + 8 * 86400000).toISOString(),
    comments_count: 3,
    assignees: ["MS"],
  },
  {
    id: "scr-4",
    title: "Design login & sign-up screens",
    status: "In progress",
    category: "Design",
    priority: "High",
    progress: 55,
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    comments_count: 4,
    assignees: ["PR", "MK"],
  },
  {
    id: "scr-5",
    title: "Passkey sign-in",
    status: "In progress",
    category: "Backend",
    priority: "High",
    progress: 40,
    due_date: new Date(Date.now() + 3 * 86400000).toISOString(),
    comments_count: 7,
    assignees: ["MS"],
  },
  {
    id: "scr-6",
    title: "Safari & Firefox regression pass",
    status: "In review",
    category: "QA",
    priority: "Medium",
    progress: 80,
    due_date: new Date(Date.now() + 1 * 86400000).toISOString(),
    comments_count: 5,
    assignees: ["SS"],
  },
  {
    id: "scr-7",
    title: "Brand illustration set",
    status: "In review",
    category: "Design",
    priority: "Medium",
    progress: 60,
    due_date: new Date(Date.now() + 2 * 86400000).toISOString(),
    comments_count: 6,
    assignees: ["MK"],
  },
  {
    id: "scr-8",
    title: "Monorepo cleanup",
    status: "Done",
    category: "Backend",
    priority: "Low",
    progress: 100,
    due_date: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments_count: 2,
    assignees: ["PR"],
  },
  {
    id: "scr-9",
    title: "Dashboard analytics widgets",
    status: "Done",
    category: "Frontend",
    priority: "High",
    progress: 100,
    due_date: new Date(Date.now() - 1 * 86400000).toISOString(),
    comments_count: 9,
    assignees: ["HK", "PR"],
  },
];
