"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Type,
  Image as ImageIcon,
  MoreHorizontal,
  X,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  FileText,
  Loader2,
  Bold,
  Italic,
  Link as LinkIcon,
  Users, // <-- Added missing import here!
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function TeamsChatPage() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("Employee");
  const [currentOrg, setCurrentOrg] = useState("Organization");

  // Real Database State
  const [channels, setChannels] = useState<any[]>([]);
  const [directMessages, setDirectMessages] = useState<any[]>([]);
  const [activeChannel, setActiveChannel] = useState("#general");
  const [messages, setMessages] = useState<any[]>([]);

  // Input & Formatting State
  const [messageInput, setMessageInput] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Call Simulator State
  const [callStatus, setCallStatus] = useState<
    "idle" | "ringing" | "connected"
  >("idle");
  const [activeCallType, setActiveCallType] = useState<
    "video" | "audio" | null
  >(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // File Attachment State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Real Users & Channels on Load
  useEffect(() => {
    async function loadChatData() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, org_name")
            .eq("id", user.id)
            .single();

          const myName =
            profile?.full_name || user.email?.split("@")[0] || "Employee";
          const myOrg = profile?.org_name || "Workspace";
          setCurrentUser(myName);
          setCurrentOrg(myOrg);

          // Fetch Team Channels
          const { data: teams } = await supabase.from("teams").select("name");
          if (teams && teams.length > 0) {
            setChannels([
              { name: "#general" },
              ...teams.map((t) => ({
                name: `#${t.name.toLowerCase().replace(/\s+/g, "-")}`,
              })),
            ]);
          } else {
            setChannels([
              { name: "#general" },
              { name: "#engineering" },
              { name: "#design" },
            ]);
          }

          // Fetch Coworkers for Direct Messages
          const { data: coworkers } = await supabase
            .from("profiles")
            .select("full_name, role")
            .neq("id", user.id)
            .limit(10);

          if (coworkers) setDirectMessages(coworkers);
        }
      } catch (err) {
        console.error("Error loading chat data");
      } finally {
        setLoading(false);
      }
    }
    loadChatData();
  }, []);

  // 2. Fetch Messages when Channel Changes
  useEffect(() => {
    async function fetchMessages() {
      if (!activeChannel) return;
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("recipient_name", activeChannel)
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
      scrollToBottom();
    }
    fetchMessages();
  }, [activeChannel]);

  // Handle Call Timer & Ringing state
  useEffect(() => {
    let interval: any = null;
    if (callStatus === "ringing") {
      // Ring for 3 seconds then connect
      const ringTimer = setTimeout(() => setCallStatus("connected"), 3000);
      return () => clearTimeout(ringTimer);
    } else if (callStatus === "connected") {
      interval = setInterval(() => setCallDuration((s) => s + 1), 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  // 3. Send Message to Real Database
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() || attachedFile) {
      let formattedMessage = messageInput;
      if (isBold && isItalic) formattedMessage = `***${messageInput}***`;
      else if (isBold) formattedMessage = `**${messageInput}**`;
      else if (isItalic) formattedMessage = `*${messageInput}*`;

      const newMessage = {
        sender_name: currentUser,
        recipient_name: activeChannel,
        message: formattedMessage,
        file_name: attachedFile ? attachedFile.name : null,
      };

      // Optimistic UI update
      setMessages([
        ...messages,
        { ...newMessage, id: Date.now(), created_at: new Date().toISOString() },
      ]);
      setMessageInput("");
      setAttachedFile(null);
      setIsBold(false);
      setIsItalic(false);
      scrollToBottom();

      try {
        await supabase.from("chat_messages").insert([newMessage]);
      } catch (err) {
        console.error("Failed to save message");
      }
    }
  };

  const startCall = (type: "video" | "audio") => {
    setActiveCallType(type);
    setCallStatus("ringing");
    setIsVideoOff(type === "audio");
  };

  const endCall = () => {
    setCallStatus("idle");
    setActiveCallType(null);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center font-bold text-slate-500 font-sans bg-white rounded-3xl border border-slate-200">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Syncing Real-Time Chat Data...</span>
      </div>
    );
  }

  const isGroupCall = activeChannel.startsWith("#");

  return (
    <div className="relative font-sans h-[calc(100vh-140px)]">
      {/* ================= CALL OVERLAY ================= */}
      {callStatus !== "idle" && (
        <div className="absolute inset-0 z-50 bg-slate-900 rounded-3xl overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
          <div className="flex-1 flex flex-col items-center justify-center text-white space-y-4">
            {/* Avatar Profile during call */}
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center text-4xl font-black shadow-lg ring-4 ring-white/10 ${isGroupCall ? "bg-indigo-600" : "bg-[#0047AB]"}`}
            >
              {isGroupCall ? (
                <Users className="w-12 h-12 text-white" />
              ) : (
                activeChannel.substring(0, 2).toUpperCase()
              )}
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-black">
                {isGroupCall
                  ? `Group Meeting: ${activeChannel}`
                  : activeChannel}
              </h2>
              <p className="text-slate-400 font-mono mt-2 text-sm">
                {callStatus === "ringing"
                  ? "Ringing..."
                  : formatCallTime(callDuration)}
              </p>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="bg-slate-800/80 backdrop-blur-md p-6 flex items-center justify-center gap-6 pb-10">
            {activeCallType === "video" && (
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-5 rounded-full transition-all ${isVideoOff ? "bg-slate-700" : "bg-slate-600 hover:bg-slate-500"}`}
              >
                {isVideoOff ? (
                  <VideoOff className="w-6 h-6 text-white" />
                ) : (
                  <Video className="w-6 h-6 text-white" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-5 rounded-full transition-all ${isMuted ? "bg-slate-700" : "bg-slate-600 hover:bg-slate-500"}`}
            >
              {isMuted ? (
                <MicOff className="w-6 h-6 text-white" />
              ) : (
                <Mic className="w-6 h-6 text-white" />
              )}
            </button>
            <button
              onClick={endCall}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/30"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ================= MAIN CHAT UI ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col md:flex-row">
        {/* CHAT LEFT SIDEBAR */}
        <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col shrink-0 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 font-sans">
                <MessageSquare className="w-4 h-4 text-[#0047AB]" />
                <span>Teams Chat</span>
              </h2>
            </div>

            {/* Channels (Live from DB) */}
            <div className="space-y-1.5 font-sans">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Channels
              </span>
              {channels.map((ch) => (
                <button
                  key={ch.name}
                  onClick={() => setActiveChannel(ch.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeChannel === ch.name
                      ? "bg-[#0047AB] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-200/60"
                  }`}
                >
                  <span>{ch.name}</span>
                </button>
              ))}
            </div>

            {/* Direct Messages (Live from DB) */}
            <div className="space-y-1.5 font-sans">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
                Direct Messages
              </span>
              {directMessages.length > 0 ? (
                directMessages.map((dm) => (
                  <button
                    key={dm.full_name}
                    onClick={() => setActiveChannel(dm.full_name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      activeChannel === dm.full_name
                        ? "bg-[#0047AB] text-white shadow-sm"
                        : "text-slate-700 hover:bg-slate-200/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full bg-emerald-500`} />
                      <span className="line-clamp-1">{dm.full_name}</span>
                    </div>
                  </button>
                ))
              ) : (
                <span className="text-[10px] text-slate-400 px-2 font-semibold">
                  No other members found.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CHAT MESSAGING STAGE */}
        <div className="flex-1 flex flex-col bg-white font-sans">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between font-sans bg-white z-10 shadow-sm">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {activeChannel}
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">
                {currentOrg} Workspace
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => startCall("video")}
                className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded-xl transition-all"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                onClick={() => startCall("audio")}
                className="p-2 text-slate-500 hover:text-[#0047AB] hover:bg-blue-50 rounded-xl transition-all"
                title="Audio Call"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 font-sans bg-slate-50/30">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender_name === currentUser ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-slate-400">
                    <span>
                      {msg.sender_name === currentUser
                        ? "You"
                        : msg.sender_name}
                    </span>
                    <span>
                      •{" "}
                      {new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-xs font-semibold max-w-md ${
                      msg.sender_name === currentUser
                        ? "bg-[#0047AB] text-white rounded-br-none shadow-sm"
                        : "bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p
                      className={
                        msg.message.startsWith("***")
                          ? "font-bold italic"
                          : msg.message.startsWith("**")
                            ? "font-bold"
                            : msg.message.startsWith("*")
                              ? "italic"
                              : ""
                      }
                    >
                      {msg.message.replace(/\*/g, "")}
                    </p>

                    {/* File Attachment Render */}
                    {msg.file_name && (
                      <div
                        className={`mt-2 p-2 rounded-xl flex items-center gap-2 border ${msg.sender_name === currentUser ? "bg-white/20 border-white/30 text-white" : "bg-slate-50 border-slate-200 text-[#0047AB]"}`}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-[10px] underline cursor-pointer">
                          {msg.file_name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                Start a conversation in {activeChannel}...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ================= MS TEAMS STYLE INPUT BAR ================= */}
          <div className="p-4 sm:p-6 pt-0 bg-white">
            <div className="border border-slate-300 rounded-2xl bg-white shadow-sm flex flex-col overflow-hidden focus-within:border-[#0047AB] focus-within:ring-1 focus-within:ring-[#0047AB]/20 transition-all font-sans">
              {/* File Attachment Preview */}
              {attachedFile && (
                <div className="px-4 pt-3 flex items-center gap-2">
                  <div className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-[11px] font-bold">
                    {attachedFile.type.includes("image") ? (
                      <ImageIcon className="w-3.5 h-3.5 text-[#0047AB]" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#0047AB]" />
                    )}
                    <span>{attachedFile.name}</span>
                    <button
                      onClick={() => setAttachedFile(null)}
                      className="ml-1 text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Text Input */}
              <div className="px-4 py-3">
                <input
                  type="text"
                  placeholder={`Type a new message in ${activeChannel}`}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className={`w-full text-xs text-slate-900 focus:outline-none bg-transparent ${isBold ? "font-bold" : "font-semibold"} ${isItalic ? "italic" : ""}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage(e);
                  }}
                />
              </div>

              {/* Formatting Toolbar */}
              <div className="flex justify-between items-center px-2 py-2 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-1">
                  {/* Format: Bold */}
                  <button
                    onClick={() => setIsBold(!isBold)}
                    type="button"
                    className={`p-1.5 rounded-lg transition-colors ${isBold ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"}`}
                  >
                    <Bold className="w-4 h-4" />
                  </button>

                  {/* Format: Italic */}
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    type="button"
                    className={`p-1.5 rounded-lg transition-colors ${isItalic ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700 hover:bg-slate-200"}`}
                  >
                    <Italic className="w-4 h-4" />
                  </button>

                  <div className="w-px h-4 bg-slate-300 mx-1" />

                  {/* Attach File */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Attach Document"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  {/* Attach Image */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Attach Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => alert("Emoji picker opened")}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setMessageInput((prev) => prev + " https://");
                    }}
                    type="button"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                    title="Insert Link"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() && !attachedFile}
                  className="bg-[#0047AB] hover:bg-[#003680] disabled:opacity-50 disabled:hover:bg-[#0047AB] text-white p-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
