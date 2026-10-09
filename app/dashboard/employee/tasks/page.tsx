"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Search, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeTasksPage() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMyRealTasks() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();

          const myName = profile?.full_name || user.email?.split("@")[0];

          // Fetch tasks where assignee matches my name
          const { data: myTasks } = await supabase
            .from("organization_tasks")
            .select("*")
            .ilike("assignee", `%${myName}%`)
            .order("created_at", { ascending: false });

          if (myTasks) setTasks(myTasks);
        }
      } catch (error) {
        console.error("Error fetching tasks");
      } finally {
        setLoading(false);
      }
    }
    fetchMyRealTasks();
  }, []);

  const toggleTask = async (id: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === "Completed" ? "In Progress" : "Completed";

    // Optimistic UI Update
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)),
    );

    try {
      await supabase
        .from("organization_tasks")
        .update({ status: nextStatus })
        .eq("id", id);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const isCompleted = t.status === "Completed";
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !isCompleted) ||
      (filter === "completed" && isCompleted);
    const matchesSearch =
      (t.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.department || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Your Real Tasks...</span>
      </div>
    );
  }

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
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF] font-sans"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold font-sans">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all font-sans ${
                filter === tab
                  ? "bg-white text-[#9D00FF] shadow-sm"
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
            <CheckCircle2 className="w-4 h-4 text-[#9D00FF]" />
            <span>Assigned Deliverables ({filteredTasks.length})</span>
          </h2>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {filteredTasks.map((task) => {
              const isCompleted = task.status === "Completed";
              return (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id, task.status)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer font-sans"
                >
                  <div className="flex items-start gap-3 font-sans">
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <h3
                        className={`font-bold text-sm font-sans ${isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mt-1 font-sans">
                        <span>
                          Dept:{" "}
                          <strong className="text-slate-700 font-sans">
                            {task.department || "General"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Assigned by:{" "}
                          <strong className="text-slate-700 font-sans">
                            Manager
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
                          : "bg-blue-50 text-[#9D00FF] border border-blue-200"
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-sans">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">No assigned tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
