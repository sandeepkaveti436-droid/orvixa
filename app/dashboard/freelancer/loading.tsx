import React from "react";

export default function Loading() {
  return (
    <div className="space-y-6 font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
        <div className="h-32 bg-slate-200 rounded-2xl" />
      </div>

      {/* Main Table Skeleton */}
      <div className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  );
}
