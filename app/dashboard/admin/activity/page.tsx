"use client";

import React, { useState, useEffect } from "react";
import { Activity, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealActivity() {
      try {
        const { data } = await supabase
          .from("activity_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setLogs(data);
      } catch (e) {
        console.log("Loading activity...");
      } finally {
        setLoading(false);
      }
    }
    fetchRealActivity();
  }, []);

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Activity...</span>
      </div>
    );

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Activity & Attendance Monitor
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Real-time team execution feeds.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Live Audit Feed</span>
          </h2>
        </div>
        <div className="divide-y divide-slate-100 font-sans">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
              >
                <div className="flex items-center gap-3 font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 font-sans">
                      {log.user_name}:{" "}
                    </strong>
                    <span className="text-slate-600 font-sans">
                      {log.action}
                    </span>
                  </div>
                </div>
                <span className="text-slate-400 font-mono text-[11px] font-sans">
                  {new Date(log.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-400 font-sans">
              <p className="text-xs font-bold">No activity logged yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
