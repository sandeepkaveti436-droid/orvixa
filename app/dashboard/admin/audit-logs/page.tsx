"use client";

import React from "react";
import { FileCode, ShieldCheck, Lock } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    {
      id: 1,
      user: "Alex Mercer",
      action: "Changed Sarah Jenkins role from 'Member' to 'Manager'",
      time: "10 mins ago",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      user: "DevOps Bot",
      action: "Generated new API secret key for Stripe integration",
      time: "1 hour ago",
      ip: "10.0.0.4",
    },
    {
      id: 3,
      user: "David Kim",
      action: "Created new project 'Orvixa AI Engine v2.0'",
      time: "3 hours ago",
      ip: "172.16.0.12",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>Security & </span>
          <span className="font-heading italic text-[#0047AB]">
            Audit Logs.
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Real-time tracking of security events, permission changes, and user
          logins.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 sm:p-5 flex items-center justify-between text-xs font-semibold hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-[#0047AB] shrink-0" />
                <div>
                  <strong className="text-slate-900">{log.user}: </strong>
                  <span className="text-slate-600">{log.action}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 font-mono text-[11px] block">
                  {log.time}
                </span>
                <span className="text-slate-300 text-[10px] font-mono">
                  {log.ip}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
