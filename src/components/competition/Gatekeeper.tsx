import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/options";
import { ShieldAlert, Lock, Clock } from "lucide-react";

export async function Gatekeeper({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Admins always bypass the gatekeeper
  if (session?.user?.role === "ADMIN") {
    return <>{children}</>;
  }

  const settings = await prisma.competitionSettings.findUnique({
    where: { id: "global" },
  });

  const status = settings?.competitionStatus || "REGISTRATION_OPEN";

  if (status === "REGISTRATION_OPEN") {
    return (
      <div className="w-full min-h-screen bg-[#05070B] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] mb-8 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
            <Lock size={32} />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,240,255,0.2)] font-sans mb-4">
            THE COMPETITION IS <span className="text-[#00F0FF]">YET TO START</span>
          </h1>

          <p className="text-[#94A3B8] text-lg sm:text-xl font-mono-tech max-w-2xl mb-12">
            System architecture is locked. Algorithms are on standby. Awaiting Exchange Administrator override to commence the trading window.
          </p>

          <div className="flex flex-col items-center p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">COUNTDOWN INITIALIZED</span>
            <div className="text-4xl sm:text-5xl font-bold font-mono text-[#00F0FF] tracking-widest drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
              T - 24:00:00
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#05CD99] font-mono-tech bg-[#05CD99]/10 px-3 py-1 rounded">
              <span className="w-2 h-2 rounded-full bg-[#05CD99] animate-pulse" />
              SYSTEMS READY
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "COMPLETED") {
    return (
      <div className="w-full min-h-screen bg-[#05070B] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] mb-8 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(212,175,55,0.2)] font-sans mb-4">
            COMPETITION <span className="text-[#D4AF37]">CONCLUDED</span>
          </h1>

          <p className="text-[#94A3B8] text-lg sm:text-xl font-mono-tech max-w-2xl mb-12">
            The trading window has officially closed. All submissions are locked and the final matching engine evaluation is complete.
          </p>

          <div className="flex flex-col items-center p-6 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-widest mb-2">STATUS</span>
            <div className="text-2xl font-bold font-mono text-white tracking-wider">
              RESULTS YET TO BE ANNOUNCED
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#D4AF37] font-mono-tech bg-[#D4AF37]/10 px-3 py-1 rounded">
              <Clock size={12} />
              AWAITING FINAL VERIFICATION
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE or PAUSED
  return <>{children}</>;
}
