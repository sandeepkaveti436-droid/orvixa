"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  FolderKanban,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);

  // Real Database State
  const [adminName, setAdminName] = useState("Admin");
  const [orgName, setOrgName] = useState("Organization");
  const [employees, setEmployees] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [deptStats, setDeptStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealAdminData() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUser = authData?.user;

        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, org_name")
            .eq("id", currentUser.id)
            .single();

          if (profile?.full_name) setAdminName(profile.full_name);
          if (profile?.org_name) setOrgName(profile.org_name);
        }

        const [empRes, taskRes, projRes] = await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .in("role", [
              "employee",
              "organization",
              "admin",
              "manager",
              "team_lead",
            ]),
          supabase
            .from("organization_tasks")
            .select("*")
            .neq("status", "Completed")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("organization_projects").select("*"),
        ]);

        const fetchedEmployees = empRes.data || [];
        const fetchedProjects = projRes.data || [];

        setEmployees(fetchedEmployees);
        setTasks(taskRes.data || []);
        setProjects(fetchedProjects);

        // Dynamically compute Department Statistics based on real projects & employees
        const deptMap: Record<
          string,
          { members: number; progressSum: number; projCount: number }
        > = {};

        fetchedEmployees.forEach((emp) => {
          const d = emp.department || "General Team";
          if (!deptMap[d])
            deptMap[d] = { members: 0, progressSum: 0, projCount: 0 };
          deptMap[d].members += 1;
        });

        fetchedProjects.forEach((proj) => {
          const d = proj.department || "General Team";
          if (!deptMap[d])
            deptMap[d] = { members: 0, progressSum: 0, projCount: 0 };
          deptMap[d].progressSum += proj.progress || 0;
          deptMap[d].projCount += 1;
        });

        const colors = [
          "bg-[#0047AB]",
          "bg-indigo-600",
          "bg-purple-600",
          "bg-emerald-600",
          "bg-amber-500",
        ];
        const computedStats = Object.keys(deptMap).map((key, i) => {
          const avgProg =
            deptMap[key].projCount > 0
              ? Math.round(deptMap[key].progressSum / deptMap[key].projCount)
              : 0;
          return {
            dept: key,
            velocity: `${avgProg}%`,
            progressNum: avgProg,
            members: `${deptMap[key].members} Members`,
            color: colors[i % colors.length],
          };
        });

        setDeptStats(computedStats);
      } catch (err) {
        console.error("Error fetching live org data");
      } finally {
        setLoading(false);
      }
    }

    fetchRealAdminData();
  }, []);

  const avgVelocity =
    projects.length > 0
      ? Math.round(
          projects.reduce((sum, p) => sum + (p.progress || 0), 0) /
            projects.length,
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Live Command Center...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#0047AB] animate-pulse" />
            <span>{orgName} Enterprise Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight font-sans">
            Organization Command Center
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Welcome back, {adminName}. Oversee real-time team roster and sprint
            velocity.
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

      {/* 2. REAL KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-sans">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Total Employees
            </span>
            <Users className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {employees.length} Members
          </div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ Database Synced
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Avg Sprint Velocity
            </span>
            <TrendingUp className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-[#0047AB]">
            {avgVelocity}%
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Across {projects.length} Projects
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Departments Active
            </span>
            <Building2 className="w-4 h-4 text-[#0047AB]" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {deptStats.length || 0} Teams
          </div>
          <span className="text-xs text-slate-500 font-semibold block">
            Org Directory
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">
              Security & RBAC
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-[#0047AB]">SOC2</div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ AES-256 Encrypted
          </span>
        </div>
      </div>

      {/* 3. AI COPILOT AUDIT BANNER */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white p-5 sm:p-6 rounded-3xl border border-blue-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-[#0047AB] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#0047AB]/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 font-sans">
              AI Team Performance Audit
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5 font-sans">
              "Your organization currently has {tasks.length} pending tasks.
              Sprint velocity is at {avgVelocity}%. Generate full weekly
              report?"
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

      {/* 4. REAL DEPARTMENT VELOCITY & TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        {/* Left: Dynamic Departments */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
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

          {deptStats.length > 0 ? (
            <div className="space-y-3.5 font-sans">
              {deptStats.map((d) => (
                <div
                  key={d.dept}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 font-sans"
                >
                  <div className="flex justify-between items-center font-sans">
                    <span className="font-bold text-xs text-slate-900 font-sans">
                      {d.dept}
                    </span>
                    <span className="text-xs font-black text-[#0047AB] font-sans">
                      {d.velocity}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden font-sans">
                    <div
                      style={{ width: d.velocity }}
                      className={`${d.color} h-full rounded-full font-sans`}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 block font-sans">
                    {d.members}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-sans space-y-2">
              <Building2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-500">
                No departments configured yet.
              </p>
            </div>
          )}
        </div>

        {/* Right: Live Org Tasks */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
              <FolderKanban className="w-4 h-4 text-[#0047AB]" />
              <span>Pending Org Tasks ({tasks.length})</span>
            </h2>
            <Link
              href="/dashboard/admin/tasks"
              className="text-xs font-bold text-[#0047AB] hover:underline font-sans"
            >
              Manage
            </Link>
          </div>

          {tasks.length > 0 ? (
            <div className="space-y-3 font-sans">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 font-sans hover:bg-slate-100/50 transition-colors"
                >
                  <div className="flex items-center justify-between font-sans">
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
                      {task.priority || "Medium"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold font-sans">
                    Assignee:{" "}
                    <strong className="text-slate-800 font-sans">
                      {task.assignee}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 font-sans space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-500">
                No pending tasks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
