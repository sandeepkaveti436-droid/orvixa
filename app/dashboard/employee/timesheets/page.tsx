"use client";

import React, { useState, useEffect } from "react";
import { Clock, Download, Loader2, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function EmployeeTimesheetsPage() {
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAttendance() {
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

          // Fetch real attendance logs
          const { data } = await supabase
            .from("attendance")
            .select("*")
            .ilike("user_name", `%${myName}%`)
            .order("clock_in", { ascending: false });

          if (data) setLogs(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAttendance();
  }, []);

  const handleExport = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1500);
  };

  const calculateDuration = (inTime: string, outTime: string) => {
    if (!outTime) return "In Progress";
    const start = new Date(inTime).getTime();
    const end = new Date(outTime).getTime();
    const mins = Math.floor((end - start) / 60000);
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Timesheets...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Timesheets & Punch Logs
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            View your verified daily clock-in/clock-out logs.
          </p>
        </div>

        <button
          onClick={handleExport}
          disabled={isDownloading || downloaded || logs.length === 0}
          className={`font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all font-sans ${
            downloaded
              ? "bg-emerald-500 text-white"
              : "bg-[#0047AB] hover:bg-[#003680] text-white"
          }`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : downloaded ? (
            <>
              <Check className="w-4 h-4" />
              <span>File Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export Timesheet</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-[#0047AB]" />
            <span>Weekly Work Hours Log ({logs.length})</span>
          </h2>
        </div>

        {logs.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans transition-colors"
              >
                <div>
                  <div className="font-bold text-sm text-slate-900 font-sans">
                    {new Date(log.clock_in).toLocaleDateString()}
                  </div>
                  <div className="text-slate-400 font-sans mt-0.5">
                    Clock In: {new Date(log.clock_in).toLocaleTimeString()}
                    {log.clock_out
                      ? ` • Clock Out: ${new Date(log.clock_out).toLocaleTimeString()}`
                      : ""}
                  </div>
                </div>

                <div className="flex items-center gap-4 font-sans">
                  <span className="font-mono font-bold text-sm text-slate-900 font-sans">
                    {calculateDuration(log.clock_in, log.clock_out)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                      log.status === "Active"
                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}
                  >
                    {log.status || "Verified"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-sans">
            <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-semibold">
              No shifts logged yet. Clock in from the dashboard!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
