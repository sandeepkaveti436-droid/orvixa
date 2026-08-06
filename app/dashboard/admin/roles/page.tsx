"use client";

import React, { useState } from "react";
import { ShieldCheck, Plus, Check, Lock } from "lucide-react";

export default function RolesPage() {
  const [roles] = useState([
    {
      name: "Super Admin",
      members: 2,
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
      members: 6,
      permissions: [
        "View/Edit Projects",
        "Assign Tasks",
        "Manage Employees",
        "Access Reports",
      ],
    },
    {
      name: "Team Lead",
      members: 8,
      permissions: ["View/Edit Projects", "Assign Tasks", "Access Reports"],
    },
    {
      name: "Employee",
      members: 16,
      permissions: ["View Projects", "Complete Assigned Tasks"],
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>Roles & </span>
          <span className="font-heading italic text-[#0047AB]">
            Permissions (RBAC).
          </span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Configure role-based access control for admins, managers, team leads,
          and employees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div
            key={role.name}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0047AB]" />
                <h3 className="font-bold text-lg text-slate-900">
                  {role.name}
                </h3>
              </div>
              <span className="text-xs font-bold bg-blue-50 text-[#0047AB] px-3 py-1 rounded-full">
                {role.members} Members
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Assigned Permissions
              </span>
              <div className="space-y-1.5">
                {role.permissions.map((perm) => (
                  <div
                    key={perm}
                    className="flex items-center gap-2 text-xs font-semibold text-slate-700"
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
