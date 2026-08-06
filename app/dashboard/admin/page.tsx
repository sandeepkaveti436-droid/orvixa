"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Building2,
  Activity,
  BarChart3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  FolderKanban,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [employees] = useState([
    {
      id: 1,
      name: "Sarah Jenkins",
      email: "sarah@orvixa.com",
      role: "Product Designer",
      dept: "Design",
      status: "Active",
    },
    {
      id: 2,
      name: "Alex Mercer",
      email: "alex@orvixa.com",
      role: "Frontend Lead",
      dept: "Engineering",
      status: "Active",
    },
    {
      id: 3,
      name: "David Kim",
      email: "david@orvixa.com",
      role: "DevOps Engineer",
      dept: "Engineering",
      status: "Invited",
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya@orvixa.com",
      role: "Marketing Lead",
      dept: "Growth",
      status: "Active",
    },
  ]);

  const [tasks] = useState([
    {
      id: 1,
      title: "Review Q3 Marketing Campaign Budget",
      assignee: "Priya Sharma",
      dept: "Growth",
      status: "In Progress",
      priority: "High",
    },
    {
      id: 2,
      title: "Implement Next.js App Router Authentication",
      assignee: "Alex Mercer",
      dept: "Engineering",
      status: "Completed",
      priority: "Urgent",
    },
    {
      id: 3,
      title: "Design Component System Tokens in Figma",
      assignee: "Sarah Jenkins",
      dept: "Design",
      status: "In Progress",
      priority: "Medium",
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      {/* 1. HEADER (NORMAL FONT ONLY) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span>Orvixa Enterprise Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight font-sans">
            Organization Command Center
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Oversee team roster, sprint velocity, department activity, and AI
            reports.
          </p>
        </div>

        <Link
          href="/dashboard/admin/employees"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 self-start sm:self-auto font-sans"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Invite Employee</span>
        </Link>
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Total Employees
            </span>
            <Users className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans">
            32 Members
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ 28 Online Now
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Sprint Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-[#0047AB] font-sans">
            94.8%
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            +12% vs last week
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Departments Active
            </span>
            <Building2 className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-slate-900 font-sans">
            4 Teams
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Engineering, Design, Growth, Sales
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Security & RBAC
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-[#0047AB] font-sans">
            SOC2
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ AES-256 Encrypted
          </span>
        </div>
      </div>

      {/* 3. AI COPILOT AUDIT BANNER */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 sm:p-6 rounded-2xl border border-blue-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0047AB]/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-sans">
              AI Team Performance Audit
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5 font-sans">
              "Engineering sprint #14 is running 18% ahead of schedule with zero
              active bottlenecks. Generate weekly report?"
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/admin/reports"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0 font-sans"
        >
          View AI Report →
        </Link>
      </div>

      {/* 4. DEPARTMENT SPRINT VELOCITY & TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <Building2 className="w-4 h-4 text-[#0047AB]" />
              <span>Department Sprint Velocity</span>
            </h2>
            <Link
              href="/dashboard/admin/reports"
              className="text-xs font-bold text-[#0047AB] hover:underline font-sans"
            >
              View Analytics
            </Link>
          </div>

          <div className="space-y-3.5">
            {[
              {
                dept: "Engineering & Dev",
                velocity: "96%",
                members: "12 Members",
                color: "bg-[#0047AB]",
              },
              {
                dept: "Product Design",
                velocity: "92%",
                members: "8 Members",
                color: "bg-indigo-600",
              },
              {
                dept: "Growth & Marketing",
                velocity: "88%",
                members: "7 Members",
                color: "bg-purple-600",
              },
              {
                dept: "Sales & Operations",
                velocity: "94%",
                members: "5 Members",
                color: "bg-emerald-600",
              },
            ].map((d) => (
              <div
                key={d.dept}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-sans"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-900 font-sans">
                    {d.dept}
                  </span>
                  <span className="text-xs font-black text-[#0047AB] font-sans">
                    {d.velocity}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: d.velocity }}
                    className={`${d.color} h-full rounded-full`}
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 block font-sans">
                  {d.members}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <FolderKanban className="w-4 h-4 text-[#0047AB]" />
              <span>Active Org Tasks ({tasks.length})</span>
            </h2>
            <Link
              href="/dashboard/admin/tasks"
              className="text-xs font-bold text-[#0047AB] hover:underline font-sans"
            >
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-sans"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 font-sans">
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-sans ${
                      task.priority === "Urgent"
                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                        : task.priority === "High"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-semibold font-sans">
                  Assignee:{" "}
                  <strong className="text-slate-800 font-sans">
                    {task.assignee}
                  </strong>{" "}
                  ({task.dept})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. RECENT EMPLOYEE ROSTER TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-[#0047AB]" />
            <span>Recent Staff Roster</span>
          </h2>

          <Link
            href="/dashboard/admin/employees"
            className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
          >
            <span>View Full Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <div
              key={emp.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0047AB] text-white flex items-center justify-center font-bold text-xs font-sans">
                  {emp.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900 font-sans">
                    {emp.name}
                  </div>
                  <div className="text-slate-400 font-sans">
                    {emp.email} • {emp.dept}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 font-sans">
                <span className="text-slate-600 font-semibold font-sans">
                  {emp.role}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${
                    emp.status === "Active"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {emp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
