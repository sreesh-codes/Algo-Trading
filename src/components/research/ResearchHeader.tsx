"use client";

import React from "react";
import { 
  Database, 
  Download, 
  Layers, 
  ShieldCheck, 
  Table, 
  Cpu, 
  Activity, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { ResearchDatasetMetadata, RESEARCH_DATASETS } from "@/services/api/research";

interface ResearchHeaderProps {
  selectedDataset: ResearchDatasetMetadata;
  onSelectDataset: (dataset: ResearchDatasetMetadata) => void;
  onExportData: (format: "PARQUET" | "CSV") => void;
  onToggleDataInspect: () => void;
  isInspectOpen: boolean;
}

export function ResearchHeader({
  selectedDataset,
  onSelectDataset,
  onExportData,
  onToggleDataInspect,
  isInspectOpen,
}: ResearchHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/8 pb-6">
      <div className="relative">
        <div className="absolute top-4 left-0 w-64 h-32 bg-amber-500/10 blur-[80px] pointer-events-none" />
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-amber-400 drop-shadow-[0_2px_24px_rgba(251,191,36,0.3)] font-sans relative z-10">
          Research
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl text-slate-200 font-normal leading-relaxed mt-3 max-w-4xl relative z-10">
          Understand the market before you trade it.
        </p>
      </div>
    </div>
  );
}
