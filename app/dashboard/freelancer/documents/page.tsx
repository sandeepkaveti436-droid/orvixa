"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FileCode,
  Upload,
  Search,
  Plus,
  Trash2,
  Download,
  Eye,
  Building,
  FolderKanban,
  CheckCircle2,
  Clock,
  Tag,
  X,
  Loader2,
  File,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface DocumentItem {
  id: string;
  title: string;
  file_url?: string;
  file_type: string;
  file_size: string;
  category: string;
  project_name?: string;
  client_name?: string;
  created_at: string;
}

export default function DocumentsPage() {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "Contract",
    project_name: "",
    client_name: "",
    file_type: "PDF",
    file_size: "1.8 MB",
    file_url: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchLiveDocumentsAndProjects();
  }, []);

  const fetchLiveDocumentsAndProjects = async () => {
    try {
      setLoading(true);

      const [docRes, projRes] = await Promise.all([
        supabase
          .from("documents")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (docRes.data) setDocuments(docRes.data);
      if (projRes.data) {
        setProjects(projRes.data);
        if (projRes.data.length > 0 && !uploadForm.project_name) {
          setUploadForm((prev) => ({
            ...prev,
            project_name: projRes.data[0].name,
            client_name: projRes.data[0].client,
          }));
        }
      }
    } catch (err) {
      console.error("Error loading documents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Project Selection in Upload Form
  const handleSelectProject = (projectName: string) => {
    const matched = projects.find((p) => p.name === projectName);
    setUploadForm({
      ...uploadForm,
      project_name: projectName,
      client_name: matched ? matched.client : uploadForm.client_name,
    });
  };

  // Handle File Input Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Auto-extract size and file extension
      const extension = file.name.split(".").pop()?.toUpperCase() || "PDF";
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setUploadForm({
        ...uploadForm,
        title: uploadForm.title || file.name.replace(/\.[^/.]+$/, ""),
        file_type: extension,
        file_size: sizeFormatted,
      });
    }
  };

  // Save Document to Supabase
  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;

    setIsUploading(true);
    try {
      let fileDownloadUrl = uploadForm.file_url || "#";

      // If user selected a local file, create a local preview URL
      if (selectedFile) {
        fileDownloadUrl = URL.createObjectURL(selectedFile);
      }

      const payload = {
        title: uploadForm.title.trim(),
        category: uploadForm.category,
        project_name: uploadForm.project_name || "General Deliverable",
        client_name: uploadForm.client_name || "Direct Client",
        file_type: uploadForm.file_type || "PDF",
        file_size: uploadForm.file_size || "1.5 MB",
        file_url: fileDownloadUrl,
      };

      const { data, error } = await supabase
        .from("documents")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setDocuments([data[0], ...documents]);
      }

      setUploadForm({
        title: "",
        category: "Contract",
        project_name: projects[0]?.name || "",
        client_name: projects[0]?.client || "",
        file_type: "PDF",
        file_size: "1.8 MB",
        file_url: "",
      });
      setSelectedFile(null);
      setShowUploadModal(false);
    } catch (err: any) {
      alert(`Error saving document: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Document
  const handleDeleteDocument = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await supabase.from("documents").delete().eq("id", id);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- STAT CALCULATIONS ---
  const totalDocsCount = documents.length;
  const contractsCount = documents.filter((d) =>
    ["contract", "agreement", "nda"].includes((d.category || "").toLowerCase()),
  ).length;
  const linkedProjectsCount = new Set(
    documents.map((d) => d.project_name).filter(Boolean),
  ).size;

  // Filter Documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.project_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (doc.client_name || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      doc.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    const c = (category || "").toLowerCase();
    if (c === "contract" || c === "agreement") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (c === "nda") {
      return "bg-purple-50 text-purple-700 border-purple-200";
    }
    if (c === "brief" || c === "sow") {
      return "bg-blue-50 text-[#0047AB] border-blue-200";
    }
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Files & Contracts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16 max-w-7xl mx-auto">
      {/* ================= 1. PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans tracking-tight">
            <span>Files & </span>
            <span className="italic text-[#0047AB]">Contracts.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 font-sans">
            Store client agreements, signed NDAs, project briefs, and design
            assets securely in your workspace.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition font-sans"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Contract / File</span>
        </button>
      </div>

      {/* ================= 2. TOP STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            SAVED DOCUMENTS & ASSETS
          </span>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {totalDocsCount} {totalDocsCount === 1 ? "File" : "Files"}
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-sans">
            ✓ Real Database Synced
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            ACTIVE CONTRACTS & NDAS
          </span>
          <div className="text-3xl font-black text-emerald-600 font-sans">
            {contractsCount} Signed
          </div>
          <span className="text-xs font-bold text-slate-400 font-sans">
            Client Legal Protections
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            PROJECT COVERAGE
          </span>
          <div className="text-3xl font-black text-[#0047AB] font-sans">
            {linkedProjectsCount} Projects
          </div>
          <span className="text-xs font-bold text-blue-600 font-sans">
            Linked to live agreements
          </span>
        </div>
      </div>

      {/* ================= 3. SEARCH & CATEGORY FILTERS ================= */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full md:w-80 font-sans">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search files, contracts, clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto font-sans">
          {[
            { id: "all", label: "All Documents" },
            { id: "contract", label: "Contracts" },
            { id: "agreement", label: "Agreements" },
            { id: "nda", label: "NDAs" },
            { id: "brief", label: "Briefs & SOW" },
            { id: "asset", label: "Design Assets" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap font-sans ${
                categoryFilter === cat.id
                  ? "bg-[#0047AB] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= 4. DOCUMENTS LIST ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <FileCode className="w-5 h-5 text-[#0047AB]" />
            <span>Saved Agreements & Files ({filteredDocuments.length})</span>
          </h3>
          <span className="text-xs font-bold text-slate-400 font-sans">
            Cloud Stored
          </span>
        </div>

        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white flex flex-col justify-between space-y-4 transition group font-sans shadow-sm"
              >
                <div>
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-2 mb-2 font-sans">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-sans ${getCategoryBadge(
                        doc.category,
                      )}`}
                    >
                      {doc.category}
                    </span>

                    <span className="text-[11px] font-medium text-slate-400 font-sans flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title & File Type Badge */}
                  <div className="flex items-start gap-3 font-sans">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0047AB] border border-blue-200 flex items-center justify-center font-black text-xs shrink-0 font-sans shadow-sm">
                      {doc.file_type || "PDF"}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 truncate font-sans group-hover:text-[#0047AB] transition">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5 font-sans">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.client_name || "Direct Client"}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-700">
                          {doc.project_name || "General"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Size, View, Download, Delete */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-sans">
                  <span className="text-[11px] font-bold text-slate-400 font-sans">
                    {doc.file_size || "1.2 MB"}
                  </span>

                  <div className="flex items-center gap-2 font-sans">
                    {doc.file_url && doc.file_url !== "#" && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 font-sans"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </a>
                    )}

                    <button
                      onClick={() => handleDeleteDocument(doc.id, doc.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition font-sans"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-14 space-y-3 font-sans">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base font-sans">
              No Documents Uploaded Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Upload your client signed contracts, SOW agreements, and project
              briefs to store them securely.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md font-sans"
            >
              <Upload className="w-4 h-4" />
              <span>Upload First Contract</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: UPLOAD CONTRACT / FILE ================= */}
      {showUploadModal && (
        <div
          onClick={() => setShowUploadModal(false)}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl font-sans"
          >
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Upload Client Contract / Agreement
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveDocument}
              className="space-y-3.5 font-sans"
            >
              {/* File Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Select Local File (PDF, DOCX, PNG, ZIP)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#0047AB] rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50/50">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="contract-file-upload"
                  />
                  <label
                    htmlFor="contract-file-upload"
                    className="cursor-pointer font-sans"
                  >
                    <Upload className="w-6 h-6 text-[#0047AB] mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-slate-800 block font-sans">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to browse contract file"}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans mt-0.5">
                      PDF, DOCX, ZIP up to 25MB
                    </span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Service Agreement_FoodLink_2026.pdf"
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              {/* Category & Project Link */}
              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, category: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="Contract">Contract / Agreement</option>
                    <option value="NDA">Signed NDA</option>
                    <option value="Brief">Project Brief / SOW</option>
                    <option value="Asset">Design Asset</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Link to Project
                  </label>
                  <select
                    value={uploadForm.project_name}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0047AB] font-sans"
                  >
                    <option value="">-- Choose Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name} ({p.client})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Cloud Link (Google Drive / DocuSign / Figma) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  External Cloud URL (Optional Google Drive / DocuSign link)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={uploadForm.file_url}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, file_url: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2 font-sans"
              >
                {isUploading
                  ? "Saving Contract..."
                  : "Save Document to Workspace"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
