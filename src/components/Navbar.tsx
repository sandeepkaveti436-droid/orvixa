"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 font-sans">
      <nav className="max-w-7xl mx-auto rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-900/5 px-6 py-3.5 transition-all">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/orviax.jpg"
              alt="Orvixa Logo"
              width={36}
              height={36}
              className="rounded-xl object-contain"
              priority
            />
            <div className="text-xl sm:text-2xl font-bold tracking-tight tex-black">
              Orvixa
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
            <Link
              href="#products"
              className="hover:text-[#0047AB] transition-colors"
            >
              Products ▾
            </Link>
            <Link
              href="#solutions"
              className="hover:text-[#0047AB] transition-colors"
            >
              Solutions ▾
            </Link>
            <Link
              href="#pricing"
              className="hover:text-[#0047AB] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="hover:text-[#0047AB] transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="hover:text-[#0047AB] transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="bg-[#0047AB] hover:bg-[#003680] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-[#0047AB]/25 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              href="/get-started"
              className="bg-white hover:bg-[#0047AB]/5 text-[#0047AB] border-2 border-[#0047AB] text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              Get Started →
            </Link>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-900 hover:text-[#0047AB] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-slate-200 mt-3 space-y-3">
            <div className="flex flex-col space-y-2 font-semibold text-slate-800 text-sm">
              <Link
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0047AB] py-1"
              >
                Products
              </Link>
              <Link
                href="#solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0047AB] py-1"
              >
                Solutions
              </Link>
              <Link
                href="#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0047AB] py-1"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0047AB] py-1"
              >
                About
              </Link>
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#0047AB] py-1"
              >
                Contact
              </Link>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#0047AB] text-white text-sm font-semibold py-2.5 rounded-xl shadow-md"
              >
                Login
              </Link>
              <Link
                href="/get-started"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-white text-[#0047AB] border-2 border-[#0047AB] text-sm font-semibold py-2.5 rounded-xl"
              >
                Get Started →
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
