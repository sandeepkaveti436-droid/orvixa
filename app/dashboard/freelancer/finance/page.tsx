"use client";

import React, { useState } from "react";
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

export default function FreelancerFinancePage() {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      name: "Figma Professional Subscription",
      category: "Software",
      amount: "$15.00",
      date: "Aug 01, 2026",
    },
    {
      id: 2,
      name: "Vercel Pro Hosting",
      category: "Hosting",
      amount: "$20.00",
      date: "Aug 02, 2026",
    },
    {
      id: 3,
      name: "MacBook Pro M3 Support Stand",
      category: "Equipment",
      amount: "$120.00",
      date: "Jul 28, 2026",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: "",
    category: "Software",
    amount: "",
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExpense.name && newExpense.amount) {
      setExpenses([
        {
          id: Date.now(),
          name: newExpense.name,
          category: newExpense.category,
          amount: `$${newExpense.amount}`,
          date: "Today",
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
            <span className="font-heading italic text-[#0047AB]">
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
            className="bg-white border border-slate-300 hover:border-[#0047AB] text-slate-800 text-xs font-bold px-4 py-3 rounded-xl shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#0047AB]" />
            <span>Export Tax Report</span>
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2"
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
          <div className="text-3xl font-black text-slate-900">$24,050.00</div>
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +28.4% vs last year
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Tax Deductible Expenses
          </span>
          <div className="text-3xl font-black text-amber-600">$1,855.00</div>
          <span className="text-xs text-slate-500 font-semibold">
            12 Tax Write-offs logged
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Net Profit
          </span>
          <div className="text-3xl font-black text-[#0047AB]">$22,195.00</div>
          <span className="text-xs text-emerald-600 font-bold">
            92.2% Net Margin
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">
            Estimated Tax Reserve (20%)
          </span>
          <div className="text-3xl font-black text-purple-600">$4,439.00</div>
          <span className="text-xs text-slate-500 font-semibold">
            Set aside for Q3 quarterly tax
          </span>
        </div>
      </div>

      {/* Expense Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#0047AB]" />
            <span>Deductible Expenses ({expenses.length})</span>
          </h3>
          <button
            onClick={() => setShowExpenseModal(true)}
            className="text-xs font-bold text-[#0047AB] hover:underline"
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
                {item.amount}
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
              />

              <select
                value={newExpense.category}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, category: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
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
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB]"
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
                  className="w-2/3 bg-[#0047AB] text-white font-bold text-xs py-3 rounded-xl shadow-md"
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
