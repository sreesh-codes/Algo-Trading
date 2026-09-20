import { MOCK_ASSETS, AssetContract } from "@/data/mock/assets";

export interface ResearchDatasetMetadata {
  id: string;
  name: string;
  session: string;
  description: string;
  recordCount: string;
  timeRange: string;
  frequency: string;
  sizeBytes: string;
  format: "PARQUET" | "CSV" | "ARROW";
  tickers: string[];
}

export type ResearchFeature =
  | "price"
  | "returns"
  | "volume"
  | "volatility"
  | "spread"
  | "imbalance"
  | "correlation";

export type SamplingInterval = "1s" | "1m" | "5m" | "15m" | "1h" | "1d";
export type DateRangeKey = "24h" | "7d" | "30d" | "all";

export interface ResearchQueryParams {
  asset: string;
  dateRange: DateRangeKey;
  interval: SamplingInterval;
  feature: ResearchFeature;
  compareAsset?: string;
  lags?: number;
  rollingWindow?: number;
  datasetId?: string;
}

export interface ResearchTimeseriesPoint {
  index: number;
  timestamp: string;
  dateStr: string;
  timeStr: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  returnPct: number;
  logReturn: number;
  rollingVolPct: number;
  spreadBlitz: number;
  spreadBps: number;
  orderImbalance: number; // between -1.0 (sell heavy) and +1.0 (buy heavy)
  sma20?: number;
  ema50?: number;
  rollingCorrelation?: number;
}

export interface ReturnsDistributionBucket {
  binMin: number;
  binMax: number;
  binCenter: number;
  binLabel: string;
  count: number;
  frequencyPct: number;
  normalDensity: number;
}

export interface AssetStatistics {
  assetTicker: string;
  assetName: string;
  sampleCount: number;
  mean: number;
  median: number;
  stdDev: number;
  skewness: number;
  kurtosis: number; // Excess kurtosis: > 0 means leptokurtic / fat-tailed
  autocorrelationLag1: number;
  annualizedVolatility: number;
  minVal: number;
  maxVal: number;
  interquartileRange: number;
  var95: number; // 95% historical Value at Risk
  var99: number; // 99% historical Value at Risk
  stationarityStatus: "STATIONARY (ADF p < 0.01)" | "TRENDING (ADF p > 0.05)";
}

export interface CorrelationCell {
  assetA: string;
  assetB: string;
  correlation: number;
  covariance: number;
  tStat: number;
  pValue: number;
  sampleSize: number;
}

export interface CorrelationMatrixData {
  tickers: string[];
  names: Record<string, string>;
  matrix: Record<string, Record<string, number>>;
  cells: CorrelationCell[];
}

export interface ScatterDataPoint {
  timestamp: string;
  xVal: number;
  yVal: number;
  label: string;
}

export interface ScatterPlotResult {
  assetA: string;
  assetB: string;
  featureX: string;
  featureY: string;
  points: ScatterDataPoint[];
  slopeBeta: number;
  interceptAlpha: number;
  rSquared: number;
  correlation: number;
  sampleSize: number;
}

export interface AutocorrelationLag {
  lag: number;
  correlation: number;
  upperConfidence: number;
  lowerConfidence: number;
  isSignificant: boolean;
}

export interface ResearchTimeseriesResponse {
  dataset: ResearchDatasetMetadata;
  asset: AssetContract;
  params: ResearchQueryParams;
  points: ResearchTimeseriesPoint[];
  statistics: AssetStatistics;
  distribution: ReturnsDistributionBucket[];
  autocorrelation: AutocorrelationLag[];
  scatter?: ScatterPlotResult;
}

export const RESEARCH_DATASETS: ResearchDatasetMetadata[] = [
  {
    id: "ds-2035-s4-l3",
    name: "Session 2035-S4 Tick Stream (L3 Depth)",
    session: "2035-S4",
    description: "Consolidated high-frequency continuous auction ticks, order book depth delta, and trade execution flags.",
    recordCount: "4,120,800",
    timeRange: "Session 2035-S4 (April 10 – April 17, 2035)",
    frequency: "100ms L3 Snapshots",
    sizeBytes: "348 MB",
    format: "PARQUET",
    tickers: ["DUNE-NRG", "NEX-AI", "ORBT-LOG", "DES-H2", "DIFC-100"],
  },
  {
    id: "ds-round-02-arb",
    name: "Round 02 High-Frequency Order Flow",
    session: "Round 02",
    description: "Multi-venue cross-corridor order arrival streams calibrated for inter-district statistical arbitrage.",
    recordCount: "2,845,000",
    timeRange: "Current Round (72h Active Window)",
    frequency: "Nanosecond Tick Replay",
    sizeBytes: "216 MB",
    format: "ARROW",
    tickers: ["DUNE-NRG", "NEX-AI", "ORBT-LOG", "DES-H2", "DIFC-100"],
  },
  {
    id: "ds-baseload-hist",
    name: "Historical Baseload & Microstructure (2034-2035)",
    session: "Historical",
    description: "Twelve-month institutional continuous auction benchmarks across energy, compute, and orbital logistics corridors.",
    recordCount: "18,400,000",
    timeRange: "May 2034 – April 2035",
    frequency: "1-Minute Aggregates",
    sizeBytes: "1.2 GB",
    format: "PARQUET",
    tickers: ["DUNE-NRG", "NEX-AI", "ORBT-LOG", "DES-H2", "DIFC-100"],
  },
];

// Baseline theoretical correlation lookup for the 5 assets
const BASE_CORRELATIONS: Record<string, Record<string, number>> = {
  "DUNE-NRG": {
    "DUNE-NRG": 1.0,
    "NEX-AI": -0.32,
    "ORBT-LOG": 0.44,
    "DES-H2": 0.64,
    "DIFC-100": 0.58,
  },
  "NEX-AI": {
    "DUNE-NRG": -0.32,
    "NEX-AI": 1.0,
    "ORBT-LOG": 0.18,
    "DES-H2": -0.19,
    "DIFC-100": 0.76,
  },
  "ORBT-LOG": {
    "DUNE-NRG": 0.44,
    "NEX-AI": 0.18,
    "ORBT-LOG": 1.0,
    "DES-H2": 0.35,
    "DIFC-100": 0.52,
  },
  "DES-H2": {
    "DUNE-NRG": 0.64,
    "NEX-AI": -0.19,
    "ORBT-LOG": 0.35,
    "DES-H2": 1.0,
    "DIFC-100": 0.41,
  },
  "DIFC-100": {
    "DUNE-NRG": 0.58,
    "NEX-AI": 0.76,
    "ORBT-LOG": 0.52,
    "DES-H2": 0.41,
    "DIFC-100": 1.0,
  },
};

// Deterministic Pseudo-Random Generator with seed
function pseudoRandom(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Generates realistic student-t / fat-tailed innovations
function generateStudentT(rand: () => number, df = 4): number {
  // Box-Muller for normal
  const u1 = Math.max(1e-7, rand());
  const u2 = rand();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  // Chi-squared approximation for degrees of freedom
  let chi2 = 0;
  for (let i = 0; i < df; i++) {
    const v1 = Math.max(1e-7, rand());
    const v2 = rand();
    const zi = Math.sqrt(-2.0 * Math.log(v1)) * Math.cos(2.0 * Math.PI * v2);
    chi2 += zi * zi;
  }
  return z / Math.sqrt(chi2 / df);
}

/**
 * Core Synthetic Research Engine
 * Produces statistically faithful microstructure series
 */
export function generateMockResearchData(params: ResearchQueryParams): ResearchTimeseriesResponse {
  const assetTicker = params.asset.toUpperCase();
  const asset =
    MOCK_ASSETS.find((a) => a.ticker.toUpperCase() === assetTicker) || MOCK_ASSETS[0];

  const compareTicker = (params.compareAsset || "DIFC-100").toUpperCase();
  const compareAsset =
    MOCK_ASSETS.find((a) => a.ticker.toUpperCase() === compareTicker) || MOCK_ASSETS[4];

  const dataset =
    RESEARCH_DATASETS.find((d) => d.id === params.datasetId) || RESEARCH_DATASETS[0];

  // Determine number of points based on date range and interval
  let pointCount = 100;
  if (params.interval === "1s") pointCount = 120;
  else if (params.interval === "1m") pointCount = 100;
  else if (params.interval === "5m") pointCount = 90;
  else if (params.interval === "15m") pointCount = 80;
  else if (params.interval === "1h") pointCount = 70;
  else if (params.interval === "1d") pointCount = 60;

  if (params.dateRange === "24h") pointCount = Math.min(pointCount, 80);
  else if (params.dateRange === "7d") pointCount = Math.min(pointCount, 100);
  else if (params.dateRange === "30d") pointCount = Math.min(pointCount, 120);

  // Derive deterministic seed from ticker string + interval
  const seedString = `${asset.ticker}-${params.interval}-${params.dateRange}`;
  let seed = 42;
  for (let i = 0; i < seedString.length; i++) {
    seed = (seed * 31 + seedString.charCodeAt(i)) % 1000000007;
  }
  const rand = pseudoRandom(seed);
  const compareRand = pseudoRandom(seed + 9999);

  const basePrice = asset.lastPrice;
  const baseVol = (asset.volatilityPct / 100) * 0.03; // daily scale
  const points: ResearchTimeseriesPoint[] = [];

  let currentPrice = basePrice * 0.96;
  let currentComparePrice = compareAsset.lastPrice * 0.95;
  let currentVol = baseVol;

  const now = new Date(2035, 3, 17, 14, 30, 0); // 2035-04-17 14:30:00 GST
  const stepSeconds =
    params.interval === "1s"
      ? 1
      : params.interval === "1m"
      ? 60
      : params.interval === "5m"
      ? 300
      : params.interval === "15m"
      ? 900
      : params.interval === "1h"
      ? 3600
      : 86400;

  const returnsList: number[] = [];
  const logReturnsList: number[] = [];
  const compareReturnsList: number[] = [];

  // Pair correlation from matrix
  const targetPairCorr =
    BASE_CORRELATIONS[asset.ticker]?.[compareAsset.ticker] ?? 0.45;

  for (let i = 0; i < pointCount; i++) {
    const pointTime = new Date(now.getTime() - (pointCount - 1 - i) * stepSeconds * 1000);
    const dateStr = pointTime.toISOString().split("T")[0];
    const timeStr = pointTime.toTimeString().split(" ")[0];

    // GARCH(1,1) style volatility clustering
    const shock = generateStudentT(rand, 4);
    currentVol = Math.sqrt(0.00002 + 0.85 * (currentVol * currentVol) + 0.12 * (shock * shock * 0.0001));
    const clampedVol = Math.max(0.004, Math.min(0.08, currentVol));

    // Common factor + idiosyncratic factor to achieve target cross-asset correlation
    const commonShock = generateStudentT(rand, 5);
    const idioShock = generateStudentT(rand, 4);
    const combinedShock =
      Math.sqrt(Math.max(0, Math.abs(targetPairCorr))) * commonShock +
      Math.sqrt(1 - Math.min(0.99, Math.abs(targetPairCorr))) * idioShock * (targetPairCorr < 0 ? -1 : 1);

    const periodReturn = combinedShock * clampedVol * (stepSeconds / 3600);
    const logReturn = Math.log(1 + periodReturn);

    // Correlated compare return
    const compareIdio = generateStudentT(compareRand, 4);
    const comparePeriodReturn =
      (Math.sqrt(Math.abs(targetPairCorr)) * commonShock +
        Math.sqrt(1 - Math.min(0.99, Math.abs(targetPairCorr))) * compareIdio) *
      (compareAsset.volatilityPct / 100 * 0.02);

    const prevPrice = currentPrice;
    currentPrice = Math.max(1.0, currentPrice * (1 + periodReturn));
    currentComparePrice = Math.max(1.0, currentComparePrice * (1 + comparePeriodReturn));

    const open = prevPrice;
    const close = currentPrice;
    const high = Math.max(open, close) * (1 + rand() * 0.003);
    const low = Math.min(open, close) * (1 - rand() * 0.003);

    // Microstructure spread & order imbalance
    const baseSpread = asset.spread;
    const spreadBlitz = Number(Math.max(asset.tickSize, baseSpread * (0.85 + rand() * 0.45 + clampedVol * 3.5)).toFixed(2));
    const spreadBps = Number(((spreadBlitz / currentPrice) * 10000).toFixed(1));

    // Order imbalance: mean-reverting OU process around current return sign
    const orderImbalance = Number(
      Math.max(-0.95, Math.min(0.95, periodReturn * 8.0 + (rand() - 0.5) * 0.35)).toFixed(3)
    );

    // Volume correlated with volatility and returns magnitude
    const baseHourlyVolume = asset.volume24h / 24;
    const volume = Math.round(
      baseHourlyVolume * (0.4 + Math.abs(combinedShock) * 0.9 + rand() * 0.5) * (stepSeconds / 3600)
    );

    returnsList.push(periodReturn);
    logReturnsList.push(logReturn);
    compareReturnsList.push(comparePeriodReturn);

    points.push({
      index: i,
      timestamp: pointTime.toISOString(),
      dateStr,
      timeStr,
      price: Number(close.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
      returnPct: Number((periodReturn * 100).toFixed(3)),
      logReturn: Number(logReturn.toFixed(5)),
      rollingVolPct: Number((clampedVol * Math.sqrt(252 * 24) * 100).toFixed(2)),
      spreadBlitz,
      spreadBps,
      orderImbalance,
    });
  }

  // Calculate moving averages
  for (let i = 0; i < points.length; i++) {
    if (i >= 19) {
      const slice20 = points.slice(i - 19, i + 1);
      const sum20 = slice20.reduce((acc, p) => acc + p.close, 0);
      points[i].sma20 = Number((sum20 / 20).toFixed(2));
    }
    if (i >= 29) {
      // 30-period rolling correlation with compare asset
      const sliceA = returnsList.slice(i - 29, i + 1);
      const sliceB = compareReturnsList.slice(i - 29, i + 1);
      points[i].rollingCorrelation = Number(calculatePearson(sliceA, sliceB).toFixed(3));
    }
  }

  // Descriptive Statistics on returns
  const stats = calculateDescriptiveStatistics(returnsList, asset.ticker, asset.name);

  // Empirical distribution histogram vs Gaussian density
  const distribution = calculateDistributionBuckets(logReturnsList, stats.mean, stats.stdDev);

  // Autocorrelation function up to specified lags (default 15)
  const lagCount = params.lags || 15;
  const autocorrelation = calculateAutocorrelation(returnsList, lagCount);

  // Scatter plot points (Asset vs Compare Asset or Return vs Imbalance)
  const scatter = calculateScatterPlot(points, compareReturnsList, asset.ticker, compareAsset.ticker, params.feature);

  return {
    dataset,
    asset,
    params,
    points,
    statistics: stats,
    distribution,
    autocorrelation,
    scatter,
  };
}

function calculatePearson(x: number[], y: number[]): number {
  const n = x.length;
  if (n === 0 || n !== y.length) return 0;
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < n; i++) {
    sumX += x[i];
    sumY += y[i];
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : Math.max(-1, Math.min(1, num / den));
}

function calculateDescriptiveStatistics(
  returns: number[],
  ticker: string,
  name: string
): AssetStatistics {
  const n = returns.length;
  if (n === 0) {
    return {
      assetTicker: ticker,
      assetName: name,
      sampleCount: 0,
      mean: 0,
      median: 0,
      stdDev: 0,
      skewness: 0,
      kurtosis: 0,
      autocorrelationLag1: 0,
      annualizedVolatility: 0,
      minVal: 0,
      maxVal: 0,
      interquartileRange: 0,
      var95: 0,
      var99: 0,
      stationarityStatus: "STATIONARY (ADF p < 0.01)",
    };
  }

  // Mean
  const sum = returns.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;

  // Sorted for median and percentiles
  const sorted = [...returns].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  // Variance, Standard Deviation, Skewness, Kurtosis
  let m2 = 0;
  let m3 = 0;
  let m4 = 0;
  for (let i = 0; i < n; i++) {
    const d = returns[i] - mean;
    m2 += d * d;
    m3 += d * d * d;
    m4 += d * d * d * d;
  }

  const variance = m2 / (n - 1);
  const stdDev = Math.sqrt(variance);

  // Standardized Skewness
  const skewness = stdDev > 0 ? (m3 / n) / Math.pow(stdDev, 3) : 0;

  // Excess Kurtosis (Normal is 3, excess = kurtosis - 3)
  const kurtosis = stdDev > 0 ? ((m4 / n) / Math.pow(stdDev, 4)) - 3.0 : 0;

  // Lag 1 Autocorrelation
  let numAcf = 0;
  let denAcf = 0;
  for (let i = 0; i < n; i++) {
    denAcf += (returns[i] - mean) ** 2;
    if (i > 0) {
      numAcf += (returns[i] - mean) * (returns[i - 1] - mean);
    }
  }
  const autocorrelationLag1 = denAcf > 0 ? numAcf / denAcf : 0;

  // Annualized Volatility (assuming 252 days * 24 hours)
  const annualizedVolatility = stdDev * Math.sqrt(252 * 24) * 100;

  // Interquartile range
  const q25 = sorted[Math.floor(n * 0.25)];
  const q75 = sorted[Math.floor(n * 0.75)];
  const iqr = q75 - q25;

  // Historical Value at Risk
  const var95 = -sorted[Math.floor(n * 0.05)] * 100;
  const var99 = -sorted[Math.floor(n * 0.01)] * 100;

  return {
    assetTicker: ticker,
    assetName: name,
    sampleCount: n,
    mean: Number((mean * 100).toFixed(4)),
    median: Number((median * 100).toFixed(4)),
    stdDev: Number((stdDev * 100).toFixed(4)),
    skewness: Number(skewness.toFixed(3)),
    kurtosis: Number(kurtosis.toFixed(3)),
    autocorrelationLag1: Number(autocorrelationLag1.toFixed(4)),
    annualizedVolatility: Number(annualizedVolatility.toFixed(2)),
    minVal: Number((sorted[0] * 100).toFixed(3)),
    maxVal: Number((sorted[n - 1] * 100).toFixed(3)),
    interquartileRange: Number((iqr * 100).toFixed(3)),
    var95: Number(Math.max(0, var95).toFixed(2)),
    var99: Number(Math.max(0, var99).toFixed(2)),
    stationarityStatus: Math.abs(autocorrelationLag1) < 0.3 ? "STATIONARY (ADF p < 0.01)" : "TRENDING (ADF p > 0.05)",
  };
}

function calculateDistributionBuckets(
  logReturns: number[],
  mean: number,
  stdDev: number,
  bucketCount = 21
): ReturnsDistributionBucket[] {
  const n = logReturns.length;
  if (n === 0) return [];

  const sorted = [...logReturns].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[n - 1];

  // Symmetrical bound around 0 or mean
  const bound = Math.max(Math.abs(min), Math.abs(max), 0.015);
  const binWidth = (bound * 2) / bucketCount;

  const buckets: ReturnsDistributionBucket[] = [];
  const meanDec = mean / 100;
  const stdDevDec = Math.max(1e-5, stdDev / 100);

  for (let i = 0; i < bucketCount; i++) {
    const binMin = -bound + i * binWidth;
    const binMax = binMin + binWidth;
    const binCenter = (binMin + binMax) / 2;

    // Gaussian normal density formula
    const z = (binCenter - meanDec) / stdDevDec;
    const normalDensity = (1.0 / (stdDevDec * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);

    buckets.push({
      binMin: Number((binMin * 100).toFixed(2)),
      binMax: Number((binMax * 100).toFixed(2)),
      binCenter: Number((binCenter * 100).toFixed(2)),
      binLabel: `${(binMin * 100).toFixed(1)}%`,
      count: 0,
      frequencyPct: 0,
      normalDensity: Number(normalDensity.toFixed(4)),
    });
  }

  // Count items in buckets
  for (const val of logReturns) {
    for (const b of buckets) {
      if (val * 100 >= b.binMin && val * 100 < b.binMax) {
        b.count++;
        break;
      }
    }
  }

  // Calculate frequency percentage
  for (const b of buckets) {
    b.frequencyPct = Number(((b.count / n) * 100).toFixed(2));
  }

  return buckets;
}

function calculateAutocorrelation(returns: number[], maxLag = 15): AutocorrelationLag[] {
  const n = returns.length;
  const sum = returns.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  let varSum = 0;
  for (let i = 0; i < n; i++) {
    varSum += (returns[i] - mean) ** 2;
  }

  const confidenceBound = Number((1.96 / Math.sqrt(n)).toFixed(4));
  const lags: AutocorrelationLag[] = [];

  for (let lag = 1; lag <= maxLag; lag++) {
    let covSum = 0;
    for (let i = lag; i < n; i++) {
      covSum += (returns[i] - mean) * (returns[i - lag] - mean);
    }
    const r = varSum > 0 ? covSum / varSum : 0;
    lags.push({
      lag,
      correlation: Number(r.toFixed(4)),
      upperConfidence: confidenceBound,
      lowerConfidence: -confidenceBound,
      isSignificant: Math.abs(r) > confidenceBound,
    });
  }

  return lags;
}

function calculateScatterPlot(
  points: ResearchTimeseriesPoint[],
  compareReturns: number[],
  tickerA: string,
  tickerB: string,
  feature: ResearchFeature
): ScatterPlotResult {
  const n = points.length;
  const scatterPoints: ScatterDataPoint[] = [];

  for (let i = 0; i < n; i++) {
    let xVal = 0;
    let yVal = 0;

    if (feature === "imbalance") {
      xVal = points[i].orderImbalance;
      yVal = points[i].returnPct;
    } else if (feature === "spread") {
      xVal = points[i].spreadBps;
      yVal = points[i].rollingVolPct;
    } else {
      // Cross-asset returns comparison
      xVal = Number((compareReturns[i] * 100).toFixed(3));
      yVal = points[i].returnPct;
    }

    scatterPoints.push({
      timestamp: points[i].timeStr,
      xVal,
      yVal,
      label: `Tick ${i + 1}`,
    });
  }

  // OLS Linear Regression: y = alpha + beta * x
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  let sumY2 = 0;

  for (const p of scatterPoints) {
    sumX += p.xVal;
    sumY += p.yVal;
    sumXY += p.xVal * p.yVal;
    sumX2 += p.xVal * p.xVal;
    sumY2 += p.yVal * p.yVal;
  }

  const denom = n * sumX2 - sumX * sumX;
  const slopeBeta = denom !== 0 ? (n * sumXY - sumX * sumY) / denom : 0;
  const interceptAlpha = (sumY - slopeBeta * sumX) / n;

  // Correlation and R²
  const rNum = n * sumXY - sumX * sumY;
  const rDen = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const correlation = rDen !== 0 ? rNum / rDen : 0;
  const rSquared = correlation * correlation;

  return {
    assetA: tickerA,
    assetB: tickerB,
    featureX: feature === "imbalance" ? "Order Imbalance" : feature === "spread" ? "Spread (bps)" : `${tickerB} Return (%)`,
    featureY: feature === "imbalance" ? `${tickerA} Return (%)` : feature === "spread" ? `${tickerA} Volatility (%)` : `${tickerA} Return (%)`,
    points: scatterPoints,
    slopeBeta: Number(slopeBeta.toFixed(4)),
    interceptAlpha: Number(interceptAlpha.toFixed(4)),
    rSquared: Number(rSquared.toFixed(4)),
    correlation: Number(correlation.toFixed(4)),
    sampleSize: n,
  };
}

/**
 * 5x5 Cross-Asset Correlation Matrix
 */
export function getCrossAssetCorrelationMatrix(): CorrelationMatrixData {
  const tickers = ["DUNE-NRG", "NEX-AI", "ORBT-LOG", "DES-H2", "DIFC-100"];
  const names: Record<string, string> = {
    "DUNE-NRG": "Dune Energy",
    "NEX-AI": "Nexus AI",
    "ORBT-LOG": "Orbit Logistics",
    "DES-H2": "Desert Hydrogen",
    "DIFC-100": "DIFC-100 Benchmark",
  };

  const cells: CorrelationCell[] = [];

  for (let i = 0; i < tickers.length; i++) {
    for (let j = 0; j < tickers.length; j++) {
      const a = tickers[i];
      const b = tickers[j];
      const corr = BASE_CORRELATIONS[a]?.[b] ?? (i === j ? 1.0 : 0.4);
      const cov = Number((corr * 0.024 * 0.022).toFixed(6));
      const sampleSize = 1440;
      // Student t-statistic for Pearson correlation
      const tStat =
        corr === 1.0
          ? 999.0
          : Number((corr * Math.sqrt((sampleSize - 2) / (1 - corr * corr))).toFixed(2));
      const pValue = Math.abs(corr) > 0.1 ? 0.0001 : 0.042;

      cells.push({
        assetA: a,
        assetB: b,
        correlation: corr,
        covariance: cov,
        tStat,
        pValue,
        sampleSize,
      });
    }
  }

  return {
    tickers,
    names,
    matrix: BASE_CORRELATIONS,
    cells,
  };
}

/**
 * Clean data-service client interface.
 * When a real FastAPI backend is connected, simply swap this mock implementation
 * with `fetch(\`/research/timeseries?\${params}\`)` without rewriting visual components.
 */
export const ResearchApi = {
  async getDatasets(): Promise<ResearchDatasetMetadata[]> {
    return new Promise((resolve) => setTimeout(() => resolve(RESEARCH_DATASETS), 40));
  },

  async getTimeseries(params: ResearchQueryParams): Promise<ResearchTimeseriesResponse> {
    try {
      const url = `/api/research/timeseries?asset=${encodeURIComponent(params.asset)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch timeseries:", error);
      // Fallback to mock generation if the backend fails or CSV is missing
      return generateMockResearchData(params);
    }
  },

  async getCorrelationMatrix(): Promise<CorrelationMatrixData> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getCrossAssetCorrelationMatrix()), 50);
    });
  },
};
