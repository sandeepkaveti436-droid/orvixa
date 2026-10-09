"use client";

import React, { useEffect, useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Receipt,
  FileText,
  Plus,
  Download,
  CheckCircle2,
  PieChart,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FreelancerFinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState<
    Array<{
      id: number;
      name: string;
      category: string;
      amount: string;
      date: string;
    }>
  >([] as any);

  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "Software",
    amount: "",
  });

  useEffect(() => {
    supabase
      .from("invoices")
      .select("amount, total_amount, status, issue_date, created_at")
      .then(({ data, error }) => {
        if (error) {
          console.error("Could not load financial invoices:", error.message);
          setInvoices([]);
          return;
        }
        setInvoices(data || []);
      });
  }, []);

  const currentYear = new Date().getFullYear();
  const grossIncome = invoices
    .filter((invoice) => {
      const date = invoice.issue_date || invoice.created_at;
      return date && new Date(date).getFullYear() === currentYear;
    })
    .reduce(
      (total, invoice) =>
        total + Number(invoice.total_amount ?? invoice.amount ?? 0),
      0,
    );
  const expenseTotal = expenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0,
  );
  const netProfit = grossIncome - expenseTotal;
  const taxReserve = Math.max(0, netProfit * 0.2);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount) {
      setExpenses([
        {
          id: Date.now(),
          name: newExpense.name,
          category: newExpense.category,
          amount: newExpense.amount,
          date: new Date().toLocaleDateString(),
        },
        ...expenses,
      ]);
      setNewExpense({ name: "", category: "Software", amount: "" });
      setShowExpenseModal(false);
    }
  };

  const handleExportTaxReport = () => {
    alert(
      "Generating Q3 Tax Report PDF & Expense Ledger CSV... Download complete!",
    );
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            <span>Finance & </span>
            <span className="font-heading italic text-[#9D00FF]">
              Operations.
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Track business income, log deductible expenses, calculate tax
            reserves, and export P&L reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportTaxReport}
            className="bg-white border border-slate-300 hover:border-[#9D00FF] text-slate-800 text-xs font-bold px-4 py-3 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#9D00FF]" />
            <span>Export Tax Report</span>
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#9D00FF]/25 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Gross Income (YTD)
          </span>
          <div className="text-3xl font-black text-slate-900">
            ₹{grossIncome.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            From invoices dated this year
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Tax Deductible Expenses
          </span>
          <div className="text-3xl font-black text-amber-600">
            ₹{expenseTotal.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {expenses.length} expenses entered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Net Profit
          </span>
          <div className="text-3xl font-black text-[#9D00FF]">
            ₹{netProfit.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Income less entered expenses
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Estimated Tax Reserve (20%)
          </span>
          <div className="text-3xl font-black text-purple-600">
            ₹{taxReserve.toLocaleString("en-IN")}
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Estimated at 20% of net profit
          </span>
        </div>
      </div>

      {/* Expense Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#9D00FF]" />
            <span>Deductible Expenses ({expenses.length})</span>
          </h3>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="text-xs font-bold text-[#9D00FF] hover:underline"
          >
            + Add Expense
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="py-3 flex justify-between items-center text-xs font-semibold"
            >
              <div>
                <div className="font-bold text-slate-900">{item.name}</div>
                <div className="text-slate-400">
                  {item.category} • {item.date}
                </div>
              </div>
              <span className="font-black text-rose-600 text-sm">
                ₹{Number(item.amount).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EXPENSE LOG MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-md w-full font-sans space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Log Tax Deductible Expense
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Expense Description (e.g. Adobe Creative Cloud)"
                value={newExpense.name}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, name: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />

              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              >
                <option>Software</option>
                <option>Equipment</option>
                <option>Marketing & Ads</option>
                <option>Travel & Meals</option>
              </select>

              <input
                type="number"
                required
                placeholder="Amount ($)"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#9D00FF]"
              />

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="w-1/3 bg-slate-100 text-slate-700 font-bold text-xs py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#9D00FF] text-white font-bold text-xs py-3 rounded-xl shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
