"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Send,
  Download,
} from "lucide-react";

export default function NewInvoicePage() {
  const [invoiceNumber] = useState(
    `INV-${Math.floor(1000 + Math.random() * 9000)}`,
  );
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [items, setItems] = useState<Array<{id: number; description: string; hours: number; rate: number}>>([] as any);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "New Invoice Item", hours: 10, rate: 75 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.hours * item.rate, 0);
  };

  const handleSendInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Invoice ${invoiceNumber} created and sent to ${clientEmail || "client"}!`,
    );
    window.location.href = "/dashboard/freelancer/invoices";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/freelancer/invoices"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0047AB]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>
        <span className="text-xs font-bold bg-[#0047AB]/10 text-[#0047AB] px-3 py-1 rounded-full">
          Drafting {invoiceNumber}
        </span>
      </div>

      <form
        onSubmit={handleSendInvoice}
        className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8"
      >
        <div className="flex justify-between items-start border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Create Invoice
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Orvixa Automated Billing Engine
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-[#0047AB]">
              {invoiceNumber}
            </span>
          </div>
        </div>

        {/* Client Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Client Business Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Global Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Client Email Address
            </label>
            <input
              type="email"
              required
              placeholder="billing@acme.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase text-slate-400">
              Line Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-bold text-[#0047AB] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
              >
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, description: e.target.value }
                          : i,
                      ),
                    )
                  }
                  className="col-span-6 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800"
                />
                <input
                  type="number"
                  placeholder="Hours"
                  value={item.hours}
                  onChange={(e) =>
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, hours: Number(e.target.value) }
                          : i,
                      ),
                    )
                  }
                  className="col-span-2 bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-800 text-center"
                />
                <input
                  type="number"
                  placeholder="Rate ($)"
                  value={item.rate}
                  onChange={(e) =>
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? { ...i, rate: Number(e.target.value) }
                          : i,
                      ),
                    )
                  }
                  className="col-span-2 bg-white border border-slate-200 px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-800 text-center"
                />
                <div className="col-span-1 text-xs font-bold text-slate-900 text-center">
                  ${item.hours * item.rate}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="col-span-1 text-rose-500 hover:text-rose-700 flex justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Total */}
        <div className="border-t border-slate-100 pt-6 flex justify-between items-center">
          <span className="text-sm font-bold text-slate-600">
            Total Amount Due
          </span>
          <span className="text-3xl font-black text-[#0047AB]">
            ${calculateSubtotal().toLocaleString()}.00
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-sm py-4 px-6 rounded-xl shadow-lg shadow-[#0047AB]/25 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Send Invoice to Client</span>
        </button>
      </form>
    </div>
  );
}
