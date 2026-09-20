"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  BarChart3,
  BookOpen,
  PlaySquare,
  Send,
  Trophy,
  Radio,
  GraduationCap,
  Users,
  Sliders,
  Search,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { clsx } from "clsx";
import { useSession, signOut } from "next-auth/react";

const NAV_LINKS = [
  { href: "/", label: "Command", icon: Flame },
  { href: "/markets", label: "Markets", icon: BarChart3 },
  { href: "/submit", label: "Submit", icon: Send },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/research", label: "Research", icon: BookOpen },
  { href: "/learn", label: "How it works", icon: GraduationCap },
];

const AuthStatus = ({ pathname }: { pathname: string }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="text-xs text-gray-500 font-mono-tech">LOADING...</div>;
  }

  if (status === "authenticated" && session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className={clsx(
            "px-3 py-1.5 rounded border flex items-center gap-2 transition-all cursor-pointer card-interactive",
            pathname === "/profile"
              ? "border-[#D4AF37] bg-[#D4AF37]/15 shadow-[0_0_16px_rgba(212,175,55,0.15)]"
              : "border-white/10 bg-[#0C1220] hover:border-white/25"
          )}
        >
          <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[10px] font-mono-tech text-[#D4AF37] font-bold">
            #
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-white font-mono-tech leading-none">
              {session.user.name || session.user.email}
            </div>
            <div className="text-[9px] text-[#05CD99] font-mono-tech font-bold leading-none mt-0.5">
              LOGGED IN
            </div>
          </div>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="p-1.5 text-xs text-gray-400 hover:text-red-400 border border-white/10 rounded bg-[#0C1220] hover:bg-white/5 transition-colors font-mono-tech"
        >
          LOGOUT
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono-tech text-white transition-colors">
        LOGIN
      </Link>
      <Link href="/register" className="px-3 py-1.5 rounded bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/30 text-xs font-mono-tech text-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.1)]">
        REGISTER
      </Link>
    </div>
  );
};

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070A12]/95 backdrop-blur-md border-b border-white/8 select-none">
      <div className="w-full px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.15)] group-hover:border-[#D4AF37] transition-all shrink-0 bg-[#0A0E18]">
              <img src="/assets/logo.jpg" alt="Algo Trading Competition Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-semibold tracking-tight text-sm text-white font-sans">
                  Dubai 2035
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#94A3B8] tracking-normal mt-0.5">
                The Mercantile
              </p>
            </div>
          </Link>

        </div>

        {/* Primary Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-base font-bold transition-all duration-200 cursor-pointer relative flex items-center gap-1.5 btn-tactile",
                  isActive
                    ? "text-[#D4AF37] bg-[#D4AF37]/12 shadow-[0_0_16px_rgba(212,175,55,0.12)] border border-[#D4AF37]/30"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon
                  size={14}
                  className={clsx(
                    "transition-transform duration-200",
                    isActive
                      ? "text-[#D4AF37] scale-110"
                      : "text-gray-400 group-hover:scale-105"
                  )}
                />
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </Link>
            );
          })}
        </nav>

          {/* Right HUD telemetry & Auth */}
          <div className="flex items-center gap-3">
            {/* Search Palette Button */}
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-command-bar"));
              }}
              className="p-1.5 rounded border border-white/10 bg-[#0B101C] text-[#94A3B8] hover:text-white hover:border-[#D4AF37]/40 transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono-tech btn-tactile"
              title="Press CMD+K to search"
            >
              <Search size={14} />
              <span className="hidden xl:inline text-[11px] text-[#64748B]">⌘K</span>
            </button>

            {/* Auth Buttons / Profile */}
            <AuthStatus pathname={pathname} />

            {/* Admin link */}
            <Link
              href="/admin"
              title="Exchange Master Control"
              className={clsx(
                "p-1.5 rounded border transition-all cursor-pointer hidden md:flex btn-tactile",
                pathname === "/admin"
                  ? "border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/15 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                  : "border-white/10 text-[#64748B] hover:text-white hover:bg-white/5"
              )}
            >
              <Sliders size={14} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070A12] border-b border-white/10 px-4 py-3 space-y-1 animate-fade-in font-sans">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#D4AF37] font-semibold"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                )}
              >
                <Icon size={15} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 mt-2 border-t border-white/10 flex justify-between text-xs text-[#94A3B8]">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 text-[#00F0FF]"
            >
              <Sliders size={13} /> Admin Console
            </Link>
            <span className="text-[#05CD99]">LATENCY: 1.18ms</span>
          </div>
        </div>
      )}
    </header>
  );
};
