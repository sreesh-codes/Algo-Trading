"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";

interface SkylineCanvasProps {
  className?: string;
  mousePos?: { x: number; y: number }; // normalized -1 to 1
  interactive?: boolean;
}

interface BezierCoord {
  x: number;
  y: number;
}

const emptySubscribe = () => () => {};

export const FuturisticSkylineCanvas: React.FC<SkylineCanvasProps> = ({
  className = "",
  mousePos = { x: 0, y: 0 },
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalMouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    if (!interactive) return;
    internalMouse.current.targetX = mousePos.x;
    internalMouse.current.targetY = mousePos.y;
  }, [mousePos, interactive]);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Window resize handler
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Generate static building layouts once per resize
    interface WindowGrid {
      cols: number;
      rows: number;
      startX: number;
      startY: number;
      w: number;
      h: number;
      states: number[]; // brightness 0 to 1
    }

    interface Building {
      x: number;
      w: number;
      h: number;
      layer: 1 | 2 | 3;
      spire?: boolean;
      burj?: boolean;
      color: string;
      windowGrid?: WindowGrid;
      roofLight?: { color: string; blinkRate: number };
    }

    // Procedural Stars & Cyber Dust Particles
    const dustParticles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      alpha: number;
      layer: number;
      pulse: number;
    }> = [];

    const numParticles = 140;
    for (let i = 0; i < numParticles; i++) {
      dustParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.6,
        speedY: -(Math.random() * 0.3 + 0.08),
        speedX: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.7 + 0.2,
        layer: Math.random() > 0.6 ? 2 : 1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Autonomous Transit Traffic / Flying Pods along skyways
    interface TransitPod {
      pathIndex: number;
      t: number; // 0 to 1 along curve
      speed: number;
      length: number;
      color: string;
    }

    const transitPods: TransitPod[] = [
      { pathIndex: 0, t: 0.1, speed: 0.0018, length: 38, color: "#00F0FF" },
      { pathIndex: 0, t: 0.55, speed: 0.0022, length: 28, color: "#D4AF37" },
      { pathIndex: 1, t: 0.3, speed: -0.0015, length: 32, color: "#05CD99" },
      { pathIndex: 1, t: 0.8, speed: -0.002, length: 42, color: "#00F0FF" },
      { pathIndex: 2, t: 0.2, speed: 0.0025, length: 24, color: "#D4AF37" },
      { pathIndex: 2, t: 0.65, speed: 0.0019, length: 36, color: "#00F0FF" },
      { pathIndex: 3, t: 0.4, speed: -0.0024, length: 30, color: "#D4AF37" },
    ];

    // Buildings generator
    const generateBuildings = (w: number, h: number): Building[] => {
      const bList: Building[] = [];
      const groundY = h * 0.98;

      // Layer 1: Distant skyline silhouette (dark navy/charcoal)
      const distantStep = 42;
      for (let x = -80; x < w + 80; x += distantStep) {
        const bh = Math.random() * (h * 0.45) + h * 0.18;
        const bw = distantStep * 1.4;
        bList.push({
          x,
          w: bw,
          h: bh,
          layer: 1,
          color: "#080D1A",
          roofLight: Math.random() > 0.4 ? { color: "#EF4444", blinkRate: Math.random() * 2 + 1 } : undefined,
        });
      }

      // Layer 2: Midground towers (DIFC, Emirates towers, Financial hubs)
      const numMid = Math.floor(w / 75);
      for (let i = 0; i < numMid; i++) {
        const x = (i / numMid) * w + (Math.random() - 0.5) * 35;
        const bw = Math.random() * 45 + 38;
        const bh = Math.random() * (h * 0.58) + h * 0.28;
        
        // Window grid
        const cols = Math.floor(bw / 6);
        const rows = Math.floor(bh / 8);
        const states: number[] = [];
        for (let r = 0; r < rows * cols; r++) {
          // 25% lit windows
          states.push(Math.random() > 0.72 ? Math.random() * 0.8 + 0.2 : 0);
        }

        bList.push({
          x,
          w: bw,
          h: bh,
          layer: 2,
          color: "#0C1324",
          windowGrid: {
            cols,
            rows,
            startX: x + 4,
            startY: groundY - bh + 14,
            w: bw - 8,
            h: bh - 24,
            states,
          },
          spire: Math.random() > 0.4,
          roofLight: { color: Math.random() > 0.5 ? "#00F0FF" : "#EF4444", blinkRate: 1.5 },
        });
      }

      // Central Burj Quantum Spire (The Hero landmark at ~48% - 52% of canvas width)
      const burjX = w * 0.50;
      const burjH = h * 0.82; // Tallest monument
      bList.push({
        x: burjX,
        w: 52,
        h: burjH,
        layer: 3,
        burj: true,
        color: "#0E182F",
        roofLight: { color: "#FFFFFF", blinkRate: 1.0 },
      });

      return bList;
    };

    let buildings = generateBuildings(width, height);

    // Re-generate buildings on dimension changes
    const checkResize = () => {
      if (width !== canvas.parentElement?.clientWidth || height !== canvas.parentElement?.clientHeight) {
        resize();
        buildings = generateBuildings(width, height);
      }
    };

    // Holographic data points / district markers floating in air
    const holoLabels = [
      { name: "BURJ QUANTUM SPIRE", sub: "DMX-CORE • 4.8 THz", nx: 0.50, ny: 0.18, color: "#D4AF37" },
      { name: "DIFC CRYOGENIC GATE", sub: "ORDER BOOK • 0.84ms", nx: 0.15, ny: 0.36, color: "#00F0FF" },
      { name: "MBR SOLAR BASIN", sub: "GRID DISPATCH • 5.1 GW", nx: 0.82, ny: 0.40, color: "#05CD99" },
      { name: "JEBEL ALI FREEPORT", sub: "HYPERLOOP CORRIDOR 01", nx: 0.12, ny: 0.68, color: "#00F0FF" },
    ];

    let time = 0;

    const render = () => {
      checkResize();
      time += 0.016;

      // Smooth mouse interpolation (lerp)
      internalMouse.current.x += (internalMouse.current.targetX - internalMouse.current.x) * 0.05;
      internalMouse.current.y += (internalMouse.current.targetY - internalMouse.current.y) * 0.05;

      const mx = internalMouse.current.x; // -1 to 1
      const my = internalMouse.current.y; // -1 to 1

      ctx.clearRect(0, 0, width, height);

      // 1. NIGHT SKY GRADIENT (Deep Dubai nocturnal atmosphere)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, "#030509");
      skyGrad.addColorStop(0.35, "#070C18");
      skyGrad.addColorStop(0.7, "#0B152B");
      skyGrad.addColorStop(0.92, "#1A1724"); // Subtle warm desert horizon glow
      skyGrad.addColorStop(1, "#090D18");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant desert amber light dome (warm ambient light behind city)
      const domeGrad = ctx.createRadialGradient(
        width * 0.5 + mx * 20,
        height * 0.85,
        10,
        width * 0.5 + mx * 20,
        height * 0.85,
        width * 0.65
      );
      domeGrad.addColorStop(0, "rgba(212, 175, 55, 0.14)");
      domeGrad.addColorStop(0.4, "rgba(245, 158, 11, 0.06)");
      domeGrad.addColorStop(0.7, "rgba(0, 240, 255, 0.03)");
      domeGrad.addColorStop(1, "transparent");
      ctx.fillStyle = domeGrad;
      ctx.fillRect(0, 0, width, height);

      // Cyan upper atmospheric halo
      const cyanGlow = ctx.createRadialGradient(
        width * 0.5 + mx * 35,
        height * 0.25 + my * 20,
        10,
        width * 0.5 + mx * 35,
        height * 0.25 + my * 20,
        width * 0.45
      );
      cyanGlow.addColorStop(0, "rgba(0, 240, 255, 0.07)");
      cyanGlow.addColorStop(0.5, "rgba(0, 240, 255, 0.02)");
      cyanGlow.addColorStop(1, "transparent");
      ctx.fillStyle = cyanGlow;
      ctx.fillRect(0, 0, width, height);

      // 2. CELESTIAL STARS & FLOATING CYBER-DUST
      dustParticles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const pParallaxX = mx * (p.layer === 2 ? 18 : 8);
        const pParallaxY = my * (p.layer === 2 ? 12 : 5);
        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(time * 2 + p.pulse));

        ctx.fillStyle = p.layer === 2 ? `rgba(212, 175, 55, ${pulseAlpha})` : `rgba(200, 230, 255, ${pulseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x + pParallaxX, p.y + pParallaxY, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. LAYER 1: DISTANT SKYLINE (Parallax Factor: 0.015)
      const p1X = mx * 12;
      const p1Y = my * 6;
      ctx.save();
      ctx.translate(p1X, p1Y);
      buildings
        .filter((b) => b.layer === 1)
        .forEach((b) => {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, height - b.h, b.w, b.h);

          // Subtle pinnacle beacon
          if (b.roofLight) {
            const blink = Math.sin(time * b.roofLight.blinkRate * 3) > 0 ? 0.8 : 0.15;
            ctx.fillStyle = `rgba(239, 68, 68, ${blink})`;
            ctx.fillRect(b.x + b.w / 2 - 1, height - b.h - 2, 2, 2);
          }
        });
      ctx.restore();

      // Atmospheric haze between Layer 1 and Layer 2
      const midHaze = ctx.createLinearGradient(0, height * 0.6, 0, height);
      midHaze.addColorStop(0, "rgba(9, 14, 26, 0)");
      midHaze.addColorStop(0.7, "rgba(12, 19, 36, 0.45)");
      midHaze.addColorStop(1, "rgba(5, 7, 11, 0.85)");
      ctx.fillStyle = midHaze;
      ctx.fillRect(0, height * 0.6, width, height * 0.4);

      // 4. LAYER 2: MIDGROUND TOWERS & ILLUMINATED WINDOW MATRICES (Parallax: 0.035)
      const p2X = mx * 28;
      const p2Y = my * 14;
      ctx.save();
      ctx.translate(p2X, p2Y);

      buildings
        .filter((b) => b.layer === 2)
        .forEach((b) => {
          // Building silhouette body
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, height - b.h, b.w, b.h);

          // Building architectural edge highlight (cyan or gold rim light)
          ctx.strokeStyle = "rgba(0, 240, 255, 0.16)";
          ctx.lineWidth = 1;
          ctx.strokeRect(b.x, height - b.h, b.w, b.h);

          // Roof spire
          if (b.spire) {
            ctx.beginPath();
            ctx.moveTo(b.x + b.w / 2, height - b.h);
            ctx.lineTo(b.x + b.w / 2, height - b.h - 32);
            ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Spire top light
            if (b.roofLight) {
              const blink = Math.sin(time * 3) > 0 ? 0.9 : 0.2;
              ctx.fillStyle = b.roofLight.color === "#00F0FF" ? `rgba(0, 240, 255, ${blink})` : `rgba(239, 68, 68, ${blink})`;
              ctx.beginPath();
              ctx.arc(b.x + b.w / 2, height - b.h - 33, 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Window Matrices (thousands of randomized tiny glowing windows)
          if (b.windowGrid) {
            const { cols, rows, startX, startY, w: gw, h: gh, states } = b.windowGrid;
            const cellW = (gw / cols) * 0.55;
            const cellH = (gh / rows) * 0.45;
            const stepX = gw / cols;
            const stepY = gh / rows;

            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const idx = r * cols + c;
                const state = states[idx];
                if (state > 0) {
                  // Shimmering light
                  const shimmer = 0.8 + 0.2 * Math.sin(time * 1.5 + idx * 0.1);
                  const isGold = (c + r) % 3 === 0;
                  ctx.fillStyle = isGold
                    ? `rgba(212, 175, 55, ${state * shimmer * 0.65})`
                    : `rgba(0, 240, 255, ${state * shimmer * 0.55})`;
                  ctx.fillRect(startX + c * stepX, startY + r * stepY, cellW, cellH);
                }
              }
            }
          }
        });
      ctx.restore();

      // 5. LAYER 3: BURJ QUANTUM SPIRE & ICONIC SILHOUETTES (Parallax: 0.055)
      const p3X = mx * 44;
      const p3Y = my * 20;
      ctx.save();
      ctx.translate(p3X, p3Y);

      // Draw Burj Quantum Spire
      const burj = buildings.find((b) => b.burj);
      if (burj) {
        const bx = burj.x;
        const by = height - burj.h;
        const bw = burj.w;
        const bh = burj.h;

        // Tiered Stepped Setbacks of Burj Khalifa Silhouette
        ctx.fillStyle = "#0A1224";
        ctx.strokeStyle = "rgba(212, 175, 55, 0.45)";
        ctx.lineWidth = 1.2;

        // Base tier
        ctx.fillRect(bx - bw * 0.8, height - bh * 0.28, bw * 1.6, bh * 0.28);
        ctx.strokeRect(bx - bw * 0.8, height - bh * 0.28, bw * 1.6, bh * 0.28);

        // Tier 2
        ctx.fillRect(bx - bw * 0.6, height - bh * 0.52, bw * 1.2, bh * 0.24);
        ctx.strokeRect(bx - bw * 0.6, height - bh * 0.52, bw * 1.2, bh * 0.24);

        // Tier 3
        ctx.fillRect(bx - bw * 0.4, height - bh * 0.74, bw * 0.8, bh * 0.22);
        ctx.strokeRect(bx - bw * 0.4, height - bh * 0.74, bw * 0.8, bh * 0.22);

        // Tier 4 (Upper Spire Column)
        ctx.fillRect(bx - bw * 0.2, height - bh * 0.92, bw * 0.4, bh * 0.18);
        ctx.strokeRect(bx - bw * 0.2, height - bh * 0.92, bw * 0.4, bh * 0.18);

        // Pinnacle Needle
        ctx.beginPath();
        ctx.moveTo(bx, height - bh * 0.92);
        ctx.lineTo(bx, by - 45);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Central Illuminated Spinal Channel (Quantum Core Light Beam running through Burj)
        const spineGrad = ctx.createLinearGradient(0, height, 0, by - 45);
        spineGrad.addColorStop(0, "rgba(212, 175, 55, 0.9)");
        spineGrad.addColorStop(0.5, "rgba(0, 240, 255, 0.85)");
        spineGrad.addColorStop(1, "rgba(255, 255, 255, 1)");

        ctx.strokeStyle = spineGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx, height);
        ctx.lineTo(bx, by - 45);
        ctx.stroke();

        // Quantum pulse traveling up the spine
        const pulseT = (time * 0.6) % 1;
        const pulseY = height - bh * pulseT;
        const pulseGlow = ctx.createRadialGradient(bx, pulseY, 2, bx, pulseY, 22);
        pulseGlow.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        pulseGlow.addColorStop(0.4, "rgba(0, 240, 255, 0.6)");
        pulseGlow.addColorStop(1, "transparent");
        ctx.fillStyle = pulseGlow;
        ctx.beginPath();
        ctx.arc(bx, pulseY, 22, 0, Math.PI * 2);
        ctx.fill();

        // Pinnacle Beacon Light (blinking white / cyan)
        const beaconBlink = (Math.sin(time * 4) + 1) * 0.5;
        const beaconGrad = ctx.createRadialGradient(bx, by - 45, 1, bx, by - 45, 18);
        beaconGrad.addColorStop(0, `rgba(255, 255, 255, ${0.8 + 0.2 * beaconBlink})`);
        beaconGrad.addColorStop(0.3, `rgba(0, 240, 255, ${0.5 * beaconBlink})`);
        beaconGrad.addColorStop(1, "transparent");
        ctx.fillStyle = beaconGrad;
        ctx.beginPath();
        ctx.arc(bx, by - 45, 18, 0, Math.PI * 2);
        ctx.fill();

        // Holographic Observation Rings around Burj
        const ringY1 = height - bh * 0.62;
        const ringY2 = height - bh * 0.38;

        [ringY1, ringY2].forEach((ry, rIdx) => {
          ctx.beginPath();
          ctx.ellipse(bx, ry, bw * (1.2 - rIdx * 0.3), 6, 0, 0, Math.PI * 2);
          ctx.strokeStyle = rIdx === 0 ? "rgba(0, 240, 255, 0.6)" : "rgba(212, 175, 55, 0.5)";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      ctx.restore();

      // 6. LAYER 4: ELEVATED TRANSIT TUBES & AUTONOMOUS LIGHT STREAMS (Parallax: 0.08)
      const p4X = mx * 60;
      const p4Y = my * 26;
      ctx.save();
      ctx.translate(p4X, p4Y);

      // Define 4 sweeping curved transit skyways across the city
      const transitCurves = [
        // Path 0: High sweeping skyway from west to east
        [
          { x: -50, y: height * 0.64 },
          { x: width * 0.35, y: height * 0.58 },
          { x: width * 0.68, y: height * 0.66 },
          { x: width + 60, y: height * 0.62 },
        ],
        // Path 1: Mid altitude hyperloop arterial
        [
          { x: -40, y: height * 0.74 },
          { x: width * 0.42, y: height * 0.70 },
          { x: width * 0.78, y: height * 0.76 },
          { x: width + 50, y: height * 0.72 },
        ],
        // Path 2: Low-altitude orbital transit arc around Burj
        [
          { x: width * 0.2, y: height * 0.82 },
          { x: width * 0.5, y: height * 0.78 },
          { x: width * 0.85, y: height * 0.84 },
        ],
        // Path 3: Jebel Ali cargo link
        [
          { x: 0, y: height * 0.88 },
          { x: width * 0.38, y: height * 0.83 },
          { x: width * 0.75, y: height * 0.89 },
          { x: width, y: height * 0.86 },
        ],
      ];

      // Draw faint translucent tube outlines
      transitCurves.forEach((curve, cIdx) => {
        ctx.beginPath();
        ctx.moveTo(curve[0].x, curve[0].y);
        if (curve.length === 4) {
          ctx.bezierCurveTo(
            curve[1].x,
            curve[1].y,
            curve[2].x,
            curve[2].y,
            curve[3].x,
            curve[3].y
          );
        } else {
          ctx.quadraticCurveTo(curve[1].x, curve[1].y, curve[2].x, curve[2].y);
        }
        ctx.strokeStyle = cIdx % 2 === 0 ? "rgba(0, 240, 255, 0.12)" : "rgba(212, 175, 55, 0.10)";
        ctx.lineWidth = 1.8;
        ctx.stroke();
      });

      // Bezier point calculator helper
      const getCubicBezierPoint = (p0: BezierCoord, p1: BezierCoord, p2: BezierCoord, p3: BezierCoord, t: number) => {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;
        return {
          x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
          y: uuu * p0.y + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
        };
      };

      // Animate and draw autonomous vehicle pods / photon pulses
      transitPods.forEach((pod) => {
        pod.t += pod.speed;
        if (pod.t > 1) pod.t = 0;
        if (pod.t < 0) pod.t = 1;

        const curve = transitCurves[pod.pathIndex];
        if (!curve || curve.length < 3) return;

        let ptNow: { x: number; y: number };
        let ptTail: { x: number; y: number };

        if (curve.length === 4) {
          ptNow = getCubicBezierPoint(curve[0], curve[1], curve[2], curve[3], pod.t);
          const tTail = Math.max(0, Math.min(1, pod.t - Math.sign(pod.speed) * 0.04));
          ptTail = getCubicBezierPoint(curve[0], curve[1], curve[2], curve[3], tTail);
        } else {
          // Quadratic approximation
          const t = pod.t;
          const u = 1 - t;
          ptNow = {
            x: u * u * curve[0].x + 2 * u * t * curve[1].x + t * t * curve[2].x,
            y: u * u * curve[0].y + 2 * u * t * curve[1].y + t * t * curve[2].y,
          };
          const tt = Math.max(0, Math.min(1, pod.t - Math.sign(pod.speed) * 0.04));
          const uu = 1 - tt;
          ptTail = {
            x: uu * uu * curve[0].x + 2 * uu * tt * curve[1].x + tt * tt * curve[2].x,
            y: uu * uu * curve[0].y + 2 * uu * tt * curve[1].y + tt * tt * curve[2].y,
          };
        }

        // Draw light streak trailing pod
        const streakGrad = ctx.createLinearGradient(ptTail.x, ptTail.y, ptNow.x, ptNow.y);
        streakGrad.addColorStop(0, "transparent");
        streakGrad.addColorStop(1, pod.color);

        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(ptTail.x, ptTail.y);
        ctx.lineTo(ptNow.x, ptNow.y);
        ctx.stroke();

        // Bright leading photon head
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(ptNow.x, ptNow.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Soft halo
        const podGlow = ctx.createRadialGradient(ptNow.x, ptNow.y, 1, ptNow.x, ptNow.y, 8);
        podGlow.addColorStop(0, pod.color === "#D4AF37" ? "rgba(212, 175, 55, 0.7)" : "rgba(0, 240, 255, 0.7)");
        podGlow.addColorStop(1, "transparent");
        ctx.fillStyle = podGlow;
        ctx.beginPath();
        ctx.arc(ptNow.x, ptNow.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      // 7. LAYER 5: FLOATING HOLOGRAPHIC DISTRICT TELEMETRY (Parallax: 0.10)
      const p5X = mx * 75;
      const p5Y = my * 32;
      ctx.save();
      ctx.translate(p5X, p5Y);

      holoLabels.forEach((lbl, i) => {
        const lx = width * lbl.nx;
        const ly = height * lbl.ny;
        const pulse = Math.sin(time * 2 + i * 1.5) * 3;

        // Floating node ring
        ctx.strokeStyle = lbl.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(lx, ly + pulse, 4, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing radar ripple
        const ripple = (time * 0.8 + i) % 2;
        ctx.strokeStyle = lbl.color === "#D4AF37" ? `rgba(212, 175, 55, ${0.4 - ripple * 0.2})` : `rgba(0, 240, 255, ${0.4 - ripple * 0.2})`;
        ctx.beginPath();
        ctx.arc(lx, ly + pulse, 4 + ripple * 10, 0, Math.PI * 2);
        ctx.stroke();

        // Connector bracket line
        ctx.beginPath();
        ctx.moveTo(lx, ly + pulse);
        ctx.lineTo(lx + 16, ly + pulse - 14);
        ctx.lineTo(lx + 110, ly + pulse - 14);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Holographic label text
        ctx.fillStyle = lbl.color;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText(lbl.name, lx + 20, ly + pulse - 18);

        ctx.fillStyle = "rgba(148, 163, 184, 0.85)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(lbl.sub, lx + 20, ly + pulse - 6);
      });

      // Holographic Candlestick Projection in upper atmosphere (near Burj)
      const candleBaseX = width * 0.62;
      const candleBaseY = height * 0.32;
      const candleData = [
        { o: 20, c: 35, h: 42, l: 15, up: true },
        { o: 35, c: 28, h: 38, l: 22, up: false },
        { o: 28, c: 46, h: 50, l: 25, up: true },
        { o: 46, c: 54, h: 60, l: 42, up: true },
        { o: 54, c: 48, h: 58, l: 44, up: false },
      ];

      candleData.forEach((cd, cIdx) => {
        const cx = candleBaseX + cIdx * 14;
        const col = cd.up ? "rgba(5, 205, 153, 0.45)" : "rgba(239, 68, 68, 0.45)";
        
        // Wick
        ctx.strokeStyle = col;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx + 4, candleBaseY - cd.h);
        ctx.lineTo(cx + 4, candleBaseY - cd.l);
        ctx.stroke();

        // Body
        ctx.fillStyle = col;
        const topY = candleBaseY - Math.max(cd.o, cd.c);
        const bodyH = Math.max(3, Math.abs(cd.c - cd.o));
        ctx.fillRect(cx, topY, 8, bodyH);
      });

      ctx.restore();

      // 8. FOREGROUND WATER / HARBOR REFLECTIONS & BOTTOM VIGNETTE
      const bottomGrad = ctx.createLinearGradient(0, height * 0.78, 0, height);
      bottomGrad.addColorStop(0, "rgba(5, 7, 11, 0)");
      bottomGrad.addColorStop(0.5, "rgba(5, 7, 11, 0.65)");
      bottomGrad.addColorStop(1, "rgba(5, 7, 11, 0.98)");
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height * 0.78, width, height * 0.22);

      // Subtle water shimmer reflections of the towers
      const waterY = height * 0.92;
      for (let i = 0; i < 28; i++) {
        const rx = (i / 28) * width + Math.sin(time + i) * 12;
        const rw = Math.random() * 45 + 15;
        const rAlpha = 0.05 + 0.05 * Math.sin(time * 2 + i);
        ctx.fillStyle = i % 2 === 0 ? `rgba(212, 175, 55, ${rAlpha})` : `rgba(0, 240, 255, ${rAlpha})`;
        ctx.fillRect(rx, waterY + (i % 6) * 3, rw, 1);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ imageRendering: "auto" }}
      />
      {/* Subtle Scanline Overlay */}
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
      {/* Edge Vignette */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
    </div>
  );
};
