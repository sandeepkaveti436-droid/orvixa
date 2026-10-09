import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-6 font-sans text-center relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[300px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />

      {/* 404 Glass Card */}
      <div className="max-w-md w-full bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-8 shadow-xl font-sans relative z-10">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <Image
            src="/orviax.jpg"
            alt="Orvixa"
            width={36}
            height={36}
            className="rounded-xl object-contain"
          />
          <span className="font-heading text-2xl font-bold text-slate-900">
            Orvixa
          </span>
        </div>

        <h1 className="text-6xl font-black text-[#9D00FF] mb-2 font-sans">
          404
        </h1>
        <h2 className="text-xl font-black text-slate-900 mb-2 font-sans">
          Page Not Found
        </h2>

        <p className="text-xs font-medium text-slate-500 mb-6 font-sans">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#9D00FF] hover:bg-[#7A00CC] text-white font-bold text-xs shadow-md transition-all font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </main>
  );
}
