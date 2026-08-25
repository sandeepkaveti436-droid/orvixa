"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Printer,
  Download,
  Trash2,
  X,
  Loader2,
  Building,
  User,
  Eye,
  Layers,
  FolderKanban,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
}

export default function InvoicesPage() {
  const searchParams = useSearchParams();
  const prefillProjectId = searchParams.get("projectId");

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Invoice Form State
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: `№: 000${Math.floor(100 + Math.random() * 900)}`,
    project_id: "",
    project_name: "",
    client_name: "",
    client_contact: "+91-XXXXXXXXXX",
    client_location: "Hyderabad",
    issued_date: new Date().toISOString().split("T")[0],
    items: [
      { description: "14th Event Design", qty: 1, price: 2500 },
    ] as InvoiceItem[],
  });

  const uniqueClients = Array.from(
    new Set(projects.map((p) => (p.client || "").trim()).filter(Boolean)),
  );

  useEffect(() => {
    fetchInvoicesAndProjects();

    if (typeof window !== "undefined" && !(window as any).html2pdf) {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const fetchInvoicesAndProjects = async () => {
    try {
      setLoading(true);

      const [invRes, projRes] = await Promise.all([
        supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (invRes.data) setInvoices(invRes.data);
      if (projRes.data) {
        setProjects(projRes.data);

        if (prefillProjectId) {
          const matched = projRes.data.find((p) => p.id === prefillProjectId);
          if (matched) {
            const clientAllProjects = projRes.data.filter(
              (p) =>
                (p.client || "").toLowerCase() ===
                (matched.client || "").toLowerCase(),
            );

            const initialItems: InvoiceItem[] = clientAllProjects.map((p) => ({
              description: p.name,
              qty: 1,
              price: Number(p.budget) || 0,
            }));

            setInvoiceForm({
              invoice_number: `№: 000${Math.floor(100 + Math.random() * 900)}`,
              project_id: matched.id,
              project_name:
                clientAllProjects.length > 1
                  ? `${matched.client} (Combined Projects)`
                  : matched.name,
              client_name: matched.client,
              client_contact: "+91-XXXXXXXXXX",
              client_location: "Hyderabad",
              issued_date: new Date().toISOString().split("T")[0],
              items:
                initialItems.length > 0
                  ? initialItems
                  : [
                      {
                        description: matched.name,
                        qty: 1,
                        price: Number(matched.budget) || 0,
                      },
                    ],
            });
            setShowCreateModal(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSingleProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      setInvoiceForm({
        ...invoiceForm,
        project_id: proj.id,
        project_name: proj.name,
        client_name: proj.client,
        items: [
          {
            description: `${proj.name} Deliverables`,
            qty: 1,
            price: Number(proj.budget) || 0,
          },
        ],
      });
    }
  };

  const handleCombineClientProjects = (clientName: string) => {
    const clientProjects = projects.filter(
      (p) => (p.client || "").toLowerCase() === clientName.toLowerCase(),
    );

    if (clientProjects.length > 0) {
      const combinedItems: InvoiceItem[] = clientProjects.map((p) => ({
        description: p.name,
        qty: 1,
        price: Number(p.budget) || 0,
      }));

      setInvoiceForm({
        ...invoiceForm,
        client_name: clientName,
        project_name: `${clientName} (Combined ${clientProjects.length} Projects)`,
        project_id: clientProjects[0].id,
        items: combinedItems,
      });
    }
  };

  const handleAddItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [
        ...invoiceForm.items,
        { description: "Additional Deliverable", qty: 1, price: 1000 },
      ],
    });
  };

  const handleUpdateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: any,
  ) => {
    const updated = [...invoiceForm.items];
    updated[index] = { ...updated[index], [field]: value };
    setInvoiceForm({ ...invoiceForm, items: updated });
  };

  const handleRemoveItem = (index: number) => {
    if (invoiceForm.items.length === 1) return;
    setInvoiceForm({
      ...invoiceForm,
      items: invoiceForm.items.filter((_, i) => i !== index),
    });
  };

  const calculatedTotal = invoiceForm.items.reduce(
    (sum, item) => sum + (Number(item.qty) || 1) * (Number(item.price) || 0),
    0,
  );

  const handleDownloadPDF = (invoice: any) => {
    setIsDownloading(true);
    const element = document.getElementById("printable-invoice");

    if (element && (window as any).html2pdf) {
      const cleanNum = (invoice?.invoice_number || "0001").replace(
        /[^a-zA-Z0-9_-]/g,
        "_",
      );
      const opt = {
        margin: [0.15, 0.15, 0.15, 0.15],
        filename: `SND_Invoice_${cleanNum}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      (window as any)
        .html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => setIsDownloading(false))
        .catch(() => {
          setIsDownloading(false);
          window.print();
        });
    } else {
      setIsDownloading(false);
      window.print();
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const clientValue = invoiceForm.client_name.trim();

    try {
      const payload: any = {
        invoice_number: invoiceForm.invoice_number,
        project_id: invoiceForm.project_id || null,
        project_name: invoiceForm.project_name || "Client Deliverables",
        client: clientValue,
        client_name: clientValue,
        client_contact: invoiceForm.client_contact || "+91-XXXXXXXXXX",
        client_location: invoiceForm.client_location || "Hyderabad",
        amount: calculatedTotal,
        status: "Pending",
        issued_date: invoiceForm.issued_date,
        items: invoiceForm.items,
      };

      const { data, error } = await supabase
        .from("invoices")
        .insert([payload])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setInvoices([data[0], ...invoices]);
        setSelectedInvoice(data[0]);
        setShowCreateModal(false);
      }
    } catch (err: any) {
      alert(`Error creating invoice: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    try {
      await supabase
        .from("invoices")
        .update({ status: nextStatus })
        .eq("id", id);
      setInvoices(
        invoices.map((inv) =>
          inv.id === id ? { ...inv, status: nextStatus } : inv,
        ),
      );
      if (selectedInvoice?.id === id) {
        setSelectedInvoice({ ...selectedInvoice, status: nextStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    await supabase.from("invoices").delete().eq("id", id);
    setInvoices(invoices.filter((i) => i.id !== id));
    if (selectedInvoice?.id === id) setSelectedInvoice(null);
  };

  const totalCollected = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const pendingAmount = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const filteredInvoices = invoices.filter(
    (i) =>
      (i.client || i.client_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (i.invoice_number || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (i.project_name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Invoices & Billing...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-900 pb-16">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Invoices & </span>
            <span className="italic text-[#0047AB]">Billing.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage billing statements, issue single or combined project
            invoices, and download PDFs in ₹ INR.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2 transition font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* TOP 3 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            TOTAL COLLECTED
          </span>
          <div className="text-3xl font-black text-emerald-600 font-sans">
            ₹{totalCollected.toLocaleString("en-IN")}
          </div>
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-sans">
            ✓ Paid Invoices
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            PENDING INVOICES
          </span>
          <div className="text-3xl font-black text-amber-600 font-sans">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </div>
          <span className="text-xs font-bold text-amber-600 font-sans">
            Awaiting Payment
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-1 font-sans">
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider font-sans">
            TOTAL INVOICES
          </span>
          <div className="text-3xl font-black text-slate-900 font-sans">
            {invoices.length} Issued
          </div>
          <span className="text-xs font-bold text-blue-600 font-sans">
            ✓ Real Database Synced
          </span>
        </div>
      </div>

      {/* INVOICE LIST */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 font-sans">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <FileText className="w-5 h-5 text-[#0047AB]" />
            <span>All Invoices ({invoices.length})</span>
          </h3>

          <div className="relative w-full sm:w-72 font-sans">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client, invoice #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            />
          </div>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="space-y-3 font-sans">
            {filteredInvoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition font-sans"
              >
                <div className="font-sans">
                  <div className="flex items-center gap-2.5 mb-1 font-sans">
                    <span className="font-bold text-sm text-slate-900 font-sans">
                      {inv.invoice_number}
                    </span>
                    <button
                      onClick={() => handleToggleStatus(inv.id, inv.status)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer font-sans ${
                        inv.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {inv.status === "Paid" ? "✓ Paid" : "⏳ Pending Payment"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-2 font-sans">
                    <span>
                      Client:{" "}
                      <strong className="text-slate-800 font-sans">
                        {inv.client || inv.client_name}
                      </strong>
                    </span>
                    <span>• {inv.project_name}</span>
                    <span>• Issued: {inv.issued_date}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 font-sans">
                  <span className="text-lg font-black text-[#0047AB] font-sans">
                    ₹
                    {Number(inv.amount || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="bg-[#0047AB] hover:bg-[#003680] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-sm font-sans"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View / Download PDF</span>
                  </button>

                  <button
                    onClick={() => handleDeleteInvoice(inv.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition font-sans"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-3 font-sans">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-900 text-base font-sans">
              No Invoices Created Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Draft your first professional invoice and bill your clients in ₹
              INR.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md font-sans"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Invoice</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE INVOICE FORM ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-2xl my-auto font-sans border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b font-sans">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Create Client Invoice (₹ INR)
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 font-sans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleCreateInvoice}
              className="space-y-4 font-sans"
            >
              {/* Option 1: Single Project */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 font-sans">
                <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5 font-sans">
                  <FolderKanban className="w-3.5 h-3.5 text-[#0047AB]" />
                  <span>Option A: Invoice a Single Separate Project</span>
                </label>
                <select
                  value={invoiceForm.project_id}
                  onChange={(e) => {
                    if (e.target.value)
                      handleSelectSingleProject(e.target.value);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#0047AB] font-sans"
                >
                  <option value="">-- Choose an Individual Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Client: {p.client} — ₹
                      {Number(p.budget).toLocaleString("en-IN")})
                    </option>
                  ))}
                </select>
              </div>

              {/* Option 2: Combine All Projects for 1 Client */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1.5 font-sans">
                <label className="text-xs font-bold text-[#0047AB] block flex items-center gap-1.5 font-sans">
                  <Layers className="w-3.5 h-3.5" />
                  <span>
                    Option B: Combine All Projects for a Client (Single Combined
                    Invoice)
                  </span>
                </label>
                <select
                  onChange={(e) => {
                    if (e.target.value)
                      handleCombineClientProjects(e.target.value);
                  }}
                  className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-[#0047AB] font-sans"
                >
                  <option value="">
                    -- Choose Client to Combine All Deliverables --
                  </option>
                  {uniqueClients.map((c, i) => {
                    const count = projects.filter((p) => p.client === c).length;
                    return (
                      <option key={i} value={c}>
                        {c} ({count} Total Projects Combined)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Meta fields */}
              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.invoice_number}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        invoice_number: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Bill To (Client Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Food Link F&B Holdings LTD"
                    value={invoiceForm.client_name}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        client_name: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-sans">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Client Contact
                  </label>
                  <input
                    type="text"
                    value={invoiceForm.client_contact}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        client_contact: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
                    Location
                  </label>
                  <input
                    type="text"
                    value={invoiceForm.client_location}
                    onChange={(e) =>
                      setInvoiceForm({
                        ...invoiceForm,
                        client_location: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#0047AB] font-sans"
                  />
                </div>
              </div>

              {/* Line items */}
              <div className="space-y-2 pt-1 font-sans">
                <div className="flex justify-between items-center font-sans">
                  <label className="text-xs font-bold text-slate-700 font-sans">
                    Line Items & Deliverables
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1 font-sans"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Line Item
                  </button>
                </div>

                <div className="space-y-2 max-h-44 overflow-y-auto pr-1 font-sans">
                  {invoiceForm.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 font-sans"
                    >
                      <input
                        type="text"
                        required
                        placeholder="Description (e.g. 14th Event Design)"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(idx, "description", e.target.value)
                        }
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold font-sans"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.qty}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "qty",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="w-14 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-center font-semibold font-sans"
                      />
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={item.price}
                        onChange={(e) =>
                          handleUpdateItem(
                            idx,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-24 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 font-sans"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2 text-xs font-bold border-t font-sans">
                  <span className="text-slate-500 font-sans">
                    Calculated Total:
                  </span>
                  <span className="text-base font-black text-[#0047AB] font-sans">
                    ₹
                    {calculatedTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs py-3.5 rounded-xl shadow-md transition disabled:opacity-50 mt-2 font-sans"
              >
                {isSaving
                  ? "Generating Invoice..."
                  : "Generate Sky Nova Digitals Invoice"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= FLOATING MODAL: EXACT SND TEMPLATE ================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans print:p-0 print:bg-white">
          <div className="bg-slate-900 rounded-3xl max-w-3xl w-full shadow-2xl my-auto overflow-hidden border border-slate-700/60 font-sans print:border-none print:shadow-none print:m-0 print:max-w-none">
            {/* Top Toolbar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden font-sans">
              <div className="flex items-center gap-2 font-sans">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5B400] inline-block" />
                <span className="text-xs font-bold text-slate-100 font-sans">
                  Invoice Ready
                </span>
                <span className="text-xs text-slate-400 font-semibold font-sans">
                  ({selectedInvoice.invoice_number})
                </span>
              </div>

              <div className="flex items-center gap-3 font-sans">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  disabled={isDownloading}
                  className="bg-[#F5B400] hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-md font-sans disabled:opacity-50"
                >
                  {isDownloading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-sans border border-slate-700"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition font-sans"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* --- EXACT SND INVOICE DOCUMENT SHEET --- */}
            <div
              id="printable-invoice"
              className="p-8 sm:p-12 space-y-7 bg-white text-slate-900 font-sans relative overflow-hidden print:p-8"
            >
              {/* Soft Blue Glow at Bottom */}
              <div className="absolute -bottom-16 left-0 right-0 h-44 bg-gradient-to-t from-blue-300/25 via-indigo-100/20 to-transparent blur-3xl pointer-events-none" />

              {/* 1. Header: Official SND Logo Image & Invoice Number */}
              <div className="flex items-start justify-between font-sans">
                <div>
                  <img
                    src="/snd-logo.png"
                    alt="SND - Sky Nova Digitals"
                    className="h-14 sm:h-16 w-auto object-contain"
                    onError={(e: any) => {
                      // Fallback if snd-logo.png is not yet in the public folder
                      e.currentTarget.style.display = "none";
                      const fallback = document.getElementById("snd-text-logo");
                      if (fallback) fallback.style.display = "block";
                    }}
                  />

                  {/* Built-in Fallback matching logo font */}
                  <div id="snd-text-logo" style={{ display: "none" }}>
                    <div className="text-4xl font-black text-[#F5B400] tracking-widest leading-none font-sans">
                      SND
                    </div>
                    <p className="text-xs italic text-[#0F172A] mt-1 font-medium font-sans">
                      We build software systems that grow with your business.
                    </p>
                  </div>
                </div>

                <div className="text-right font-sans">
                  <span className="text-[11px] text-slate-400 font-medium block font-sans">
                    Invoice number:
                  </span>
                  <span className="text-sm font-black text-slate-900 block font-sans">
                    {selectedInvoice.invoice_number}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-1.5 font-sans">
                    Issued:
                  </span>
                  <span className="text-xs font-bold text-slate-800 block font-sans">
                    {new Date(selectedInvoice.issued_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* 2. Top 3 Cards (BILL TO, BILL FROM, AMOUNT DUE) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
                {/* BILL TO */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100/90 space-y-2 text-xs font-sans">
                  <span className="text-[10px] font-black text-[#F5B400] uppercase flex items-center gap-1 tracking-wider font-sans">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F5B400] text-slate-950 flex items-center justify-center text-[9px] font-black font-sans">
                      ✓
                    </span>
                    BILL TO:
                  </span>
                  <div className="flex items-start gap-2 pt-1 font-sans">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-snug font-sans">
                        {selectedInvoice.client || selectedInvoice.client_name}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 font-sans">
                        Contact :{" "}
                        {selectedInvoice.client_contact || "+91-XXXXXXXXXX"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-dashed border-slate-200 pt-1.5 text-[11px] text-slate-500 font-sans">
                    Location : {selectedInvoice.client_location || "Hyderabad"}
                  </div>
                </div>

                {/* BILL FROM */}
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-100/90 space-y-2 text-xs font-sans">
                  <span className="text-[10px] font-black text-[#F5B400] uppercase flex items-center gap-1 tracking-wider font-sans">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#F5B400] text-slate-950 flex items-center justify-center text-[9px] font-black font-sans">
                      ✓
                    </span>
                    BILL FROM:
                  </span>
                  <div className="flex items-start gap-2 pt-1 font-sans">
                    <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Building className="w-3 h-3" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm leading-snug font-sans">
                        Sky Nova Digitals
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 font-sans">
                        Contact : +91- 9392525043
                      </p>
                      <p className="text-[11px] text-slate-500 font-sans">
                        Beeramguda, Hyderabad
                        <br />
                        Telangana - 502032
                      </p>
                    </div>
                  </div>
                </div>

                {/* AMOUNT DUE YELLOW CARD */}
                <div className="bg-[#F5B400] text-slate-950 p-5 rounded-2xl flex flex-col justify-between shadow-md font-sans">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-900 flex items-center gap-1 tracking-wider font-sans">
                      <span className="w-3.5 h-3.5 rounded-full bg-slate-950 text-[#F5B400] flex items-center justify-center text-[9px] font-black font-sans">
                        ✓
                      </span>
                      AMOUNT DUE
                    </span>
                    <span className="text-[10px] font-bold block mt-3 text-slate-900/80 uppercase tracking-wider font-sans">
                      INR
                    </span>
                    <div className="text-2xl font-black text-slate-950 font-sans">
                      ₹{" "}
                      {Number(selectedInvoice.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-900/90 mt-2 block font-sans">
                    {new Date(selectedInvoice.issued_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>

              {/* 3. LINE ITEMS (ROUNDED ROW PILLS) */}
              <div className="space-y-2 font-sans">
                <div className="grid grid-cols-12 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-4 font-sans">
                  <div className="col-span-6 font-sans">DESCRIPTION</div>
                  <div className="col-span-2 text-center font-sans">QTY</div>
                  <div className="col-span-2 text-right font-sans">PRICE</div>
                  <div className="col-span-2 text-right font-sans">TOTAL</div>
                </div>

                {Array.isArray(selectedInvoice.items) &&
                selectedInvoice.items.length > 0 ? (
                  selectedInvoice.items.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 items-center bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-800 shadow-sm font-sans"
                    >
                      <div className="col-span-6 font-bold text-slate-900 font-sans">
                        {item.description}
                      </div>
                      <div className="col-span-2 text-center text-slate-600 font-sans">
                        {item.qty || 1}
                      </div>
                      <div className="col-span-2 text-right text-slate-600 font-sans">
                        ₹{" "}
                        {Number(item.price).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="col-span-2 text-right font-black text-slate-950 font-sans">
                        ₹{" "}
                        {(
                          Number(item.qty || 1) * Number(item.price || 0)
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-12 items-center bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-800 shadow-sm font-sans">
                    <div className="col-span-6 font-bold text-slate-900 font-sans">
                      {selectedInvoice.project_name}
                    </div>
                    <div className="col-span-2 text-center text-slate-600 font-sans">
                      1
                    </div>
                    <div className="col-span-2 text-right text-slate-600 font-sans">
                      ₹{" "}
                      {Number(selectedInvoice.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                    <div className="col-span-2 text-right font-black text-slate-950 font-sans">
                      ₹{" "}
                      {Number(selectedInvoice.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. TOTAL AMOUNT */}
              <div className="text-right pt-1 font-sans">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  TOTAL AMOUNT:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1 font-sans">
                  ₹{" "}
                  {Number(selectedInvoice.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* 5. FOOTER: TERMS & BANK DETAILS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 font-sans">
                <div className="space-y-1.5 text-[11px] text-slate-400 font-sans">
                  <span className="font-bold text-slate-700 block font-sans">
                    Terms & Conditions:
                  </span>
                  <p className="leading-relaxed font-sans">
                    Fees and payment terms will be established in the contract
                    or agreement prior to the commencement of the project. An
                    initial deposit will be required before any design work
                    begins. We reserve the right to suspend or halt work in the
                    event of non-payment.
                  </p>
                </div>

                {/* Bank Details Card (Yellow Border) */}
                <div className="bg-white p-5 rounded-2xl border-2 border-[#F5B400] text-xs space-y-2 shadow-sm font-sans">
                  <div className="flex justify-between font-sans">
                    <span className="font-bold text-slate-700 font-sans">
                      Name
                    </span>
                    <span className="font-bold text-slate-900 font-sans">
                      SANDEEP KAVETI
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-bold text-slate-700 font-sans">
                      Bank details
                    </span>
                    <span className="font-semibold text-slate-900 font-sans">
                      Yes Bank
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-bold text-slate-700 font-sans">
                      Account #
                    </span>
                    <span className="font-black text-slate-900 font-sans">
                      018391600022849
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-bold text-slate-700 font-sans">
                      IFS code
                    </span>
                    <span className="font-black text-slate-900 font-sans">
                      YESB0000183
                    </span>
                  </div>
                </div>
              </div>

              {/* 6. BOTTOM BRANDING BANNER */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2 relative z-10 font-sans">
                <div>
                  <span className="font-bold text-slate-900 block font-sans">
                    SKY NOVA DIGITALS
                  </span>
                  <span className="italic text-slate-400 font-sans">
                    We build software systems that grow with your business.
                  </span>
                </div>
                <div className="text-right font-sans">
                  <span className="font-bold text-slate-800 block font-sans">
                    Website : skynovadigitals.vercel.app
                  </span>
                  <span className="font-sans">
                    skynovadigitals@gmail.com | +91 - 93925 25043
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
