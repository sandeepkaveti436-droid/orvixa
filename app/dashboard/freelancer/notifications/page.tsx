"use client";

import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  Info,
  Check,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "ai",
      title: "✨ AI Invoice Auto-Drafted",
      message:
        "Orvixa AI prepared Invoice #INV-1045 for 12 billable hours with Acme Corp.",
      time: "10 mins ago",
      read: false,
      icon: Sparkles,
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      id: 2,
      title: "Deadline Alert: Stripe API Sandbox",
      type: "deadline",
      message: "Sprint deadline for FinTech Labs is due in 24 hours.",
      time: "1 hour ago",
      read: false,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      id: 3,
      title: "Invoice #1042 Paid ($4,850.00)",
      type: "invoice",
      message: "Acme Global Inc. remitted payment via Stripe integration.",
      time: "3 hours ago",
      read: true,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: 4,
      title: "Task Reminder: Figma Design Tokens",
      type: "task",
      message: "You have 2 pending tasks due tomorrow on Acme iOS App.",
      time: "Yesterday",
      read: true,
      icon: CheckCircle2,
      color: "bg-blue-50 text-[#0047AB] border-blue-200",
    },
    {
      id: 5,
      title: "System Update v2.4 Active",
      type: "system",
      message: "Next.js 15 & Supabase real-time sync upgrade completed.",
      time: "2 days ago",
      read: true,
      icon: Info,
      color: "bg-slate-100 text-slate-600 border-slate-200",
    },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter !== "all") return n.type === filter;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Notifications </span>
            <span className="font-heading italic text-[#0047AB]">Center.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Task reminders, deadline alerts, invoice payments, and AI
            suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="bg-white border border-slate-300 hover:border-[#0047AB] text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-[#0047AB]" />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={clearAll}
            className="bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            title="Clear All Notifications"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2 text-xs font-bold text-slate-700">
        {[
          { id: "all", label: "All Alerts" },
          { id: "unread", label: "Unread Only" },
          { id: "task", label: "Task Reminders" },
          { id: "deadline", label: "Deadlines" },
          { id: "invoice", label: "Invoices" },
          { id: "ai", label: "AI Suggestions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              filter === tab.id
                ? "bg-[#0047AB] text-white shadow-sm"
                : "hover:bg-slate-100 text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100 font-sans">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((n) => {
            const IconComp = n.icon;
            return (
              <div
                key={n.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? "bg-blue-50/30" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 font-bold ${n.color}`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#0047AB]" />
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">
                      {n.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-400 text-xs font-semibold">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
