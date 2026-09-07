import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { TrafficPoint, AlertItem, NetworkConnection } from '../types';
import { useMode } from '../context/ModeContext';
import { Eye, RotateCcw, Play, Pause, Zap, Activity, ShieldAlert, Cpu } from 'lucide-react';

interface ThreeDNetworkGraphProps {
  trafficData?: TrafficPoint[];
  alerts?: AlertItem[];
  connections?: NetworkConnection[];
  height?: string;
}

export const ThreeDNetworkGraph: React.FC<ThreeDNetworkGraphProps> = ({
  trafficData = [],
  alerts = [],
  connections = [],
  height = '480px'
}) => {
  const { mode, suricataConnected } = useMode();
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'topology' | 'speed3d'>('topology');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nodesGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const speedBarsGroupRef = useRef<THREE.Group | null>(null);

  // Interaction controls refs
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0.3, y: 0 });

  const latestPoint = trafficData.length > 0 ? trafficData[trafficData.length - 1] : null;
  const activeInterface = latestPoint?.interface_name || 'Ethernet/Wi-Fi';
  const networkName = latestPoint?.network_name || 'Local Network';
  const ipAddress = latestPoint?.ip_address || '192.168.1.100';

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const heightPx = container.clientHeight || 480;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.015);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(55, width / heightPx, 0.1, 1000);
    camera.position.set(0, 20, 55);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2, 100);
    pointLight.position.set(0, 15, 0);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 1.5, 80);
    blueLight.position.set(25, -10, 25);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 1.5, 80);
    purpleLight.position.set(-25, 10, -25);
    scene.add(purpleLight);

    // 5. Build Grid Floor
    const gridHelper = new THREE.GridHelper(100, 40, 0x27272a, 0x18181b);
    gridHelper.position.y = -15;
    scene.add(gridHelper);

    // Groups
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);
    nodesGroupRef.current = nodesGroup;

    const particlesGroup = new THREE.Group();
    scene.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsGroupRef.current = ringsGroup;

    const speedBarsGroup = new THREE.Group();
    scene.add(speedBarsGroup);
    speedBarsGroupRef.current = speedBarsGroup;

    // Build Initial 3D Elements
    buildTopologyScene();
    buildSpeed3DScene();

    // Mouse Interaction Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        rotationRef.current.y += deltaX * 0.008;
        rotationRef.current.x += deltaY * 0.008;
        rotationRef.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationRef.current.x));

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (cameraRef.current) {
        cameraRef.current.position.z += e.deltaY * 0.05;
        cameraRef.current.position.z = Math.max(15, Math.min(120, cameraRef.current.position.z));
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // ResizeObserver for rock-solid layout responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || container.clientWidth;
        const h = entry.contentRect.height || container.clientHeight || 480;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        rotationRef.current.y += 0.003;
      }

      if (nodesGroupRef.current) {
        nodesGroupRef.current.rotation.y = rotationRef.current.y;
        nodesGroupRef.current.rotation.x = rotationRef.current.x;
      }

      if (ringsGroupRef.current) {
        ringsGroupRef.current.rotation.y = rotationRef.current.y * 0.5;
        ringsGroupRef.current.rotation.z = elapsedTime * 0.1;
      }

      if (particlesGroupRef.current) {
        particlesGroupRef.current.rotation.y = rotationRef.current.y;
        particlesGroupRef.current.rotation.x = rotationRef.current.x;

        // Animate packet particles along arcs
        particlesGroupRef.current.children.forEach((p: any) => {
          if (p.userData && p.userData.curve) {
            p.userData.progress = (p.userData.progress + p.userData.speed) % 1;
            const pt = p.userData.curve.getPoint(p.userData.progress);
            p.position.copy(pt);
          }
        });
      }

      if (speedBarsGroupRef.current) {
        speedBarsGroupRef.current.rotation.y = rotationRef.current.y;
        speedBarsGroupRef.current.rotation.x = rotationRef.current.x;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Re-build Topology Scene when mode/data changes
  const buildTopologyScene = () => {
    if (!nodesGroupRef.current || !particlesGroupRef.current || !ringsGroupRef.current) return;

    // Clear old children
    while (nodesGroupRef.current.children.length > 0) {
      nodesGroupRef.current.remove(nodesGroupRef.current.children[0]);
    }
    while (particlesGroupRef.current.children.length > 0) {
      particlesGroupRef.current.remove(particlesGroupRef.current.children[0]);
    }
    while (ringsGroupRef.current.children.length > 0) {
      ringsGroupRef.current.remove(ringsGroupRef.current.children[0]);
    }

    // 1. Central Core Node (Local Gateway/SOC)
    const coreGeo = new THREE.IcosahedronGeometry(3.5, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      wireframe: true,
      shininess: 100
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    nodesGroupRef.current.add(coreMesh);

    // Glowing Inner Sphere
    const innerGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreMesh.add(innerMesh);

    // 2. Cyber Orbital Rings
    [15, 25, 35].forEach((radius, idx) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx === 0 ? 0x10b981 : (idx === 1 ? 0x3b82f6 : 0xa855f7),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.25
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringsGroupRef.current?.add(ringMesh);
    });

    // 3. Node Endpoints (Active connections & alerts)
    const nodeTargets: Array<{ ip: string; color: number; type: string; pos: THREE.Vector3; details: string }> = [];

    // Derive node list from connections or alerts or fallback
    const connList = connections.length > 0 ? connections.slice(0, 12) : [
      { source_ip: ipAddress, destination_ip: '1.1.1.1', protocol: 'UDP', status: 'ACTIVE', packets: 45 },
      { source_ip: ipAddress, destination_ip: '142.250.190.46', protocol: 'TCP', status: 'ESTABLISHED', packets: 120 },
      { source_ip: '45.154.255.12', destination_ip: ipAddress, protocol: 'TCP', status: 'SYN_SENT', packets: 88 },
      { source_ip: '185.220.101.5', destination_ip: ipAddress, protocol: 'TCP', status: 'ESTABLISHED', packets: 340 },
      { source_ip: ipAddress, destination_ip: '8.8.8.8', protocol: 'UDP', status: 'ACTIVE', packets: 12 },
      { source_ip: '192.168.1.105', destination_ip: '192.168.1.1', protocol: 'TCP', status: 'ESTABLISHED', packets: 210 }
    ];

    connList.forEach((c, index) => {
      const angle = (index / connList.length) * Math.PI * 2;
      const radius = 16 + (index % 3) * 8;
      const yPos = Math.sin(index * 1.5) * 6;
      const pos = new THREE.Vector3(
        Math.cos(angle) * radius,
        yPos,
        Math.sin(angle) * radius
      );

      const isThreat = c.source_ip.startsWith('45.') || c.source_ip.startsWith('185.') || c.status === 'SYN_SENT';
      const nodeColor = isThreat ? 0xef4444 : (c.protocol === 'UDP' ? 0x3b82f6 : 0x10b981);

      nodeTargets.push({
        ip: c.destination_ip === ipAddress ? c.source_ip : c.destination_ip,
        color: nodeColor,
        type: isThreat ? 'Threat IP' : 'Authorized Connection',
        pos,
        details: `${c.protocol} | Status: ${c.status} | Packets: ${c.packets || 10}`
      });
    });

    nodeTargets.forEach((t) => {
      // Node Mesh
      const nodeGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const nodeMat = new THREE.MeshPhongMaterial({
        color: t.color,
        emissive: t.color,
        emissiveIntensity: 0.6
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(t.pos);
      nodesGroupRef.current?.add(nodeMesh);

      // Connection Line to Core
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(t.pos.x * 0.5, t.pos.y + 5, t.pos.z * 0.5),
        t.pos
      );

      const points = curve.getPoints(24);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: t.color,
        transparent: true,
        opacity: 0.35
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      nodesGroupRef.current?.add(lineMesh);

      // Add Data Flow Particles along line
      for (let p = 0; p < 2; p++) {
        const pGeo = new THREE.SphereGeometry(0.35, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: t.color });
        const pMesh = new THREE.Mesh(pGeo, pMat) as any;
        pMesh.userData = {
          curve,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.01
        };
        particlesGroupRef.current?.add(pMesh);
      }
    });
  };

  // Re-build 3D Speed Mesh Scene
  const buildSpeed3DScene = () => {
    if (!speedBarsGroupRef.current) return;
    while (speedBarsGroupRef.current.children.length > 0) {
      speedBarsGroupRef.current.remove(speedBarsGroupRef.current.children[0]);
    }

    const dataPoints = trafficData.length > 0 ? trafficData.slice(-16) : Array.from({ length: 12 }, (_, i) => ({
      timestamp: `00:0${i}`,
      packets: 300 + Math.random() * 500,
      bytes_recv: 200000 + Math.random() * 800000,
      bytes_sent: 50000 + Math.random() * 200000
    }));

    dataPoints.forEach((pt: any, idx) => {
      const xPos = (idx - dataPoints.length / 2) * 3.5;

      // Download Bar (Green)
      const downVal = (pt.bytes_recv || pt.bytes || 300000) / 100000;
      const downHeight = Math.max(1, Math.min(25, downVal));
      const downGeo = new THREE.BoxGeometry(1.2, downHeight, 1.2);
      const downMat = new THREE.MeshPhongMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        transparent: true,
        opacity: 0.85
      });
      const downMesh = new THREE.Mesh(downGeo, downMat);
      downMesh.position.set(xPos, downHeight / 2 - 15, 2);
      speedBarsGroupRef.current?.add(downMesh);

      // Upload Bar (Blue)
      const upVal = (pt.bytes_sent || pt.bytes ? (pt.bytes * 0.2) : 80000) / 50000;
      const upHeight = Math.max(0.8, Math.min(18, upVal));
      const upGeo = new THREE.BoxGeometry(1.2, upHeight, 1.2);
      const upMat = new THREE.MeshPhongMaterial({
        color: 0x3b82f6,
        emissive: 0x1d4ed8,
        transparent: true,
        opacity: 0.85
      });
      const upMesh = new THREE.Mesh(upGeo, upMat);
      upMesh.position.set(xPos, upHeight / 2 - 15, -2);
      speedBarsGroupRef.current?.add(upMesh);
    });
  };

  useEffect(() => {
    buildTopologyScene();
    buildSpeed3DScene();
  }, [trafficData, connections, alerts, mode]);

  useEffect(() => {
    if (nodesGroupRef.current) nodesGroupRef.current.visible = viewMode === 'topology';
    if (particlesGroupRef.current) particlesGroupRef.current.visible = viewMode === 'topology';
    if (ringsGroupRef.current) ringsGroupRef.current.visible = viewMode === 'topology';
    if (speedBarsGroupRef.current) speedBarsGroupRef.current.visible = viewMode === 'speed3d';
  }, [viewMode]);

  const resetCamera = () => {
    rotationRef.current = { x: 0.3, y: 0 };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 20, 55);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  return (
    <div className="soc-card relative overflow-hidden flex flex-col" style={{ minHeight: height }}>
      
      {/* 3D Header Controls Bar */}
      <div className="p-3.5 border-b border-borderMuted bg-surface flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
                3D WebGL Cyber Threat & Network Visualizer
              </h3>
              <span className="px-1.5 py-0.5 text-[10px] rounded font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                60 FPS WebGL
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Active Adapter: <span className="text-emerald-400 font-mono font-semibold">{networkName}</span> [{ipAddress}]
            </p>
          </div>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-xs font-mono">
            <button
              onClick={() => setViewMode('topology')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'topology'
                  ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Topology Globe
            </button>
            <button
              onClick={() => setViewMode('speed3d')}
              className={`px-2.5 py-1 rounded text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'speed3d'
                  ? 'bg-zinc-800 text-blue-400 font-bold border border-zinc-700 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              3D Speed Volumetric
            </button>
          </div>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded border text-xs transition-colors ${
              autoRotate
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            title={autoRotate ? "Pause Auto-Orbit" : "Start Auto-Orbit"}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={resetCamera}
            className="p-1.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
            title="Reset 3D Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative flex-1 w-full bg-zinc-950 cursor-grab active:cursor-grabbing min-h-[380px]" ref={mountRef}>
        
        {/* Floating Controls Guidance Overlay */}
        <div className="absolute top-3 left-3 z-10 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-2.5 rounded-lg text-[11px] font-mono text-zinc-400 space-y-1 pointer-events-none">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>3D INTERACTIVE CONTROLS</span>
          </div>
          <p>• Click & Drag: Rotate Camera</p>
          <p>• Scroll Wheel: Zoom In / Out</p>
          <p>• <span className="text-emerald-400">Green Spheres</span>: Authorized Flows</p>
          <p>• <span className="text-red-400">Red Spheres</span>: Threat / Scan Vectors</p>
        </div>

        {/* Floating Speed Legend Overlay */}
        {latestPoint && (
          <div className="absolute bottom-3 right-3 z-10 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-3 rounded-lg font-mono text-xs text-zinc-300 space-y-1.5 shadow-lg">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">LIVE INTERFACE METRICS</div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400">Download Speed:</span>
              <span className="text-emerald-400 font-bold">
                {latestPoint.download_speed_formatted || '0.0 KB/s'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400">Upload Speed:</span>
              <span className="text-blue-400 font-bold">
                {latestPoint.upload_speed_formatted || '0.0 KB/s'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-zinc-400">Link Speed:</span>
              <span className="text-purple-400 font-bold">{latestPoint.link_speed || '1.0 Gbps'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
