"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("orvixa_cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("orvixa_cookie_consent", "accepted");
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem("orvixa_cookie_consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 font-sans">
      <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 p-5 rounded-2xl shadow-2xl flex flex-col gap-3 font-sans">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900">
          <Cookie className="w-4 h-4 text-[#0047AB]" />
          <span>Cookie & Privacy Consent (GDPR / CCPA)</span>
        </div>

        <p className="text-xs font-medium text-slate-600 leading-relaxed font-sans">
          We use cookies to personalize your experience and optimize AI
          features. Learn more in our{" "}
          <Link
            href="/privacy"
            className="text-[#0047AB] font-bold hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex items-center justify-end gap-2 pt-1 font-sans">
          <button
            onClick={handleDecline}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0047AB] hover:bg-[#003680] text-white shadow-sm transition-all"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </div>
  );
}
