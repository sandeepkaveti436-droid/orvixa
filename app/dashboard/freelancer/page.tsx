"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Trash2,
  Building,
  FolderKanban,
  CheckSquare,
  Users,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerDashboard() {
  const [loading, setLoading] = useState(true);

  // Live Database States
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Forms
  const [newTask, setNewTask] = useState({
    title: "",
    project_name: "",
    priority: "High",
  });
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    client: "",
    meeting_time: "10:00 AM",
    platform: "Google Meet",
  });
  const [newReminder, setNewReminder] = useState({
    title: "",
    reminder_time: "09:30 AM",
    priority: "High",
  });

  useEffect(() => {
    fetchLiveWorkspaceData();
  }, []);

  const fetchLiveWorkspaceData = async () => {
    try {
      setLoading(true);

      const [projRes, taskRes, meetRes, remRes] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("meetings")
          .select("*")
          .order("created_at", { ascending: true }),
        supabase
          .from("reminders")
          .select("*")
          .order("created_at", { ascending: true }),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (taskRes.data) setTasks(taskRes.data);
      if (meetRes.data) setMeetings(meetRes.data);
      if (remRes.data) setReminders(remRes.data);
    } catch (err) {
      console.error("Error loading workspace data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- TASK ACTIONS ---
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            title: newTask.title.trim(),
            project_name: newTask.project_name || "General",
            priority: newTask.priority,
            status: "Pending",
            progress: 0,
          },
        ])
        .select();

      if (error) throw error;
      if (data) setTasks([data[0], ...tasks]);
      setNewTask({ title: "", project_name: "", priority: "High" });
      setShowTaskModal(false);
    } catch (err: any) {
      alert(`Error creating task: ${err.message}`);
    }
  };

  const handleToggleTaskStatus = async (
    taskId: string,
    currentStatus: string,
  ) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    const nextProgress = nextStatus === "Completed" ? 100 : 0;
    try {
      await supabase
        .from("tasks")
        .update({ status: nextStatus, progress: nextProgress })
        .eq("id", taskId);
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: nextStatus, progress: nextProgress }
            : t,
        ),
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // --- MEETING ACTIONS ---
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from("meetings")
        .insert([newMeeting])
        .select();
      if (error) throw error;
      if (data) setMeetings([...meetings, data[0]]);
      setNewMeeting({
        title: "",
        client: "",
        meeting_time: "10:00 AM",
        platform: "Google Meet",
      });
      setShowMeetingModal(false);
    } catch (err: any) {
      alert(`Error scheduling meeting: ${err.message}`);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    await supabase.from("meetings").delete().eq("id", id);
    setMeetings(meetings.filter((m) => m.id !== id));
  };

  // --- REMINDER ACTIONS ---
  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;

    try {
      const { data, error } = await supabase
        .from("reminders")
        .insert([newReminder])
        .select();
      if (error) throw error;
      if (data) setReminders([...reminders, data[0]]);
      setNewReminder({
        title: "",
        reminder_time: "09:30 AM",
        priority: "High",
      });
      setShowReminderModal(false);
    } catch (err: any) {
      alert(`Error adding reminder: ${err.message}`);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    await supabase.from("reminders").delete().eq("id", id);
    setReminders(reminders.filter((r) => r.id !== id));
  };

  // --- LIVE STAT CALCULATIONS ---
  const totalProjectsCount = projects.length;
  const totalTasksCount = tasks.length;
  const assignedTasksCount = tasks.filter(
    (t) => t.status !== "Completed",
  ).length;

  const uniqueClients = Array.from(
    new Set(projects.map((p) => (p.client || "").trim()).filter(Boolean)),
  );
  const totalBudget = projects.reduce(
    (acc, p) => acc + (Number(p.budget) || 0),
    0,
  );

  const overdueAmount = projects
    .filter((p) => (p.status || "").toLowerCase().includes("hold"))
    .reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const inProgressAmount = projects
    .filter((p) => (p.status || "").toLowerCase() === "in progress")
    .reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const reviewAmount = projects
    .filter((p) => (p.status || "").toLowerCase().includes("review"))
    .reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const completedAmount = projects
    .filter((p) => (p.status || "").toLowerCase() === "completed")
    .reduce((acc, p) => acc + (Number(p.budget) || 0), 0);

  const chartColors = ["#3B82F6", "#10B981", "#EF4444", "#F59E0B", "#8B5CF6"];

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Workspace Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-12">
      {/* ================= 1. TOP METRIC STATS ROW ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-sans">
        {/* Total Project */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 font-sans">
              Total Project
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-sans">
              Active
            </span>
          </div>
          <div className="mt-3 font-sans">
            <div className="text-3xl font-black text-slate-900 font-sans">
              {totalProjectsCount}
            </div>
            <span className="text-[11px] font-medium text-slate-400 font-sans">
              All registered projects
            </span>
          </div>
        </div>

        {/* Total Task */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 font-sans">
              Total Task
            </span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-sans">
              Tracked
            </span>
          </div>
          <div className="mt-3 font-sans">
            <div className="text-3xl font-black text-slate-900 font-sans">
              {totalTasksCount}
            </div>
            <span className="text-[11px] font-medium text-slate-400 font-sans">
              All workspace deliverables
            </span>
          </div>
        </div>

        {/* Assigned Task */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 font-sans">
              Assigned Task
            </span>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-sans">
              Pending
            </span>
          </div>
          <div className="mt-3 font-sans">
            <div className="text-3xl font-black text-slate-900 font-sans">
              {assignedTasksCount}
            </div>
            <span className="text-[11px] font-medium text-slate-400 font-sans">
              Tasks in progress
            </span>
          </div>
        </div>

        {/* Total Pipeline Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:border-blue-200 transition font-sans">
          <div className="flex items-center justify-between font-sans">
            <span className="text-xs font-bold text-slate-500 font-sans">
              Total Pipeline
            </span>
            <span className="text-[11px] font-bold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 font-sans">
              ₹ INR
            </span>
          </div>
          <div className="mt-3 font-sans">
            <div className="text-3xl font-black text-[#0047AB] font-sans">
              ₹{totalBudget.toLocaleString("en-IN")}
            </div>
            <span className="text-[11px] font-medium text-slate-400 font-sans">
              {uniqueClients.length} Total Client
              {uniqueClients.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= 2. BALANCED 3-COLUMN MIDDLE ROW (NO ACTIVITY CARD) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
        {/* 1. Today's Tasks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
            <div className="flex items-center gap-2 font-sans">
              <h3 className="font-bold text-xs text-slate-700 font-sans">
                Today&apos;s Tasks
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-sans">
                {tasks.length}
              </span>
            </div>
            <button
              onClick={() => setShowTaskModal(true)}
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2.5 my-3.5 max-h-48 overflow-y-auto pr-1 font-sans">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-2.5 bg-slate-50/80 hover:bg-blue-50/40 rounded-xl border border-slate-100 flex items-center justify-between gap-2 group transition font-sans"
              >
                <div className="flex items-center gap-2 min-w-0 font-sans">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition shrink-0 ${
                      task.status === "Completed"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-[#0047AB]"
                    }`}
                  >
                    {task.status === "Completed" && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <div className="min-w-0 font-sans">
                    <div
                      className={`text-xs font-bold font-sans truncate ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-800"}`}
                    >
                      {task.title}
                    </div>
                    <span className="text-[9px] font-medium text-slate-400 block truncate font-sans">
                      {task.project_name}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-sans">
                No tasks today. Click &quot;Add&quot; above.
              </div>
            )}
          </div>

          <Link
            href="/dashboard/freelancer/tasks"
            className="text-right text-[11px] font-bold text-slate-400 hover:text-[#0047AB] block pt-1 font-sans"
          >
            Manage all →
          </Link>
        </div>

        {/* 2. Today's Meetings */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between font-sans">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
            <div className="flex items-center gap-2 font-sans">
              <h3 className="font-bold text-xs text-slate-700 font-sans">
                Today&apos;s Meetings
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-sans">
                {meetings.length}
              </span>
            </div>
            <button
              onClick={() => setShowMeetingModal(true)}
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
            >
              <Plus className="w-3.5 h-3.5" /> Schedule
            </button>
          </div>

          <div className="space-y-2.5 my-3.5 max-h-48 overflow-y-auto pr-1 font-sans">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="p-2.5 bg-slate-50/80 hover:bg-slate-100/60 rounded-xl border border-slate-100 flex items-center justify-between gap-2 group transition font-sans"
              >
                <div className="font-sans">
                  <span className="text-[10px] font-bold text-[#0047AB] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 inline-block mb-0.5 font-sans">
                    {m.meeting_time}
                  </span>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1 font-sans">
                    {m.title}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium font-sans">
                    {m.client || "Client Call"}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteMeeting(m.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {meetings.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-sans">
                No scheduled calls today.
              </div>
            )}
          </div>

          <button
            onClick={() => setShowMeetingModal(true)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1.5 font-sans"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule meeting
          </button>
        </div>

        {/* 3. Project Work Breakdown Donut (Shows 0 and gray ring when 0 projects) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between font-sans">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-sans">
            <h4 className="font-bold text-xs text-slate-700 font-sans">
              Project Work
            </h4>
            <span className="text-[10px] font-bold text-slate-400 font-sans">
              {projects.length} Total
            </span>
          </div>

          <div className="relative w-28 h-28 mx-auto my-1 flex items-center justify-center font-sans">
            {/* Clean empty gray ring when 0 projects */}
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="transparent"
                stroke={projects.length > 0 ? "#E2E8F0" : "#F1F5F9"}
                strokeWidth="4"
              />
              {projects.length > 0 && (
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="transparent"
                  stroke="#3B82F6"
                  strokeWidth="4"
                  strokeDasharray="100 100"
                  strokeDashoffset="0"
                />
              )}
            </svg>
            <div className="absolute text-center font-sans">
              <span className="text-lg font-black text-slate-900 block leading-none font-sans">
                {projects.length}
              </span>
              <span className="text-[8px] font-bold uppercase text-slate-400 font-sans">
                PROJECTS
              </span>
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100 text-xs font-sans">
            {projects.slice(0, 2).map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-slate-700 font-sans"
              >
                <div className="flex items-center gap-1.5 truncate font-sans">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor: chartColors[idx % chartColors.length],
                    }}
                  />
                  <span className="truncate font-bold text-[10px] font-sans">
                    {p.name}
                  </span>
                </div>
                <span className="font-bold text-[10px] text-slate-400 font-sans">
                  {totalBudget > 0
                    ? Math.round(((Number(p.budget) || 0) / totalBudget) * 100)
                    : 0}
                  %
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <span className="text-[10px] text-slate-400 italic block text-center py-1 font-sans">
                No active projects
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ================= 3. BOTTOM ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 font-sans">
        {/* 1. Invoice / Revenue Breakdown in ₹ INR */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
            <h3 className="font-bold text-xs text-slate-700 font-sans">
              Invoice / Revenue Overview
            </h3>
            <span className="text-xs font-bold text-[#0047AB] font-sans">
              ₹{totalBudget.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="space-y-3 font-sans">
            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-purple-700 font-sans">
                  Overdue / On Hold
                </span>
                <span className="text-slate-800 font-sans">
                  ₹{overdueAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{
                    width: `${totalBudget > 0 ? (overdueAmount / totalBudget) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-blue-600 font-sans">
                  In Progress Active
                </span>
                <span className="text-slate-800 font-sans">
                  ₹{inProgressAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${totalBudget > 0 ? (inProgressAmount / totalBudget) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1 font-sans">
              <div className="flex justify-between text-xs font-bold font-sans">
                <span className="text-emerald-600 font-sans">
                  Fully Completed
                </span>
                <span className="text-slate-800 font-sans">
                  ₹{completedAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${totalBudget > 0 ? (completedAmount / totalBudget) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Schedule Timeline */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
            <h3 className="font-bold text-xs text-slate-700 font-sans">
              Schedule Timeline
            </h3>
            <span className="text-xs font-bold text-slate-400 font-sans">
              Today
            </span>
          </div>

          <div className="space-y-2.5 font-sans">
            {projects
              .filter(
                (project) =>
                  project.date || project.due_date || project.deadline,
              )
              .slice(0, 3)
              .map((p, idx) => {
                const bgColors = [
                  "bg-lime-50 border-lime-200",
                  "bg-amber-50 border-amber-200",
                  "bg-blue-50 border-blue-200",
                ];
                const scheduledDate = p.date || p.due_date || p.deadline;

                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 font-sans"
                  >
                    <div
                      className={`p-2.5 rounded-xl border flex-1 font-sans ${bgColors[idx % bgColors.length]}`}
                    >
                      <div className="text-xs font-bold text-slate-900 truncate font-sans">
                        {p.name}
                      </div>
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-wider block font-sans">
                        {p.client}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 shrink-0 font-sans">
                      {new Date(scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            {!projects.some(
              (project) => project.date || project.due_date || project.deadline,
            ) && (
              <div className="text-center py-6 text-xs text-slate-400 font-sans">
                No scheduled timeline items.
              </div>
            )}
          </div>
        </div>

        {/* 3. Reminders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3 font-sans">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-sans">
            <h3 className="font-bold text-xs text-slate-700 font-sans">
              Reminders
            </h3>
            <button
              onClick={() => setShowReminderModal(true)}
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="space-y-2 font-sans">
            {reminders.map((r) => (
              <div
                key={r.id}
                className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 group transition font-sans"
              >
                <div className="font-sans">
                  <span className="text-[9px] font-bold text-slate-400 block font-sans">
                    {r.reminder_time}
                  </span>
                  <div className="text-xs font-bold text-slate-800 font-sans">
                    {r.title}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-sans">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-sans ${r.priority === "High" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}
                  >
                    {r.priority}
                  </span>
                  <button
                    onClick={() => handleDeleteReminder(r.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-sans">
                No active reminders.
              </div>
            )}
          </div>

          <button
            onClick={() => setShowReminderModal(true)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition font-sans"
          >
            + New Reminder
          </button>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* 1. Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-sans">
            <div className="flex justify-between items-center border-b pb-3 font-sans">
              <h4 className="font-bold text-xs text-slate-700 font-sans">
                Add Live Task
              </h4>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3 font-sans">
              <input
                type="text"
                required
                placeholder="Task title (e.g. Create Landing Page)"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                placeholder="Project Name (e.g. Food Link)"
                value={newTask.project_name}
                onChange={(e) =>
                  setNewTask({ ...newTask, project_name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-2.5 rounded-xl shadow-md font-sans"
              >
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Schedule Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-sans">
            <div className="flex justify-between items-center border-b pb-3 font-sans">
              <h4 className="font-bold text-xs text-slate-700 font-sans">
                Schedule Meeting
              </h4>
              <button
                onClick={() => setShowMeetingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleCreateMeeting}
              className="space-y-3 font-sans"
            >
              <input
                type="text"
                required
                placeholder="Meeting Topic (e.g. Project Feedback Call)"
                value={newMeeting.title}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                placeholder="Client Name (e.g. Food Link)"
                value={newMeeting.client}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, client: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                placeholder="Time (e.g. 03:00 PM)"
                value={newMeeting.meeting_time}
                onChange={(e) =>
                  setNewMeeting({ ...newMeeting, meeting_time: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-2.5 rounded-xl shadow-md font-sans"
              >
                Save Meeting
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl font-sans">
            <div className="flex justify-between items-center border-b pb-3 font-sans">
              <h4 className="font-bold text-xs text-slate-700 font-sans">
                Add Reminder
              </h4>
              <button
                onClick={() => setShowReminderModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form
              onSubmit={handleCreateReminder}
              className="space-y-3 font-sans"
            >
              <input
                type="text"
                required
                placeholder="Reminder Title (e.g. Check Test Results)"
                value={newReminder.title}
                onChange={(e) =>
                  setNewReminder({ ...newReminder, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                placeholder="Time (e.g. 09:30 AM)"
                value={newReminder.reminder_time}
                onChange={(e) =>
                  setNewReminder({
                    ...newReminder,
                    reminder_time: e.target.value,
                  })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-2.5 rounded-xl shadow-md font-sans"
              >
                Save Reminder
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
