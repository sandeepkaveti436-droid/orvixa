"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ArrowUpDown,
  Calendar as CalendarIcon,
  CheckCircle2,
  Trash2,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  FolderKanban,
  MoreVertical,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"Table" | "Kanban" | "Calendar">(
    "Table",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Selection
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Add Task Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    project_name: "",
    status: "To Do",
    priority: "High",
    progress: 0,
    due_date: new Date().toISOString().split("T")[0],
  });

  const projectColors = [
    "bg-amber-500",
    "bg-blue-600",
    "bg-emerald-500",
    "bg-purple-600",
    "bg-rose-500",
    "bg-indigo-600",
  ];

  useEffect(() => {
    fetchLiveTasksAndProjects();
  }, []);

  const fetchLiveTasksAndProjects = async () => {
    try {
      setLoading(true);

      const [taskRes, projRes] = await Promise.all([
        supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (taskRes.data) setTasks(taskRes.data);
      if (projRes.data) {
        setProjects(projRes.data);
        if (projRes.data.length > 0 && !newTask.project_name) {
          setNewTask((prev) => ({
            ...prev,
            project_name: projRes.data[0].name,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add Task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    setIsSaving(true);
    const selectedProj = projects.find((p) => p.name === newTask.project_name);
    const projNameVal = newTask.project_name.trim() || "General Deliverable";

    try {
      const payload: any = {
        title: newTask.title.trim(),
        project_name: projNameVal,
        project: projNameVal,
        project_id: selectedProj?.id || null,
        priority: newTask.priority,
        status: newTask.status,
        progress: Number(newTask.progress) || 0,
        due_date: newTask.due_date || null,
      };

      const { data, error } = await supabase
        .from("tasks")
        .insert([payload])
        .select();

      if (error) throw error;
      if (data && data.length > 0) {
        setTasks([data[0], ...tasks]);
      }

      setNewTask({
        title: "",
        project_name: projects[0]?.name || "",
        status: "To Do",
        priority: "High",
        progress: 0,
        due_date: new Date().toISOString().split("T")[0],
      });
      setShowAddModal(false);
    } catch (err: any) {
      alert(`Error adding task: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Update Status
  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    const computedProgress =
      newStatus === "Done"
        ? 100
        : newStatus === "In Review"
          ? 80
          : newStatus === "To Do"
            ? 0
            : 50;

    try {
      await supabase
        .from("tasks")
        .update({ status: newStatus, progress: computedProgress })
        .eq("id", taskId);

      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus, progress: computedProgress }
            : t,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await supabase.from("tasks").delete().eq("id", taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  const handleToggleSelectTask = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const getStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "done" || s === "completed") return "bg-[#10B981] text-white";
    if (s === "in review") return "bg-[#A7F3D0] text-emerald-900";
    if (s === "in progress") return "bg-[#F59E0B] text-white";
    if (s === "to do") return "bg-[#F87171] text-white";
    if (s === "backlog") return "bg-[#EC4899] text-white";
    return "bg-slate-200 text-slate-700";
  };

  const getProgressVal = (task: any) => {
    if (typeof task.progress === "number") return task.progress;
    const s = (task.status || "").toLowerCase();
    if (s === "done" || s === "completed") return 100;
    if (s === "in review") return 80;
    if (s === "in progress") return 50;
    return 0;
  };

  // Filter Tasks
  const filteredTasks = tasks
    .filter((t) => {
      const taskProj = t.project_name || t.project || "";
      const matchesSearch =
        (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        taskProj.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (t.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return sortOrder === "asc"
        ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
        : new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    });

  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // --- CALENDAR GENERATION LOGIC ---
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading My Tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-16">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 font-sans">
            Monitor all of your tasks across Table, Kanban, and Calendar
          </p>
        </div>

        <div className="relative w-full sm:w-80 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/80 border border-slate-200 rounded-xl pl-9 pr-12 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 bg-white px-1.5 py-0.5 rounded-md font-sans">
            ⌘ F
          </span>
        </div>
      </div>

      {/* 2. VIEW SWITCHER & CONTROLS */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3 font-sans">
        {/* Table | Kanban | Calendar Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl font-sans w-full md:w-auto">
          {(["Table", "Kanban", "Calendar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all font-sans ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto font-sans">
          {/* Month Indicator / Navigator */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 font-sans">
            <button onClick={prevMonth} className="hover:text-[#0047AB]">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={nextMonth} className="hover:text-[#0047AB]">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none font-sans"
          >
            <option value="all">Filter ▾</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="In Review">In Review</option>
            <option value="Done">Done</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-slate-100 transition font-sans"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Nearest Due Date</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-4 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition font-sans"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* ================= 3. VIEW 1: TABLE VIEW ================= */}
      {activeTab === "Table" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-slate-50/75 border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px] font-sans">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedTaskIds.length === filteredTasks.length &&
                        filteredTasks.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#0047AB] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Task Name
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Project
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Assignee
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Due Date
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Status
                  </th>
                  <th className="py-3.5 px-4 font-bold text-slate-500">
                    Progress
                  </th>
                  <th className="py-3.5 px-4 text-right"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedTasks.map((task, index) => {
                  const isSelected = selectedTaskIds.includes(task.id);
                  const projName =
                    task.project_name || task.project || "General Deliverable";
                  const firstLetter = projName.charAt(0).toUpperCase();
                  const colorBg = projectColors[index % projectColors.length];
                  const taskProgress = getProgressVal(task);

                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition group font-sans ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectTask(task.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#0047AB] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-bold text-xs font-sans ${
                            task.status === "Done"
                              ? "line-through text-slate-400"
                              : "text-slate-900"
                          }`}
                        >
                          {task.title}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 font-sans">
                          <div
                            className={`w-5 h-5 rounded-md ${colorBg} text-white flex items-center justify-center font-black text-[10px] shadow-sm shrink-0`}
                          >
                            {firstLetter}
                          </div>
                          <span className="font-bold text-xs text-slate-800 truncate max-w-[140px] font-sans">
                            {projName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-sans">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px] shrink-0">
                            SK
                          </div>
                          <span className="font-bold text-xs text-slate-700 font-sans">
                            You
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold text-xs font-sans ${
                            task.due_date &&
                            new Date(task.due_date).getTime() <
                              new Date().getTime() &&
                            task.status !== "Done"
                              ? "text-rose-600 font-bold"
                              : "text-slate-600"
                          }`}
                        >
                          {task.due_date
                            ? new Date(task.due_date).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "No deadline"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={task.status || "To Do"}
                          onChange={(e) =>
                            handleUpdateStatus(task.id, e.target.value)
                          }
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full border-none cursor-pointer outline-none font-sans ${getStatusBadge(
                            task.status,
                          )}`}
                        >
                          <option
                            value="To Do"
                            className="bg-white text-slate-900"
                          >
                            To Do
                          </option>
                          <option
                            value="In Progress"
                            className="bg-white text-slate-900"
                          >
                            In Progress
                          </option>
                          <option
                            value="In Review"
                            className="bg-white text-slate-900"
                          >
                            In Review
                          </option>
                          <option
                            value="Done"
                            className="bg-white text-slate-900"
                          >
                            Done
                          </option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 min-w-[150px]">
                        <div className="flex items-center gap-2.5 font-sans">
                          <span className="text-xs font-bold text-slate-700 w-9 font-sans">
                            {taskProgress}%
                          </span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                taskProgress === 100
                                  ? "bg-blue-600"
                                  : taskProgress > 40
                                    ? "bg-slate-700"
                                    : "bg-slate-400"
                              }`}
                              style={{ width: `${taskProgress}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-600 transition p-1 rounded-lg"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredTasks.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-12 text-slate-400 font-sans text-xs"
                    >
                      No tasks found. Click &quot;+ New&quot; above to create
                      your first deliverable.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-sans">
            <span>
              Page {currentPage} of {totalPages} ({filteredTasks.length} total
              tasks)
            </span>

            <div className="flex items-center gap-1 font-sans">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg font-bold transition font-sans ${
                      currentPage === pageNum
                        ? "bg-[#0047AB] text-white"
                        : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <span className="ml-4 font-bold text-slate-400 font-sans">
                Show 12 /page
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. VIEW 2: KANBAN BOARD VIEW ================= */}
      {activeTab === "Kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
          {(["To Do", "In Progress", "In Review", "Done"] as const).map(
            (columnStatus) => {
              const columnTasks = filteredTasks.filter(
                (t) =>
                  (t.status || "To Do").toLowerCase() ===
                  columnStatus.toLowerCase(),
              );

              return (
                <div
                  key={columnStatus}
                  className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3.5 font-sans min-h-[450px] flex flex-col justify-between"
                >
                  <div className="space-y-3 font-sans">
                    {/* Column Header */}
                    <div className="flex items-center justify-between font-sans">
                      <div className="flex items-center gap-2 font-sans">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            columnStatus === "Done"
                              ? "bg-emerald-500"
                              : columnStatus === "In Progress"
                                ? "bg-amber-500"
                                : columnStatus === "In Review"
                                  ? "bg-blue-500"
                                  : "bg-rose-500"
                          }`}
                        />
                        <h3 className="font-bold text-xs text-slate-800 font-sans uppercase tracking-wider">
                          {columnStatus}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full font-sans">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Task Cards */}
                    <div className="space-y-2.5 font-sans">
                      {columnTasks.map((task, idx) => (
                        <div
                          key={task.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm space-y-2.5 hover:shadow-md transition font-sans"
                        >
                          <div className="flex items-start justify-between gap-2 font-sans">
                            <span className="font-bold text-xs text-slate-900 font-sans leading-snug">
                              {task.title}
                            </span>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="text-slate-300 hover:text-rose-600 transition p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Project Name Badge */}
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-100 font-sans">
                            <FolderKanban className="w-3 h-3 text-[#0047AB]" />
                            <span className="truncate">
                              {task.project_name || "General"}
                            </span>
                          </div>

                          {/* Due Date & Quick Move */}
                          <div className="flex items-center justify-between pt-1 text-[10px] font-semibold text-slate-400 font-sans">
                            <span>
                              {task.due_date
                                ? `Due: ${task.due_date}`
                                : "No deadline"}
                            </span>

                            {/* Quick Column Shift */}
                            <select
                              value={task.status || "To Do"}
                              onChange={(e) =>
                                handleUpdateStatus(task.id, e.target.value)
                              }
                              className="text-[10px] font-bold bg-slate-100 text-slate-700 rounded-md px-1.5 py-0.5 outline-none cursor-pointer font-sans"
                            >
                              <option value="To Do">To Do</option>
                              <option value="In Progress">In Progress</option>
                              <option value="In Review">In Review</option>
                              <option value="Done">Done</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="text-center py-10 text-xs text-slate-400 font-sans border-2 border-dashed border-slate-200 rounded-xl">
                          No tasks in {columnStatus}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* + Add to column */}
                  <button
                    onClick={() => {
                      setNewTask((prev) => ({ ...prev, status: columnStatus }));
                      setShowAddModal(true);
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1 transition font-sans"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* ================= 5. VIEW 3: CALENDAR VIEW ================= */}
      {activeTab === "Calendar" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 font-sans">
          {/* Day Headers (Sun - Sat) */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b font-sans">
            <div>SUN</div>
            <div>MON</div>
            <div>TUE</div>
            <div>WED</div>
            <div>THU</div>
            <div>FRI</div>
            <div>SAT</div>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-2 font-sans">
            {/* Empty slots for month start offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="min-h-[100px] p-2 bg-slate-50/50 rounded-xl border border-slate-100/50"
              />
            ))}

            {/* Actual Days of the Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
              const dayTasks = tasks.filter((t) => t.due_date === dateStr);

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    setNewTask((prev) => ({ ...prev, due_date: dateStr }));
                    setShowAddModal(true);
                  }}
                  className="min-h-[110px] p-2 bg-white hover:bg-blue-50/20 rounded-xl border border-slate-200/80 flex flex-col justify-between transition cursor-pointer group font-sans"
                >
                  <div className="flex justify-between items-center font-sans">
                    <span className="text-xs font-black text-slate-800 font-sans">
                      {dayNum}
                    </span>
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] font-bold bg-blue-50 text-[#0047AB] px-1.5 rounded-full font-sans">
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 my-1 overflow-y-auto max-h-16 font-sans">
                    {dayTasks.map((t) => (
                      <div
                        key={t.id}
                        className={`text-[10px] font-bold p-1 rounded-md truncate font-sans ${
                          t.status === "Done"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-blue-50 text-[#0047AB]"
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition font-sans">
                    + Add Task
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 6. ADD TASK MODAL ================= */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl font-sans"
          >
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Create New Task Deliverable
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Task Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Homepage Design & Wireframes"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Project
                </label>
                <select
                  value={newTask.project_name}
                  onChange={(e) =>
                    setNewTask({ ...newTask, project_name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0047AB] font-sans"
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.client})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Status
                  </label>
                  <select
                    value={newTask.status}
                    onChange={(e) =>
                      setNewTask({ ...newTask, status: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2 font-sans"
              >
                {isSaving ? "Saving Task..." : "Create Task in Database"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
