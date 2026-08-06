"use client";

import React, { useState } from "react";
import { Megaphone, Plus, MessageSquare, Send } from "lucide-react";

export default function AnnouncementsPage() {
  const [announcements] = useState([
    {
      id: 1,
      title: "Q3 Company All-Hands Meeting Scheduled",
      author: "Alex Mercer (Super Admin)",
      date: "Today",
      text: "Join us this Friday at 10:00 AM EST for our Q3 product roadmap and sprint velocity review.",
    },
    {
      id: 2,
      title: "New SOC2 Security Protocols Active",
      author: "DevOps Team",
      date: "Yesterday",
      text: "All employee accounts must enable hardware passkey or SSO multi-factor authentication.",
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Company </span>
            <span className="font-heading italic text-[#0047AB]">
              Announcements.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Broadcast organization-wide notices and departmental updates.
          </p>
        </div>

        <button className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#0047AB]" />
                <span>{a.title}</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {a.date}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              {a.text}
            </p>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-bold">
              Posted by: {a.author}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
