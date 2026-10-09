"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Phone,
  Mail,
  MapPin,
  Search,
  Plus,
  Filter,
  DollarSign,
  Layers,
  FolderOpen,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  X,
  ChevronRight,
  ChevronDown,
  Calendar,
  Briefcase,
  CreditCard,
  Loader2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CreativeDeliverable {
  id: string;
  name: string;
  type: string;
  amount: number;
  date?: string;
  status: "In Progress" | "Completed" | "Pending";
}

interface ProjectRecord {
  id: string;
  title: string;
  client: string;
  status: string;
  budget: number | string;
  payment_status?: "paid" | "unpaid" | string;
  industry?: string;
  deliverables?: string;
  created_at?: string;
}

interface ClientGroup {
  name: string;
  email?: string;
  phone?: string;
  industry: string;
  projects: ProjectRecord[];
  totalBilled: number;
  totalPaid: number;
  totalPending: number;
  collectionRate: number;
}

const INDUSTRIES = [
  "All Industries",
  "Restaurant & Food",
  "Healthcare & Hospitals",
  "Fashion & Apparel",
  "Real Estate & Construction",
  "Tech & Software",
  "Education & E-Learning",
  "Events & Entertainment",
  "Retail & E-Commerce",
  "Corporate & Consulting",
];

export default function ClientsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "dues" | "paid">(
    "all",
  );
  const [expandedClients, setExpandedClients] = useState<
    Record<string, boolean>
  >({});

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    industry: "Restaurant & Food",
    firstProjectTitle: "",
    firstProjectBudget: "5000",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const fetchClientProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(
          "Error loading projects for clients view:",
          error.message,
        );
      } else if (data) {
        setProjects(data);
        // By default, open first 3 client cards
        const initialExpanded: Record<string, boolean> = {};
        const clientNames = Array.from(
          new Set(data.map((p) => p.client || "Direct Client")),
        );
        clientNames.slice(0, 3).forEach((name) => {
          initialExpanded[name] = true;
        });
        setExpandedClients(initialExpanded);
      }
    } catch (err: any) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Group projects by client
  const clientGroups: ClientGroup[] = useMemo(() => {
    const map = new Map<string, ProjectRecord[]>();

    projects.forEach((proj) => {
      const cName = proj.client?.trim() || "Direct Client";
      if (!map.has(cName)) {
        map.set(cName, []);
      }
      map.get(cName)!.push(proj);
    });

    const groups: ClientGroup[] = [];

    map.forEach((clientProjects, clientName) => {
      let billed = 0;
      let paid = 0;
      let primaryIndustry = "General";

      clientProjects.forEach((p) => {
        const pBudget = parseFloat(String(p.budget)) || 0;
        billed += pBudget;
        const isPaid = p.payment_status === "paid";
        if (isPaid) {
          paid += pBudget;
        }
        if (p.industry && p.industry !== "General") {
          primaryIndustry = p.industry;
        }
      });

      const pending = Math.max(0, billed - paid);
      const rate = billed > 0 ? Math.round((paid / billed) * 100) : 100;

      groups.push({
        name: clientName,
        industry: primaryIndustry,
        projects: clientProjects,
        totalBilled: billed,
        totalPaid: paid,
        totalPending: pending,
        collectionRate: rate,
      });
    });

    return groups.sort((a, b) => b.totalPending - a.totalPending);
  }, [projects]);

  // Overall Financial KPIs
  const metrics = useMemo(() => {
    let pipeline = 0;
    let received = 0;

    projects.forEach((p) => {
      const budget = parseFloat(String(p.budget)) || 0;
      pipeline += budget;
      if (p.payment_status === "paid") {
        received += budget;
      }
    });

    const dues = Math.max(0, pipeline - received);
    const overallRate =
      pipeline > 0 ? Math.round((received / pipeline) * 100) : 0;

    return {
      totalClients: clientGroups.length,
      totalPipeline: pipeline,
      totalReceived: received,
      totalDues: dues,
      overallRate,
    };
  }, [projects, clientGroups]);

  // Filtered Client Groups
  const filteredGroups = useMemo(() => {
    return clientGroups.filter((g) => {
      const matchesSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.industry.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "All Industries" ||
        g.industry === selectedIndustry;

      let matchesPayment = true;
      if (paymentFilter === "dues") {
        matchesPayment = g.totalPending > 0;
      } else if (paymentFilter === "paid") {
        matchesPayment = g.totalPending === 0 && g.totalBilled > 0;
      }

      return matchesSearch && matchesIndustry && matchesPayment;
    });
  }, [clientGroups, searchQuery, selectedIndustry, paymentFilter]);

  // 1-Click Toggle Payment Status for a Project
  const handleTogglePaymentStatus = async (
    projectId: string,
    currentStatus?: string,
  ) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";

    // Optimistic UI update
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, payment_status: nextStatus } : p,
      ),
    );

    try {
      const { error } = await supabase
        .from("projects")
        .update({ payment_status: nextStatus })
        .eq("id", projectId);

      if (error) {
        console.warn("Database column warning:", error.message);
      }
    } catch (err: any) {
      console.error("Toggle payment status failed:", err.message);
    }
  };

  const toggleExpand = (clientName: string) => {
    setExpandedClients((prev) => ({
      ...prev,
      [clientName]: !prev[clientName],
    }));
  };

  // Add Client with First Project
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name.trim()) return;

    setIsSubmitting(true);
    try {
      const projectPayload: any = {
        title:
          newClient.firstProjectTitle.trim() ||
          `${newClient.name} - Brand Identity & Creative Works`,
        client: newClient.name.trim(),
        category: "Graphic Design",
        industry: newClient.industry,
        budget: parseFloat(newClient.firstProjectBudget) || 5000,
        status: "In Progress",
        payment_status: "unpaid",
        deliverables: JSON.stringify([
          {
            id: `work-${Date.now()}`,
            name: "Initial Marketing Creative",
            type: "Flyer",
            amount: parseFloat(newClient.firstProjectBudget) || 5000,
            date: new Date().toISOString().split("T")[0],
            status: "In Progress",
          },
        ]),
      };

      const { data, error } = await supabase
        .from("projects")
        .insert([projectPayload])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setProjects((prev) => [data[0], ...prev]);
        setExpandedClients((prev) => ({
          ...prev,
          [newClient.name.trim()]: true,
        }));
      }

      setShowAddModal(false);
      setNewClient({
        name: "",
        email: "",
        phone: "",
        industry: "Restaurant & Food",
        firstProjectTitle: "",
        firstProjectBudget: "5000",
      });
    } catch (err: any) {
      alert(`Could not create client: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Client Financial Directory & Works
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#9D00FF]/10 text-[#9D00FF]">
              {clientGroups.length} Clients
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track client relationships, individual deliverable billings, and
            payment settlements in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchClientProjects}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-sm shadow-md transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Client</span>
          </button>
        </div>
      </div>

      {/* Graphical Financial Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Contracted Pipeline
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#9D00FF] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-slate-900">
              ₹{metrics.totalPipeline.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Across {projects.length} project deliverables</span>
            </p>
          </div>
        </div>

        {/* Total Received (Paid) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Total Received (Paid)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-emerald-600">
              ₹{metrics.totalReceived.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-700/80 mt-1 font-medium">
              Successfully collected into account
            </p>
          </div>
        </div>

        {/* Pending Dues */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Pending Collections (Dues)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-amber-600">
              ₹{metrics.totalDues.toLocaleString()}
            </p>
            <p className="text-xs text-amber-700/80 mt-1 font-medium">
              Awaiting client payment clearance
            </p>
          </div>
        </div>

        {/* Collection Recovery Rate */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Collection Recovery Rate
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-black text-purple-700">
              {metrics.overallRate}%
            </p>
            {/* Visual Animated Dual-Color Bar */}
            <div className="w-full bg-amber-100 rounded-full h-2.5 mt-2 overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${metrics.overallRate}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mt-1.5">
              <span className="text-emerald-600">
                {metrics.overallRate}% Paid
              </span>
              <span className="text-amber-600">
                {metrics.overallRate < 100 ? 100 - metrics.overallRate : 0}% Due
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search client name or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#9D00FF] text-sm"
          />
        </div>

        {/* Industry & Payment Status Badges */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Industry Dropdown */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#9D00FF]"
          >
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>

          {/* Payment Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPaymentFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                paymentFilter === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Clients
            </button>
            <button
              onClick={() => setPaymentFilter("dues")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                paymentFilter === "dues"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Has Dues
            </button>
            <button
              onClick={() => setPaymentFilter("paid")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                paymentFilter === "paid"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Fully Settled
            </button>
          </div>
        </div>
      </div>

      {/* Clients Breakdown Section */}
      {loading ? (
        <div className="py-20 text-center font-bold text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF]" />
          <span>Loading client directory & billing records...</span>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#9D00FF] flex items-center justify-center mx-auto">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Clients Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            No clients match your filter criteria. Add a client or clear your
            search query to see full records.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedIndustry("All Industries");
              setPaymentFilter("all");
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isExpanded = !!expandedClients[group.name];
            const hasDues = group.totalPending > 0;

            return (
              <div
                key={group.name}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm transition hover:border-slate-300 overflow-hidden"
              >
                {/* Client Master Card Header */}
                <div
                  onClick={() => toggleExpand(group.name)}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 select-none transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#9D00FF]/10 text-[#9D00FF] flex items-center justify-center font-black text-lg shrink-0">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-black text-slate-900">
                          {group.name}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                          {group.industry}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-[#9D00FF]">
                          {group.projects.length}{" "}
                          {group.projects.length === 1
                            ? "Work / Project"
                            : "Works / Projects"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>Client Folder Workspace</span>
                        <span>•</span>
                        <span className="text-slate-400">
                          Click to expand creative deliverables
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Financial Stats Per Client */}
                  <div className="flex items-center gap-5 shrink-0 self-start lg:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Total Billed
                      </span>
                      <span className="text-sm font-black text-slate-900">
                        ₹{group.totalBilled.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                        Received (Paid)
                      </span>
                      <span className="text-sm font-black text-emerald-600">
                        ₹{group.totalPaid.toLocaleString()}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                        Pending Due
                      </span>
                      <span
                        className={`text-sm font-black ${
                          hasDues ? "text-amber-600" : "text-slate-400"
                        }`}
                      >
                        ₹{group.totalPending.toLocaleString()}
                      </span>
                    </div>

                    {/* Due Badge / Settlement status */}
                    <div className="w-24 text-right">
                      {hasDues ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          <span>DUE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>CLEAR</span>
                        </span>
                      )}
                    </div>

                    <div className="text-slate-400 pl-2">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Client Deliverables & Sub-works */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#9D00FF]" />
                        <span>
                          Creative Works & Contract Line Items for {group.name}
                        </span>
                      </h4>

                      <Link
                        href={`/dashboard/freelancer/projects`}
                        className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
                      >
                        <span>Open In Project Folders</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Table of Client's Projects */}
                    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Project / Deliverable</th>
                            <th className="py-3 px-4">Industry / Category</th>
                            <th className="py-3 px-4">Work Status</th>
                            <th className="py-3 px-4">Billing Amount</th>
                            <th className="py-3 px-4">Payment Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                          {group.projects.map((proj) => {
                            const isProjPaid = proj.payment_status === "paid";
                            const pAmount =
                              parseFloat(String(proj.budget)) || 0;

                            return (
                              <tr
                                key={proj.id}
                                className="hover:bg-slate-50/80 transition"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <FolderOpen className="w-3.5 h-3.5 text-[#9D00FF]" />
                                    <span>{proj.title}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    Created:{" "}
                                    {proj.created_at
                                      ? new Date(
                                          proj.created_at,
                                        ).toLocaleDateString()
                                      : "Recent"}
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                                    {proj.industry || "General"}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                      proj.status === "Completed"
                                        ? "bg-emerald-100 text-emerald-800"
                                        : proj.status === "Stopped" ||
                                            proj.status === "On Hold"
                                          ? "bg-rose-100 text-rose-800"
                                          : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {proj.status === "Completed" ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : (
                                      <Clock className="w-3 h-3" />
                                    )}
                                    <span>{proj.status || "In Progress"}</span>
                                  </span>
                                </td>

                                <td className="py-3 px-4 font-black text-slate-900">
                                  ₹{pAmount.toLocaleString()}
                                </td>

                                {/* 1-Click Payment Status Toggle */}
                                <td className="py-3 px-4">
                                  <button
                                    onClick={() =>
                                      handleTogglePaymentStatus(
                                        proj.id,
                                        proj.payment_status,
                                      )
                                    }
                                    title="Click to toggle Paid / Due status"
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border transition shadow-sm active:scale-95 ${
                                      isProjPaid
                                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200"
                                        : "bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
                                    }`}
                                  >
                                    {isProjPaid ? (
                                      <>
                                        <Check className="w-3 h-3 stroke-[3]" />
                                        <span>PAID</span>
                                      </>
                                    ) : (
                                      <>
                                        <Clock className="w-3 h-3 stroke-[3]" />
                                        <span>DUE (PAY)</span>
                                      </>
                                    )}
                                  </button>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <Link
                                    href={`/dashboard/freelancer/projects/${proj.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                                  >
                                    <span>View Details</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ADD NEW CLIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#9D00FF]/10 text-[#9D00FF] flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Register New Client
                  </h3>
                  <p className="text-xs text-slate-400">
                    Create client account and initialize their creative work
                    folder
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Client / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Food & Link, Apex Healthcare, etc."
                  value={newClient.name}
                  onChange={(e) =>
                    setNewClient((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D00FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Industry Classification
                </label>
                <select
                  value={newClient.industry}
                  onChange={(e) =>
                    setNewClient((prev) => ({
                      ...prev,
                      industry: e.target.value,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#9D00FF]"
                >
                  {INDUSTRIES.filter((i) => i !== "All Industries").map(
                    (ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    First Project / Creative Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. July Restaurant Posters"
                    value={newClient.firstProjectTitle}
                    onChange={(e) =>
                      setNewClient((prev) => ({
                        ...prev,
                        firstProjectTitle: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D00FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Initial Budget (₹ INR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="5000"
                    value={newClient.firstProjectBudget}
                    onChange={(e) =>
                      setNewClient((prev) => ({
                        ...prev,
                        firstProjectBudget: e.target.value,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#9D00FF]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9D00FF] hover:bg-[#7A00CC] text-white text-sm font-bold shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Client Folder...</span>
                    </>
                  ) : (
                    <span>Create Client & Setup</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
