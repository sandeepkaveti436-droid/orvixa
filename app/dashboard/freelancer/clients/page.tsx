"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Globe,
  Archive,
  Building,
  X,
  History,
  FolderKanban,
  DollarSign,
} from "lucide-react";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHistoryClient, setSelectedHistoryClient] = useState<
    any | null
  >(null);

  const [clients, setClients] = useState([
    {
      id: "c-1",
      name: "Alex Mercer",
      company: "Acme Global Inc.",
      email: "alex@acmeglobal.com",
      phone: "+1 (555) 234-5678",
      website: "https://acmeglobal.com",
      country: "United States",
      timezone: "UTC - 05:00 (Eastern)",
      totalBilled: "$11,350.00",
      notes: "VIP corporate client. Prefers Net-15 invoice payment terms.",
      linkedProjects: ["Acme Corp iOS App Redesign", "Acme Brand Guidelines"],
      history: [
        "Aug 01: Paid $4,850 Invoice #1042",
        "Jul 15: Signed Contract v2",
      ],
      status: "Active",
      archived: false,
    },
    {
      id: "c-2",
      name: "Sarah Chen",
      company: "FinTech Labs",
      email: "sarah@fintechlabs.io",
      phone: "+1 (555) 876-5432",
      website: "https://fintechlabs.io",
      country: "United Kingdom",
      timezone: "UTC + 00:00 (London)",
      totalBilled: "$8,200.00",
      notes: "FinTech client focusing on Stripe payment integration.",
      linkedProjects: ["Stripe Payment Gateway Integration"],
      history: ["Aug 04: Issued $3,200 Invoice #1043"],
      status: "Active",
      archived: false,
    },
    {
      id: "c-3",
      name: "David Kim",
      company: "Solopreneur Studio",
      email: "david@solopreneur.co",
      phone: "+1 (555) 432-1098",
      website: "https://solopreneur.co",
      country: "Canada",
      timezone: "UTC - 08:00 (Pacific)",
      totalBilled: "$4,500.00",
      notes: "Solo creator seeking brand identity system.",
      linkedProjects: ["Brand Identity Package"],
      history: ["Jul 20: Paid $1,800 Invoice #1044"],
      status: "Completed",
      archived: true,
    },
  ]);

  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    country: "United States",
    timezone: "UTC - 05:00 (Eastern)",
    notes: "",
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      setClients([
        ...clients,
        {
          id: `c-${Date.now()}`,
          name: newClient.name,
          company: newClient.company || "Independent",
          email: newClient.email,
          phone: newClient.phone || "+1 (555) 000-0000",
          website: newClient.website || "https://client.com",
          country: newClient.country,
          timezone: newClient.timezone,
          totalBilled: "$0.00",
          notes: newClient.notes || "New client profile created.",
          linkedProjects: [],
          history: ["Today: Account Created"],
          status: "Active",
          archived: false,
        },
      ]);
      setShowAddModal(false);
      setNewClient({
        name: "",
        company: "",
        email: "",
        phone: "",
        website: "",
        country: "United States",
        timezone: "UTC - 05:00 (Eastern)",
        notes: "",
      });
    }
  };

  const toggleArchive = (id: string) => {
    setClients(
      clients.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c)),
    );
  };

  const filteredClients = clients.filter((c) => {
    const matchesArchive = showArchived ? c.archived : !c.archived;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesArchive && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            <span>Client </span>
            <span className="font-heading italic text-[#0047AB]">
              CRM Directory.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Track client relationships, contact info, total billed revenue, time
            zones, and linked projects.
          </p>
        </div>
        

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>
        {/* SEARCH & ARCHIVE FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 font-sans">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
          />
        </div>

        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            showArchived
              ? "bg-[#0047AB] text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>
            {showArchived ? "Viewing Archived Clients" : "Show Archived"}
          </span>
        </button>
      </div>

      {/* CRM METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Total Active Clients
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {clients.filter((c) => !c.archived).length}
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">
            ✓ Healthy client pipeline
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Lifetime Client Revenue
          </span>
          <div className="text-3xl font-black text-[#0047AB] mt-1">
            $24,050.00
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            Avg. $8,016 per client
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Active Client Projects
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            3 Projects
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            100% On-time delivery
          </span>
        </div>
      </div>

      {/* CLIENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#0047AB]/30 transition-all flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      client.archived
                        ? "bg-slate-100 text-slate-500"
                        : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    }`}
                  >
                    {client.archived ? "Archived" : "Active"}
                  </span>

                  <button
                    onClick={() => toggleArchive(client.id)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                    title={
                      client.archived ? "Unarchive Client" : "Archive Client"
                    }
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-lg text-slate-900">
                {client.company}
              </h3>
              <p className="text-xs font-bold text-[#0047AB] mb-4">
                Contact: {client.name}
              </p>

              <div className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {client.country} ({client.timezone})
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Linked Projects ({client.linkedProjects.length})
                </span>
                <div className="space-y-1">
                  {client.linkedProjects.length > 0 ? (
                    client.linkedProjects.map((p) => (
                      <span
                        key={p}
                        className="text-[11px] font-semibold text-slate-700 bg-slate-50 px-2 py-0.5 rounded block line-clamp-1"
                      >
                        • {p}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">
                      No active projects
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
              <div>
                <span className="text-slate-400 text-[10px] block uppercase">
                  Total Billed:
                </span>
                <span className="text-[#0047AB] text-sm font-black">
                  {client.totalBilled}
                </span>
              </div>

              <button
                onClick={() => setSelectedHistoryClient(client)}
                className="text-[#0047AB] hover:underline flex items-center gap-1"
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CLIENT HISTORY MODAL */}
      {selectedHistoryClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                History: {selectedHistoryClient.company}
              </h3>
              <button
                onClick={() => setSelectedHistoryClient(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              {selectedHistoryClient.history.map((h: string, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100"
                >
                  {h}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0047AB]" />
                <span>Add Client Profile</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 font-sans">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Global"
                  value={newClient.company}
                  onChange={(e) =>
                    setNewClient({ ...newClient, company: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient({ ...newClient, name: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@stripe.com"
                  value={newClient.email}
                  onChange={(e) =>
                    setNewClient({ ...newClient, email: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={newClient.phone}
                  onChange={(e) =>
                    setNewClient({ ...newClient, phone: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-[#0047AB]/25"
              >
                Save Client Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
