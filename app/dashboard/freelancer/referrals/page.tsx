"use client";

import React, { useState } from "react";
import { Award, Share2, Copy, Check, DollarSign, Users } from "lucide-react";

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://orvixa.com/ref/sarah-jenkins";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0047AB]/10 text-[#0047AB] text-xs font-bold mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Affiliate & Partner Program</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
          <span>Referral </span>
          <span className="font-heading italic text-[#0047AB]">Program.</span>
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
          Invite fellow freelancers and organizations to Orvixa. Earn 20%
          recurring commission on every active referral!
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Total Referrals Joined
          </span>
          <div className="text-3xl font-black text-slate-900">14 Members</div>
          <span className="text-xs text-emerald-600 font-bold block">
            ✓ 8 Converted Pro Users
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Affiliate Earnings
          </span>
          <div className="text-3xl font-black text-[#0047AB]">$350.00</div>
          <span className="text-xs text-slate-500 font-semibold block">
            20% Monthly Recurring
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase">
            Available Payout
          </span>
          <div className="text-3xl font-black text-emerald-600">$180.00</div>
          <button
            onClick={() => alert("Payout request submitted!")}
            className="text-xs font-bold text-[#0047AB] hover:underline block pt-1"
          >
            Request Payout →
          </button>
        </div>
      </div>

      {/* Shareable Referral Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          Your Shareable Referral Link
        </h3>
        <div className="flex gap-2 max-w-xl">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 px-4 py-3 rounded-xl w-full"
          />
          <button
            onClick={handleCopy}
            className="bg-[#0047AB] hover:bg-[#003680] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shrink-0 flex items-center gap-1.5"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
