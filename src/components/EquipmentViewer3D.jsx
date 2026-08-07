import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Sparkles, Cpu, Layers, ShieldCheck, Activity } from 'lucide-react';

export default function EquipmentViewer3D() {
  const mountRef = useRef(null);
  const [modelType, setModelType] = useState('motor'); // motor, switchgear, frp
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const sceneRef = useRef(null);
  const groupRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 7);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff6b00, 1.2);
    dirLight2.position.set(-5, -3, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00ff9d, 1.5, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Main 3D Object Group
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Build 3D Geometries based on Model Type
    const buildModel = () => {
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }

      if (modelType === 'motor') {
        // Build Industrial Electric Motor
        // Casing Body
        const bodyGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.3,
          metalness: 0.8,
          wireframe: wireframe
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.rotation.z = Math.PI / 2;
        group.add(body);

        // Cooling Fins
        for (let i = -1.0; i <= 1.0; i += 0.25) {
          const finGeo = new THREE.CylinderGeometry(1.32, 1.32, 0.06, 32);
          const finMat = new THREE.MeshStandardMaterial({
            color: 0x00f0ff,
            emissive: 0x003344,
            metalness: 0.9,
            wireframe: wireframe
          });
          const fin = new THREE.Mesh(finGeo, finMat);
          fin.position.x = i;
          fin.rotation.z = Math.PI / 2;
          group.add(fin);
        }

        // Output Shaft
        const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.6, 24);
        const shaftMat = new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          metalness: 1.0,
          roughness: 0.1
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.rotation.z = Math.PI / 2;
        group.add(shaft);

        // Terminal Junction Box on top
        const boxGeo = new THREE.BoxGeometry(0.7, 0.5, 0.7);
        const boxMat = new THREE.MeshStandardMaterial({
          color: 0xff6b00,
          metalness: 0.6,
          wireframe: wireframe
        });
        const termBox = new THREE.Mesh(boxGeo, boxMat);
        termBox.position.set(0, 1.45, 0);
        group.add(termBox);

        // Fan Cover back
        const coverGeo = new THREE.CylinderGeometry(1.28, 1.1, 0.6, 32);
        const coverMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          wireframe: wireframe
        });
        const cover = new THREE.Mesh(coverGeo, coverMat);
        cover.position.x = -1.4;
        cover.rotation.z = Math.PI / 2;
        group.add(cover);

      } else if (modelType === 'switchgear') {
        // Build Siemens ACB Switchgear Enclosure
        const cabinetGeo = new THREE.BoxGeometry(2.4, 3.2, 1.8);
        const cabinetMat = new THREE.MeshStandardMaterial({
          color: 0x0f172a,
          metalness: 0.7,
          roughness: 0.2,
          wireframe: wireframe
        });
        const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
        group.add(cabinet);

        // Glass Front Panel
        const glassGeo = new THREE.BoxGeometry(2.0, 2.6, 0.05);
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x00f0ff,
          transparent: true,
          opacity: 0.6,
          roughness: 0.1,
          transmission: 0.8
        });
        const glass = new THREE.Mesh(glassGeo, glassMat);
        glass.position.z = 0.92;
        group.add(glass);

        // Interior Breaker Units
        for (let y = -0.8; y <= 0.8; y += 0.8) {
          const breakerGeo = new THREE.BoxGeometry(1.6, 0.6, 1.2);
          const breakerMat = new THREE.MeshStandardMaterial({
            color: y === 0 ? 0xff6b00 : 0x00ff9d,
            metalness: 0.8,
            wireframe: wireframe
          });
          const breaker = new THREE.Mesh(breakerGeo, breakerMat);
          breaker.position.set(0, y, 0);
          group.add(breaker);
        }

      } else if (modelType === 'frp') {
        // Build FRP Molded Grating Panel
        const meshGroup = new THREE.Group();
        const size = 3;
        const gridCount = 8;
        const step = size / gridCount;

        for (let i = 0; i <= gridCount; i++) {
          const pos = -size / 2 + i * step;
          // Longitudinal bars
          const bar1Geo = new THREE.BoxGeometry(0.12, 0.4, size);
          const barMat = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0x00f0ff : 0xff6b00,
            metalness: 0.3,
            roughness: 0.4,
            wireframe: wireframe
          });
          const bar1 = new THREE.Mesh(bar1Geo, barMat);
          bar1.position.x = pos;
          meshGroup.add(bar1);

          // Transverse bars
          const bar2Geo = new THREE.BoxGeometry(size, 0.4, 0.12);
          const bar2 = new THREE.Mesh(bar2Geo, barMat);
          bar2.position.z = pos;
          meshGroup.add(bar2);
        }
        group.add(meshGroup);
      }
    };

    buildModel();

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.5 * rotationSpeed;
        groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      }

      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, [modelType, wireframe, rotationSpeed]);

  const hotspots = {
    motor: [
      { id: 1, title: "Class H Stator Copper Winding", desc: "100% Electrolytic copper winding engineered for IE4 low thermal loss and VFD high frequency duty." },
      { id: 2, title: "Cast Iron Heavy Frame", desc: "Rigid IP55 / IP56 enclosure designed for harsh chemical & industrial vibration resilience." },
      { id: 3, title: "Dyno-Balanced Shaft & Bearings", desc: "Dual shield pre-lubricated bearings guaranteeing zero axial play and over 50,000 operational hours." }
    ],
    switchgear: [
      { id: 1, title: "Siemens ACB Electronic Trip Unit", desc: "Microprocessor protective relay sensing overloads, short-circuit, and ground fault currents instantly." },
      { id: 2, title: "Finger-Touch Safe Busbars", desc: "High conductivity silver-plated copper busbars with IP2X dielectric safety barrier." }
    ],
    frp: [
      { id: 1, title: "Concave Meniscus Anti-Slip Edge", desc: "Integral molded anti-skid surface providing superior grip in oily or wet walkways." },
      { id: 2, title: "Isophthalic / Vinyl Ester Resin", desc: "Impenetrable chemical barrier resistant to acids, alkalis, and outdoor salt spray." }
    ]
  };

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-slate-950/80 border border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col">
      {/* Top Controls Header */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orbitron font-bold text-sm tracking-wider text-cyan-400 uppercase">
            Interactive 3D Holographic Inspector
          </span>
        </div>

        {/* Model Switchers */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setModelType('motor')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              modelType === 'motor' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" /> IE3/IE4 Motor
          </button>
          <button
            onClick={() => setModelType('switchgear')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              modelType === 'switchgear' ? 'bg-orange-500 text-black shadow-lg shadow-orange-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Siemens ACB Panel
          </button>
          <button
            onClick={() => setModelType('frp')}
            className={`px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 ${
              modelType === 'frp' ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> FRP Grating
          </button>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-2 rounded-lg border transition ${
              wireframe ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Wireframe Matrix"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setRotationSpeed(rotationSpeed === 0 ? 1 : rotationSpeed === 1 ? 2 : 0)}
            className="p-2 rounded-lg border bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 transition flex items-center gap-1 text-xs"
            title="Rotation Speed"
          >
            <RotateCw className="w-4 h-4" />
            <span>{rotationSpeed}x</span>
          </button>
        </div>
      </div>

      {/* 3D Canvas Container */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing" ref={mountRef}>
        {/* Overlay Badges */}
        <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
          <div className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-mono-code flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>RENDER_ENGINE: WebGL 3D</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono-code">
            ROTATION_SPEED: {rotationSpeed.toFixed(1)}x
          </div>
        </div>

        {/* Hotspots Info Cards */}
        <div className="absolute bottom-4 right-4 left-4 z-10 flex flex-wrap gap-2 pointer-events-auto">
          {hotspots[modelType].map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
              className={`px-3 py-2 rounded-xl border text-xs text-left transition-all backdrop-blur-md flex items-center gap-2 ${
                activeHotspot === hs.id
                  ? 'bg-cyan-500 text-black border-cyan-300 shadow-lg shadow-cyan-500/40 font-semibold'
                  : 'bg-slate-900/80 border-slate-700 text-slate-200 hover:border-cyan-400/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>{hs.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Hotspot Drawer */}
      {activeHotspot && (
        <div className="p-4 bg-slate-900 border-t border-cyan-500/30 text-sm animate-fadeIn z-20 flex items-start justify-between gap-4">
          <div>
            <h4 className="font-orbitron font-bold text-cyan-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              {hotspots[modelType].find((h) => h.id === activeHotspot)?.title}
            </h4>
            <p className="text-slate-300 text-xs mt-1">
              {hotspots[modelType].find((h) => h.id === activeHotspot)?.desc}
            </p>
          </div>
          <button
            onClick={() => setActiveHotspot(null)}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded-lg"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
