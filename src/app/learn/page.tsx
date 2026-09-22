"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Database, Cpu, Rocket, Droplet, Building2, Code2, Trophy, Terminal, Calculator, FileDown, Braces } from "lucide-react";
import { clsx } from "clsx";

const WIKI_SECTIONS = [
  { id: "overview", title: "Dubai 2035: The Mercantile", icon: BookOpen },
  { id: "dune", title: "DUNE-NRG (Solar)", icon: Database },
  { id: "nex", title: "NEX-AI (Compute)", icon: Cpu },
  { id: "orbt", title: "ORBT-LOG (Logistics)", icon: Rocket },
  { id: "des", title: "DES-H2 (Hydrogen)", icon: Droplet },
  { id: "difc", title: "DIFC-100 (Index)", icon: Building2 },
  { id: "microstructure", title: "Market Microstructure", icon: Calculator },
  { id: "phase1", title: "Phase 1: Research", icon: Terminal },
  { id: "algo101", title: "Algo Trading 101", icon: FileDown },
  { id: "phase2", title: "Phase 2: Deployment", icon: Code2 },
  { id: "oop", title: "Writing Your Algorithm", icon: Braces },
  { id: "phase3", title: "Phase 3: Simulation", icon: Trophy },
];

export default function HowItWorksPage() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    WIKI_SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/8 pb-6 mb-8">
        <div className="relative">
          <div className="absolute top-4 left-0 w-64 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-400 drop-shadow-[0_2px_24px_rgba(251,191,36,0.3)] font-sans relative z-10">
            How it works
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 font-normal leading-relaxed mt-3 max-w-4xl relative z-10">
            The Official Wiki & Survival Guide for The Mercantile
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Sidebar (Wiki Navigation) */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-xs font-mono-tech text-slate-500 font-semibold uppercase tracking-wider mb-4 px-3">
              Wiki Contents
            </h3>
            {WIKI_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Icon size={16} className={isActive ? "text-amber-400" : "text-slate-500"} />
                  {section.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content (Wiki Content) */}
        <div className="flex-1 max-w-4xl prose prose-invert prose-lg font-sans text-slate-300 pb-32 space-y-24">
          
          <section id="overview" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <BookOpen className="text-amber-400" /> Introduction: Dubai 2035
            </h2>
            <div className="space-y-6">
              <p className="text-xl leading-relaxed text-slate-200">
                Welcome to the year 2035. The metropolis of Dubai has evolved into a hyper-connected nexus of autonomous commerce, powered entirely by the infinite energy of the sun and the computational might of submerged quantum arrays. 
              </p>
              <p>
                Following the Great Synchronization of 2031, humanity stepped back from the trading floors. The erratic, emotion-driven decisions of human brokers were permanently replaced by the cold, calculating precision of artificial intelligence. The global markets are now dictated by relentless algorithms, processing petabytes of data and executing trades at the speed of light.
              </p>
              <p>
                You have just arrived at <strong>The Mercantile</strong>—the city's premier sovereign wealth exchange. It is the beating heart of the new global economy. As a newly minted Quantitative Architect, your mandate is absolute: you must analyze the new world's digital commodities, forge autonomous algorithms to trade them, and outmaneuver rival institutional factions on the global leaderboard.
              </p>
              <p>
                There is no manual trading. There are no limit orders placed by hand. You must code your logic, deploy your intelligence, and let your creation survive in the brutal ecosystem of the DMX-35 grid.
              </p>
            </div>
          </section>

          <section id="dune" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Database className="text-amber-400" /> DUNE-NRG (Solar Credits)
            </h2>
            <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 mb-6 font-mono-tech text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block mb-1">LIQUIDITY</span><span className="text-[#05CD99]">ULTRA-HIGH</span></div>
              <div><span className="text-slate-500 block mb-1">SPREAD</span><span className="text-white">0.10 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">TICK SIZE</span><span className="text-amber-400">0.01 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">BEHAVIOR</span><span className="text-amber-400">MEAN-REVERTING</span></div>
            </div>
            <div className="space-y-6">
              <p>
                The collapse of fossil fuels in the late 2020s forced Dubai into a hyper-accelerated transition. The Mohammed Bin Rashid (MBR) Solar Park was expanded beyond the horizon, blanketing the desert in millions of hyper-efficient photovoltaic arrays. DUNE-NRG was created to tokenize this infinite, yet highly variable, energy source. Every credit represents a gigawatt-hour of baseload power keeping the city alive.
              </p>
              <p>
                Because the sun rises and sets with absolute predictability, DUNE-NRG exhibits incredibly stable, mean-reverting behavior throughout the standard solar day. Algorithms constantly trade the micro-fluctuations in grid efficiency, anchoring the price to a fair value with a 3-second half-life on reversion models.
              </p>
              <p>
                <strong>Market Microstructure:</strong> DUNE-NRG boasts exceptionally thick order books on both the bid and ask sides. However, the order book is notorious for "spoofing" by AI weather-prediction bots. These rogue algos place massive, fake limit orders to manipulate the mid-price right before a cloud cover hits. When a desert sandstorm causes a sudden drop-off in power generation, the mean-reversion breaks, and chaotic panic buying ensures. Only the fastest High-Frequency Trading (HFT) bots can successfully navigate the slippage during a weather event.
              </p>
            </div>
          </section>

          <section id="nex" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Cpu className="text-blue-400" /> NEX-AI (Nexus Compute)
            </h2>
            <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 mb-6 font-mono-tech text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block mb-1">LIQUIDITY</span><span className="text-red-400">MODERATE</span></div>
              <div><span className="text-slate-500 block mb-1">SPREAD</span><span className="text-white">2.50 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">TICK SIZE</span><span className="text-amber-400">0.10 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">BEHAVIOR</span><span className="text-amber-400">MOMENTUM BURSTS</span></div>
            </div>
            <div className="space-y-6">
              <p>
                When Artificial General Intelligence was achieved, quantum computing became the ultimate global arms race. Nexus AI, a monolithic tech conglomerate, constructed massive decentralized quantum arrays. To prevent the superconducting cores from melting down, they sunk the entire infrastructure into the deep, chilling trenches of the Arabian Gulf.
              </p>
              <p>
                NEX-AI represents pure compute epoch allocation. It is the currency of thought in 2035. If a corporation wants to train a new generative model or crack a cryptographic cipher, they must burn NEX-AI on the open market.
              </p>
              <p>
                <strong>Market Microstructure:</strong> The market for compute is inherently fragmented and structurally illiquid. The order book is notoriously thin, leading to a massive 2.50 Blitz spread. "Iceberg orders" are heavily used by megacorporations to hide the true size of their AI training runs. Because of this, NEX-AI price action is characterized by violent momentum bursts. If your execution logic fails to account for the lack of depth, a single market order can tear through ten price levels, causing extreme slippage and destroying your algorithm's PnL. The exchange offers heavy Maker Rebates here to encourage liquidity provision.
              </p>
            </div>
          </section>

          <section id="orbt" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Rocket className="text-purple-400" /> ORBT-LOG (Orbital Logistics)
            </h2>
            <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 mb-6 font-mono-tech text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block mb-1">LIQUIDITY</span><span className="text-red-500">GHOST TOWN</span></div>
              <div><span className="text-slate-500 block mb-1">SPREAD</span><span className="text-white">5.20 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">TICK SIZE</span><span className="text-amber-400">1.00 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">BEHAVIOR</span><span className="text-amber-400">JUMP-DIFFUSION</span></div>
            </div>
            <div className="space-y-6">
              <p>
                Global supply chains have moved out of the oceans and into the exosphere. Massive sub-orbital launch vehicles have replaced traditional shipping fleets, capable of delivering hyper-urgent freight to any metropolis on Earth in under two hours. ORBT-LOG contracts are digital tickets that secure payload priority on these rockets. 
              </p>
              <p>
                Because the physical launch infrastructure is still scaling, launches are scarce and tightly regulated. Only the absolute elite megacorporations can afford to jump the queue for emergency payload deliveries.
              </p>
              <p>
                <strong>Market Microstructure:</strong> ORBT-LOG operates on a mathematical jump-diffusion model. For 90% of the day, the lit order book is a complete ghost town. Liquidity is chronically low, and the spread rests at a punishing 5.20 Blitz. However, the exact millisecond a spaceport launch manifest is publicly updated, the book floods with HFT arbitrage bots. During these narrow launch windows, the bid-ask spread can dynamically widen to 50.00 Blitz as liquidity entirely vanishes from the sell side. Trading halts and circuit breakers trigger frequently due to rocket telemetry anomalies.
              </p>
            </div>
          </section>

          <section id="des" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Droplet className="text-emerald-400" /> DES-H2 (Desert Hydrogen)
            </h2>
            <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 mb-6 font-mono-tech text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block mb-1">LIQUIDITY</span><span className="text-[#05CD99]">HIGH</span></div>
              <div><span className="text-slate-500 block mb-1">SPREAD</span><span className="text-white">0.50 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">TICK SIZE</span><span className="text-amber-400">0.05 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">BEHAVIOR</span><span className="text-amber-400">MACRO TRENDS</span></div>
            </div>
            <div className="space-y-6">
              <p>
                With solar power acting as the city's infinite engine, the excess energy generated during peak daylight hours had to be stored. Desert Hydrogen operates the world's largest electrolysis mega-plants along the Dubai coastline, continuously cracking Gulf seawater into pure, green hydrogen. It fuels the city's heavy industry and acts as the physical anchor bridging raw energy to physical momentum.
              </p>
              <p>
                <strong>Market Microstructure:</strong> DES-H2 is a trend-follower's dream. Because industrial hydrogen consumption shifts slowly across the supply chain, the asset moves in massive, predictable structural waves. It boasts high liquidity and a tight 0.50 Blitz spread. Price action is heavily driven by algorithmic VWAP (Volume-Weighted Average Price) execution. Huge institutional block trades are typically executed via dark pools, but they occasionally leak into the lit book, causing massive structural shifts in the trend. Latency arbitrage is less effective here; sophisticated statistical arbitrage and long-term holding logic reigns supreme.
              </p>
            </div>
          </section>

          <section id="difc" className="scroll-mt-32">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Building2 className="text-white" /> DIFC-100 (Sovereign Index)
            </h2>
            <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 mb-6 font-mono-tech text-sm grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><span className="text-slate-500 block mb-1">LIQUIDITY</span><span className="text-blue-400">UNLIMITED</span></div>
              <div><span className="text-slate-500 block mb-1">SPREAD</span><span className="text-white">0.05 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">TICK SIZE</span><span className="text-amber-400">0.001 Blitz</span></div>
              <div><span className="text-slate-500 block mb-1">BEHAVIOR</span><span className="text-amber-400">PURE BETA TRACKER</span></div>
            </div>
            <div className="space-y-6">
              <p>
                The Dubai International Financial Centre (DIFC) absorbed the headquarters of the world's most powerful autonomous corporations following the collapse of legacy fiat systems. The DIFC-100 is the composite sovereign index aggregating their total economic performance. It is the ultimate benchmark—every other asset on The Mercantile is ultimately measured against its health.
              </p>
              <p>
                <strong>Market Microstructure:</strong> The DIFC-100 is the ultimate battlefield for latency arbitrage. Because it is a heavily weighted macro index, it boasts unlimited liquidity and a microscopic 0.05 Blitz spread. The order book updates every 50 nanoseconds. Massive order cancellations and "quote stuffing" happen constantly as millions of algorithms fight for queue position at the very top of the book. Arbitrage algorithms fight over fractions of a cent, making the DIFC-100 the most competitive, highly-efficient, and ruthless market in existence.
              </p>
            </div>
          </section>

          <section id="microstructure" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Calculator className="text-amber-400" /> Market Microstructure Math
            </h2>
            <div className="space-y-6">
              <p>
                To build successful algorithms, you must understand the mathematical reality of the order book. An order book is a ledger of all open buy (bid) and sell (ask) orders for a specific asset.
              </p>
              
              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">1. The Mid-Price</h3>
                <p className="mb-4 text-slate-300">The mid-price is the theoretical "true" price of an asset, sitting exactly between the highest buyer and lowest seller.</p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-center text-white text-lg tracking-wider border border-white/5">
                  <span className="text-blue-400">P<sub className="text-xs">mid</sub></span> = (<span className="text-[#05CD99]">Best Bid</span> + <span className="text-red-400">Best Ask</span>) / 2
                </div>
              </div>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">2. The Spread</h3>
                <p className="mb-4 text-slate-300">The spread represents the cost of immediate liquidity. A wider spread means higher transaction costs for market orders.</p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-center text-white text-lg tracking-wider border border-white/5">
                  <span className="text-blue-400">S</span> = <span className="text-red-400">Best Ask</span> - <span className="text-[#05CD99]">Best Bid</span>
                </div>
              </div>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">3. Volume-Weighted Average Price (VWAP)</h3>
                <p className="mb-4 text-slate-300">VWAP is the true average price a stock has traded at throughout the day, based on both volume and price. It is heavily used by institutional algorithms.</p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-center text-white text-lg tracking-wider border border-white/5">
                  <span className="text-blue-400">VWAP</span> = <span className="text-white text-2xl">Σ</span>(<span className="text-amber-400">Price<sub className="text-xs">i</sub></span> × <span className="text-purple-400">Volume<sub className="text-xs">i</sub></span>) / <span className="text-white text-2xl">Σ</span><span className="text-purple-400">Volume<sub className="text-xs">i</sub></span>
                </div>
              </div>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-amber-400 mb-2">4. Order Book Imbalance (OIB)</h3>
                <p className="mb-4 text-slate-300">Imbalance measures buying pressure vs selling pressure at the top of the book. Positive values indicate buying pressure.</p>
                <div className="bg-black/50 p-4 rounded-lg font-mono text-center text-white text-lg tracking-wider border border-white/5 flex flex-col items-center justify-center gap-2">
                  <div className="text-blue-400 text-left w-full max-w-[300px]">OIB =</div>
                  <div className="border-b border-white/30 pb-2 mb-2 inline-block">
                    (<span className="text-[#05CD99]">Bid Vol</span> - <span className="text-red-400">Ask Vol</span>)
                  </div>
                  <div className="inline-block">
                    (<span className="text-[#05CD99]">Bid Vol</span> + <span className="text-red-400">Ask Vol</span>)
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="my-12 py-8 border-y border-white/10 bg-white/[0.02] px-8 rounded-2xl">
            <p className="text-xl text-center font-semibold text-amber-400/90 italic">
              "With the assets understood, your true trial begins. The competition to secure a permanent seat at The Mercantile is brutal, and split into three unforgiving phases."
            </p>
          </div>

          <section id="phase1" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Terminal className="text-slate-300" /> Phase 1: Research & Analytics
            </h2>
            <div className="space-y-6">
              <p>
                Your journey begins in the shadows. Before a single line of execution code is written, you must retreat to your terminal and access the <strong>Research</strong> sector. 
              </p>
              <p>
                The Mercantile provides you with vast troves of historical tick data for the five core assets. You will download these datasets and pull them into your local environments. Here, in the quiet glow of your monitors, you will act as a forensic data scientist. You must analyze the microstructures of the order books, discover hidden statistical arbitrages between highly correlated assets like DUNE-NRG and DES-H2, and train your predictive machine learning models offline.
              </p>
              <p>
                Failing to understand the historical context of a flash crash in ORBT-LOG or a momentum breakout in NEX-AI guarantees your destruction in the live markets. Research is where the war is truly won.
              </p>
            </div>
          </section>

          <section id="algo101" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <FileDown className="text-slate-300" /> Algo Trading 101: First Steps
            </h2>
            <div className="space-y-6">
              <p>
                If you have zero programming experience, do not panic. Algorithmic trading is simply the process of using rules to buy and sell assets, translated into code. Here is your step-by-step path to building your first algorithm.
              </p>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">Step 1: Download the Data</h3>
                <p className="text-slate-300">
                  You cannot build a strategy without knowing how an asset moves. Navigate to the <strong>Research</strong> tab in The Mercantile. Download the historical CSV datasets (e.g., <code>historical_DUNE.csv</code>). This CSV file contains a row for every single time the order book changed.
                </p>
              </div>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">Step 2: Exploratory Data Analysis (EDA)</h3>
                <p className="text-slate-300">
                  Load this CSV into Python using <strong>Pandas</strong>, a powerful data analysis library. You can use Jupyter Notebooks or Google Colab for this.
                </p>
                <div className="bg-black/80 rounded-lg p-4 font-mono text-sm text-[#05CD99] overflow-x-auto border border-white/10">
<pre>{`import pandas as pd
import matplotlib.pyplot as plt

# Load the historical dataset
df = pd.read_csv('historical_DUNE.csv')

# Calculate the mid-price using the formula we learned
df['mid_price'] = (df['best_bid'] + df['best_ask']) / 2

# Plot it to see the mean-reverting behavior
df['mid_price'].plot(title="DUNE-NRG Mid Price")
plt.show()`}</pre>
                </div>
              </div>

              <div className="bg-[#0b101d] border border-white/10 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-semibold text-white">Step 3: Finding an Edge</h3>
                <p className="text-slate-300">
                  By looking at the graph, you might notice patterns. For example, DUNE-NRG might constantly bounce between 99 Blitz and 101 Blitz. If you code your algorithm to <code>BUY</code> when the price hits 99, and <code>SELL</code> when it hits 101, you have found an "edge"—a repeatable, profitable pattern.
                </p>
              </div>
            </div>
          </section>

          <section id="phase2" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Code2 className="text-slate-300" /> Phase 2: Algorithm Deployment
            </h2>
            <div className="space-y-6">
              <p>
                Once your mathematical models are primed and your logic core is sound, you enter the Algorithm Deployment phase. 
              </p>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 my-8 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
                <div>
                  <h3 className="text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <FileDown size={20} /> Download the Official Quant SDK
                  </h3>
                  <p className="text-slate-300 text-sm">
                    The Mercantile Quant SDK contains all the Python classes, type hints, and local simulation tools you need to build and test your algorithm offline before submitting it to the grid.
                  </p>
                </div>
                <a 
                  href="/strategy-sdk.zip" 
                  download="strategy-sdk.zip"
                  className="shrink-0 flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors whitespace-nowrap shadow-lg shadow-amber-500/20"
                >
                  <FileDown size={18} />
                  Download SDK (.zip)
                </a>
              </div>

              <p>
                Utilizing The Mercantile's proprietary Quant SDK, you will translate your theoretical strategies into ruthless, executable Python code. You are building an autonomous machine that will operate entirely without your intervention. You must strictly define your risk limits, your position sizing algorithms, and your absolute entry and exit triggers.
              </p>
              <p>
                When your code is compiled, tested, and perfect, you head to the <strong>Submit</strong> terminal. There, you will upload your script's logic core directly into the DMX-35 execution engine. From that moment on, the algorithm belongs to the grid.
              </p>
            </div>
          </section>

          <section id="oop" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Braces className="text-slate-300" /> Writing Your Algorithm (OOP)
            </h2>
            <div className="space-y-6">
              <p>
                To submit an algorithm to the DMX-35 execution engine, it must be formatted in a specific way using <strong>Object-Oriented Programming (OOP)</strong>.
              </p>
              <p>
                Think of OOP like building a blueprint. You are defining a "Class" (the blueprint) that the exchange will use to build your trading bot. The exchange engine expects your class to define an <code>on_tick</code> method (the engine will auto-discover your class, so you can name it whatever you like, e.g., <code>MyStrategy</code> or <code>ArbitrageBot</code>).
              </p>

              <div className="bg-black/80 rounded-xl p-6 font-mono text-sm text-slate-300 overflow-x-auto border border-white/10 shadow-lg">
                <div className="flex gap-2 mb-4 pb-2 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-[#05CD99]"></div>
                </div>
<div className="whitespace-pre">
<div><span className="text-purple-400">class</span> <span className="text-amber-400">MyStrategy</span>:</div>
<div>    <span className="text-slate-500"># This runs ONCE when the simulation starts.</span></div>
<div>    <span className="text-purple-400">def</span> <span className="text-blue-400">on_start</span>(<span className="text-orange-400">self</span>, md):</div>
<div>        <span className="text-orange-400">self</span>.position = <span className="text-[#05CD99]">0</span></div>
<div>        <span className="text-orange-400">self</span>.total_profit = <span className="text-[#05CD99]">0</span></div>
<div>        <span className="text-blue-300">print</span>(<span className="text-green-300">"Algorithm Initialized"</span>)</div>
<br />
<div>    <span className="text-slate-500"># This runs EVERY SINGLE TIME the market changes.</span></div>
<div>    <span className="text-purple-400">def</span> <span className="text-blue-400">on_tick</span>(<span className="text-orange-400">self</span>, md, order_book):</div>
<div>        best_bid = order_book.bids[<span className="text-[#05CD99]">0</span>].price</div>
<div>        best_ask = order_book.asks[<span className="text-[#05CD99]">0</span>].price</div>
<div>        mid_price = (best_bid + best_ask) / <span className="text-[#05CD99]">2</span></div>
<br />
<div>        <span className="text-slate-500"># Example Logic: Mean Reversion</span></div>
<div>        <span className="text-purple-400">if</span> (mid_price &lt; <span className="text-[#05CD99]">99.5</span> </div>
<div>            <span className="text-purple-400">and</span> <span className="text-orange-400">self</span>.position == <span className="text-[#05CD99]">0</span>):</div>
<div>            <span className="text-slate-500"># Send a BUY order to the exchange</span></div>
<div>            md.send_order(<span className="text-green-300">"BUY"</span>, qty=<span className="text-[#05CD99]">10</span>)</div>
<div>            <span className="text-orange-400">self</span>.position += <span className="text-[#05CD99]">10</span></div>
<br />
<div>        <span className="text-purple-400">elif</span> (mid_price &gt; <span className="text-[#05CD99]">100.5</span> </div>
<div>              <span className="text-purple-400">and</span> <span className="text-orange-400">self</span>.position &gt; <span className="text-[#05CD99]">0</span>):</div>
<div>            <span className="text-slate-500"># Sell to take profit</span></div>
<div>            md.send_order(<span className="text-green-300">"SELL"</span>, qty=<span className="text-[#05CD99]">10</span>)</div>
<div>            <span className="text-orange-400">self</span>.position -= <span className="text-[#05CD99]">10</span></div>
</div>
              </div>

              <div className="bg-[#0b101d] border-l-4 border-amber-400 rounded-r-xl p-4">
                <p className="text-sm text-slate-300">
                  <strong className="text-amber-400">CRITICAL:</strong> Your code must contain a class with an <code>on_tick</code> method, otherwise the validation engine will throw an error and reject your submission. The class name itself can be anything.
                </p>
              </div>
            </div>
          </section>

          <section id="phase3" className="scroll-mt-32 pt-8">
            <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <Trophy className="text-slate-300" /> Phase 3: Live Simulation & Leaderboard
            </h2>
            <div className="space-y-6">
              <p>
                There is no turning back. In Phase 3, your algorithm is unleashed into the wild. 
              </p>
              <p>
                It will be strictly backtested and simulated against completely unseen, future data arrays—market conditions that your model has never encountered. You will watch in real-time as your creation battles globally against the algorithms of rival Quantitative Architects.
              </p>
              <p>
                The ecosystem is unforgiving. You will be ranked mercilessly on the global <strong>Leaderboard</strong> based on three critical metrics: your total cumulative PnL (Profit and Loss), your Sharpe Ratio (risk-adjusted return), and your Maximum Drawdown (capital preservation during crashes).
              </p>
              <p className="text-2xl font-bold text-amber-400 text-center pt-12 pb-8">
                Only the top Quants will survive. Welcome to The Mercantile.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
