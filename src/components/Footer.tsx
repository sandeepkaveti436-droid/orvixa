"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8fafc] font-sans text-slate-800 overflow-hidden select-none border-t border-slate-200/80">
      {/* ================= 1. MAIN LIGHT FOOTER CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start font-sans">
          {/* LEFT COLUMN: Logo, Tagline & Subtext */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/orviax.jpg"
                alt="Orvixa Logo"
                width={38}
                height={38}
                className="rounded-xl object-contain"
                priority
              />
              <span className="font-heading text-2xl font-bold tracking-tight text-slate-900">
                Orvixa
              </span>
            </Link>

            {/* Tagline */}
            <h3 className="font-sans text-2xl sm:text-3xl font-black text-slate-900 max-w-md leading-tight">
              <span>We grow your business with </span>
              <span className="inline-block font-heading italic text-[#0047AB]">
                personal AI manager.
              </span>
            </h3>

            {/* Subtext */}
            <p className="text-xs font-bold text-slate-400 font-sans">
              Orvixa, 2026.
            </p>
          </div>

          {/* RIGHT COLUMN: 4 Columns (Platform, Company, Resources, Get the app) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 font-sans">
            {/* Col 1: Platform */}
            <div className="space-y-3 font-sans">
              <span className="text-xs font-bold text-slate-400 block font-sans uppercase tracking-wider">
                Platform
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 font-sans">
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Plans & Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#products"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Personal AI Manager
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    AI Business Writer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 2: Company */}
            <div className="space-y-3 font-sans">
              <span className="text-xs font-bold text-slate-400 block font-sans uppercase tracking-wider">
                Company
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 font-sans">
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/news"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    News
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3 font-sans">
              <span className="text-xs font-bold text-slate-400 block font-sans uppercase tracking-wider">
                Resources
              </span>
              <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-slate-700 font-sans">
                <li>
                  <Link
                    href="/docs"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/papers"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Papers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/press"
                    className="hover:text-[#0047AB] transition-colors"
                  >
                    Press Conferences
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Get the app */}
            <div className="space-y-3 font-sans">
              <span className="text-xs font-bold text-slate-400 block font-sans uppercase tracking-wider">
                Get the app
              </span>
              <div className="space-y-2 font-sans">
                {/* Windows Button */}
                <a
                  href="/download/windows"
                  className="inline-flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:border-[#0047AB] hover:text-[#0047AB] text-slate-800 text-xs font-bold transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.95-9.6L24 0v11.4H10.95M0 12.6h9.75v9.451L0 20.701M10.95 12.6H24V24l-13.05-1.8" />
                  </svg>
                  <span>Windows</span>
                </a>

                {/* macOS Button */}
                <a
                  href="/download/macos"
                  className="inline-flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:border-[#0047AB] hover:text-[#0047AB] text-slate-800 text-xs font-bold transition-all shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87 1 0 2.5-1.07 4.1-1 1.63.07 2.87.67 3.65 1.76-3.2 1.92-2.67 6.13.52 7.37-.66 1.34-1.53 2.65-2.67 3.62zM15.97 6.32c.63-.82 1.07-1.96.94-3.12-.97.05-2.18.68-2.88 1.48-.61.73-1.12 1.88-.95 3.01 1.09.08 2.22-.55 2.89-1.37z" />
                  </svg>
                  <span>macOS</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. BOTTOM ACCENT BAR (COBALT BLUE BRAND COLOR) ================= */}
      <div className="bg-[#0047AB] text-white py-4 px-6 sm:px-8 lg:px-12 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold tracking-wide font-sans">
          <div>© 2026 Orvixa Inc. | Design by Sandeep Kaveti | All rights reserved.</div>

          <div className="flex items-center gap-6 font-sans">
            <Link
              href="/terms"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="hover:underline opacity-90 hover:opacity-100"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
