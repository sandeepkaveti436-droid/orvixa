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
  const [notifications, setNotifications] = useState<
    Array<{
      id: number;
      type: string;
      title: string;
      message: string;
      time: string;
      read: boolean;
      icon: any;
      color: string;
    }>
  >([] as any);

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
            <span className="font-heading italic text-[#9D00FF]">Center.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Task reminders, deadline alerts, invoice payments, and AI
            suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="bg-white border border-slate-300 hover:border-[#9D00FF] text-slate-800 text-xs font-bold px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-[#9D00FF]" />
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
                ? "bg-[#9D00FF] text-white shadow-sm"
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
                        <span className="w-2 h-2 rounded-full bg-[#9D00FF]" />
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
