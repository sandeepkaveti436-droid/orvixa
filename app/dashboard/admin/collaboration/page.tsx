"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Video,
  Share2,
  Send,
  Sparkles,
  CheckCircle2,
  Circle,
} from "lucide-react";

export default function CollaborationPage() {
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ id: number; sender: string; text: string; time: string }>
  >([] as any);
  const [shapes, setShapes] = useState<
    Array<{ id: number; text: string; x: number; y: number; color: string }>
  >([] as any);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatInput.trim()) {
      setMessages([
        ...messages,
        { id: Date.now(), sender: "You", text: chatInput, time: "Just now" },
      ]);
      setChatInput("");
    }
  };

  const handleAddStickyNote = () => {
    setShapes([
      ...shapes,
      {
        id: Date.now(),
        text: "New Note",
        x: 100,
        y: 120,
        color: "bg-emerald-100 border-emerald-300",
      },
    ]);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Real-time </span>
            <span className="font-heading italic text-[#0047AB]">
              Collaboration.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Team chat, video calls, screen sharing, and interactive digital
            whiteboard.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Launching HD Video Call & Screen Share...")}
            className="bg-[#0047AB] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Video className="w-4 h-4" />
            <span>Start Video Call</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: REAL-TIME TEAM CHAT (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0047AB]" />
            <span>Team Thread (#general)</span>
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto p-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1"
              >
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#0047AB]">{m.sender}</span>
                  <span className="text-slate-400 font-mono">{m.time}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{m.text}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex gap-2 pt-2 border-t border-slate-100"
          >
            <input
              type="text"
              placeholder="Type a message or @mention..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
            <button
              type="submit"
              className="bg-[#0047AB] text-white p-2.5 rounded-xl"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* RIGHT: INTERACTIVE DIGITAL WHITEBOARD (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans min-h-[380px] flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#0047AB]" />
              <span>Interactive Whiteboard Canvas</span>
            </h3>

            <button
              onClick={handleAddStickyNote}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              + Add Sticky Note
            </button>
          </div>

          {/* Interactive Canvas Stage */}
          <div className="relative flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-6 min-h-[260px] overflow-hidden">
            {shapes.map((s) => (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border shadow-sm max-w-[200px] text-xs font-bold text-slate-800 ${s.color} absolute cursor-move`}
                style={{ top: s.y, left: s.x }}
              >
                {s.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
