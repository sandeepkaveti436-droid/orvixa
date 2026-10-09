"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Receipt,
  Printer,
  Check,
  Building,
  User,
  Loader2,
  Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LineItem {
  id: number;
  description: string;
  qty: number;
  rate: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [billingProfile, setBillingProfile] = useState({
    brandName: "",
    fullName: "",
    phone: "",
    address: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
  });

  useEffect(() => {
    const loadBillingProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "brand_name, full_name, phone, address, bank_name, account_number, ifsc_code",
        )
        .eq("id", user.id)
        .maybeSingle();
      if (error) {
        console.error("Could not load billing profile:", error.message);
        return;
      }
      if (data) {
        setBillingProfile({
          brandName: data.brand_name || "",
          fullName: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
          bankName: data.bank_name || "",
          accountNumber: data.account_number || "",
          ifscCode: data.ifsc_code || "",
        });
      }
    };

    loadBillingProfile();
  }, []);

  // Invoice Details
  const [invoiceNumber, setInvoiceNumber] = useState(
    `000${Math.floor(100 + Math.random() * 900)}`,
  );
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
  );

  // Client Details (BILL TO)
  const [clientName, setClientName] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientLocation, setClientLocation] = useState("");

  // Items
  const [items, setItems] = useState<LineItem[]>([
    {
      id: 1,
      description: "",
      qty: 1,
      rate: 0,
    },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        description: "",
        qty: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: "description" | "qty" | "rate",
    val: any,
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (item.qty || 1) * (item.rate || 0),
    0,
  );

  // Save Invoice & Redirect
  const handleSaveInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Please enter the client / business name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newInvoice = {
        id: `inv-${Date.now()}`,
        invoice_number: invoiceNumber,
        client: clientName.trim(),
        client_contact: clientContact.trim(),
        client_location: clientLocation.trim(),
        amount: totalAmount,
        status: "Pending" as const,
        issue_date: issueDate,
        due_date: dueDate,
        items,
        notes:
          "Fees and payment terms will be established in the contract or agreement prior to the commencement of the project. An initial deposit will be required before any design work begins. We reserve the right to suspend or halt work in the event of non-payment.",
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

      router.push("/dashboard/freelancer/invoices");
    } catch (err: any) {
      alert(`Notice: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans not-italic space-y-6 text-slate-900 pb-16 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/freelancer/invoices"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#9D00FF] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">
            Invoice Number:
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
            N°: {invoiceNumber}
          </span>
        </div>
      </div>

      <form onSubmit={handleSaveInvoice} className="space-y-6">
        {/* Bill To & Bill From Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bill To Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>BILL TO (Client Details)</span>
            </h3>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Client / Company Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Food Link F&B Holdings LTD"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  placeholder="+91-XXXXXXXXXX"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  placeholder="Hyderabad"
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                />
              </div>
            </div>
          </div>

          {/* Bill From Card */}
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              <span>BILL FROM</span>
            </h3>

            <div className="pt-1">
              <h4 className="text-sm font-bold text-slate-900">
                {billingProfile.brandName || "Add billing details in Settings"}
              </h4>
              {billingProfile.phone && (
                <p className="text-xs text-slate-500 mt-1">
                  Contact: {billingProfile.phone}
                </p>
              )}
              {billingProfile.address && (
                <p className="text-xs text-slate-500">
                  {billingProfile.address}
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500">
              <span>Account: </span>
              <span className="font-semibold text-slate-800">
                {[
                  billingProfile.fullName,
                  billingProfile.bankName,
                  billingProfile.accountNumber,
                  billingProfile.ifscCode,
                ]
                  .filter(Boolean)
                  .join(" | ") || "No payment details saved"}
              </span>
            </div>
          </div>
        </div>

        {/* Dates Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Issued Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Deliverables & Line Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="text-xs font-semibold text-[#9D00FF] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 bg-slate-50 p-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              <div className="col-span-6">Description</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-right">Price (₹)</div>
              <div className="col-span-1 text-center">Del</div>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 p-3 gap-2 items-center text-xs"
              >
                <div className="col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="Deliverable description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, "description", e.target.value)
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>

                <div className="col-span-2 text-center">
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.id, "qty", parseInt(e.target.value) || 1)
                    }
                    className="w-14 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1.5 text-xs font-medium text-center text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>

                <div className="col-span-3 text-right">
                  <input
                    type="number"
                    min="0"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "rate",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="w-28 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-bold text-right text-slate-900 focus:outline-none focus:border-[#9D00FF]"
                  />
                </div>

                <div className="col-span-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-slate-300 hover:text-red-500 transition p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount Box */}
          <div className="flex justify-end pt-2">
            <div className="bg-[#F5A623] text-slate-950 px-6 py-3 rounded-2xl text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">
                Amount Due
              </span>
              <span className="text-2xl font-black tabular-nums">
                ₹{" "}
                {totalAmount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/dashboard/freelancer/invoices"
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-semibold text-xs px-6 py-2.5 rounded-xl shadow-sm flex items-center gap-2 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Invoice...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save & Create Invoice</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
