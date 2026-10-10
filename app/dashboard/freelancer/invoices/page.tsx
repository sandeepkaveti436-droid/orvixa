"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  Loader2,
  Sparkles,
  Building,
  IndianRupee,
  Receipt,
  X,
  Edit3,
  Upload,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface InvoiceItem {
  id: string;
  invoice_number: string;
  client: string;
  client_phone?: string;
  client_email?: string;
  client_address?: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | string;
  issue_date: string;
  due_date?: string;
  items?: any;
  notes?: string;
  tax_percent?: number;
  created_at?: string;
}

interface CompanyProfile {
  companyName: string;
  tagline: string;
  logoDataUrl?: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  ifscCode: string;
  signatoryName: string;
  signatoryTitle: string;
}

const DEFAULT_COMPANY_PROFILE: CompanyProfile = {
  companyName: "Sky Nova Digitals",
  tagline: "Build What's Next.",
  logoDataUrl: "",
  phone: "+91 939 252 5043",
  email: "skynovadigitals@gmail.com",
  website: "skynovadigitals.vercel.app",
  address: "Beeramguda, Hyderabad, Telangana",
  accountNumber: "018391600022849",
  accountName: "Sandeep Kaveti",
  bankName: "Yes Bank",
  ifscCode: "YESB0000183",
  signatoryName: "Sandeep Kaveti",
  signatoryTitle: "Creative Director & Founder",
};

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );

  // Business Profile
  const [profile, setProfile] = useState<CompanyProfile>(
    DEFAULT_COMPANY_PROFILE,
  );
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Client & Tax Edit Modal
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [clientEditData, setClientEditData] = useState({
    client: "",
    client_phone: "",
    client_email: "",
    client_address: "",
    tax_percent: 0,
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchInvoices();
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = () => {
    try {
      const saved = localStorage.getItem("orvixa_company_invoice_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load company profile:", e);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "orvixa_company_invoice_profile",
      JSON.stringify(profile),
    );
    setShowProfileModal(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Please upload a logo image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          logoDataUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching invoices:", error.message);

      if (data && data.length > 0) {
        const normalized: InvoiceItem[] = data.map((inv: any) => ({
          id: String(inv.id),
          invoice_number:
            inv.invoice_number ||
            inv.invoice_no ||
            `INV-${String(inv.id).slice(-5).toUpperCase()}`,
          client: inv.client || inv.client_name || "Food Link F&B Holdings",
          client_phone: inv.client_phone || "",
          client_email: inv.client_email || "",
          client_address: inv.client_address || "",
          amount: parseFloat(String(inv.amount || inv.total || 0)),
          status: inv.status || "Pending",
          issue_date:
            inv.issue_date ||
            inv.date ||
            inv.created_at?.split("T")[0] ||
            new Date().toISOString().split("T")[0],
          due_date: inv.due_date || null,
          items:
            typeof inv.items === "string" ? JSON.parse(inv.items) : inv.items,
          notes: inv.notes || "",
          tax_percent:
            typeof inv.tax_percent === "number" ? inv.tax_percent : 0,
          created_at: inv.created_at,
        }));

        setInvoices(normalized);
      } else {
        setInvoices([]);
      }
    } catch (err: any) {
      console.error("Invoices error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    let totalIssued = 0;
    let amountDue = 0;

    invoices.forEach((inv) => {
      const amt = inv.amount || 0;
      totalIssued += amt;
      if ((inv.status || "").toLowerCase() !== "paid") {
        amountDue += amt;
      }
    });

    return {
      totalIssued,
      amountDue,
      totalCount: invoices.length,
    };
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q),
    );
  }, [invoices, searchQuery]);

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: nextStatus } : inv)),
    );
    try {
      await supabase
        .from("invoices")
        .update({ status: nextStatus })
        .eq("id", id);
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    try {
      await supabase.from("invoices").delete().eq("id", id);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleOpenInvoice = (inv: InvoiceItem) => {
    setSelectedInvoice(inv);
    setClientEditData({
      client: inv.client || "",
      client_phone: inv.client_phone || "",
      client_email: inv.client_email || "",
      client_address: inv.client_address || "",
      tax_percent: inv.tax_percent ?? 0,
      due_date: inv.due_date || "",
      notes: inv.notes || "",
    });
  };

  const handleSaveClientDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const updatedInv: InvoiceItem = {
      ...selectedInvoice,
      client: clientEditData.client.trim() || selectedInvoice.client,
      client_phone: clientEditData.client_phone.trim(),
      client_email: clientEditData.client_email.trim(),
      client_address: clientEditData.client_address.trim(),
      tax_percent: Number(clientEditData.tax_percent) || 0,
      due_date: clientEditData.due_date || selectedInvoice.due_date,
      notes: clientEditData.notes,
    };

    setSelectedInvoice(updatedInv);
    setInvoices((prev) =>
      prev.map((it) => (it.id === updatedInv.id ? updatedInv : it)),
    );
    setShowEditClientModal(false);

    try {
      await supabase
        .from("invoices")
        .update({
          client: updatedInv.client,
          client_phone: updatedInv.client_phone,
          client_email: updatedInv.client_email,
          client_address: updatedInv.client_address,
          tax_percent: updatedInv.tax_percent,
          due_date: updatedInv.due_date,
          notes: updatedInv.notes,
        })
        .eq("id", updatedInv.id);
    } catch (err) {
      console.warn("Could not sync client info:", err);
    }
  };

  const tableItems = useMemo(() => {
    if (!selectedInvoice) return [];
    if (
      Array.isArray(selectedInvoice.items) &&
      selectedInvoice.items.length > 0
    ) {
      return selectedInvoice.items.map((it: any) => ({
        description: it.description || it.name || "Creative Deliverable Design",
        qty: it.qty || 1,
        rate: it.rate || selectedInvoice.amount,
        total: (it.qty || 1) * (it.rate || selectedInvoice.amount),
      }));
    }
    return [
      {
        description:
          selectedInvoice.notes ||
          `${selectedInvoice.client} Creative Services`,
        qty: 1,
        rate: selectedInvoice.amount,
        total: selectedInvoice.amount,
      },
    ];
  }, [selectedInvoice]);

  const subTotal = useMemo(() => {
    return tableItems.reduce((acc, it) => acc + (it.total || 0), 0);
  }, [tableItems]);

  const taxPercent = selectedInvoice?.tax_percent ?? 0;
  const taxAmount = useMemo(() => {
    if (!taxPercent || taxPercent <= 0) return 0;
    return (subTotal * taxPercent) / 100;
  }, [subTotal, taxPercent]);

  const grandTotal = useMemo(() => {
    return subTotal + taxAmount;
  }, [subTotal, taxAmount]);

  return (
    <div className="font-sans space-y-6 pb-20 text-slate-900 not-italic">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Invoices
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Manage your client billings, custom statements, and PDF exports
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-500" />
            <span>Company &amp; Bank Profile</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-900"
            />
          </div>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL ISSUED
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              ₹{" "}
              {stats.totalIssued.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              AMOUNT DUE
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              ₹{" "}
              {stats.amountDue.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              TOTAL INVOICES
            </span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              {stats.totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">All Invoices</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              {filteredInvoices.length} records
            </span>
          </div>

          <Link
            href="/dashboard/freelancer/projects"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate from Projects</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-slate-800" />
            <span className="text-xs font-medium">Loading invoices...</span>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700">
              No invoices found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create an invoice from your Projects workspace by clicking
              &quot;Generate from Projects&quot; above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-5">Invoice #</th>
                  <th className="py-3.5 px-5">Client / Brand</th>
                  <th className="py-3.5 px-5">Issue Date</th>
                  <th className="py-3.5 px-5">Due Date</th>
                  <th className="py-3.5 px-5">Amount</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredInvoices.map((inv) => {
                  const isPaid = inv.status.toLowerCase() === "paid";

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/80 transition cursor-pointer"
                      onClick={() => handleOpenInvoice(inv)}
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {inv.invoice_number}
                      </td>

                      <td className="py-3.5 px-5 font-semibold text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          <span>{inv.client}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-5 text-slate-500">
                        {inv.issue_date}
                      </td>

                      <td className="py-3.5 px-5 text-slate-500">
                        {inv.due_date || "—"}
                      </td>

                      <td className="py-3.5 px-5 font-black text-slate-900 tabular-nums">
                        ₹ {inv.amount.toLocaleString("en-IN")}
                      </td>

                      <td
                        className="py-3.5 px-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleToggleStatus(inv.id, inv.status)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          }`}
                        >
                          {isPaid ? "Paid" : "Pending"}
                        </button>
                      </td>

                      <td
                        className="py-3.5 px-5 text-right space-x-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleOpenInvoice(inv)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-900 hover:text-white text-slate-800 font-bold transition text-xs shadow-xs"
                        >
                          View Invoice
                        </button>

                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🌟 LUXURY DESIGNER INVOICE PREVIEW MODAL                                  */}
      {/* ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="bg-[#0f172a] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Statement • {selectedInvoice.invoice_number}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowEditClientModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Client &amp; Tax</span>
                </button>

                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Company / Bank</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / PDF</span>
                </button>

                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE SHEET */}
            <div
              id="printable-invoice"
              className="p-8 sm:p-14 text-slate-900 bg-white relative font-sans space-y-9"
              style={{ minHeight: "1050px" }}
            >
              {/* 1. TOP HEADER: LOGO ONLY (NO DUPLICATE BRAND TEXT BESIDE IT) */}
              <div className="flex items-start justify-between pb-8 border-b-2 border-slate-900">
                <div className="flex items-center">
                  {profile.logoDataUrl ? (
                    <img
                      src={profile.logoDataUrl}
                      alt="Company Logo"
                      className="h-16 sm:h-20 w-auto max-w-[240px] object-contain"
                    />
                  ) : (
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                        {profile.companyName}
                      </h2>
                      {profile.tagline && (
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mt-0.5">
                          {profile.tagline}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 border border-slate-200 bg-slate-50">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedInvoice.status.toLowerCase() === "paid"
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <span>{selectedInvoice.status}</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
                    INVOICE
                  </h1>
                </div>
              </div>

              {/* 2. INVOICE META & TWO-COLUMN ADDRESS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
                {/* BILL FROM */}
                <div className="md:col-span-4 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Billed From
                  </span>
                  <h4 className="text-sm font-black text-slate-950">
                    {profile.companyName}
                  </h4>
                  <p className="text-slate-600 font-medium">{profile.phone}</p>
                  <p className="text-slate-600 font-medium">{profile.email}</p>
                  <p className="text-slate-500 leading-relaxed mt-1">
                    {profile.address}
                  </p>
                </div>

                {/* BILL TO (CLIENT DETAILS) */}
                <div className="md:col-span-5 space-y-1.5 border-l-0 md:border-l border-slate-100 md:pl-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                    Billed To
                  </span>
                  <h4 className="text-sm font-black text-slate-950">
                    {selectedInvoice.client}
                  </h4>
                  {selectedInvoice.client_phone && (
                    <p className="text-slate-600 font-medium">
                      {selectedInvoice.client_phone}
                    </p>
                  )}
                  {selectedInvoice.client_email && (
                    <p className="text-slate-600 font-medium">
                      {selectedInvoice.client_email}
                    </p>
                  )}
                  {selectedInvoice.client_address && (
                    <p className="text-slate-500 leading-relaxed mt-1">
                      {selectedInvoice.client_address}
                    </p>
                  )}
                  {!selectedInvoice.client_phone &&
                    !selectedInvoice.client_email &&
                    !selectedInvoice.client_address && (
                      <p
                        className="text-amber-600 text-[11px] font-bold italic print:hidden cursor-pointer"
                        onClick={() => setShowEditClientModal(true)}
                      >
                        + Click &quot;Edit Client &amp; Tax&quot; to set client
                        address/phone
                      </p>
                    )}
                </div>

                {/* DATES & INVOICE NUMBER */}
                <div className="md:col-span-3 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Invoice Number
                    </span>
                    <span className="text-sm font-black text-slate-900 font-mono mt-0.5 block">
                      {selectedInvoice.invoice_number}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Issue Date
                    </span>
                    <span className="text-xs font-bold text-slate-800 block">
                      {selectedInvoice.issue_date}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Payment Due
                    </span>
                    <span className="text-xs font-black text-amber-600 block">
                      {selectedInvoice.due_date || selectedInvoice.issue_date}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. FINANCIAL DELIVERABLES TABLE */}
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-12 pb-3 border-b-2 border-slate-900 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-6">
                    Work Description / Deliverable
                  </div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2 text-right">Rate (₹)</div>
                  <div className="col-span-2 text-right">Amount (₹)</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {tableItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 py-4 px-3 text-xs items-center"
                    >
                      <div className="col-span-1 text-center font-mono font-bold text-slate-400">
                        0{idx + 1}
                      </div>
                      <div className="col-span-6 font-bold text-slate-950 pr-4">
                        {item.description}
                      </div>
                      <div className="col-span-1 text-center font-bold text-slate-600">
                        {item.qty}
                      </div>
                      <div className="col-span-2 text-right font-medium text-slate-600 tabular-nums">
                        ₹{" "}
                        {item.rate.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="col-span-2 text-right font-black text-slate-950 tabular-nums">
                        ₹{" "}
                        {item.total.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOTALS (TAX IS OPTIONAL) */}
              <div className="flex flex-col items-end pt-4 border-t border-slate-200 text-xs space-y-2">
                <div className="w-80 flex justify-between text-slate-600 font-semibold px-2">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    ₹{" "}
                    {subTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {taxPercent > 0 && (
                  <div className="w-80 flex justify-between text-slate-600 font-semibold px-2">
                    <span>Tax / GST ({taxPercent}%):</span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      ₹{" "}
                      {taxAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                <div className="w-80 bg-slate-950 text-white p-4 rounded-2xl flex justify-between items-center shadow-md mt-2">
                  <span className="font-bold uppercase tracking-wider text-xs text-slate-300">
                    Total Amount Due:
                  </span>
                  <span className="text-2xl font-black text-amber-400 tabular-nums">
                    ₹{" "}
                    {grandTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* 5. BANK SETTLEMENT & SIGNATURE */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8 border-t border-slate-200 text-xs">
                <div className="md:col-span-7 bg-amber-50/50 p-5 rounded-2xl border border-amber-200/80 space-y-2.5">
                  <div className="flex items-center gap-2 text-amber-800 font-bold uppercase tracking-wider text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    <span>Direct Bank Wire / Remittance</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1.5 pt-1 text-slate-700">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Account Holder
                      </span>
                      <span className="font-bold text-slate-900">
                        {profile.accountName}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Bank Name
                      </span>
                      <span className="font-bold text-slate-900">
                        {profile.bankName}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Account Number
                      </span>
                      <span className="font-mono font-black text-slate-900 tracking-wider">
                        {profile.accountNumber}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        IFSC / Routing Code
                      </span>
                      <span className="font-mono font-black text-slate-900 tracking-wider">
                        {profile.ifscCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Terms of Settlement
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                      {selectedInvoice.notes ||
                        "Payment is due within the stipulated date. All deliverables transferred upon settlement. Thank you for your business!"}
                    </p>
                  </div>

                  <div className="pt-2 text-center md:text-right">
                    <div className="font-serif italic text-2xl text-slate-950 font-medium">
                      {profile.signatoryName}
                    </div>
                    <div className="border-t border-slate-300 mt-1.5 pt-1">
                      <p className="font-black text-xs text-slate-900 uppercase tracking-tight">
                        {profile.signatoryName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {profile.signatoryTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. CLEAN FOOTER */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 font-black">
                    {profile.companyName}
                  </span>
                  <span>•</span>
                  <span>{profile.website}</span>
                </div>

                <div>
                  <span>
                    {profile.email} • {profile.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT CLIENT & TAX MODAL */}
      {showEditClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Edit Client Information &amp; Tax
                </h3>
                <p className="text-xs text-slate-500">
                  Update client contact information and choose whether to apply
                  tax.
                </p>
              </div>
              <button
                onClick={() => setShowEditClientModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveClientDetails}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientEditData.client}
                  onChange={(e) =>
                    setClientEditData({
                      ...clientEditData,
                      client: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Client Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={clientEditData.client_phone}
                    onChange={(e) =>
                      setClientEditData({
                        ...clientEditData,
                        client_phone: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Client Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. billing@foodlink.com"
                    value={clientEditData.client_email}
                    onChange={(e) =>
                      setClientEditData({
                        ...clientEditData,
                        client_email: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Client Billing Address / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jubilee Hills, Hyderabad, Telangana"
                  value={clientEditData.client_address}
                  onChange={(e) =>
                    setClientEditData({
                      ...clientEditData,
                      client_address: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      Tax (VAT / GST) %
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Set to 0% for tax-free freelance invoices
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={clientEditData.tax_percent}
                      onChange={(e) =>
                        setClientEditData({
                          ...clientEditData,
                          tax_percent: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-20 text-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 font-bold focus:outline-none focus:border-slate-900"
                    />
                    <span className="font-bold text-slate-600">%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Custom Terms &amp; Settlement Notes
                </label>
                <textarea
                  rows={2}
                  value={clientEditData.notes}
                  onChange={(e) =>
                    setClientEditData({
                      ...clientEditData,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Payment is due within specified terms..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditClientModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
                >
                  Save &amp; Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SETUP COMPANY & BANK DETAILS MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Company Branding &amp; Bank Account Setup
                </h3>
                <p className="text-xs text-slate-500">
                  Customize the company logo, agency name, and bank transfer
                  details.
                </p>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Company Logo Image
                </label>
                <div className="flex items-center gap-4">
                  {profile.logoDataUrl ? (
                    <img
                      src={profile.logoDataUrl}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain rounded-xl border border-slate-200 p-1 bg-slate-50"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition">
                    <span>Upload Logo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={profile.tagline}
                    onChange={(e) =>
                      setProfile({ ...profile, tagline: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Office / City Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-600 block mb-2">
                  Bank Settlement Details (Printed on Invoice)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Name / A/C Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.accountName}
                      onChange={(e) =>
                        setProfile({ ...profile, accountName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.accountNumber}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={profile.bankName}
                      onChange={(e) =>
                        setProfile({ ...profile, bankName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      IFSC / Routing Code
                    </label>
                    <input
                      type="text"
                      value={profile.ifscCode}
                      onChange={(e) =>
                        setProfile({ ...profile, ifscCode: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    value={profile.signatoryName}
                    onChange={(e) =>
                      setProfile({ ...profile, signatoryName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    value={profile.signatoryTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, signatoryTitle: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
