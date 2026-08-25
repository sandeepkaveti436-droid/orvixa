"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  MapPin,
  FolderKanban,
  FileText,
  IndianRupee,
  Loader2,
  Trash2,
  X,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ClientProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  projectsCount: number;
  totalBudget: number;
  status: string;
  projects: any[];
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // New Client Form
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "+91-XXXXXXXXXX",
    location: "Hyderabad",
  });

  useEffect(() => {
    fetchLiveClientsAndProjects();
  }, []);

  const fetchLiveClientsAndProjects = async () => {
    try {
      setLoading(true);

      // 1. Fetch real projects
      const { data: projectsData, error: projError } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      // 2. Fetch explicit clients table (if any)
      let dbClients: any[] = [];
      try {
        const { data: clientTableData } = await supabase
          .from("clients")
          .select("*");
        if (clientTableData) dbClients = clientTableData;
      } catch (e) {
        // Ignored if clients table not yet created
      }

      const allProjects = projectsData || [];

      // Extract unique client names from both projects and clients table
      const uniqueNames = Array.from(
        new Set([
          ...allProjects.map((p) => (p.client || "").trim()),
          ...dbClients.map((c) => (c.name || "").trim()),
        ]),
      ).filter(Boolean);

      // Construct live rich client profiles
      const aggregatedClients: ClientProfile[] = uniqueNames.map(
        (clientName, index) => {
          const clientProjects = allProjects.filter(
            (p) => (p.client || "").toLowerCase() === clientName.toLowerCase(),
          );
          const matchingDbClient = dbClients.find(
            (c) => (c.name || "").toLowerCase() === clientName.toLowerCase(),
          );

          const totalBudget = clientProjects.reduce(
            (sum, p) => sum + (Number(p.budget) || 0),
            0,
          );

          const hasHold = clientProjects.some((p) =>
            (p.status || "").toLowerCase().includes("hold"),
          );
          const allCompleted =
            clientProjects.length > 0 &&
            clientProjects.every(
              (p) => (p.status || "").toLowerCase() === "completed",
            );

          let status = "Active";
          if (hasHold) status = "On Hold";
          else if (allCompleted) status = "Completed";

          return {
            id: matchingDbClient?.id || `client-${index}`,
            name: clientName,
            email:
              matchingDbClient?.email ||
              `${clientName.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
            phone: matchingDbClient?.phone || "+91-XXXXXXXXXX",
            location: matchingDbClient?.location || "Hyderabad, India",
            projectsCount: clientProjects.length,
            totalBudget,
            status,
            projects: clientProjects,
          };
        },
      );

      setClients(aggregatedClients);
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add New Client to Supabase
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;

    setIsSaving(true);
    try {
      // 1. Insert into clients table
      await supabase.from("clients").insert([
        {
          name: newClient.name.trim(),
          email: newClient.email.trim(),
          phone: newClient.phone.trim(),
          location: newClient.location.trim(),
          status: "Active",
        },
      ]);

      await fetchLiveClientsAndProjects();
      setNewClient({
        name: "",
        email: "",
        phone: "+91-XXXXXXXXXX",
        location: "Hyderabad",
      });
      setShowAddModal(false);
    } catch (err: any) {
      alert(`Error saving client: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // --- STAT CALCULATIONS ---
  const totalClientsCount = clients.length;
  const totalPortfolioValue = clients.reduce(
    (acc, c) => acc + c.totalBudget,
    0,
  );
  const totalLinkedProjects = clients.reduce(
    (acc, c) => acc + c.projectsCount,
    0,
  );

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.projects.some((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span className="font-sans">Loading Clients CRM Directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Client </span>
            <span className="italic text-[#0047AB]">CRM Directory.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage your real client profiles, active projects, contracts, and
            billing in ₹ INR.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* TOP 3 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            TOTAL CLIENTS
          </span>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {totalClientsCount} {totalClientsCount === 1 ? "Client" : "Clients"}
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-sans">
            ✓ Workspace Synced
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            TOTAL CLIENT PIPELINE VALUE
          </span>
          <div className="text-3xl font-black text-[#0047AB] font-sans">
            ₹{totalPortfolioValue.toLocaleString("en-IN")}
          </div>
          <span className="text-xs font-bold text-slate-400 font-sans">
            Total Combined Project Budgets
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            LINKED ACTIVE PROJECTS
          </span>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {totalLinkedProjects} Projects
          </div>
          <span className="text-xs font-bold text-blue-600 font-sans">
            Across All Clients
          </span>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 font-sans">
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
        <input
          type="text"
          placeholder="Search real clients by name, project, email, location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-none placeholder:text-slate-400 font-sans"
        />
      </div>

      {/* CLIENTS GRID */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition font-sans"
            >
              <div>
                {/* Client Header */}
                <div className="flex items-start justify-between gap-3 font-sans">
                  <div className="flex items-center gap-3 font-sans">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0047AB] border border-blue-200 flex items-center justify-center font-bold text-sm shrink-0 font-sans shadow-sm">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 font-sans leading-snug">
                        {client.name}
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400 font-sans">
                        {client.location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-sans ${
                      client.status === "On Hold"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : client.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-[#0047AB] border-blue-200"
                    }`}
                  >
                    {client.status}
                  </span>
                </div>

                {/* Financial & Project Count Badge */}
                <div className="grid grid-cols-2 gap-2 my-4 pt-4 border-t border-slate-100 font-sans">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">
                      PROJECTS
                    </span>
                    <span className="text-sm font-black text-slate-900 font-sans">
                      {client.projectsCount}{" "}
                      {client.projectsCount === 1 ? "Project" : "Projects"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 font-sans">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">
                      TOTAL VALUE
                    </span>
                    <span className="text-sm font-black text-[#0047AB] font-sans">
                      ₹{client.totalBudget.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Linked Projects Pills */}
                <div className="space-y-1.5 font-sans">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-sans">
                    Linked Deliverables:
                  </span>
                  <div className="space-y-1.5 font-sans">
                    {client.projects.map((p) => (
                      <Link
                        key={p.id}
                        href={`/dashboard/freelancer/projects/${p.id}`}
                        className="p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 rounded-xl flex items-center justify-between transition group font-sans"
                      >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-[#0047AB] truncate font-sans">
                          {p.name}
                        </span>
                        <span className="text-xs font-black text-slate-700 shrink-0 font-sans">
                          ₹{Number(p.budget || 0).toLocaleString("en-IN")}
                        </span>
                      </Link>
                    ))}

                    {client.projects.length === 0 && (
                      <span className="text-xs text-slate-400 italic block py-1 font-sans">
                        No projects created yet for this client.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quick Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 font-sans">
                <Link
                  href={`/dashboard/freelancer/invoices?projectId=${client.projects[0]?.id || ""}`}
                  className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Invoice Client</span>
                </Link>

                <Link
                  href="/dashboard/freelancer/projects"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1 font-sans"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            No Clients Found
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
            Add your first real client profile or create a project to start
            tracking contracts and billing.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Client</span>
          </button>
        </div>
      )}

      {/* ================= MODAL: ADD NEW CLIENT ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl font-sans">
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Add Client Profile
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateClient}
              className="space-y-3.5 font-sans"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Company / Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Food Link F&B Holdings LTD"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="client@company.com"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91-XXXXXXXXXX"
                    value={newClient.phone}
                    onChange={(e) =>
                      setNewClient({ ...newClient, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Location / City
                  </label>
                  <input
                    type="text"
                    placeholder="Hyderabad"
                    value={newClient.location}
                    onChange={(e) =>
                      setNewClient({ ...newClient, location: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 rounded-xl shadow-md transition disabled:opacity-50 mt-2 font-sans"
              >
                {isSaving ? "Saving Client..." : "Save Client Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
