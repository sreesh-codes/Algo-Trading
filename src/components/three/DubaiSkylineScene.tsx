"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Compass, Activity, Layers } from "lucide-react";

interface DistrictInfo {
  id: string;
  name: string;
  category: string;
  activeContracts: string[];
  volume24hBlitz: string;
  status: string;
  pos: [number, number, number];
}

const DISTRICTS: DistrictInfo[] = [
  {
    id: "burj-nexus",
    name: "Burj Quantum Nexus",
    category: "Superconducting Financial Spine",
    activeContracts: ["DMX-35-INDEX", "Q-FLOP-COMPUTE", "DIFC-CREDIT"],
    volume24hBlitz: "2,840,500,000 Blitz",
    status: "MAXIMUM LIQUIDITY",
    pos: [0, 6, 0],
  },
  {
    id: "mbr-solar",
    name: "Mohammed bin Rashid Solar Complex",
    category: "Continuous Thermal & Clean Baseload",
    activeContracts: ["SOL-MWH-SPOT", "GRID-STABILIZER", "SOLAR-DESALT"],
    volume24hBlitz: "1,450,200,000 Blitz",
    status: "GENERATION NOMINAL",
    pos: [6, 1, 4],
  },
  {
    id: "jebel-ali",
    name: "Jebel Ali Autonomous Hyperport",
    category: "Pneumatic Freight & Hydrogen Terminal",
    activeContracts: ["HYPER-DXB-AUH", "HYDRO-DXB", "CARGO-DRONE-INDEX"],
    volume24hBlitz: "920,800,000 Blitz",
    status: "ZERO DEMURRAGE",
    pos: [-6, 2, -4],
  },
];

export const DubaiSkylineScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(DISTRICTS[0]);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const isRotatingRef = useRef(isRotating);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL support using a separate probe canvas
    let hasGl = false;
    try {
      const probeCanvas = document.createElement("canvas");
      const gl =
        probeCanvas.getContext("webgl2") ||
        probeCanvas.getContext("webgl") ||
        probeCanvas.getContext("experimental-webgl");
      hasGl = !!gl;
    } catch {
      hasGl = false;
    }

    if (!hasGl) {
      setTimeout(() => setWebglSupported(false), 0);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070b, 0.04);

    const width = canvas.parentElement?.clientWidth || 800;
    const height = canvas.parentElement?.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 10, 18);
    camera.lookAt(0, 3, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch {
      setTimeout(() => setWebglSupported(false), 0);
      return;
    }

    // Atmospheric Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0xd4af37, 0x18243b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Group for all procedural Dubai structures
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // 1. Central Burj Spire (Pyramid Needle Tower)
    const burjGeo = new THREE.ConeGeometry(1.2, 11, 4);
    const burjMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const burjMesh = new THREE.Mesh(burjGeo, burjMat);
    burjMesh.position.set(0, 5.5, 0);
    cityGroup.add(burjMesh);

    // Glowing core inside Burj
    const burjCoreGeo = new THREE.CylinderGeometry(0.3, 0.5, 9, 8);
    const burjCoreMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.4,
    });
    const burjCore = new THREE.Mesh(burjCoreGeo, burjCoreMat);
    burjCore.position.set(0, 4.5, 0);
    cityGroup.add(burjCore);

    // 2. Surrounding Dubai High-Rises (Wireframe Blocks)
    const buildingCoords = [
      { x: -3.5, z: 2, w: 1.4, h: 6, d: 1.4, col: 0xd4af37 }, // DIFC Gate
      { x: -2.0, z: -2.5, w: 1.2, h: 4.5, d: 1.2, col: 0x00f0ff },
      { x: 3.5, z: -2.0, w: 1.6, h: 5.2, d: 1.5, col: 0xd4af37 }, // Solar Nexus
      { x: 2.2, z: 3.0, w: 1.3, h: 4.0, d: 1.3, col: 0x05cd99 },
      { x: -5.0, z: -3.0, w: 2.0, h: 3.0, d: 2.5, col: 0x38bdf8 }, // Jebel Port
      { x: 4.5, z: 2.5, w: 1.1, h: 5.5, d: 1.1, col: 0x00f0ff },
    ];

    buildingCoords.forEach((b) => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const wireMat = new THREE.MeshBasicMaterial({
        color: b.col,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const mesh = new THREE.Mesh(geo, wireMat);
      mesh.position.set(b.x, b.h / 2, b.z);
      cityGroup.add(mesh);
    });

    // 3. Orbital Energy Ring around Palm Horizon
    const ringGeo = new THREE.RingGeometry(8, 8.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.2;
    cityGroup.add(ringMesh);

    // 4. Floating Holographic District Telemetry Spheres
    const nodeSpheres: THREE.Mesh[] = [];
    DISTRICTS.forEach((d) => {
      const sGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const sMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        wireframe: true,
      });
      const sMesh = new THREE.Mesh(sGeo, sMat);
      sMesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      cityGroup.add(sMesh);
      nodeSpheres.push(sMesh);
    });

    // 5. Data Particles Stream
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 20;
      posArray[i + 1] = Math.random() * 10;
      posArray[i + 2] = (Math.random() - 0.5) * 20;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xd4af37,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    cityGroup.add(particleSystem);

    // Resize listener
    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotatingRef.current) {
        cityGroup.rotation.y += 0.003;
      }

      // Pulse floating telemetry nodes
      angle += 0.04;
      nodeSpheres.forEach((node, i) => {
        node.position.y = DISTRICTS[i].pos[1] + Math.sin(angle + i) * 0.2;
      });

      // Slowly elevate particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particlesCount * 3; i += 3) {
        positions[i] += 0.015;
        if (positions[i] > 10) positions[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      try {
        renderer.forceContextLoss();
        renderer.dispose();
      } catch {}
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] rounded-lg overflow-hidden border border-white/10 bg-[#05070B]"
    >
      {/* 3D Canvas or Fallback */}
      {webglSupported ? (
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      ) : (
        /* CSS / SVG Holographic Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center bg-radial-vignette p-6 text-center">
          <div className="w-32 h-32 rounded-full border border-[#D4AF37]/40 flex items-center justify-center text-[#00F0FF] mb-4 animate-pulse">
            <Layers size={48} />
          </div>
          <h4 className="text-sm font-bold text-white font-mono-tech tracking-wider uppercase">
            Holographic Architectural Overlay (2D Telemetry)
          </h4>
          <p className="text-xs text-[#94A3B8] font-mono-tech max-w-sm mt-1">
            Displaying simulated Dubai 2035 node topology in hardware-accelerated fallback mode.
          </p>
        </div>
      )}

      {/* Top Left HUD Label */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
          <span className="font-mono-tech text-xs font-bold text-white tracking-wider uppercase">
            DUBAI 2035 // ORBITAL NODE TOPOLOGY
          </span>
        </div>
        <p className="font-mono-tech text-[10px] text-[#94A3B8] tracking-widest uppercase">
          CRYOGENIC TELEMETRY MESH • DMX-35 GRID
        </p>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className="px-2.5 py-1 rounded bg-[#0B0F19]/80 border border-white/15 text-[#CBD5E1] hover:text-white hover:border-[#D4AF37] transition-all text-xs font-mono-tech flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <Compass size={12} className={isRotating ? "text-[#D4AF37]" : "text-[#64748B]"} />
          <span>{isRotating ? "ROTATING" : "PAUSED"}</span>
        </button>
      </div>

      {/* Bottom Floating District Selector & Info Card */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-3 pointer-events-none">
        {/* District Selector Buttons */}
        <div className="flex flex-wrap gap-1.5 pointer-events-auto bg-[#070A12]/80 backdrop-blur-md p-1 rounded border border-white/10">
          {DISTRICTS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded text-xs font-mono-tech tracking-wider uppercase transition-all cursor-pointer ${
                selectedDistrict.id === d.id
                  ? "bg-[#D4AF37] text-[#05070B] font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
            >
              {d.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {/* Selected District Details HUD */}
        <div className="pointer-events-auto">
          <GlassPanel
            variant="gold"
            hudCorners
            className="p-3.5 max-w-sm backdrop-blur-lg bg-[#0B0F1C]/90"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-mono-tech text-[10px] text-[#D4AF37] uppercase font-bold flex items-center gap-1">
                <Activity size={11} /> {selectedDistrict.category}
              </span>
              <TechnicalLabel variant="green">{selectedDistrict.status}</TechnicalLabel>
            </div>
            <h5 className="text-xs font-bold text-white font-mono-tech tracking-wide uppercase mb-1">
              {selectedDistrict.name}
            </h5>
            <div className="flex items-center justify-between text-[11px] font-mono-tech text-[#CBD5E1] pt-1.5 border-t border-white/10">
              <span>24H VOLUME:</span>
              <span className="text-[#D4AF37] font-semibold">
                {selectedDistrict.volume24hBlitz}
              </span>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
