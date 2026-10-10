"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  User,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export interface InvoiceItem {
  id: string;
  invoice_number: string;
  client: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | string;
  issue_date: string;
  due_date?: string;
  items?: any;
  notes?: string;
  created_at?: string;
}

interface BusinessProfile {
  companyName: string;
  tagline: string;
  logoUrl?: string;
  contactNumber: string;
  email: string;
  website: string;
  location: string;
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  companyName: "Sky Nova Digitals",
  tagline: "Build What's Next.",
  logoUrl: "",
  contactNumber: "+91- 9392525043",
  email: "skynovadigitals@gmail.com",
  website: "skynovadigitals.vercel.app",
  location: "Beeramguda, Hyderabad, Telangana - 502032",
  bankAccountName: "SANDEEP KAVETI",
  bankName: "Yes Bank",
  accountNumber: "018391600022849",
  ifscCode: "YESB0000183",
};

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );

  // Business profile for the invoice
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(
    DEFAULT_BUSINESS_PROFILE,
  );
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const invoicePrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvoices();
    loadSavedBusinessProfile();
  }, []);

  const loadSavedBusinessProfile = () => {
    try {
      const saved = localStorage.getItem("orvixa_invoice_business_profile");
      if (saved) {
        setBusinessProfile(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load saved business profile:", e);
    }
  };

  const handleSaveBusinessProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(
      "orvixa_invoice_business_profile",
      JSON.stringify(businessProfile),
    );
    setShowEditProfileModal(false);
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
            `000${String(inv.id).slice(-4)}`,
          client: inv.client || inv.client_name || "Client",
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

  // KPIs
  const stats = useMemo(() => {
    let totalIssued = 0;
    let amountDue = 0;

    invoices.forEach((inv) => {
      const amt = inv.amount || 0;
      totalIssued += amt;
      const s = (inv.status || "").toLowerCase();
      if (s !== "paid") {
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

  const handlePrint = () => {
    window.print();
  };

  // Parse deliverables items safely for display
  const invoiceLineItems = useMemo(() => {
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
          selectedInvoice.notes || `${selectedInvoice.client} Creative Work`,
        qty: 1,
        rate: selectedInvoice.amount,
        total: selectedInvoice.amount,
      },
    ];
  }, [selectedInvoice]);

  return (
    <div className="font-sans space-y-6 pb-20 text-slate-900 not-italic">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Invoices
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1">
            Manage and track your client billings and PDF statements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditProfileModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>Customize Company / Bank Info</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
            />
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#9D00FF] flex items-center justify-center shrink-0">
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
            <Sparkles className="w-3.5 h-3.5 text-[#9D00FF]" />
            <span>Generate from Projects</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#9D00FF]" />
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
                      onClick={() => setSelectedInvoice(inv)}
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
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold transition"
                          title="View / Print PDF"
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
      {/* FULL INVOICE MODAL - ACCURATE LAYOUT MATCHING YOUR SAMPLE SCREENSHOT     */}
      {/* ========================================================================= */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full">
            {/* Top Toolbar (Hidden when printing) */}
            <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Invoice Statement • {selectedInvoice.invoice_number}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE BODY */}
            <div
              ref={invoicePrintRef}
              id="printable-invoice"
              className="p-8 sm:p-12 text-slate-900 bg-white relative space-y-8"
              style={{ minHeight: "950px" }}
            >
              {/* TOP HEADER: LOGO & INVOICE DETAILS */}
              <div className="flex items-start justify-between">
                <div>
                  {businessProfile.logoUrl ? (
                    <img
                      src={businessProfile.logoUrl}
                      alt={businessProfile.companyName}
                      className="h-12 object-contain"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-4xl font-extrabold tracking-tight text-amber-500 font-mono">
                        SND
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-semibold italic text-slate-500 mt-1">
                    {businessProfile.tagline || "Build What's Next."}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400 block">
                    Invoice number:
                  </span>
                  <span className="text-base font-bold text-slate-900 block mt-0.5">
                    №: {selectedInvoice.invoice_number.replace(/^INV-/, "")}
                  </span>

                  <span className="text-xs font-medium text-slate-400 block mt-2">
                    Issued:
                  </span>
                  <span className="text-sm font-bold text-slate-900 block mt-0.5">
                    {selectedInvoice.issue_date}
                  </span>
                </div>
              </div>

              {/* THREE CARDS ROW: BILL TO, BILL FROM, AMOUNT DUE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. BILL TO CARD */}
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>BILL TO:</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <User className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {selectedInvoice.client}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2">
                          Contact : +91-XXXXXXXXXX
                        </p>
                        <p className="text-xs text-slate-400 tracking-widest my-1">
                          ---------------------
                        </p>
                        <p className="text-xs text-slate-500">
                          Location : Hyderabad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. BILL FROM CARD */}
                <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                      <span>BILL FROM:</span>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Building className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {businessProfile.companyName}
                        </h4>
                        <p className="text-xs text-slate-500 mt-2">
                          Contact : {businessProfile.contactNumber}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {businessProfile.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. AMOUNT DUE CARD (GOLD COLOR BLOCK LIKE SAMPLE) */}
                <div className="bg-[#f59e0b] text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center gap-2 text-xs font-bold text-white/90 uppercase tracking-wider">
                    <span className="w-4 h-4 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    <span>AMOUNT DUE</span>
                  </div>

                  <div className="my-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90 block">
                      INR
                    </span>
                    <span className="text-3xl font-black text-white tabular-nums tracking-tight block mt-1">
                      ₹{" "}
                      {selectedInvoice.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-white/90 block">
                    {selectedInvoice.due_date || selectedInvoice.issue_date}
                  </span>
                </div>
              </div>

              {/* DELIVERABLES & LINE ITEMS TABLE */}
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">
                  <div className="col-span-6">DESCRIPTION</div>
                  <div className="col-span-2 text-center">QTY</div>
                  <div className="col-span-2 text-right">PRICE</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>

                <div className="space-y-2">
                  {invoiceLineItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center px-5 py-4 rounded-2xl bg-white border border-slate-200/90 text-sm shadow-xs"
                    >
                      <div className="col-span-6 font-bold text-slate-900">
                        {item.description}
                      </div>
                      <div className="col-span-2 text-center text-slate-600 font-semibold">
                        {item.qty}
                      </div>
                      <div className="col-span-2 text-right text-slate-600 font-semibold tabular-nums">
                        ₹{" "}
                        {item.rate.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="col-span-2 text-right font-black text-slate-900 tabular-nums">
                        ₹{" "}
                        {item.total.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL AMOUNT LINE */}
                <div className="flex flex-col items-end pt-4 pr-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    TOTAL AMOUNT:
                  </span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums mt-1">
                    ₹{" "}
                    {selectedInvoice.amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* BOTTOM SECTION: TERMS AND BANK TRANSFER DETAILS */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
                {/* Terms and conditions */}
                <div className="md:col-span-6 space-y-2">
                  <h5 className="text-xs font-bold text-slate-700">
                    Terms & Conditions:
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm">
                    Fees and payment terms will be established in the contract
                    or agreement prior to the commencement of the project. An
                    initial deposit will be required before any design work
                    begins. We reserve the right to suspend or halt work in the
                    event of non-payment.
                  </p>
                </div>

                {/* Bank details card with Gold Border */}
                <div className="md:col-span-6 border-2 border-amber-400 rounded-2xl p-5 bg-white space-y-2.5 text-xs">
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-900">Name</span>
                    <span className="col-span-2 text-slate-700 font-medium">
                      {businessProfile.bankAccountName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-900">
                      Bank details
                    </span>
                    <span className="col-span-2 text-slate-700 font-medium">
                      {businessProfile.bankName}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-900">Account #</span>
                    <span className="col-span-2 text-slate-700 font-medium tracking-wide">
                      {businessProfile.accountNumber}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-bold text-slate-900">IFS code</span>
                    <span className="col-span-2 text-slate-700 font-medium tracking-wider">
                      {businessProfile.ifscCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* INVOICE FOOTER WITH SLIGHT BLUE GLOW ACCENT */}
              <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium text-slate-500">
                <div>
                  <span className="font-bold text-slate-900 uppercase tracking-wider block">
                    {businessProfile.companyName}
                  </span>
                  <span className="italic text-slate-400">
                    {businessProfile.tagline}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block">
                    Website : {businessProfile.website}
                  </span>
                  <span className="block mt-0.5">
                    {businessProfile.email} | {businessProfile.contactNumber}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL TO EDIT BUSINESS & BANK DETAILS (SAVED FOR ALL USERS)              */}
      {/* ========================================================================= */}
      {showEditProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">
                Customize Your Invoice Branding & Bank Details
              </h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveBusinessProfile}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Company / Freelancer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessProfile.companyName}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        companyName: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={businessProfile.tagline}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={businessProfile.contactNumber}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        contactNumber: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={businessProfile.email}
                    onChange={(e) =>
                      setBusinessProfile({
                        ...businessProfile,
                        email: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Website URL
                </label>
                <input
                  type="text"
                  value={businessProfile.website}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      website: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Office / City Location Address
                </label>
                <input
                  type="text"
                  value={businessProfile.location}
                  onChange={(e) =>
                    setBusinessProfile({
                      ...businessProfile,
                      location: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-600 block mb-2">
                  Bank Transfer Settlement Details
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={businessProfile.bankAccountName}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          bankAccountName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={businessProfile.bankName}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          bankName: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={businessProfile.accountNumber}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      value={businessProfile.ifscCode}
                      onChange={(e) =>
                        setBusinessProfile({
                          ...businessProfile,
                          ifscCode: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
