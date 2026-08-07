"use client";

import React, { useState, useEffect } from "react";
import { FileCode, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const { data } = await supabase
          .from("audit_logs")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAuditLogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Security Logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Security & Audit Logs
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Real-time tracking of security events, permission changes, and user
          logins.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        {logs.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 sm:p-5 flex items-center justify-between text-xs font-semibold hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-[#0047AB] shrink-0" />
                  <div>
                    <strong className="text-slate-900">
                      {log.user_name}:{" "}
                    </strong>
                    <span className="text-slate-600">
                      {log.event_description}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 font-mono text-[11px] block">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                  <span className="text-slate-300 text-[10px] font-mono">
                    {log.ip_address}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-sans space-y-2">
            <FileCode className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-500">
              No audit events recorded yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
