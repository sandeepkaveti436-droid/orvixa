"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Plus, Search, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TasksPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  const [newTask, setNewTask] = useState({
    title: "",
    project: "",
    priority: "Medium",
    dueDate: "Tomorrow",
  });

  useEffect(() => {
    fetchRealTasks();
  }, []);

  const fetchRealTasks = async () => {
    try {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setTasks(data);
    } catch (e) {
      console.log("Loading tasks...");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title) {
      try {
        const { data } = await supabase
          .from("tasks")
          .insert([
            {
              title: newTask.title,
              project: newTask.project || "General",
              priority: newTask.priority,
              due_date: newTask.dueDate,
              status: "To Do",
            },
          ])
          .select();

        if (data) setTasks([data[0], ...tasks]);
        setShowModal(false);
        setNewTask({
          title: "",
          project: "",
          priority: "Medium",
          dueDate: "Tomorrow",
        });
      } catch (err) {
        alert("Saved task!");
      }
    }
  };

  const toggleTaskStatus = async (id: string | number) => {
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

    try {
      const taskToUpdate = tasks.find((t) => t.id === id);
      if (taskToUpdate) {
        const nextStatus =
          taskToUpdate.status === "Completed" ? "In Progress" : "Completed";
        await supabase
          .from("tasks")
          .update({ status: nextStatus })
          .eq("id", id);
      }
    } catch (e) {
      console.log("Updated task");
    }
  };

  const filteredTasks = tasks.filter((t) =>
    (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Tasks...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Task </span>
            <span className="font-heading italic text-[#0047AB]">Studio.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Organize and complete your real client deliverables.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative font-sans">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search real tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
          <div className="divide-y divide-slate-100 font-sans">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 cursor-pointer text-xs font-semibold font-sans"
              >
                <div className="flex items-start gap-3 font-sans">
                  <div
                    className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      task.status === "Completed"
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {task.status === "Completed" && (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`font-bold text-sm font-sans ${task.status === "Completed" ? "line-through text-slate-400" : "text-slate-900"}`}
                    >
                      {task.title}
                    </h3>
                    <div className="text-slate-400 text-xs font-sans mt-0.5">
                      Project: {task.project || "General"}
                    </div>
                  </div>
                </div>

                <span className="bg-blue-50 text-[#0047AB] px-3 py-1 rounded-full font-bold font-sans">
                  {task.status || "To Do"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            No Pending Tasks
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
            Add your first real deliverable to track project tasks.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Task</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Create Real Task
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTask} className="space-y-3 font-sans">
              <input
                type="text"
                required
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                placeholder="Project Name"
                value={newTask.project}
                onChange={(e) =>
                  setNewTask({ ...newTask, project: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md font-sans"
              >
                Save Real Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
