"use client";

import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, Square, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimeEntry {
  id: string | number;
  project?: string | null;
  task?: string | null;
  duration: string;
  created_at?: string;
}

interface ProjectOption {
  id?: string | number;
  name: string | null;
}

export default function TimeTrackerPage() {
  const [loading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLogs, setTimeLogs] = useState<TimeEntry[]>([]);
  const [realProjects, setRealProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadTimeData = async () => {
      try {
        const [timeRes, projRes] = await Promise.all([
          supabase
            .from("time_entries")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("projects").select("id, name"),
        ]);

        if (timeRes.error) throw timeRes.error;
        if (projRes.error) throw projRes.error;
        if (!isMounted) return;

        setTimeLogs(timeRes.data || []);
        const projects = (projRes.data || []) as ProjectOption[];
        setRealProjects(projects);
        setSelectedProject(projects[0]?.name || "");
      } catch {
        console.error("Could not load time tracker data.");
        if (isMounted) {
          setTimeLogs([]);
          setRealProjects([]);
          setSelectedProject("");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTimeData();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSaveTimeLog = async () => {
    if (seconds > 0) {
      const mins = Math.floor(seconds / 60);
      const durationStr = `${mins}m`;

      try {
        const { data, error } = await supabase
          .from("time_entries")
          .insert([
            {
              project: selectedProject || null,
              duration: durationStr,
            },
          ])
          .select();

        if (error) throw error;
        if (data?.[0]) setTimeLogs([data[0], ...timeLogs]);
        setSeconds(0);
        setIsRunning(false);
      } catch {
        alert("Could not save the time entry.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Real Timesheets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Time Tracker & </span>
            <span className="font-heading italic text-[#9D00FF]">
              Timesheets.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Log real billable hours for your projects and save timesheets to
            database.
          </p>
        </div>
      </div>

      {/* STOPWATCH TIMER CARD */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 font-sans">
        <div className="space-y-2 text-center md:text-left font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 font-sans">
            Live Stopwatch Timer
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-black text-slate-900 tracking-wider">
            {formatTime(seconds)}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 justify-center md:justify-start font-sans">
            <span>Project:</span>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-[#9D00FF] font-sans"
            >
              {realProjects.length > 0 ? (
                realProjects.map((p) => (
                  <option
                    key={p.id || p.name || "project"}
                    value={p.name || ""}
                  >
                    {p.name}
                  </option>
                ))
              ) : (
                <option value="">No project selected</option>
              )}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 font-sans">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#9D00FF]/25 flex items-center gap-2 font-sans"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Timer</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-md flex items-center gap-2 font-sans"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleSaveTimeLog}
            disabled={seconds === 0}
            className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm px-5 py-3.5 rounded-2xl shadow-sm flex items-center gap-2 font-sans"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>Save & Log</span>
          </button>
        </div>
      </div>

      {/* Real Time Log History */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-[#9D00FF]" />
            <span>Real Time Logs ({timeLogs.length})</span>
          </h2>
        </div>

        {timeLogs.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {timeLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
              >
                <div className="flex items-center gap-3 font-sans">
                  <div className="w-9 h-9 rounded-xl bg-[#9D00FF]/10 text-[#9D00FF] flex items-center justify-center font-bold font-sans">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 font-sans">
                      {log.project}
                    </div>
                    <div className="text-slate-400 font-sans">
                      {log.task || "Work Session"}
                    </div>
                  </div>
                </div>

                <div className="text-right font-sans">
                  <div className="font-mono text-sm font-bold text-[#9D00FF] font-sans">
                    {log.duration}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    {log.created_at
                      ? new Date(log.created_at).toLocaleDateString()
                      : "Today"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold font-sans">
            No time logs recorded yet. Start the stopwatch above to record your
            first work session.
          </div>
        )}
      </div>
    </div>
  );
}
