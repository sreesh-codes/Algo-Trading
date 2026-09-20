"use client";

import React, { useState, useEffect, useTransition } from "react";
import { MercantileApi } from "@/services/api";
import { 
  ResearchDatasetMetadata, 
  ResearchQueryParams, 
  ResearchTimeseriesResponse, 
  CorrelationMatrixData,
  RESEARCH_DATASETS 
} from "@/services/api/research";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { DataExplorerControls } from "@/components/research/DataExplorerControls";
import { StatisticsMetricsBar } from "@/components/research/StatisticsMetricsBar";
import { PriceVolumeChart } from "@/components/research/PriceVolumeChart";
import { ReturnsDistributionChart } from "@/components/research/ReturnsDistributionChart";
import { AutocorrelationChart } from "@/components/research/AutocorrelationChart";
import { CorrelationMatrixWidget } from "@/components/research/CorrelationMatrixWidget";
import { ScatterPlotWidget } from "@/components/research/ScatterPlotWidget";
import { RollingCorrelationChart } from "@/components/research/RollingCorrelationChart";
import { RollingVolatilityChart } from "@/components/research/RollingVolatilityChart";
import { DataInspectTable } from "@/components/research/DataInspectTable";
import { useToast } from "@/components/ui/Toast";
import { 
  Activity, 
  BarChart2, 
  Grid, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Download, 
  FileText, 
  Code2, 
  Copy, 
  Check,
  LayoutGrid
} from "lucide-react";
import { ResearchPaper, StarterStrategy } from "@/data/mock/research";

type ActivePerspective = "overview" | "distribution" | "correlation" | "comprehensive";

export default function ResearchPage() {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Research Query Parameters State
  const [queryParams, setQueryParams] = useState<ResearchQueryParams>({
    asset: "DUNE-NRG",
    dateRange: "24h",
    interval: "5m",
    feature: "price",
    compareAsset: "DIFC-100",
    datasetId: RESEARCH_DATASETS[0].id,
  });

  const [selectedDataset, setSelectedDataset] = useState<ResearchDatasetMetadata>(RESEARCH_DATASETS[0]);
  const [researchData, setResearchData] = useState<ResearchTimeseriesResponse | null>(null);
  const [correlationData, setCorrelationData] = useState<CorrelationMatrixData | null>(null);
  const [activePerspective, setActivePerspective] = useState<ActivePerspective>("overview");
  const [isInspectOpen, setIsInspectOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Archive materials state
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [starterStrategies, setStarterStrategies] = useState<StarterStrategy[]>([]);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Initial and reactive data fetching
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [res, corr, p, s] = await Promise.all([
        MercantileApi.research.getTimeseries(queryParams),
        MercantileApi.research.getCorrelationMatrix(),
        MercantileApi.getResearchPapers(),
        MercantileApi.getStarterStrategies(),
      ]);
      if (isMounted) {
        setResearchData(res);
        setCorrelationData(corr);
        setPapers(p);
        setStarterStrategies(s);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  // Handlers for parameter changes
  const handleParamChange = (updated: Partial<ResearchQueryParams>) => {
    startTransition(() => {
      setQueryParams((prev) => ({ ...prev, ...updated }));
    });
  };

  const handleSelectDataset = (dataset: ResearchDatasetMetadata) => {
    setSelectedDataset(dataset);
    handleParamChange({ datasetId: dataset.id });
    showToast({
      type: "info",
      title: "DATASET SYNCHRONIZED",
      description: `Loaded ${dataset.name} (${dataset.recordCount} observations).`,
    });
  };

  const handleExportData = (format: "PARQUET" | "CSV") => {
    showToast({
      type: "success",
      title: `EXPORTING: ${queryParams.asset}_${queryParams.interval}.${format.toLowerCase()}`,
      description: `Cryptographic SHA-256 verified against DMX-35 telemetry archive.`,
    });
  };

  const handleSelectMatrixPair = (assetA: string, assetB: string) => {
    handleParamChange({
      asset: assetA,
      compareAsset: assetB,
    });
    showToast({
      type: "info",
      title: `ACTIVE REGRESSION PAIR: ${assetA} &times; ${assetB}`,
      description: "Updated scatter regression and 30-period rolling correlation.",
    });
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    showToast({
      type: "info",
      title: "STRATEGY COPIED",
      description: "Python quantitative template copied to clipboard.",
    });
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  if (loading || !researchData || !correlationData) {
    return (
      <div className="w-full min-h-screen bg-[#050811] text-white flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-gray-400 uppercase tracking-wider">
            INITIALIZING QUANTITATIVE TIME SERIES ANALYZER...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050811] text-[#F8FAFC] pb-16">
      {/* Clean Non-Dotted Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-[#070C18] via-[#05070B] to-[#030508] z-0" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(212,175,55,0.06),transparent_75%)] z-0" />

      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-3 sm:px-5 lg:px-7 py-4 space-y-4">
        {/* 1. Header with exact requested text & dataset selector */}
        <ResearchHeader
          selectedDataset={selectedDataset}
          onSelectDataset={handleSelectDataset}
          onExportData={handleExportData}
          onToggleDataInspect={() => setIsInspectOpen(!isInspectOpen)}
          isInspectOpen={isInspectOpen}
        />

        {/* 2. Collapsible Raw Record Inspector Table */}
        {isInspectOpen && (
          <DataInspectTable
            points={researchData.points}
            assetTicker={researchData.asset.ticker}
            onClose={() => setIsInspectOpen(false)}
            onExportCsv={() => handleExportData("CSV")}
          />
        )}

        {/* 3. Data Explorer Controls (asset, date range, interval, feature) */}
        <DataExplorerControls
          params={queryParams}
          onChangeParams={handleParamChange}
        />

        {/* 4. Descriptive Statistics Bar (Mean, Median, Std, Skewness, Kurtosis, ACF, Volatility) */}
        <StatisticsMetricsBar
          statistics={researchData.statistics}
          feature={queryParams.feature}
        />

        {/* 5. Visualization Perspective Switcher Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none font-sans">
            <button
              onClick={() => setActivePerspective("overview")}
              className={`text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium whitespace-nowrap ${
                activePerspective === "overview"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold"
                  : "text-gray-400 hover:text-white bg-white/5 border border-transparent"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Price & Microstructure</span>
            </button>

            <button
              onClick={() => setActivePerspective("distribution")}
              className={`text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium whitespace-nowrap ${
                activePerspective === "distribution"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold"
                  : "text-gray-400 hover:text-white bg-white/5 border border-transparent"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Distribution & Serial Correlation</span>
            </button>


            <button
              onClick={() => setActivePerspective("comprehensive")}
              className={`text-xs px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium whitespace-nowrap ${
                activePerspective === "comprehensive"
                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold"
                  : "text-gray-400 hover:text-white bg-white/5 border border-transparent"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Comprehensive Multi-Pane</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-gray-400 shrink-0">
            ACTIVE ASSET: <span className="text-white font-semibold">{researchData.asset.ticker}</span>
            {queryParams.compareAsset && (
              <span> • PAIR: <span className="text-[#D4AF37]">{queryParams.compareAsset}</span></span>
            )}
          </div>
        </div>

        {/* ================================================== */}
        {/* PERSPECTIVE VIEWS */}
        {/* ================================================== */}

        {/* 1. OVERVIEW PERSPECTIVE */}
        {activePerspective === "overview" && (
          <div className="flex flex-col gap-4">
            {/* Main Feature / Price & Volume Chart */}
            <div className="w-full">
              <PriceVolumeChart
                points={researchData.points}
                asset={researchData.asset}
                feature={queryParams.feature}
                statistics={researchData.statistics}
              />
            </div>

            {/* Bottom Pane: Rolling Volatility */}
            <div className="w-full">
              <RollingVolatilityChart
                points={researchData.points}
                statistics={researchData.statistics}
              />
            </div>
          </div>
        )}

        {/* 2. DISTRIBUTION & AUTOCORRELATION PERSPECTIVE */}
        {activePerspective === "distribution" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* Empirical Returns Distribution Histogram vs Normal Bell Curve */}
            <ReturnsDistributionChart
              distribution={researchData.distribution}
              statistics={researchData.statistics}
            />

            {/* Autocorrelation Correlogram (ACF) with 95% Bartlett Bounds */}
            <AutocorrelationChart
              autocorrelation={researchData.autocorrelation}
            />

            {/* Rolling Volatility Clustering */}
            <div className="lg:col-span-2">
              <RollingVolatilityChart
                points={researchData.points}
                statistics={researchData.statistics}
              />
            </div>
          </div>
        )}



        {/* 4. COMPREHENSIVE MULTI-PANE PERSPECTIVE */}
        {activePerspective === "comprehensive" && (
          <div className="space-y-4">
            {/* Top: Price & Volume */}
            <PriceVolumeChart
              points={researchData.points}
              asset={researchData.asset}
              feature={queryParams.feature}
              statistics={researchData.statistics}
            />

            {/* Middle Grid: Returns Distribution + ACF Correlogram */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              <ReturnsDistributionChart
                distribution={researchData.distribution}
                statistics={researchData.statistics}
              />

              <AutocorrelationChart
                autocorrelation={researchData.autocorrelation}
              />
            </div>




          </div>
        )}

      </div>
    </div>
  );
}
