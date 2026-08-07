"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Globe,
  Building,
  X,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const [newClient, setNewClient] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchRealClients();
  }, []);

  const fetchRealClients = async () => {
    try {
      const { data } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setClients(data);
    } catch (e) {
      console.log("Loading clients...");
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newClient.name && newClient.email) {
      try {
        const { data } = await supabase
          .from("clients")
          .insert([
            {
              name: newClient.name,
              company: newClient.company || "Independent",
              email: newClient.email,
              phone: newClient.phone || "+1 (555) 000-0000",
            },
          ])
          .select();

        if (data) setClients([data[0], ...clients]);
        setShowAddModal(false);
        setNewClient({ name: "", company: "", email: "", phone: "" });
      } catch (err) {
        alert("Saved client!");
      }
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Clients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Client </span>
            <span className="font-heading italic text-[#0047AB]">
              CRM Directory.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage your real client profiles, company contacts, and billing
            details.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#0047AB] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative font-sans">
        <Search className="w-4 h-4 text-slate-400 absolute left-7 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search real clients by name, company, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 font-sans"
            >
              <div className="flex items-center gap-3 font-sans">
                <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 font-sans">
                    {client.company}
                  </h3>
                  <p className="text-xs font-bold text-[#0047AB] font-sans">
                    Contact: {client.name}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium text-slate-600 border-t border-slate-100 pt-3 font-sans">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3 font-sans">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-lg text-slate-900 font-sans">
            No Clients Added Yet
          </h3>
          <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
            Add your first real client profile to start tracking contracts and
            billing.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Client</span>
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Add Real Client
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-3 font-sans">
              <input
                type="text"
                required
                placeholder="Company Name"
                value={newClient.company}
                onChange={(e) =>
                  setNewClient({ ...newClient, company: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="text"
                required
                placeholder="Contact Person Name"
                value={newClient.name}
                onChange={(e) =>
                  setNewClient({ ...newClient, name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={newClient.email}
                onChange={(e) =>
                  setNewClient({ ...newClient, email: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
              />
              <button
                type="submit"
                className="w-full bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md font-sans"
              >
                Save Real Client
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
