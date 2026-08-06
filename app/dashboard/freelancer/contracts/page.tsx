"use client";

import React, { useState } from "react";
import {
  FileCode,
  Download,
  ShieldCheck,
  Sparkles,
  FileText,
} from "lucide-react";

export default function ContractsPage() {
  const [contractType, setContractType] = useState("Freelance Agreement");
  const [clientName, setClientName] = useState("Acme Global Inc.");

  const contractTemplates = [
    "Freelance Agreement",
    "Non-Disclosure Agreement (NDA)",
    "Maintenance Agreement",
    "Retainer Agreement",
  ];

  const handleDownload = () => {
    alert(`Downloading ${contractType} for ${clientName}... File generated!`);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          <span>AI Contracts </span>
          <span className="font-heading italic text-[#0047AB]">Hub.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Generate legally binding Freelance Agreements, NDAs, and Retainer
          contracts in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contractTemplates.map((type) => (
          <button
            key={type}
            onClick={() => setContractType(type)}
            className={`p-5 rounded-2xl border text-left transition-all ${
              contractType === type
                ? "bg-[#0047AB] text-white border-[#0047AB] shadow-md"
                : "bg-white text-slate-800 border-slate-200 hover:border-[#0047AB]/30"
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-2" />
            <div className="font-bold text-sm">{type}</div>
            <p className="text-[10px] opacity-80 mt-1 font-medium">
              Standard Legal Template
            </p>
          </button>
        ))}
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">{contractType}</h3>
            <p className="text-xs text-slate-400 font-semibold">
              Client: {clientName}
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Legal Contract (PDF)</span>
          </button>
        </div>

        <div className="font-mono text-xs text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-200 leading-relaxed space-y-4">
          <p className="font-bold text-slate-900">
            INDEPENDENT CONTRACTOR AGREEMENT ({contractType.toUpperCase()})
          </p>
          <p>
            This Agreement is made effective as of August 2026 by and between
            Sarah Jenkins ("Contractor") and {clientName} ("Client").
          </p>
          <p>
            1. SERVICES PERFORMED: Contractor agrees to perform specialized AI
            development and design services.
          </p>
          <p>
            2. PAYMENT TERMS: Client agrees to remit payment within 15 days of
            invoice date.
          </p>
          <p>
            3. INTELLECTUAL PROPERTY: All work product created shall become the
            exclusive property of Client upon full payment.
          </p>
        </div>
      </div>
    </div>
  );
}
