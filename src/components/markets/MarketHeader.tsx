"use client";

import React from "react";

export function MarketHeader() {
  return (
    <div className="w-full pt-6 pb-4 select-none">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-yellow-400 drop-shadow-[0_2px_24px_rgba(250,204,21,0.4)] font-sans">
        Assets
      </h1>
      <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 font-normal leading-relaxed mt-3 max-w-4xl">
        Sovereign instruments and continuous execution contracts for Dubai 2035.
      </p>
    </div>
  );
}

