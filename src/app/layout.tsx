import type { Metadata } from "next";
import { Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/common/Navigation";
import { MarketTicker } from "@/components/ui/MarketTicker";
import { CommandBar } from "@/components/ui/CommandBar";
import { ToastProvider } from "@/components/ui/Toast";
import { PageTransition } from "@/components/common/PageTransition";
import { SystemEventBanner } from "@/components/common/SystemEventBanner";

const chakraPetch = Chakra_Petch({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import { Providers } from "@/components/common/Providers";

export const metadata: Metadata = {
  title: "DUBAI 2035 — The Mercantile | Autonomous Trading League",
  description: "Institutional algorithmic trading competition set in Dubai, 2035. Trade high-frequency quantum commodities, clean solar grids, and autonomous transit derivatives.",
  keywords: ["Algorithmic Trading", "IMC Prosperity", "Dubai 2035", "Quantitative Finance", "The Mercantile", "Trading Competition"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${chakraPetch.variable} ${ibmPlexMono.variable} dark antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#05070B] text-[#F8FAFC] selection:bg-[#D4AF37]/30 selection:text-[#FFF]">
        <Providers>
          <ToastProvider>
            {/* Top Global Navigation HUD */}
            <Navigation />

            {/* Main Viewport Content with Smooth Route Transitions */}
            <main className="flex-1 flex flex-col relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

            {/* Quick Action Palette (CMD+K) */}
            <CommandBar />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
