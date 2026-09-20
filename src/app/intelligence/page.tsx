"use client";

import React, { useState, useEffect, useMemo } from "react";
import { MercantileApi } from "@/services/api";
import {
  IntelligenceEvent,
  NetworkThreatLevel,
  DistrictName,
  EventSeverity,
  MOCK_INTELLIGENCE_EVENTS,
} from "@/services/api/intelligence";
import { NetworkStatusBanner } from "@/components/intelligence/NetworkStatusBanner";
import { FeaturedReportCard } from "@/components/intelligence/FeaturedReportCard";
import { VerticalTimeline } from "@/components/intelligence/VerticalTimeline";
import { IntelligenceDetailModal } from "@/components/intelligence/IntelligenceDetailModal";
import {
  Radio,
  Filter,
  Search,
  Clock,
  Shield,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

export default function IntelligencePage() {
  const [events, setEvents] = useState<IntelligenceEvent[]>(MOCK_INTELLIGENCE_EVENTS);
  const [featuredEvent, setFeaturedEvent] = useState<IntelligenceEvent | null>(
    MOCK_INTELLIGENCE_EVENTS[0]
  );
  const [selectedEvent, setSelectedEvent] = useState<IntelligenceEvent | null>(null);
  const [threatLevel, setThreatLevel] = useState<NetworkThreatLevel>("ELEVATED VOLATILITY");
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName | "ALL">("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<EventSeverity | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("14:32:17 GST");

  // Load initial intelligence stream
  useEffect(() => {
    async function load() {
      const allEvents = await MercantileApi.intelligence.getEvents();
      const featured = await MercantileApi.intelligence.getFeatured();
      setEvents(allEvents);
      setFeaturedEvent(featured);
    }
    load();
  }, []);

  // Live ticking GST clock
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String((now.getUTCHours() + 4) % 24).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setCurrentTime(`${h}:${m}:${s} GST`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filtered timeline events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedDistrict !== "ALL" && e.district !== selectedDistrict) return false;
      if (selectedSeverity !== "ALL" && e.severity !== selectedSeverity) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          e.headline.toLowerCase().includes(q) ||
          e.shortDescription.toLowerCase().includes(q) ||
          e.district.toLowerCase().includes(q) ||
          e.affectedAsset.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedDistrict, selectedSeverity, searchQuery]);

  const districts: Array<DistrictName | "ALL"> = [
    "ALL",
    "DIFC",
    "JEBEL ALI",
    "ENERGY GRID",
    "AI CITY",
    "ORBITAL NETWORK",
  ];

  const severities: Array<EventSeverity | "ALL"> = [
    "ALL",
    "NORMAL",
    "WATCH",
    "ALERT",
    "CRITICAL",
    "SYSTEMIC",
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-700 ${
        threatLevel === "STABLE"
          ? "bg-[#04060B]"
          : threatLevel === "ELEVATED VOLATILITY"
          ? "bg-[#070503]"
          : "bg-[#080204]"
      }`}
    >
      {/* Ambient background glow reflecting network state */}
      <div
        className={`pointer-events-none fixed inset-0 transition-opacity duration-700 ${
          threatLevel === "STABLE"
            ? "bg-[radial-gradient(ellipse_at_top,_rgba(5,205,153,0.06),_transparent_70%)]"
            : threatLevel === "ELEVATED VOLATILITY"
            ? "bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08),_transparent_70%)]"
            : "bg-[radial-gradient(ellipse_at_top,_rgba(239,68,68,0.12),_transparent_70%)]"
        }`}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs">
              <span className="text-slate-400 uppercase tracking-widest">
                DUBAI 2035 NARRATIVE WIRE
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-[#00F0FF] font-bold tracking-wider uppercase">
                INTELLIGENCE DISPATCH
              </span>
              <span className="flex items-center gap-1 text-[#05CD99] ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
                TELEMETRY ORACLE ACTIVE
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase font-sans">
              Market Intelligence & Shocks
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
              Fictional narrative reports, atmospheric telemetry, and localized supply disruptions driving continuous auction volatility.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#080B14] border border-white/10 rounded-xl p-3.5 shrink-0 font-mono text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase block">ORACLE TIME</span>
              <span className="text-white font-bold text-sm tabular-nums">
                {currentTime}
              </span>
              <span className="text-[10px] text-slate-500 block">Synchronized Feed</span>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-500 uppercase block">ACTIVE SHOCKS</span>
              <span className="text-[#D4AF37] font-bold text-sm">3 DISTRICTS</span>
              <span className="text-[10px] text-slate-500 block">Round 02 Arena</span>
            </div>
          </div>
        </div>

        {/* Immersive Network Status Banner (Visual State Alteration) */}
        <NetworkStatusBanner
          currentThreatLevel={threatLevel}
          onChangeThreatLevel={(level) => setThreatLevel(level)}
          activeAlertCount={3}
        />

        {/* Main Featured Intelligence Report */}
        {featuredEvent && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                PRIMARY MARKET BULLETIN
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                DISPATCH ID: {featuredEvent.id}
              </span>
            </div>
            <FeaturedReportCard
              event={featuredEvent}
              onInspectReport={(e) => setSelectedEvent(e)}
            />
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="space-y-3 pt-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* District Filter Pills */}
            <div className="flex items-center gap-1.5 bg-[#070A12] p-1.5 rounded-xl border border-white/8 text-xs font-mono overflow-x-auto">
              <span className="text-[10px] text-slate-500 px-2 uppercase font-medium hidden sm:inline">
                District:
              </span>
              {districts.map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => setSelectedDistrict(district)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer uppercase tracking-wider whitespace-nowrap text-[11px] ${
                    selectedDistrict === district
                      ? "bg-[#D4AF37] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {district}
                </button>
              ))}
            </div>

            {/* Severity Filter & Search */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Severity Pill Selector */}
              <div className="flex items-center gap-1 bg-[#070A12] p-1.5 rounded-xl border border-white/8 text-xs font-mono overflow-x-auto">
                <span className="text-[10px] text-slate-500 px-2 uppercase font-medium hidden sm:inline">
                  Severity:
                </span>
                {severities.map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer uppercase text-[10px] font-semibold ${
                      selectedSeverity === sev
                        ? "bg-white/15 text-white shadow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              {/* Text Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter dispatches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[#070A12] border border-white/8 text-white text-xs font-mono focus:border-[#D4AF37] outline-none w-full sm:w-48 placeholder-slate-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Animated Timeline */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-white/8 pb-3">
            <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
              CHRONOLOGICAL INTELLIGENCE TIMELINE
            </h2>
            <span className="text-[11px] font-mono text-slate-500">
              Showing {filteredEvents.length} sequential dispatches
            </span>
          </div>

          <VerticalTimeline
            events={filteredEvents}
            onSelectEvent={(event) => setSelectedEvent(event)}
          />
        </div>

        {/* Narrative Wire Sign-off Footer */}
        <div className="p-4 rounded-xl bg-[#080B14] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span>
              All intelligence reports are broadcast via verified Dubai Mercantile Network cryptographic feeds.
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Node 04 Telemetry Archive • 2035.04.17
          </span>
        </div>
      </div>

      {/* Intelligence Detail Modal */}
      <IntelligenceDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
