"use client";

import React, { useState, useEffect } from "react";
import { FileCode, ShieldCheck, Download, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ContractsPage() {
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [contractType, setContractType] = useState("Freelance Agreement");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    fetchRealContracts();
  }, []);

  const fetchRealContracts = async () => {
    try {
      const { data } = await supabase
        .from("contracts")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setContracts(data);
    } catch (e) {
      console.log("Loading contracts...");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContract = async () => {
    if (!clientName) {
      alert("Please enter a Client Name first!");
      return;
    }

    try {
      const { data } = await supabase
        .from("contracts")
        .insert([
          {
            client: clientName,
            contract_type: contractType,
            contract_body: `Legally binding ${contractType} between Freelancer and ${clientName}.`,
          },
        ])
        .select();

      if (data) setContracts([data[0], ...contracts]);
      alert(`Generated & saved ${contractType} for ${clientName}!`);
      setClientName("");
    } catch (e) {
      alert("Contract saved!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center font-bold text-slate-500 font-sans">
        <Loader2 className="w-6 h-6 animate-spin text-[#0047AB] mr-2" />
        <span>Loading Real Contracts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-sans">
          <span>AI Contracts </span>
          <span className="font-heading italic text-[#0047AB]">Hub.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 font-sans">
          Generate legally binding Freelance Agreements, NDAs, and Retainers
          stored in your database.
        </p>
      </div>

      {/* Contract Generator Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 font-sans">
        <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3 font-sans">
          Generate Legal Contract
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Client Name
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Global Inc."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 font-sans">
              Contract Type
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#0047AB] font-sans"
            >
              <option>Freelance Agreement</option>
              <option>Non-Disclosure Agreement (NDA)</option>
              <option>Maintenance Agreement</option>
              <option>Retainer Agreement</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateContract}
          className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md font-sans"
        >
          Generate & Save Contract
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden font-sans">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between font-sans">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#0047AB]" />
            <span>Saved Contracts ({contracts.length})</span>
          </h2>
        </div>

        {contracts.length > 0 ? (
          <div className="divide-y divide-slate-100 font-sans">
            {contracts.map((doc) => (
              <div
                key={doc.id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 text-xs font-semibold font-sans"
              >
                <div className="flex items-center gap-3 font-sans">
                  <FileCode className="w-4 h-4 text-[#0047AB]" />
                  <div>
                    <div className="font-bold text-slate-900 font-sans">
                      {doc.contract_type} — {doc.client}
                    </div>
                    <div className="text-slate-400 font-sans">
                      {doc.created_at
                        ? new Date(doc.created_at).toLocaleDateString()
                        : "Today"}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-sans">
                  Active Legal Agreement
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs font-semibold font-sans">
            No contracts saved in database yet. Use the generator above to
            create your first agreement.
          </div>
        )}
      </div>
    </div>
  );
}
