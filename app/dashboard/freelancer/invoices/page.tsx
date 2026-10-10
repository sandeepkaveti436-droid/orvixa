"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Trash2,
  ArrowUpRight,
  Loader2,
  Sparkles,
  Building,
  Calendar,
  IndianRupee,
  Receipt,
  X,
  ExternalLink,
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

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(
    null,
  );

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching invoices:", error.message);
      }

      if (data && data.length > 0) {
        const normalized: InvoiceItem[] = data.map((inv: any) => ({
          id: String(inv.id),
          invoice_number:
            inv.invoice_number || inv.invoice_no || `INV-${inv.id.slice(0, 6)}`,
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

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return invoices;

    return invoices.filter(
      (inv) =>
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.client.toLowerCase().includes(q),
    );
  }, [invoices, searchQuery]);

  // Toggle Paid / Pending status
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

  // Delete invoice
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

        <div className="relative w-full sm:w-72">
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

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* TOTAL ISSUED */}
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

        {/* AMOUNT DUE */}
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

        {/* TOTAL INVOICES */}
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

      {/* INVOICES LIST / TABLE */}
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
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                          title="View / Print PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
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

      {/* VIEW / PRINT INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Invoice Statement
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedInvoice.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">
                  Client / Brand:
                </span>
                <span className="font-bold text-slate-900">
                  {selectedInvoice.client}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Issue Date:</span>
                <span className="font-bold text-slate-900">
                  {selectedInvoice.issue_date}
                </span>
              </div>

              {selectedInvoice.due_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    Payment Due:
                  </span>
                  <span className="font-bold text-slate-900">
                    {selectedInvoice.due_date}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    selectedInvoice.status.toLowerCase() === "paid"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {selectedInvoice.status}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Billed:</span>
                <span className="font-black text-[#9D00FF] text-base tabular-nums">
                  ₹ {selectedInvoice.amount.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
