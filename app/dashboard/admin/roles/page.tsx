"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RolesPage() {
  const [loading, setLoading] = useState(true);
  const [roleStats, setRoleStats] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealRoles() {
      try {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("role");
        const profList = profiles || [];

        const counts = {
          "Super Admin": profList.filter(
            (p) => p.role === "organization" || p.role === "admin",
          ).length,
          Manager: profList.filter((p) => p.role === "manager").length,
          "Team Lead": profList.filter((p) => p.role === "team_lead").length,
          Employee: profList.filter((p) => p.role === "employee").length,
        };

        setRoleStats([
          {
            name: "Super Admin",
            members: counts["Super Admin"],
            permissions: [
              "View/Edit Projects",
              "Assign Tasks",
              "Manage Employees",
              "Access Reports",
              "Billing Access",
            ],
          },
          {
            name: "Manager",
            members: counts["Manager"],
            permissions: [
              "View/Edit Projects",
              "Assign Tasks",
              "Manage Employees",
              "Access Reports",
            ],
          },
          {
            name: "Team Lead",
            members: counts["Team Lead"],
            permissions: ["View Projects", "Assign Tasks", "Access Reports"],
          },
          {
            name: "Employee",
            members: counts["Employee"],
            permissions: ["View Projects", "Complete Assigned Tasks"],
          },
        ]);
      } catch (err) {
        console.error("Error loading roles");
      } finally {
        setLoading(false);
      }
    }
    fetchRealRoles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF] mr-2" />
        <span>Loading Real RBAC Data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          Roles & Permissions (RBAC)
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Configure role-based access control for admins, managers, team leads,
          and employees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
        {roleStats.map((role) => (
          <div
            key={role.name}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-2.5 font-sans">
                <ShieldCheck className="w-5 h-5 text-[#9D00FF]" />
                <h3 className="font-bold text-lg text-slate-900 font-sans">
                  {role.name}
                </h3>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-[#9D00FF] px-3 py-1 rounded-full font-sans">
                {role.members} Members
              </span>
            </div>

            <div className="space-y-2 font-sans">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">
                Assigned Permissions
              </span>
              <div className="space-y-1.5 font-sans">
                {role.permissions.map((perm: string) => (
                  <div
                    key={perm}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700 font-sans"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
