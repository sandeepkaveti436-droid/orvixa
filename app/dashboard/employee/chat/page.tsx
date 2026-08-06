"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Search,
  Phone,
  Video,
  MoreVertical,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function TeamsChatPage() {
  const [activeChannel, setActiveChannel] = useState("#engineering");
  const [messageInput, setMessageInput] = useState("");

  const [channels] = useState([
    { name: "#general", unread: 0 },
    { name: "#engineering", unread: 2 },
    { name: "#sprint-14-release", unread: 1 },
    { name: "#design-sync", unread: 0 },
  ]);

  const [directMessages] = useState([
    {
      name: "Alex Mercer",
      role: "Engineering Lead",
      status: "Online",
      unread: 1,
    },
    {
      name: "Sarah Jenkins",
      role: "Product Designer",
      status: "In Deep Work",
      unread: 0,
    },
    {
      name: "Priya Sharma",
      role: "Marketing Lead",
      status: "Offline",
      unread: 0,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex Mercer",
      text: "Team, sprint #14 deployment is scheduled for 4 PM today.",
      time: "10:30 AM",
    },
    {
      id: 2,
      sender: "Sarah Jenkins",
      text: "Figma design tokens and accordion component files are merged!",
      time: "10:35 AM",
    },
    {
      id: 3,
      sender: "You",
      text: "I'm wrapping up the PR review now. All unit tests passing.",
      time: "10:40 AM",
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), sender: "You", text: messageInput, time: "Just now" },
      ]);
      setMessageInput("");
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] flex flex-col md:flex-row font-sans">
      {/* CHAT LEFT SIDEBAR (Channels & Direct Messages) */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 font-sans">
        <div className="space-y-6 font-sans">
          {/* Header */}
          <div className="flex items-center justify-between font-sans">
            <h2 className="font-sans text-sm font-black text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0047AB]" />
              <span>Teams Chat</span>
            </h2>
          </div>

          {/* Channels List */}
          <div className="space-y-2 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
              Channels
            </span>
            {channels.map((ch) => (
              <button
                key={ch.name}
                onClick={() => setActiveChannel(ch.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all font-sans ${
                  activeChannel === ch.name
                    ? "bg-[#0047AB] text-white shadow-sm font-sans"
                    : "text-slate-700 hover:bg-slate-200/60 font-sans"
                }`}
              >
                <span>{ch.name}</span>
                {ch.unread > 0 && activeChannel !== ch.name && (
                  <span className="text-[10px] bg-rose-500 text-white font-extrabold px-1.5 py-0.2 rounded-full font-sans">
                    {ch.unread}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Direct Messages List */}
          <div className="space-y-2 font-sans">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
              Direct Messages
            </span>
            {directMessages.map((dm) => (
              <button
                key={dm.name}
                onClick={() => setActiveChannel(dm.name)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all font-sans ${
                  activeChannel === dm.name
                    ? "bg-[#0047AB] text-white shadow-sm font-sans"
                    : "text-slate-700 hover:bg-slate-200/60 font-sans"
                }`}
              >
                <div className="flex items-center gap-2 font-sans">
                  <span
                    className={`w-2 h-2 rounded-full ${dm.status === "Online" ? "bg-emerald-500" : "bg-slate-300"}`}
                  />
                  <span className="line-clamp-1 font-sans">{dm.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHAT MAIN MESSAGING STAGE */}
      <div className="flex-1 flex flex-col justify-between bg-white font-sans">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between font-sans">
          <div>
            <h3 className="font-bold text-base text-slate-900 font-sans">
              {activeChannel}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold font-sans">
              32 Members Active • Orvixa Workspace
            </p>
          </div>

          <div className="flex items-center gap-2 font-sans">
            <button
              onClick={() => alert("Starting HD Video Call...")}
              className="p-2 text-slate-500 hover:text-[#0047AB] rounded-xl hover:bg-slate-100"
            >
              <Video className="w-4 h-4" />
            </button>
            <button
              onClick={() => alert("Starting Voice Call...")}
              className="p-2 text-slate-500 hover:text-[#0047AB] rounded-xl hover:bg-slate-100"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-sans">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "You" ? "items-end" : "items-start"} font-sans`}
            >
              <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-slate-400 font-sans">
                <span>{msg.sender}</span>
                <span>• {msg.time}</span>
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs font-semibold max-w-md font-sans ${
                  msg.sender === "You"
                    ? "bg-[#0047AB] text-white rounded-br-none shadow-sm font-sans"
                    : "bg-slate-100 text-slate-800 rounded-bl-none font-sans"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-slate-100 flex items-center gap-2 font-sans"
        >
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            type="text"
            placeholder={`Message ${activeChannel}...`}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
          <button
            type="submit"
            className="bg-[#0047AB] hover:bg-[#003680] text-white p-2.5 rounded-xl shadow-md transition-all font-sans"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
