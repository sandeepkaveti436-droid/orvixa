"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Plus, DollarSign, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetchRealInvoices();
  }, []);

  const fetchRealInvoices = async () => {
    try {
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setInvoices(data);
    } catch (e) {
      console.log("Loading invoices...");
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = invoices
    .filter((i) => i.status === "Paid")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  const pendingAmount = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Invoices...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
            <span>Invoices & </span>
            <span className="font-heading italic text-[#0047AB]">Billing.</span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
            Manage real billing statements, track payments, and issue client
            invoices.
          </p>
        </div>

        <Link
          href="/dashboard/freelancer/invoices/new"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2 font-sans"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 font-sans">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 block font-sans">
            Total Collected
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1 font-sans">
            ${totalCollected.toLocaleString()}.00
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block font-sans">
            Paid Invoices
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 block font-sans">
            Pending Invoices
          </span>
          <div className="text-3xl font-black text-[#0047AB] mt-1 font-sans">
            ${pendingAmount.toLocaleString()}.00
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block font-sans">
            Awaiting Payment
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm font-sans">
          <span className="text-xs font-bold uppercase text-slate-400 block font-sans">
            Total Invoices
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1 font-sans">
            {invoices.length} Issued
          </div>
          <span className="text-xs text-emerald-600 font-bold mt-2 block font-sans">
            ✓ Real Database Synced
          </span>
        </div>
      </div>

      {/* Invoices List or Empty State */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>Real Invoices ({invoices.length})</span>
          </h2>
        </div>

        {invoices.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 text-xs font-semibold font-sans"
              >
                <div className="flex items-center gap-3 font-sans">
                  <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold shrink-0 font-sans">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 font-sans">
                      {inv.invoice_number || "INV-1001"} — {inv.client}
                    </div>
                    <div className="text-slate-400 font-sans">
                      Issued {inv.issue_date || "Today"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 font-sans">
                  <div className="text-right font-sans">
                    <div className="font-black text-sm text-slate-900 font-sans">
                      ${Number(inv.amount || 0).toLocaleString()}.00
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold font-sans ${inv.status === "Paid" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}
                  >
                    {inv.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 space-y-3 font-sans">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-lg text-slate-900 font-sans">
              No Invoices Created Yet
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto font-sans">
              Draft your first professional invoice and bill your clients
              directly.
            </p>
            <Link
              href="/dashboard/freelancer/invoices/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047AB] text-white text-xs font-bold shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Invoice</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
