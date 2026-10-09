"use client";

import React, { useState, useEffect } from "react";
import { FolderKanban, Plus, Search, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminTasksPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dept: "",
    priority: "High",
  });

  useEffect(() => {
    fetchRealOrgTasks();
  }, []);

  const fetchRealOrgTasks = async () => {
    try {
      const { data } = await supabase
        .from("organization_tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setTasks(data);
    } catch (e) {
      console.log("Loading org tasks...");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title) {
      try {
        const { data } = await supabase
          .from("organization_tasks")
          .insert([
            {
              title: newTask.title,
              assignee: newTask.assignee || "Unassigned",
              department: newTask.dept || "General",
              priority: newTask.priority,
              status: "To Do",
            },
          ])
          .select();

        if (data) setTasks([data[0], ...tasks]);
        setShowModal(false);
        setNewTask({ title: "", assignee: "", dept: "", priority: "High" });
      } catch (err) {
        alert("Failed to assign task");
      }
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.assignee || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Real Org Tasks...</span>
      </div>
    );
  }

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
          className="bg-[#9D00FF] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Org Task</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative font-sans">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search task title or assignee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <FolderKanban className="w-4 h-4 text-[#9D00FF]" />
            <span>Assigned Tasks ({filteredTasks.length})</span>
          </h2>
        </div>

        {filteredTasks.length > 0 ? (
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
                    ({task.department || "General"})
                  </div>
                </div>
                <div className="flex items-center gap-3 font-sans">
                  <span className="px-2.5 py-0.5 rounded-full font-bold font-sans bg-amber-50 text-amber-600 border border-amber-200">
                    {task.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold font-sans bg-blue-50 text-[#9D00FF] border border-blue-200">
                    {task.status || "To Do"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 space-y-3 font-sans">
            <p className="text-xs font-semibold">No assigned org tasks.</p>
          </div>
        )}
      </div>

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
              <input
                type="text"
                required
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />
              <input
                type="text"
                required
                placeholder="Assignee Name"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />
              <button
                type="submit"
                className="w-full bg-[#9D00FF] text-white font-bold text-xs py-3 rounded-xl shadow-md font-sans"
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
