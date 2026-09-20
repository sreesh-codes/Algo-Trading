"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown } from "lucide-react";

const TOTAL_FRAMES = 300;

// Helper to format frame path
const getFrameSrc = (frameNumber: number) => {
  const padded = String(Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameNumber)))).padStart(3, "0");
  return `/sequence/ezgif-frame-${padded}.jpg`;
};

interface ParallaxOffset {
  x: number;
  y: number;
}

export const CinematicSequenceHero: React.FC = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Preloaded image elements cache (index 1 to 300)
  const framesCache = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));

  // Physics & Animation tracking
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const isAutoFlyingRef = useRef<boolean>(false);
  const [isAutoFlying, setIsAutoFlying] = useState<boolean>(false);


  // Mouse Parallax tracking
  const mousePosRef = useRef<ParallaxOffset>({ x: 0, y: 0 });
  const currentParallaxRef = useRef<ParallaxOffset>({ x: 0, y: 0 });

  // Scroll State
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [timeGst, setTimeGst] = useState<string>("23:45:00 GST");
  const [activeFrameNum, setActiveFrameNum] = useState<number>(1);

  // Format live Dubai clock (UTC+4)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const dxb = new Date(utc + 4 * 3600000);
      const h = String(dxb.getHours()).padStart(2, "0");
      const m = String(dxb.getMinutes()).padStart(2, "0");
      const s = String(dxb.getSeconds()).padStart(2, "0");
      setTimeGst(`${h}:${m}:${s} GST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Safe getter for cached images with wide search so canvas NEVER drops to black
  const getCachedImage = useCallback((index: number): HTMLImageElement | null => {
    const cache = framesCache.current;
    if (cache[index]?.complete && cache[index]?.naturalWidth) {
      return cache[index];
    }
    // Search outward for nearest loaded frame
    for (let offset = 1; offset < 60; offset++) {
      const prev = index - offset;
      if (prev >= 1 && cache[prev]?.complete && cache[prev]?.naturalWidth) {
        return cache[prev];
      }
      const next = index + offset;
      if (next <= TOTAL_FRAMES && cache[next]?.complete && cache[next]?.naturalWidth) {
        return cache[next];
      }
    }
    return cache[1] || null;
  }, []);

  // Draw frame to canvas with aspect-ratio cover and mouse parallax
  const drawFrameToCanvas = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = getCachedImage(frameIndex);
    if (!img || !img.complete || !img.naturalWidth) {
      return;
    }

    // Explicit high-quality interpolation to avoid blur on high-DPI screens
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = Math.round(iw * scale);
    const nh = Math.round(ih * scale);

    const px = Math.round(currentParallaxRef.current.x * 10);
    const py = Math.round(currentParallaxRef.current.y * 6);

    const x = Math.round((cw - nw) / 2 + px);
    const y = Math.round((ch - nh) / 2 + py);

    // Draw directly - do NOT clearRect to prevent any blank white/black flashes
    ctx.drawImage(img, x, y, nw, nh);
  }, [getCachedImage]);

  // High-performance 2-tier progressive frame preloader
  useEffect(() => {
    let isCancelled = false;

    // 1. Immediately preload Frame 1
    const f1 = new Image();
    f1.src = getFrameSrc(1);
    f1.onload = () => {
      if (isCancelled) return;
      framesCache.current[1] = f1;
      drawFrameToCanvas(1);
    };
    if (typeof f1.decode === "function") {
      f1.decode().then(() => {
        if (isCancelled) return;
        framesCache.current[1] = f1;
        drawFrameToCanvas(1);
      }).catch(() => {});
    }
    framesCache.current[1] = f1;

    // 2. Tier 1: Keyframe backbone (every 2nd frame) for instant responsive scrubbing
    const keyframes: number[] = [];
    for (let i = 3; i <= TOTAL_FRAMES; i += 2) {
      keyframes.push(i);
    }

    // 3. Tier 2: Intermediate even frames (filling 30fps smoothness)
    const remaining: number[] = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += 2) {
      remaining.push(i);
    }

    // Throttled batch loader to prevent freezing the browser
    const loadBatch = (list: number[], batchSize = 2, done?: () => void) => {
      let idx = 0;
      const next = () => {
        if (isCancelled || idx >= list.length) {
          if (done) done();
          return;
        }
        const end = Math.min(idx + batchSize, list.length);
        for (let j = idx; j < end; j++) {
          const frameNum = list[j];
          if (!framesCache.current[frameNum]) {
            const im = new Image();
            im.src = getFrameSrc(frameNum);
            im.onload = () => {
              framesCache.current[frameNum] = im;
            };
            if (typeof im.decode === "function") {
              im.decode().then(() => {
                framesCache.current[frameNum] = im;
              }).catch(() => {});
            }
            framesCache.current[frameNum] = im;
          }
        }
        idx = end;
        // Wait 150ms between batches so we don't choke Next.js hot-reloading
        setTimeout(next, 150);
      };
      next();
    };

    // Load keyframes first (batch of 3 every 150ms)
    loadBatch(keyframes, 3, () => {
      // Then load the rest
      loadBatch(remaining, 3);
    });

    return () => {
      isCancelled = true;
    };
  }, [drawFrameToCanvas]);

  // Handle Resize and initial canvas dimensions
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      drawFrameToCanvas(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrameToCanvas]);

  // Global Page Scroll Listener: Scrubs from Frame 1 (top) to Frame 300 (footer)
  useEffect(() => {
    const handleScroll = () => {
      if (isAutoFlyingRef.current) return;


      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = Math.max(0, Math.min(1, window.scrollY / (totalScroll || 1)));
      setScrollProgress(rawProgress);

      const target = 1 + rawProgress * (TOTAL_FRAMES - 1);
      targetFrameRef.current = Math.max(1, Math.min(TOTAL_FRAMES, target));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const heroContainerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax listener with Cursor Spotlight CSS variables
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth) * 2 - 1;
    const y = (e.clientY / innerHeight) * 2 - 1;
    mousePosRef.current = { x, y };

    if (heroContainerRef.current) {
      const rect = heroContainerRef.current.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      heroContainerRef.current.style.setProperty("--cursor-x", `${px}px`);
      heroContainerRef.current.style.setProperty("--cursor-y", `${py}px`);
    }
  }, []);


  // 60FPS Render & Physics Loop
  useEffect(() => {
    let animId: number;
    let lastRenderedFrame = -1;

    const tick = () => {

      // Smooth frame interpolation (spring damping)
      const frameDelta = targetFrameRef.current - currentFrameRef.current;
      const speed = isAutoFlyingRef.current ? 0.15 : 0.18;
      currentFrameRef.current += frameDelta * speed;

      // Mouse parallax smoothing
      const pxDelta = mousePosRef.current.x - currentParallaxRef.current.x;
      const pyDelta = mousePosRef.current.y - currentParallaxRef.current.y;
      currentParallaxRef.current.x += pxDelta * 0.08;
      currentParallaxRef.current.y += pyDelta * 0.08;

      const frameToDraw = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(currentFrameRef.current)));

      if (frameToDraw !== lastRenderedFrame) {
        drawFrameToCanvas(frameToDraw);
        lastRenderedFrame = frameToDraw;
        setActiveFrameNum(frameToDraw);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [drawFrameToCanvas]);

  // CTA Click: Forward flight animation into competition dashboard
  const handleEnterMercantile = useCallback(() => {
    if (isAutoFlyingRef.current) return;
    isAutoFlyingRef.current = true;
    setIsAutoFlying(true);

    targetFrameRef.current = TOTAL_FRAMES;
    const startTime = performance.now();
    const duration = 1200;
    const startFrame = currentFrameRef.current;

    const rush = (time: number) => {
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const easeT = t * t * (3 - 2 * t);
      currentFrameRef.current = startFrame + (TOTAL_FRAMES - startFrame) * easeT;
      const frame = Math.round(currentFrameRef.current);
      drawFrameToCanvas(frame);
      setActiveFrameNum(frame);

      if (t < 1) {
        requestAnimationFrame(rush);
      } else {
        router.push("/markets");
      }
    };

    requestAnimationFrame(rush);
  }, [drawFrameToCanvas, router]);

  const scrollToMarkets = () => {
    window.scrollTo({
      top: window.innerHeight * 0.95,
      behavior: "smooth",
    });
  };

  return (
    <div ref={heroContainerRef} onMouseMove={handleMouseMove} className="relative w-full">
      {/* ========================================================================= */}
      {/* 1. FIXED FULL-SCREEN 30-FPS CINEMATIC BACKGROUND (EXTENDS ENTIRE PAGE)    */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none bg-[#05070B]">
        {/* Permanent Base Image Tag: Always renders Frame 1 immediately (never black) */}
        <img
          src="/sequence/ezgif-frame-001.jpg"
          alt="Dubai 2035 The Mercantile"
          className="absolute inset-0 w-full h-full object-cover [image-rendering:-webkit-optimize-contrast] contrast-[1.04] saturate-[1.06]"
        />

        {/* 60FPS Canvas Layer for Smooth Sub-pixel Interpolation */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover [image-rendering:-webkit-optimize-contrast] contrast-[1.04] saturate-[1.06]"
        />

        {/* Subtle Ambient Vignette: Keeps center vibrant, gentle fade towards edges */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070B]/20 via-transparent to-[#05070B]/40 pointer-events-none" />

        {/* Flash/Fade Overlay when CTA trigger active */}
        {isAutoFlying && (
          <div className="absolute inset-0 z-50 bg-[#05070B] pointer-events-none animate-in fade-in duration-1000" />
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. MINIMAL PREMIUM TOP NAVIGATION                                         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full px-6 sm:px-10 py-5 flex items-center justify-between border-b border-white/[0.08] backdrop-blur-md bg-[#05070B]/60 select-none">
        {/* Brand Mark */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.8)] group-hover:scale-125 transition-transform" />
          <div className="flex flex-col">
            <span className="font-sans text-sm font-semibold tracking-wider text-white group-hover:text-[#D4AF37] transition-colors uppercase">
              THE MERCANTILE
            </span>
            <span className="font-mono text-[10px] tracking-widest text-slate-400">
              DUBAI 2035
            </span>
          </div>
        </Link>

        {/* Minimal Nav Links: Markets / Intelligence / Research / Competition / Leaderboard */}
        <nav className="hidden md:flex items-center gap-8 text-base font-sans font-bold tracking-wide absolute left-1/2 -translate-x-1/2">
          <Link
            href="/markets"
            className="text-slate-200 hover:text-[#D4AF37] transition-colors relative py-1 group"
          >
            <span>Markets</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-200" />
          </Link>

          <Link
            href="/research"
            className="text-slate-200 hover:text-[#D4AF37] transition-colors relative py-1 group"
          >
            <span>Research</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-200" />
          </Link>

          <Link
            href="/leaderboard"
            className="text-slate-200 hover:text-[#D4AF37] transition-colors relative py-1 group"
          >
            <span>Leaderboard</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] group-hover:w-full transition-all duration-200" />
          </Link>
        </nav>

        {/* Right Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
            <span>{timeGst}</span>
          </div>
          <Link
            href="/markets"
            className="px-3.5 py-1.5 rounded border border-[#D4AF37]/50 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] font-semibold text-xs transition-all duration-200 shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          >
            ARENA
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO VIEWPORT (INITIAL FULL-SCREEN SCREEN WITH READABLE TEXT & CTA)     */}
      {/* ========================================================================= */}
      <section className="relative z-20 min-h-[calc(100vh-5.5rem)] flex flex-col justify-between max-w-7xl mx-auto px-6 sm:px-12 py-10 select-none">
        {/* Main Content Block */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl space-y-7 pt-10 sm:pt-16">
          {/* Monumental Hero Title with Radiant Glow */}
          <div className="font-sans space-y-3">
            <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tight text-white leading-[0.9] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_60px_rgba(255,255,255,0.12)]">
              DUBAI 2035
            </h1>
            <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#D4AF37] via-[#FFF5C0] to-[#E5C158] bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(212,175,55,0.45)] animate-gold-shimmer">
              THE MERCANTILE
            </div>
          </div>

          {/* Subtitle Card with Balanced Refined Font Size and Glowing Effects */}
          <div className="relative max-w-2xl sm:max-w-3xl p-5 sm:p-6 rounded-xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_35px_rgba(212,175,55,0.12)] overflow-hidden group hover:border-[#D4AF37]/50 transition-all duration-500">
            {/* Top scanning laser beam */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />
            <div className="absolute top-0 left-0 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent animate-beam-scan pointer-events-none" />

            {/* Ambient gold corner bloom */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/25 transition-colors duration-500" />

            {/* Balanced refined subtext size */}
            <p className="text-base sm:text-lg md:text-xl text-slate-200 font-normal leading-relaxed tracking-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              An institutional quantitative trading league set in the financial architecture of 2035.
              Master high-frequency commodities, cryogenic compute swaps, and autonomous market mechanics.
            </p>
          </div>


          {/* Primary CTA & Secondary Action Buttons with Premium Effects */}
          <div className="pt-3 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={handleEnterMercantile}
              disabled={isAutoFlying}
              className="group/cta relative overflow-hidden inline-flex items-center gap-3.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FDE68A] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right font-sans font-bold text-base text-[#05070B] tracking-wide transition-all duration-300 shadow-[0_0_35px_rgba(212,175,55,0.5),0_0_70px_rgba(212,175,55,0.25)] hover:shadow-[0_0_50px_rgba(212,175,55,0.85),0_0_90px_rgba(212,175,55,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              {/* Sheen sweep animation on hover */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/30 transform -skew-x-12 -translate-x-full group-hover/cta:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

              <span>ENTER THE MERCANTILE</span>
              <ArrowRight
                size={18}
                className="group-hover/cta:translate-x-1.5 transition-transform"
              />
            </button>

            <button
              type="button"
              onClick={scrollToMarkets}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl border border-white/20 bg-black/60 hover:bg-black/90 hover:border-[#D4AF37]/60 hover:text-[#D4AF37] text-white font-sans text-base font-semibold transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:scale-105 cursor-pointer group/sec"
            >
              <span>Explore Markets</span>
              <ChevronDown size={16} className="text-[#D4AF37] group-hover/sec:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Hero Section Bottom Bar with Glowing Status */}
        <div className="pt-12 pb-4 w-full flex items-center justify-end border-t border-white/10 text-xs font-sans text-slate-300">
          <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
            <Link href="/markets" className="hover:text-[#D4AF37] transition-colors hidden sm:inline">
              Markets
            </Link>
            <Link href="/competition" className="hover:text-[#D4AF37] transition-colors hidden sm:inline">
              Competition
            </Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-slate-300 font-mono text-[11px] backdrop-blur-md shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#05CD99] animate-pulse" />
              <span>{timeGst}</span>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. FIXED RIGHT-EDGE SCROLL TRACK INDICATOR                                */}
      {/* ========================================================================= */}
      <div className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col items-end gap-3 pointer-events-none select-none">
        <div className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
          FRAME {String(activeFrameNum).padStart(3, "0")} / 300
        </div>

        <div className="w-[2px] h-36 bg-white/15 rounded-full overflow-hidden relative">
          <div
            className="w-full bg-[#D4AF37] transition-all duration-75 rounded-full shadow-[0_0_8px_#D4AF37]"
            style={{ height: `${Math.round(scrollProgress * 100)}%` }}
          />
        </div>

        <div className="font-mono text-[10px] text-[#D4AF37]">
          {Math.round(scrollProgress * 100)}%
        </div>
      </div>
    </div>
  );
};
