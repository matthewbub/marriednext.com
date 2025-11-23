"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useMemo, useEffect, useState, useRef } from "react";
import * as THREE from "three";
import type { Mesh } from "three";

function LowPolyBalloon({
  position,
  colors,
}: {
  position: [number, number, number];
  colors: { envelope: string; stripe: string; basket?: string };
}) {
  const balloonRef = useRef<THREE.Group>(null);
  const baseYRef = useRef<number>(position[1]);

  useEffect(() => {
    baseYRef.current = position[1];
    if (balloonRef.current) {
      balloonRef.current.position.y = position[1];
    }
  }, [position]);

  useFrame((state) => {
    if (balloonRef.current) {
      const t = state.clock.elapsedTime;
      // Gentle floating animation around base height with slight phase offset by x
      balloonRef.current.rotation.y += 0.005;
      balloonRef.current.position.y =
        baseYRef.current + Math.sin(t + position[0] * 0.1) * 0.6;
    }
  });

  return (
    <group ref={balloonRef} position={position}>
      {/* Low poly balloon envelope with stripes */}
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[2, 8, 6]} />
        <meshLambertMaterial color={colors.envelope} flatShading />
      </mesh>

      {/* Balloon stripes */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[2.01, 8, 6]} />
        <meshLambertMaterial
          color={colors.stripe}
          flatShading
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Low poly basket */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshLambertMaterial color={colors.basket ?? "#8b4513"} flatShading />
      </mesh>

      {/* 4 strings connecting balloon to basket corners */}
      {[
        { balloon: [-1, 0.5, -1], basket: [-0.4, -1.3, -0.4] },
        { balloon: [1, 0.5, -1], basket: [0.4, -1.3, -0.4] },
        { balloon: [-1, 0.5, 1], basket: [-0.4, -1.3, 0.4] },
        { balloon: [1, 0.5, 1], basket: [0.4, -1.3, 0.4] },
      ].map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([...points.balloon, ...points.basket]),
                3,
              ]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#4a4a4a" />
        </line>
      ))}
    </group>
  );
}

function LowPolyHills() {
  const meshRef = useRef<THREE.Mesh>(null);
  // Fixed terrain parameters (from requested settings)
  const terrainY = -72;
  const heightScale = 0.7;
  const r1 = 0.7;
  const r2 = 1.0;
  const r3 = 0.4;
  const noise = 3.0;

  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(1000, 1000, 32, 32);

    const positionAttribute = geometry.getAttribute("position");
    const vertices = positionAttribute.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];

      const ridge1 =
        Math.floor(Math.abs(x * 0.02)) * 15 +
        Math.floor(Math.abs(y * 0.025)) * 8;
      const ridge2 =
        (Math.floor(x * 0.015) % 3) * 12 + (Math.floor(y * 0.02) % 2) * 18;
      const ridge3 =
        Math.abs((Math.floor(x * 0.01) % 5) - 2) * 10 +
        Math.abs((Math.floor(y * 0.015) % 4) - 1.5) * 14;

      const n = ((Math.floor(x * 0.05) + Math.floor(y * 0.05)) % 7) - 3;

      vertices[i + 2] = ridge1 + ridge2 + ridge3 + n;
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    return geometry;
  }, []);

  useEffect(() => {
    const positionAttribute = terrain.getAttribute("position");
    const vertices = positionAttribute.array as Float32Array;

    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];

      const ridge1 =
        (Math.floor(Math.abs(x * 0.02)) * 15 +
          Math.floor(Math.abs(y * 0.025)) * 8) *
        r1;
      const ridge2 =
        ((Math.floor(x * 0.015) % 3) * 12 + (Math.floor(y * 0.02) % 2) * 18) *
        r2;
      const ridge3 =
        (Math.abs((Math.floor(x * 0.01) % 5) - 2) * 10 +
          Math.abs((Math.floor(y * 0.015) % 4) - 1.5) * 14) *
        r3;
      const n =
        (((Math.floor(x * 0.05) + Math.floor(y * 0.05)) % 7) - 3) * noise;

      vertices[i + 2] = (ridge1 + ridge2 + ridge3 + n) * heightScale;
    }

    positionAttribute.needsUpdate = true;
    terrain.computeVertexNormals();
  }, [terrain]);

  const balloons = useMemo(() => {
    function groundHeightAt(x: number, zWorld: number) {
      // use same ridge/noise formula, but with y -> zWorld, and apply multipliers
      const ridge1 =
        (Math.floor(Math.abs(x * 0.02)) * 15 +
          Math.floor(Math.abs(zWorld * 0.025)) * 8) *
        r1;
      const ridge2 =
        ((Math.floor(x * 0.015) % 3) * 12 +
          (Math.floor(zWorld * 0.02) % 2) * 18) *
        r2;
      const ridge3 =
        (Math.abs((Math.floor(x * 0.01) % 5) - 2) * 10 +
          Math.abs((Math.floor(zWorld * 0.015) % 4) - 1.5) * 14) *
        r3;
      const n =
        (((Math.floor(x * 0.05) + Math.floor(zWorld * 0.05)) % 7) - 3) * noise;
      return (ridge1 + ridge2 + ridge3 + n) * heightScale;
    }

    const ENVELOPE_COLORS = [
      "#ff6b6b",
      "#ffd93d",
      "#6bcb77",
      "#4d96ff",
      "#b8c0ff",
      "#ff8e72",
      "#e56b6f",
      "#00bcd4",
      "#b388eb",
    ];
    const STRIPE_COLORS = [
      "#4ecdc4",
      "#1b9aaa",
      "#f45d01",
      "#aa00ff",
      "#ff5d8f",
      "#3ddc97",
      "#f9c74f",
      "#2ec4b6",
    ];
    const rand = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    type BalloonData = {
      position: [number, number, number];
      colors: { envelope: string; stripe: string; basket?: string };
    };

    const temp: BalloonData[] = [];
    for (let i = 0; i < 12; i++) {
      const x = (Math.random() - 0.5) * 240;
      const z = -20 - Math.random() * 140;
      const groundY = groundHeightAt(x, z);
      const y = groundY + 22 + Math.random() * 14;

      const envelope = rand(ENVELOPE_COLORS);
      let stripe = rand(STRIPE_COLORS);
      for (let t = 0; t < 3 && stripe === envelope; t++)
        stripe = rand(STRIPE_COLORS);

      temp.push({
        position: [x, y, z],
        colors: { envelope, stripe, basket: "#8b4513" },
      });
    }
    return temp;
  }, []);

  return (
    <>
      <fog attach="fog" args={["#f4a460", 80, 400]} />

      <mesh
        ref={meshRef}
        geometry={terrain}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, terrainY, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#8fbc8f"
          flatShading={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      {balloons.map((b, i) => (
        <LowPolyBalloon key={i} position={b.position} colors={b.colors} />
      ))}
    </>
  );
}

export function WineCountrySun() {
  const sunRef = useRef<Mesh>(null);
  const coronaRef = useRef<Mesh>(null);

  useFrame(() => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.005;
      sunRef.current.rotation.x += 0.002;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= 0.003;
      coronaRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group position={[60, 70, -150]}>
      <mesh ref={sunRef} castShadow>
        <sphereGeometry args={[12, 8, 6]} />
        <meshStandardMaterial
          emissive="#ff6b35"
          emissiveIntensity={3.0}
          color="#ffb347"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      <mesh ref={coronaRef} scale={1.3}>
        <sphereGeometry args={[12, 6, 4]} />
        <meshStandardMaterial
          emissive="#ff8c42"
          emissiveIntensity={1.5}
          color="#ff6b35"
          transparent
          opacity={0.4}
          roughness={0.9}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 18;
        const y = Math.sin(angle) * 18;
        return (
          <mesh
            key={i}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
            scale={[0.5, 4, 0.5]}
          >
            <cylinderGeometry args={[0.3, 0.1, 1, 4]} />
            <meshStandardMaterial
              emissive="#ffab3d"
              emissiveIntensity={2.0}
              color="#ff8c42"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      })}

      <pointLight
        position={[0, 0, 0]}
        intensity={2.0}
        distance={200}
        decay={2}
        color="#ff6b35"
      />
    </group>
  );
}

/* 🎥 Scroll-based camera controller */
function ScrollCamera() {
  const { camera } = useThree();
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
      const scrollY = window.scrollY / maxScroll;
      setScroll(scrollY);
    }

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    const startPos = new THREE.Vector3(0, 25, 45);
    const endPos = new THREE.Vector3(0, 8, 15);
    camera.position.lerpVectors(startPos, endPos, scroll);

    const lookStart = new THREE.Vector3(0, 0, -50);
    const lookEnd = new THREE.Vector3(0, 5, -120);
    const lookTarget = new THREE.Vector3().lerpVectors(
      lookStart,
      lookEnd,
      scroll
    );
    camera.lookAt(lookTarget);
  });

  return null;
}

/* 🍷 Main export - Temecula Wine Country Background */
export default function TemeculaWineBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        shadows
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        camera={{ position: [0, 25, 45], fov: 60 }}
      >
        <color attach="background" args={["#87ceeb"]} />

        <Stars radius={500} depth={100} count={2000} factor={1.5} fade />

        <ambientLight intensity={0.8} color="#fff8dc" />

        <directionalLight
          position={[70, 80, -150]}
          intensity={2.8}
          color="#ffb347"
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-radius={10}
          shadow-bias={-0.0005}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-200, 200, 200, -200, 1, 500]}
          />
        </directionalLight>

        <WineCountrySun />

        <Suspense fallback={null}>
          <LowPolyHills />
        </Suspense>

        <ScrollCamera />

        {/* Lock user orbit rotation/zoom */}
        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
