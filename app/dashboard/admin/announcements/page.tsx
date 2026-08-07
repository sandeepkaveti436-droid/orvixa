"use client";

import React, { useState, useEffect } from "react";
import { Megaphone, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRealAnnouncements() {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setAnnouncements(data);
      } catch (e) {
        console.log("Loading announcements...");
      } finally {
        setLoading(false);
      }
    }
    fetchRealAnnouncements();
  }, []);

  if (loading)
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Announcements...</span>
      </div>
    );

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            Company Announcements
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Broadcast organization-wide notices and updates.
          </p>
        </div>
        <button className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center gap-2 font-sans">
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="space-y-4 font-sans">
        {announcements.length > 0 ? (
          announcements.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 font-sans"
            >
              <div className="flex justify-between items-center font-sans">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 font-sans">
                  <Megaphone className="w-4 h-4 text-[#0047AB]" />
                  <span>{a.title}</span>
                </h3>
                <span className="text-xs text-slate-400 font-semibold font-sans">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">
                {a.body}
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-bold font-sans">
                Posted by: {a.author}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 font-sans">
            <p className="text-xs font-bold">No announcements posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
