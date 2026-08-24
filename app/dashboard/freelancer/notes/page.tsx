"use client";

import React, { useState } from "react";
import { Pin, Search, Plus, Trash2, Edit3, Tag, X } from "lucide-react";

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [notes, setNotes] = useState([]);

  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    project: "General",
  });

  const togglePin = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.title) {
      setNotes([
        {
          id: `n-${Date.now()}`,
          title: newNote.title,
          content: newNote.content,
          project: newNote.project,
          pinned: false,
          date: "Today",
        },
        ...notes,
      ]);
      setShowModal(false);
      setNewNote({ title: "", content: "", project: "General" });
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Notes & </span>
            <span className="font-heading italic text-[#0047AB]">
              Documentation.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Store client notes, project briefs, and technical specs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search notes or project briefs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-6 rounded-3xl border shadow-sm transition-all space-y-3 flex flex-col justify-between ${
              note.pinned
                ? "bg-blue-50/60 border-blue-200"
                : "bg-white border-slate-200"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-[#0047AB] bg-white border border-blue-200 px-2 py-0.5 rounded">
                  #{note.project}
                </span>
                <button
                  onClick={() => togglePin(note.id)}
                  className="text-slate-400 hover:text-[#0047AB]"
                >
                  <Pin
                    className={`w-4 h-4 ${note.pinned ? "fill-[#0047AB] text-[#0047AB]" : ""}`}
                  />
                </button>
              </div>

              <h3 className="font-bold text-base text-slate-900 mb-2">
                {note.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium whitespace-pre-wrap line-clamp-4 leading-relaxed">
                {note.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 font-bold">
              <span>{note.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD NOTE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Create New Note
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Note Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
              <textarea
                rows={4}
                placeholder="Note content & Markdown supported..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                Save Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
