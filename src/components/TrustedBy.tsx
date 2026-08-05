"use client";

import React from "react";

export default function TrustedBy() {
  const logos = [
    {
      name: "Google",
      svg: (
        <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
      ),
    },
    {
      name: "Microsoft",
      svg: (
        <div className="flex items-center gap-2">
          <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
            <div className="bg-[#f25022] w-full h-full" />
            <div className="bg-[#7fba00] w-full h-full" />
            <div className="bg-[#00a4ef] w-full h-full" />
            <div className="bg-[#ffb900] w-full h-full" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight">
            Microsoft
          </span>
        </div>
      ),
    },
    {
      name: "Adobe",
      svg: (
        <div className="flex items-center gap-2">
          <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24">
            <path d="M13.966 22h6.034l-8-18h-4l-8 18h6.034l1.966-4.966h4l1.966 4.966zm-4.966-8l1.034-2.8 1.034 2.8h-2.068z" />
          </svg>
          <span className="font-sans font-black text-lg tracking-wider uppercase">
            Adobe
          </span>
        </div>
      ),
    },
    {
      name: "Notion",
      svg: (
        <div className="flex items-center gap-2">
          <svg className="h-7 w-auto fill-current" viewBox="0 0 24 24">
            <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.414-.701c.28 0 .513-.186.513-.42 0-.28-.186-.42-.42-.373L7.117 3.835c-1.12.093-1.773-.187-2.24-.747l-1.68-2.053C2.81 0 2.25 0 1.69 0H.477c-.28 0-.477.187-.477.42 0 .093.047.186.14.28l4.319 3.508zm.84 3.033v14.887c0 .56.327 1.026 1.073 1.026h14.701c.654 0 1.12-.326 1.12-1.026V6.261c0-.513-.373-.933-.933-.887l-14.888.933c-.56 0-1.073.42-1.073.934zm12.927 12.04l-5.6-8.541V18.17c0 .466-.233.746-.746.746h-.84c-.466 0-.746-.28-.746-.746V9.208c0-.466.28-.746.746-.746h1.213c.466 0 .746.186.98.56l5.46 8.354V9.208c0-.466.233-.746.746-.746h.84c.466 0 .746.28.746.746v8.962c0 .466-.28.746-.746.746h-1.026c-.467 0-.747-.186-.98-.56z" />
          </svg>
          <span className="font-sans font-extrabold text-lg tracking-tight">
            Notion
          </span>
        </div>
      ),
    },
    {
      name: "Figma",
      svg: (
        <div className="flex items-center gap-2">
          <svg className="h-6 w-auto fill-current" viewBox="0 0 38 57">
            <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" />
            <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" />
            <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" />
            <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" />
            <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" />
          </svg>
          <span className="font-sans font-bold text-lg tracking-tight">
            Figma
          </span>
        </div>
      ),
    },
    {
      name: "Stripe",
      svg: (
        <div className="flex items-center gap-1">
          <svg className="h-8 w-auto fill-current" viewBox="0 0 60 25">
            <path d="M59.64 14.28c0-4.59-2.24-8.23-7.14-8.23-4.94 0-7.82 3.64-7.82 8.18 0 5.4 3.42 8.1 8.35 8.1 2.41 0 4.38-.52 5.82-1.28v-3.32c-1.44.71-3.15 1.12-5.07 1.12-2.18 0-3.92-.85-4.18-2.91h10.02c.02-.45.02-1.24.02-1.66zm-10.02-1.66c.21-1.84 1.6-2.65 3.01-2.65 1.39 0 2.76.81 2.91 2.65h-5.92zm-12.72-6.57c-2.31 0-3.82 1.09-4.56 2.02l-.33-1.61h-4.45v21.57h4.86v-6.07c.78.78 2.11 1.76 4.38 1.76 4.38 0 7.82-3.48 7.82-8.83 0-5.18-3.35-8.84-7.72-8.84zm-1.52 13.56c-1.46 0-2.39-.55-3.04-1.33v-6.39c.67-.81 1.62-1.38 3.04-1.38 2.29 0 3.87 2.02 3.87 4.54.01 2.59-1.55 4.56-3.87 4.56zM29.28 2.45l-4.88 1.04v3.63l4.88-1.04V2.45zm-4.88 5.6h4.88v14.18h-4.88V8.05zm-6.27.02c-1.28 0-2.3.43-2.94 1.12l-.31-1.12h-4.22v14.18h4.88v-8.08c0-1.88.98-2.83 2.5-2.83.47 0 .91.07 1.28.19V8.22c-.43-.1-.87-.15-1.19-.15zm-11.83.03c-2.43 0-4.4.88-5.3 1.61l1.44 3.03c.78-.59 2.13-1.24 3.65-1.24 1.48 0 2.21.52 2.21 1.28 0 .88-.93 1.28-2.45 1.73-3.1.93-5.22 2.13-5.22 4.96 0 2.97 2.39 4.75 5.82 4.75 2.02 0 3.52-.5 4.47-1.12l.33 1.1h4.22V13.82c0-3.92-2.85-5.72-9.17-5.72zm.28 12.83c-1.19 0-2.11-.43-2.11-1.35 0-.9.81-1.28 2.02-1.63 1.81-.55 2.85-.98 2.85-2.07v2.24c-.71.86-1.57 2.81-2.76 2.81z" />
          </svg>
        </div>
      ),
    },
    {
      name: "Slack",
      svg: (
        <div className="flex items-center gap-2">
          <svg className="h-6 w-auto fill-current" viewBox="0 0 24 24">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
          </svg>
          <span className="font-sans font-extrabold text-lg tracking-tight">
            slack
          </span>
        </div>
      ),
    },
  ];

  return (
    <section className="w-full py-12 relative overflow-hidden bg-slate-50/90 border-y border-slate-200/80 font-sans">
      {/* Section Header Label */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Trusted by industry leaders and innovative teams worldwide
        </p>
      </div>

      {/* Marquee Outer Wrapper with Glass Mask Edges */}
      <div className="relative w-full overflow-hidden flex items-center">
        {/* Left Side Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Animated Track */}
        <div className="flex w-max animate-marquee gap-12 sm:gap-20 items-center">
          {/* First Copy of Logos */}
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer text-slate-800"
            >
              {logo.svg}
            </div>
          ))}

          {/* Second Duplicate Copy for Infinite Loop */}
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-pointer text-slate-800"
            >
              {logo.svg}
            </div>
          ))}
        </div>

        {/* Right Side Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-48 bg-gradient-to-l from-slate-50 via-slate-50/80 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
