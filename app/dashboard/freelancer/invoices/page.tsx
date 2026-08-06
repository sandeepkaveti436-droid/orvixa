"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  ArrowUpRight,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([
    {
      id: "INV-1042",
      client: "Acme Global Inc.",
      project: "iOS App Redesign",
      amount: "$4,850.00",
      date: "Aug 01, 2026",
      dueDate: "Aug 15, 2026",
      status: "Paid",
    },
    {
      id: "INV-1043",
      client: "FinTech Labs",
      project: "Stripe API Integration",
      amount: "$3,200.00",
      date: "Aug 04, 2026",
      dueDate: "Aug 18, 2026",
      status: "Pending",
    },
    {
      id: "INV-1044",
      client: "Solopreneur Studio",
      project: "Brand Identity Package",
      amount: "$1,800.00",
      date: "Jul 20, 2026",
      dueDate: "Aug 03, 2026",
      status: "Paid",
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Invoices & Billing
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Create professional invoices, track payments, and export PDF billing
            statements.
          </p>
        </div>

        <Link
          href="/dashboard/freelancer/invoices/new"
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Total Revenue Collected
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            $6,650.00
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            ✓ 2 Invoices Paid
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Pending Invoices
          </span>
          <div className="text-3xl font-black text-[#0047AB] mt-1">
            $3,200.00
          </div>
          <span className="text-xs text-slate-500 font-semibold mt-2 block">
            1 Invoice awaiting payment
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold uppercase text-slate-400">
            Overdue Payments
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">$0.00</div>
          <span className="text-xs text-emerald-600 font-bold mt-2 block">
            ✓ All payments on time
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0047AB]" />
            <span>Recent Invoices ({invoices.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 text-xs font-semibold"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {inv.id} — {inv.client}
                  </div>
                  <div className="text-slate-500">
                    {inv.project} • Due {inv.dueDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                <div className="text-right">
                  <div className="font-black text-sm text-slate-900">
                    {inv.amount}
                  </div>
                  <div className="text-[10px] text-slate-400">{inv.date}</div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    inv.status === "Paid"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
                >
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
