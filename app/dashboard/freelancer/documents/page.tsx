"use client";

import React, { useState } from "react";
import { FileCode, Upload, Download, FileText, Plus } from "lucide-react";

export default function DocumentsPage() {
  const [documents] = useState([
    {
      id: 1,
      name: "Acme_Corp_Design_Contract_v2.pdf",
      type: "Contract",
      size: "1.2 MB",
      date: "Aug 02, 2026",
    },
    {
      id: 2,
      name: "Stripe_Integration_SOW_Proposal.pdf",
      type: "Proposal",
      size: "850 KB",
      date: "Aug 04, 2026",
    },
    {
      id: 3,
      name: "Non_Disclosure_Agreement_2026.pdf",
      type: "NDA",
      size: "420 KB",
      date: "Jul 15, 2026",
    },
  ]);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Documents & Contracts
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Store client contracts, proposals, NDAs, and project assets
            securely.
          </p>
        </div>

        <button className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-[#0047AB]/25 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-[#0047AB]" />
            <span>Document Repository ({documents.length})</span>
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0047AB]/10 text-[#0047AB] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{doc.name}</div>
                  <div className="text-slate-400">
                    {doc.type} • {doc.size}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-slate-400">{doc.date}</span>
                <button className="p-2 text-[#0047AB] hover:bg-blue-50 rounded-lg">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
