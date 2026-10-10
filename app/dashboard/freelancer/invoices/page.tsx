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
  Upload,
  Phone,
  Mail,
  Globe,
  MapPin,
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
  companyName: "DESIGN STUDIO",
  tagline: "YOUR TAGLINE HERE",
  logoDataUrl: "",
  phone: "+91 939 252 5043",
  email: "yourmail0123@gmail.com",
  website: "www.yourdomain.com",
  address: "800 Windy Ridge Road, Hyderabad",
  accountNumber: "012 345 678 900",
  accountName: "Novada Musimas Bank Details",
  bankName: "HDFC Bank",
  ifscCode: "HDFC0001234",
  signatoryName: "Lauras Smith",
  signatoryTitle: "Accountant",
};

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );

  // User's Company & Bank Details Profile
  const [profile, setProfile] = useState<CompanyProfile>(
    DEFAULT_COMPANY_PROFILE,
  );
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileConfigured, setIsProfileConfigured] = useState(false);

  useEffect(() => {
    fetchInvoices();
    loadCompanyProfile();
  }, []);

  const loadCompanyProfile = () => {
    try {
      const saved = localStorage.getItem("orvixa_company_invoice_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
        setIsProfileConfigured(true);
      } else {
        setIsProfileConfigured(false);
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
    setIsProfileConfigured(true);
    setShowProfileModal(false);
  };

  // Handle Logo Upload
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
            `#000${String(inv.id).slice(-4)}`,
          client: inv.client || inv.client_name || "Decilia Smith",
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
          tax_percent: inv.tax_percent ?? 15,
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

  // Open invoice with profile verification
  const handleOpenInvoice = (inv: InvoiceItem) => {
    if (!isProfileConfigured) {
      // Prompt user to fill details before viewing
      setShowProfileModal(true);
      setSelectedInvoice(inv);
    } else {
      setSelectedInvoice(inv);
    }
  };

  // Items table parsing
  const tableItems = useMemo(() => {
    if (!selectedInvoice) return [];
    if (
      Array.isArray(selectedInvoice.items) &&
      selectedInvoice.items.length > 0
    ) {
      return selectedInvoice.items.map((it: any) => ({
        description: it.description || it.name || "Design Work",
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

  const taxAmount = useMemo(() => {
    return subTotal * 0.15; // 15% Tax VAT
  }, [subTotal]);

  const grandTotal = useMemo(() => {
    return subTotal + taxAmount;
  }, [subTotal, taxAmount]);

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
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold shadow-xs transition"
          >
            <Edit3 className="w-4 h-4 text-amber-500" />
            <span>Company & Bank Setup</span>
          </button>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#29487d]"
            />
          </div>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#29487d] flex items-center justify-center shrink-0">
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

      {/* INVOICES LIST TABLE */}
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
            <Sparkles className="w-3.5 h-3.5 text-[#29487d]" />
            <span>Generate from Projects</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#29487d]" />
            <span className="text-xs font-medium">Loading invoices...</span>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-20 text-center text-slate-400 space-y-3">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-slate-700">
              No invoices found
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Create an invoice from your Projects workspace or by clicking
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
                          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-[#29487d] hover:text-white text-slate-800 font-bold transition text-xs shadow-xs"
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
      {/* 🌟 NEW TEMPLATE DESIGN MATCHING YOUR SAMPLE IMAGE (BLUE & GOLD STUDIO)    */}
      {/* ========================================================================= */}
      {selectedInvoice && isProfileConfigured && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
          <div className="bg-white rounded-3xl max-w-4xl w-full my-auto shadow-2xl overflow-hidden print:shadow-none print:max-w-none print:w-full">
            {/* Top Toolbar (Hidden on Print) */}
            <div className="bg-[#1c3055] text-white px-6 py-4 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Invoice Preview • {selectedInvoice.invoice_number}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Info / Logo</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-sm"
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

            {/* PRINTABLE INVOICE SHEET (A4 Aspect) */}
            <div
              id="printable-invoice"
              className="p-0 text-slate-900 bg-white relative font-sans"
              style={{ minHeight: "1120px" }}
            >
              {/* 1. ROYAL BLUE HEADER BANNER */}
              <div className="bg-[#29487d] text-white px-8 sm:px-12 pt-10 pb-6 relative overflow-hidden">
                <div className="flex items-start justify-between relative z-10">
                  {/* Left: Logo & Company Name */}
                  <div className="flex items-center gap-4">
                    {profile.logoDataUrl ? (
                      <img
                        src={profile.logoDataUrl}
                        alt="Company Logo"
                        className="w-16 h-16 object-contain bg-white/10 rounded-xl p-1"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-xl font-black text-[#29487d]">
                          ✦
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-amber-400 uppercase">
                        {profile.companyName || "DESIGN STUDIO"}
                      </h2>
                      <p className="text-xs font-semibold tracking-widest text-white/90 uppercase mt-0.5">
                        {profile.tagline || "YOUR TAGLINE HERE"}
                      </p>
                    </div>
                  </div>

                  {/* Right Decorative Pattern (Star Matrix + Curved Arch) */}
                  <div className="hidden sm:flex items-center gap-6 opacity-80">
                    <div className="text-amber-300 font-mono text-sm tracking-widest leading-none">
                      ✦ ✦ ✦<br />✦ ✦ ✦<br />✦ ✦ ✦
                    </div>
                    {/* Concentric Arch Motif */}
                    <div className="w-16 h-16 border-4 border-amber-300/40 rounded-t-full flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-amber-300/60 rounded-t-full" />
                    </div>
                  </div>
                </div>

                {/* Decorative Sawtooth / Zigzag Ribbon */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-3 bg-white"
                  style={{
                    clipPath:
                      "polygon(0% 100%, 5% 0%, 10% 100%, 15% 0%, 20% 100%, 25% 0%, 30% 100%, 35% 0%, 40% 100%, 45% 0%, 50% 100%, 55% 0%, 60% 100%, 65% 0%, 70% 100%, 75% 0%, 80% 100%, 85% 0%, 90% 100%, 95% 0%, 100% 100%)",
                  }}
                />
              </div>

              {/* 2. INVOICE META & CLIENT INFO */}
              <div className="px-8 sm:px-12 pt-8 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                {/* Left: Invoice Big Title + Dates */}
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-16 bg-amber-400 rounded-full mt-1 shrink-0" />
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">
                      INVOICE
                    </h1>
                    <div className="mt-3 space-y-1 text-xs text-slate-700 font-semibold">
                      <p>
                        <span className="font-bold">No.</span>{" "}
                        {selectedInvoice.invoice_number}
                      </p>
                      <p>
                        <span className="font-bold">Date.</span>{" "}
                        {selectedInvoice.issue_date}
                      </p>
                      <p>
                        <span className="font-bold">Due Date.</span>{" "}
                        {selectedInvoice.due_date || selectedInvoice.issue_date}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Invoice To */}
                <div className="text-left sm:text-right text-xs">
                  <span className="font-medium text-slate-400 block mb-1">
                    Invoice To.
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedInvoice.client}
                  </h3>
                  <p className="text-slate-600 mt-1">+039 123 456 7890</p>
                  <p className="text-slate-600">clientbilling@example.com</p>
                  <p className="text-slate-500 mt-0.5">
                    4599 Quincy Street, Fort Wayne, New York
                  </p>
                </div>
              </div>

              {/* 3. ITEMS TABLE */}
              <div className="px-8 sm:px-12 space-y-4">
                <div className="border-t-2 border-b-2 border-slate-900 py-3 grid grid-cols-12 text-xs font-bold text-slate-900 uppercase">
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-6 pl-2">Item Description</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>

                <div className="divide-y divide-slate-200">
                  {tableItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 py-3.5 text-xs text-slate-800 font-medium"
                    >
                      <div className="col-span-1 text-center font-bold">
                        {item.qty}
                      </div>
                      <div className="col-span-6 pl-2 font-semibold text-slate-900">
                        {item.description}
                      </div>
                      <div className="col-span-2 text-right tabular-nums">
                        ₹{" "}
                        {item.rate.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                      <div className="col-span-3 text-right font-bold text-slate-900 tabular-nums">
                        ₹{" "}
                        {item.total.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. TOTALS BLOCK WITH ROYAL BLUE BAR */}
              <div className="px-8 sm:px-12 flex flex-col items-end pt-4 space-y-2 text-xs">
                <div className="w-72 flex justify-between font-semibold text-slate-600">
                  <span>Sub-Total:</span>
                  <span className="tabular-nums font-bold text-slate-900">
                    ₹{" "}
                    {subTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="w-72 flex justify-between font-semibold text-slate-600">
                  <span>Tax Vat (15%):</span>
                  <span className="tabular-nums font-bold text-slate-900">
                    ₹{" "}
                    {taxAmount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* SOLID ROYAL BLUE TOTAL HIGHLIGHT */}
                <div className="w-72 bg-[#29487d] text-white px-5 py-3 rounded-lg flex justify-between items-center text-sm font-black shadow-sm mt-2">
                  <span className="tracking-wide uppercase">Total:</span>
                  <span className="text-xl tabular-nums">
                    ₹{" "}
                    {grandTotal.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* 5. PAYMENT METHOD, TERMS, AND SIGNATURE */}
              <div className="px-8 sm:px-12 pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
                {/* Left: Payment Method & Terms */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Payment Method.
                    </h4>
                    <p className="text-slate-600 mt-1 font-medium">
                      Account {profile.accountNumber}
                    </p>
                    <p className="text-slate-600">
                      A/C Name {profile.accountName} • {profile.bankName} (IFSC:{" "}
                      {profile.ifscCode})
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Terms & Condition.
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Payment terms are due upon receipt as specified.
                    </p>
                  </div>
                </div>

                {/* Right: Signature */}
                <div className="md:col-span-5 flex flex-col items-center justify-end text-center pb-2">
                  <div className="h-10 text-2xl font-serif italic text-slate-800 tracking-wider">
                    {profile.signatoryName || "Lauras Smith"}
                  </div>
                  <div className="w-48 border-t border-slate-400 mt-2 pt-1">
                    <p className="font-bold text-slate-900">
                      {profile.signatoryName}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {profile.signatoryTitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6. BOTTOM FOOTER (DECORATIVE ARCHES & 2x2 CONTACT BOX) */}
              <div className="px-8 sm:px-12 pt-10 pb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left: Geometric Cross Matrix & Arch Motif */}
                <div className="flex items-center gap-4">
                  <div className="text-blue-900 font-mono text-xs tracking-widest leading-none">
                    ✦ ✦ ✦<br />✦ ✦ ✦<br />✦ ✦ ✦
                  </div>
                  {/* Gold & Blue Arch */}
                  <div className="w-16 h-8 bg-amber-400 rounded-t-full flex items-end justify-center overflow-hidden">
                    <div className="w-10 h-5 bg-[#29487d] rounded-t-full" />
                  </div>
                </div>

                {/* Right: 2x2 Bordered Contact Card */}
                <div className="border border-slate-300 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#29487d] text-white flex items-center justify-center shrink-0">
                      <Phone className="w-2.5 h-2.5" />
                    </span>
                    <span>{profile.phone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#29487d] text-white flex items-center justify-center shrink-0">
                      <Mail className="w-2.5 h-2.5" />
                    </span>
                    <span>{profile.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#29487d] text-white flex items-center justify-center shrink-0">
                      <Globe className="w-2.5 h-2.5" />
                    </span>
                    <span>{profile.website}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#29487d] text-white flex items-center justify-center shrink-0">
                      <MapPin className="w-2.5 h-2.5" />
                    </span>
                    <span className="truncate max-w-[140px]">
                      {profile.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 SETUP COMPANY & BANK DETAILS MODAL (BEFORE GENERATING INVOICE)         */}
      {/* ========================================================================= */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Company Branding & Bank Account Setup
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in your details once so every invoice automatically uses
                  your template.
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
              {/* Logo File Upload */}
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

              {/* Company Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DESIGN STUDIO"
                    value={profile.companyName}
                    onChange={(e) =>
                      setProfile({ ...profile, companyName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. YOUR TAGLINE HERE"
                    value={profile.tagline}
                    onChange={(e) =>
                      setProfile({ ...profile, tagline: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 939 252 5043"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="yourmail0123@gmail.com"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
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
                    placeholder="www.yourdomain.com"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Office / Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="800 Windy Ridge Road, US"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
              </div>

              {/* Bank Account Details */}
              <div className="pt-2 border-t border-slate-100">
                <span className="font-bold uppercase tracking-wider text-[11px] text-amber-600 block mb-2">
                  Bank Transfer Details (Printed on Invoice)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Name / A/C Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Novada Musimas"
                      value={profile.accountName}
                      onChange={(e) =>
                        setProfile({ ...profile, accountName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="012 345 678 900"
                      value={profile.accountNumber}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          accountNumber: e.target.value,
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="HDFC Bank"
                      value={profile.bankName}
                      onChange={(e) =>
                        setProfile({ ...profile, bankName: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      IFSC / Routing Code
                    </label>
                    <input
                      type="text"
                      placeholder="HDFC0001234"
                      value={profile.ifscCode}
                      onChange={(e) =>
                        setProfile({ ...profile, ifscCode: e.target.value })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                    />
                  </div>
                </div>
              </div>

              {/* Signatory */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    placeholder="Lauras Smith"
                    value={profile.signatoryName}
                    onChange={(e) =>
                      setProfile({ ...profile, signatoryName: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Signatory Title
                  </label>
                  <input
                    type="text"
                    placeholder="Accountant / Director"
                    value={profile.signatoryTitle}
                    onChange={(e) =>
                      setProfile({ ...profile, signatoryTitle: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-[#29487d]"
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
                  className="px-5 py-2 rounded-xl bg-[#29487d] hover:bg-[#1c3055] text-white font-bold transition shadow-sm"
                >
                  Save & Apply to Invoices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
