"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Folder,
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Pencil,
  Trash2,
  Calendar,
  Building,
  ArrowRight,
  Filter,
  DollarSign,
  Loader2,
  X,
  AlertCircle,
  Briefcase,
  IndianRupee,
  Check,
  Receipt,
  FileText,
  Printer,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CreativeWork {
  id: string;
  name: string;
  type: string;
  amount: number;
  date?: string;
  status: "In Progress" | "Completed" | "Pending";
}

interface ProjectRecord {
  id: string;
  title?: string;
  name?: string;
  client?: string;
  category?: string;
  industry?: string;
  budget: number | string;
  status: string;
  payment_status?: "paid" | "unpaid" | string;
  deliverables?: string;
  date?: string;
  due_date?: string;
  deadline?: string;
  created_at?: string;
}

interface InvoiceLineItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  selected: boolean;
}

const CATEGORIES = [
  "Graphic Design",
  "Web Development",
  "UI/UX Design",
  "Video Editing",
  "Social Media",
  "Content Writing",
  "Branding",
  "Other",
];

const INDUSTRIES = [
  "Restaurant & Food",
  "Healthcare & Hospitals",
  "Fashion & Apparel",
  "Real Estate & Architecture",
  "Tech & Software",
  "Education & Coaching",
  "Events & Entertainment",
  "Retail & E-Commerce",
  "Corporate & Consulting",
  "Other / General",
];

export default function ProjectsPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<"folders" | "all">("folders");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPayment, setFilterPayment] = useState<"all" | "paid" | "unpaid">(
    "all",
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "In Progress" | "Completed"
  >("all");
  const [filterClient, setFilterClient] = useState<string>("all");

  // Create Project Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createProjectError, setCreateProjectError] = useState<string | null>(
    null,
  );
  const [newProject, setNewProject] = useState({
    title: "",
    client: "",
    category: "Graphic Design",
    industry: "Restaurant & Food",
    budget: "1500",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],
    status: "In Progress",
    deliverableName: "",
    deliverableType: "Flyer",
  });

  // Inline Quick Edit Budget Modal
  const [editingBudgetProject, setEditingBudgetProject] =
    useState<ProjectRecord | null>(null);
  const [updatedBudgetVal, setUpdatedBudgetVal] = useState("");

  // ================= INVOICE GENERATOR MODAL STATE =================
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [isSavingInvoice, setIsSavingInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "",
    clientName: "",
    clientEmail: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    taxPercent: 0,
    discountAmount: 0,
    notes: "Thank you for your business! Payment is due within 7 days.",
    paymentDetails: "UPI: skynova@upi | Bank: HDFC Bank - A/C: 501002349823",
    items: [] as InvoiceLineItem[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading projects:", error.message);

      // Normalize records so both .title and .name are always available
      const normalized = (data || []).map((proj: any) => ({
        ...proj,
        title: proj.title || proj.name || "Untitled Deliverable",
        name: proj.name || proj.title || "Untitled Deliverable",
      }));
      setProjects(normalized);
    } catch (err: any) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Group projects by client folder
  const clientFolders = useMemo(() => {
    const map = new Map<string, ProjectRecord[]>();
    projects.forEach((proj) => {
      const clientName = proj.client?.trim() || "Direct Client";
      if (!map.has(clientName)) {
        map.set(clientName, []);
      }
      map.get(clientName)!.push(proj);
    });
    return Array.from(map.entries()).map(([client, projs]) => {
      const totalBudget = projs.reduce(
        (acc, p) => acc + (parseFloat(String(p.budget)) || 0),
        0,
      );
      const paidBudget = projs
        .filter((p) => p.payment_status === "paid")
        .reduce((acc, p) => acc + (parseFloat(String(p.budget)) || 0), 0);
      const pendingBudget = Math.max(0, totalBudget - paidBudget);
      const industry = projs[0]?.industry || "Restaurant & Food";

      return {
        client,
        projects: projs,
        totalBudget,
        paidBudget,
        pendingBudget,
        industry,
      };
    });
  }, [projects]);

  // Clients list for filter dropdown
  const allClientsList = useMemo(() => {
    return Array.from(
      new Set(projects.map((p) => p.client?.trim() || "Direct Client")),
    ).filter(Boolean);
  }, [projects]);

  // Current folder data if one is open
  const currentFolderData = useMemo(() => {
    if (!activeFolder) return null;
    return clientFolders.find((f) => f.client === activeFolder) || null;
  }, [activeFolder, clientFolders]);

  // Filter projects (Safe against undefined titles)
  const displayedProjects = useMemo(() => {
    return projects.filter((p) => {
      const pClient = (p.client || "").trim();
      const pTitle = p.title || p.name || "";
      const pIndustry = p.industry || "";

      if (activeFolder && (pClient || "Direct Client") !== activeFolder) {
        return false;
      }

      if (
        filterClient !== "all" &&
        (pClient || "Direct Client") !== filterClient
      ) {
        return false;
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        pTitle.toLowerCase().includes(query) ||
        pClient.toLowerCase().includes(query) ||
        pIndustry.toLowerCase().includes(query);

      let matchesPayment = true;
      if (filterPayment === "paid")
        matchesPayment = p.payment_status === "paid";
      if (filterPayment === "unpaid")
        matchesPayment = p.payment_status !== "paid";

      let matchesStatus = true;
      if (filterStatus !== "all") matchesStatus = p.status === filterStatus;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [
    projects,
    activeFolder,
    filterClient,
    searchQuery,
    filterPayment,
    filterStatus,
  ]);

  // 1-Click Toggle Payment Status
  const handleTogglePayment = async (
    projId: string,
    currentStatus?: string,
  ) => {
    const nextStatus = currentStatus === "paid" ? "unpaid" : "paid";
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projId ? { ...p, payment_status: nextStatus } : p,
      ),
    );

    try {
      await supabase
        .from("projects")
        .update({ payment_status: nextStatus })
        .eq("id", projId);
    } catch (err: any) {
      console.error("Toggle payment status failed:", err.message);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, title?: string) => {
    const displayTitle = title || "this project";
    const confirm = window.confirm(
      `Are you sure you want to delete "${displayTitle}"?`,
    );
    if (!confirm) return;

    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await supabase.from("projects").delete().eq("id", id);
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  // Quick Inline Save Budget
  const handleSaveBudget = async () => {
    if (!editingBudgetProject) return;
    const newAmt = parseFloat(updatedBudgetVal) || 0;

    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingBudgetProject.id ? { ...p, budget: newAmt } : p,
      ),
    );

    try {
      await supabase
        .from("projects")
        .update({ budget: newAmt })
        .eq("id", editingBudgetProject.id);
    } catch (err: any) {
      console.error("Budget update error:", err.message);
    }
    setEditingBudgetProject(null);
  };

  // Create Project (Uses 'name' first to match your Supabase schema)
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    setCreateProjectError(null);
    setIsSubmitting(true);
    try {
      const budgetVal = parseFloat(newProject.budget) || 1500;
      const clientName =
        newProject.client.trim() || activeFolder || "Direct Client";
      const trimmedTitle = newProject.title.trim();

      const deliverableItem: CreativeWork = {
        id: `deliv-${Date.now()}`,
        name: newProject.deliverableName.trim() || trimmedTitle,
        type: newProject.deliverableType,
        amount: budgetVal,
        date: newProject.date,
        status: newProject.status as any,
      };

      const basePayload: any = {
        client: clientName,
        category: newProject.category,
        industry: newProject.industry,
        budget: budgetVal,
        status: newProject.status,
        payment_status: "unpaid",
        due_date: newProject.dueDate,
        deliverables: JSON.stringify([deliverableItem]),
      };

      // 1. Insert with 'name' to match your schema
      let insertResult = await supabase
        .from("projects")
        .insert([{ ...basePayload, name: trimmedTitle }])
        .select();

      // 2. Fallback to 'title' only if schema doesn't have 'name'
      if (
        insertResult.error &&
        insertResult.error.message?.toLowerCase().includes("name")
      ) {
        insertResult = await supabase
          .from("projects")
          .insert([{ ...basePayload, title: trimmedTitle }])
          .select();
      }

      if (insertResult.error) throw insertResult.error;

      const data = insertResult.data;
      if (data && data[0]) {
        const createdRecord: ProjectRecord = {
          ...data[0],
          title: data[0].title || data[0].name || trimmedTitle,
          name: data[0].name || data[0].title || trimmedTitle,
        };
        setProjects((prev) => [createdRecord, ...prev]);
        if (activeFolder) {
          setActiveFolder(clientName);
        }
      }

      setShowCreateModal(false);
      setNewProject({
        title: "",
        client: "",
        category: "Graphic Design",
        industry: "Restaurant & Food",
        budget: "1500",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date().toISOString().split("T")[0],
        status: "In Progress",
        deliverableName: "",
        deliverableType: "Flyer",
      });
    } catch (err: unknown) {
      console.error("Failed to create project:", err);
      const message =
        err &&
        typeof err === "object" &&
        "message" in err &&
        typeof err.message === "string"
          ? err.message
          : "Could not save this project. Please try again.";
      setCreateProjectError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= OPEN INVOICE BUILDER =================
  const openInvoiceGenerator = (
    mode: "single" | "combined",
    targetProject?: ProjectRecord,
  ) => {
    const randomInvNum = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (mode === "single" && targetProject) {
      const pAmount = parseFloat(String(targetProject.budget)) || 0;
      const pTitle =
        targetProject.title || targetProject.name || "Creative Deliverable";
      const initialItem: InvoiceLineItem = {
        id: `item-${Date.now()}-0`,
        description: pTitle,
        qty: 1,
        rate: pAmount,
        selected: true,
      };

      setInvoiceData({
        invoiceNumber: randomInvNum,
        clientName: targetProject.client || "Client",
        clientEmail: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split("T")[0],
        taxPercent: 0,
        discountAmount: 0,
        notes: `Invoice for ${pTitle}. Thank you for your business!`,
        paymentDetails:
          "UPI: skynova@upi | Bank: HDFC Bank - A/C: 501002349823",
        items: [initialItem],
      });
    } else {
      const clientName = activeFolder || "Client";
      const folderWorks = projects.filter(
        (p) => (p.client?.trim() || "Direct Client") === clientName,
      );

      const combinedItems: InvoiceLineItem[] = folderWorks.map((p, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        description: p.title || p.name || `Work #${idx + 1}`,
        qty: 1,
        rate: parseFloat(String(p.budget)) || 0,
        selected: p.payment_status !== "paid",
      }));

      setInvoiceData({
        invoiceNumber: randomInvNum,
        clientName: clientName,
        clientEmail: "",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split("T")[0],
        taxPercent: 0,
        discountAmount: 0,
        notes: `Combined statement invoice for ${clientName} deliverables.`,
        paymentDetails:
          "UPI: skynova@upi | Bank: HDFC Bank - A/C: 501002349823",
        items:
          combinedItems.length > 0
            ? combinedItems
            : [
                {
                  id: `item-${Date.now()}`,
                  description: `${clientName} Creative Works`,
                  qty: 1,
                  rate: 3000,
                  selected: true,
                },
              ],
      });
    }

    setShowInvoiceModal(true);
  };

  const handleAddInvoiceItem = () => {
    const newItem: InvoiceLineItem = {
      id: `item-${Date.now()}`,
      description: "Additional Deliverable / Modification",
      qty: 1,
      rate: 500,
      selected: true,
    };
    setInvoiceData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleUpdateInvoiceItem = (
    id: string,
    field: "description" | "qty" | "rate" | "selected",
    val: any,
  ) => {
    setInvoiceData((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === id ? { ...it, [field]: val } : it,
      ),
    }));
  };

  const invoiceSubtotal = useMemo(() => {
    return invoiceData.items
      .filter((it) => it.selected)
      .reduce((sum, it) => sum + (it.qty || 1) * (it.rate || 0), 0);
  }, [invoiceData.items]);

  const invoiceTax = useMemo(() => {
    return (invoiceSubtotal * (invoiceData.taxPercent || 0)) / 100;
  }, [invoiceSubtotal, invoiceData.taxPercent]);

  const invoiceGrandTotal = useMemo(() => {
    return Math.max(
      0,
      invoiceSubtotal + invoiceTax - (invoiceData.discountAmount || 0),
    );
  }, [invoiceSubtotal, invoiceTax, invoiceData.discountAmount]);

  const handlePrintInvoice = () => {
    window.print();
  };

  // Save Invoice and instantly redirect to Invoices
  const handleSaveInvoice = async () => {
    setIsSavingInvoice(true);
    try {
      const selectedItems = invoiceData.items
        .filter((it) => it.selected)
        .map((it) => ({
          description: it.description,
          qty: it.qty || 1,
          rate: it.rate || 0,
        }));

      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoice_number: invoiceData.invoiceNumber,
        client: invoiceData.clientName || activeFolder || "",
        amount: invoiceGrandTotal,
        status: "Pending" as const,
        issue_date: invoiceData.issueDate,
        due_date: invoiceData.dueDate,
        items: selectedItems,
        notes: invoiceData.notes,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("invoices").insert([
        {
          invoice_number: newInvoice.invoice_number,
          client: newInvoice.client,
          amount: newInvoice.amount,
          status: newInvoice.status,
          issue_date: newInvoice.issue_date,
          due_date: newInvoice.due_date,
          items: JSON.stringify(newInvoice.items),
          notes: newInvoice.notes,
        },
      ]);
      if (error) throw error;

      setShowInvoiceModal(false);
      window.location.href = "/dashboard/freelancer/invoices";
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSavingInvoice(false);
    }
  };

  return (
    <div className="font-sans not-italic space-y-6 text-slate-900 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Projects & Client Workflows
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Manage client deliverables, multi-page campaigns, and earnings in ₹
            INR.
          </p>
        </div>

        <button
          onClick={() => {
            setCreateProjectError(null);
            if (activeFolder) {
              setNewProject((prev) => ({ ...prev, client: activeFolder }));
            }
            setShowCreateModal(true);
          }}
          className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>
            {activeFolder ? `Add Work to ${activeFolder}` : "Create Project"}
          </span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col 2xl:flex-row justify-between items-center gap-3">
        <div className="relative w-full 2xl:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects, client, industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full 2xl:w-auto justify-start 2xl:justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => {
                setViewMode("folders");
                setActiveFolder(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "folders" && !activeFolder
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>Client Folders</span>
            </button>
            <button
              onClick={() => {
                setViewMode("all");
                setActiveFolder(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                viewMode === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Projects</span>
            </button>
          </div>

          <select
            value={filterPayment}
            onChange={(e: any) => setFilterPayment(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#9D00FF]"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Payment Due</option>
          </select>

          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#9D00FF]"
          >
            <option value="all">All Clients ({allClientsList.length})</option>
            {allClientsList.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e: any) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#9D00FF]"
          >
            <option value="all">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Client Folder Banner */}
      {activeFolder && currentFolderData && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveFolder(null)}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Folders</span>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-400">
                  Client Folder •
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {currentFolderData.industry}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                {currentFolderData.client}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                Combined Value ({currentFolderData.projects.length} Works)
              </span>
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                ₹{currentFolderData.totalBudget.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Received (Paid)</span>
              </span>
              <span className="text-xl font-bold text-emerald-600 tabular-nums">
                ₹{currentFolderData.paidBudget.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide block flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Pending Due</span>
              </span>
              <span className="text-xl font-bold text-amber-600 tabular-nums">
                ₹{currentFolderData.pendingBudget.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openInvoiceGenerator("combined")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition"
                title="Generate combined statement invoice"
              >
                <Receipt className="w-4 h-4 stroke-[2.5]" />
                <span>Combined Invoice</span>
              </button>

              <button
                onClick={() => {
                  setCreateProjectError(null);
                  setNewProject((prev) => ({ ...prev, client: activeFolder }));
                  setShowCreateModal(true);
                }}
                className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Work</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Folders View Grid */}
      {viewMode === "folders" && !activeFolder ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-[#9D00FF]" />
              <span>Client Project Folders ({clientFolders.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {clientFolders.map((folder) => {
              const hasDues = folder.pendingBudget > 0;

              return (
                <div
                  key={folder.client}
                  onClick={() => setActiveFolder(folder.client)}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between space-y-4 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#9D00FF] flex items-center justify-center font-bold text-base border border-blue-100 group-hover:scale-105 transition">
                        <FolderOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-[#9D00FF] transition">
                          {folder.client}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-500">
                          {folder.industry}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                      {folder.projects.length} Works
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-center">
                    <div>
                      <span className="text-[10px] font-medium text-slate-400 block">
                        Total
                      </span>
                      <span className="text-xs font-bold text-slate-900 tabular-nums">
                        ₹{folder.totalBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-emerald-600 block">
                        Paid
                      </span>
                      <span className="text-xs font-bold text-emerald-600 tabular-nums">
                        ₹{folder.paidBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-medium text-amber-600 block">
                        Due
                      </span>
                      <span
                        className={`text-xs font-bold tabular-nums ${
                          hasDues ? "text-amber-600" : "text-slate-400"
                        }`}
                      >
                        ₹{folder.pendingBudget.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9D00FF]">
                    <span>Open Folder Workspace</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Projects Grid */}
      {(viewMode === "all" || activeFolder) && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#9D00FF]" />
              <span>
                {activeFolder
                  ? `${activeFolder}'s Creative Deliverables`
                  : "All Projects"}{" "}
                ({displayedProjects.length})
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="py-20 text-center font-medium text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF]" />
              <span>Loading projects from database...</span>
            </div>
          ) : displayedProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
              <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-base text-slate-900">
                No Projects Found
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No deliverables found matching your filter criteria. Click
                &quot;Add Work&quot; to schedule a new project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedProjects.map((proj) => {
                const isPaid = proj.payment_status === "paid";
                const pBudget = parseFloat(String(proj.budget)) || 0;
                const workDate =
                  proj.date || proj.created_at?.split("T")[0] || "Recent";
                const dueDate = proj.due_date || proj.deadline || workDate;
                const displayTitle =
                  proj.title || proj.name || "Untitled Deliverable";

                return (
                  <div
                    key={proj.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              proj.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-[#9D00FF] border border-blue-200"
                            }`}
                          >
                            {proj.status}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              handleTogglePayment(proj.id, proj.payment_status)
                            }
                            title="Click to toggle Paid / Due"
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 transition select-none ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                            }`}
                          >
                            {isPaid ? (
                              <>
                                <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                                <span>Paid</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-2.5 h-2.5" />
                                <span>Payment Due</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <button
                            onClick={() => {
                              setEditingBudgetProject(proj);
                              setUpdatedBudgetVal(String(proj.budget));
                            }}
                            className="p-1 rounded-md hover:bg-slate-100 hover:text-slate-600 transition"
                            title="Edit Budget"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProject(proj.id, displayTitle)
                            }
                            className="p-1 rounded-md hover:bg-red-50 hover:text-red-600 transition"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-slate-900 leading-snug">
                        {displayTitle}
                      </h4>

                      <div className="flex items-center gap-2 flex-wrap mt-1.5">
                        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{proj.client || "Direct Client"}</span>
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {proj.industry || "General"}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-50 text-[#9D00FF]">
                          {proj.category || "Graphic Design"}
                        </span>
                      </div>

                      <div className="text-[11px] font-medium text-slate-500 mt-2.5 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Work Date: {workDate}</span>
                        </span>
                        <span>•</span>
                        <span>Due: {dueDate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-bold text-slate-900 tabular-nums">
                          ₹{pBudget.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => {
                            setEditingBudgetProject(proj);
                            setUpdatedBudgetVal(String(proj.budget));
                          }}
                          className="text-slate-400 hover:text-slate-600"
                          title="Quick Edit Budget"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openInvoiceGenerator("single", proj)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shadow-sm"
                          title="Generate individual invoice for this work"
                        >
                          <Receipt className="w-3 h-3 text-[#9D00FF]" />
                          <span>Invoice</span>
                        </button>

                        <Link
                          href={`/dashboard/freelancer/projects/${proj.id}`}
                          className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Invoice Generator Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-2xl w-full space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Generate & Customize Invoice
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modify line items, prices, and terms before saving or
                    printing
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  value={invoiceData.invoiceNumber}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      invoiceNumber: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  Client / Brand Name
                </label>
                <input
                  type="text"
                  value={invoiceData.clientName}
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      clientName: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  Payment Due Date
                </label>
                <input
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                  }
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deliverables & Line Items ({invoiceData.items.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddInvoiceItem}
                  className="text-xs font-bold text-[#9D00FF] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                <div className="grid grid-cols-12 bg-slate-50 p-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <div className="col-span-1 text-center">Inc.</div>
                  <div className="col-span-6">Work Description</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate (₹)</div>
                  <div className="col-span-1 text-center">Del</div>
                </div>

                {invoiceData.items.map((it) => (
                  <div
                    key={it.id}
                    className={`grid grid-cols-12 p-2 items-center gap-1 text-xs transition ${
                      it.selected ? "bg-white" : "bg-slate-50 opacity-50"
                    }`}
                  >
                    <div className="col-span-1 text-center">
                      <input
                        type="checkbox"
                        checked={it.selected}
                        onChange={(e) =>
                          handleUpdateInvoiceItem(
                            it.id,
                            "selected",
                            e.target.checked,
                          )
                        }
                        className="rounded border-slate-300 text-[#9D00FF] focus:ring-0"
                      />
                    </div>

                    <div className="col-span-6">
                      <input
                        type="text"
                        value={it.description}
                        onChange={(e) =>
                          handleUpdateInvoiceItem(
                            it.id,
                            "description",
                            e.target.value,
                          )
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                      />
                    </div>

                    <div className="col-span-2 text-center">
                      <input
                        type="number"
                        min="1"
                        value={it.qty}
                        onChange={(e) =>
                          handleUpdateInvoiceItem(
                            it.id,
                            "qty",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-14 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-xs font-medium text-center text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                      />
                    </div>

                    <div className="col-span-2 text-right">
                      <input
                        type="number"
                        min="0"
                        value={it.rate}
                        onChange={(e) =>
                          handleUpdateInvoiceItem(
                            it.id,
                            "rate",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-20 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-1 text-xs font-bold text-right text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                      />
                    </div>

                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveInvoiceItem(it.id)}
                        className="text-slate-300 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Bank / UPI Payment Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={invoiceData.paymentDetails}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        paymentDetails: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                    Client Note / Terms
                  </label>
                  <input
                    type="text"
                    value={invoiceData.notes}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, notes: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-bold">
                    ₹{invoiceSubtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <span>Tax (GST %):</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={invoiceData.taxPercent}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          taxPercent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-12 bg-white border border-slate-200 rounded px-1 text-center text-xs"
                    />
                  </span>
                  <span className="tabular-nums">
                    ₹{invoiceTax.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <span>Discount (₹):</span>
                    <input
                      type="number"
                      min="0"
                      value={invoiceData.discountAmount}
                      onChange={(e) =>
                        setInvoiceData({
                          ...invoiceData,
                          discountAmount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-16 bg-white border border-slate-200 rounded px-1 text-right text-xs"
                    />
                  </span>
                  <span className="tabular-nums text-emerald-600">
                    -₹{invoiceData.discountAmount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Grand Total (Due):</span>
                  <span className="text-base text-[#9D00FF] tabular-nums">
                    ₹{invoiceGrandTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvoiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingInvoice}
                  onClick={handleSaveInvoice}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2 rounded-xl shadow-sm flex items-center gap-2 transition disabled:opacity-50"
                >
                  {isSavingInvoice ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Invoice...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Finalize & Record Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-md w-full space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#9D00FF]" />
                <span>
                  {activeFolder
                    ? `Add Deliverable to ${activeFolder}`
                    : "Create New Project"}
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateProjectError(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Deliverable / Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 26th Sep Dinner Design, Festival Poster"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>

              {!activeFolder && (
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Client / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Food & Link"
                    value={newProject.client}
                    onChange={(e) =>
                      setNewProject({ ...newProject, client: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Industry Type
                  </label>
                  <select
                    value={newProject.industry}
                    onChange={(e) =>
                      setNewProject({ ...newProject, industry: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  >
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Fee / Budget (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={newProject.budget}
                    onChange={(e) =>
                      setNewProject({ ...newProject, budget: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Work Date
                  </label>
                  <input
                    type="date"
                    value={newProject.date}
                    onChange={(e) =>
                      setNewProject({ ...newProject, date: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newProject.dueDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, dueDate: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Deliverable Type
                </label>
                <select
                  value={newProject.deliverableType}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      deliverableType: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                >
                  <option value="Flyer">Flyer</option>
                  <option value="Poster">Poster</option>
                  <option value="Brochure">Brochure</option>
                  <option value="Menu Card">Menu Card</option>
                  <option value="Instagram Reel / Video">
                    Instagram Reel / Video
                  </option>
                  <option value="Logo / Branding">Logo / Branding</option>
                  <option value="Social Media Post">Social Media Post</option>
                </select>
              </div>

              {createProjectError && (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
                >
                  {createProjectError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Deliverable...</span>
                  </>
                ) : (
                  <span>Save Project Work</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Budget Modal */}
      {editingBudgetProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xl max-w-xs w-full space-y-3">
            <h4 className="font-bold text-sm text-slate-900">
              Modify Deliverable Fee
            </h4>
            <p className="text-xs text-slate-500">
              {editingBudgetProject.title ||
                editingBudgetProject.name ||
                "Deliverable"}
            </p>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                Amount (₹ INR)
              </label>
              <input
                type="number"
                min="0"
                value={updatedBudgetVal}
                onChange={(e) => setUpdatedBudgetVal(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingBudgetProject(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-1.5 rounded-lg bg-[#9D00FF] text-white font-semibold text-xs shadow-sm hover:bg-[#7A00CC]"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
