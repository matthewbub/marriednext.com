"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import {
  Float,
  Environment,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function FloatingHeart({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  // Create heart shape
  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, 0);
  heartShape.bezierCurveTo(0, -0.3, -0.6, -0.3, -0.6, 0);
  heartShape.bezierCurveTo(-0.6, 0.3, 0, 0.6, 0, 1);
  heartShape.bezierCurveTo(0, 0.6, 0.6, 0.3, 0.6, 0);
  heartShape.bezierCurveTo(0.6, -0.3, 0, -0.3, 0, 0);

  const extrudeSettings = {
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh
        ref={meshRef}
        position={position}
        scale={0.8}
        rotation={[Math.PI, 0, 0]}
      >
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <MeshTransmissionMaterial
          color="#B794F6"
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.1}
          backside
        />
      </mesh>
    </Float>
  );
}

function FloatingGift({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef} position={position}>
        {/* Gift box */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <MeshTransmissionMaterial
            color="#7DD3C0"
            thickness={0.3}
            roughness={0.2}
            transmission={0.8}
            ior={1.4}
            chromaticAberration={0.05}
            backside
          />
        </mesh>
        {/* Ribbon horizontal */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.1, 0.15, 0.15]} />
          <meshStandardMaterial
            color="#F5A3C7"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        {/* Ribbon vertical */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 1.1, 0.15]} />
          <meshStandardMaterial
            color="#F5A3C7"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        {/* Bow */}
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#F5A3C7"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </group>
    </Float>
  );
}

function FloatingStar({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.8;
    }
  });

  // Create star shape
  const starShape = new THREE.Shape();
  const outerRadius = 0.5;
  const innerRadius = 0.2;
  const points = 5;

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i * Math.PI) / points;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      starShape.moveTo(x, y);
    } else {
      starShape.lineTo(x, y);
    }
  }
  starShape.closePath();

  const extrudeSettings = {
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 1,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  };

  return (
    <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={0.6}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#FFD93D"
          metalness={0.5}
          roughness={0.2}
          emissive="#FFD93D"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 100;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          args={[positions, 3]}
          attach="attributes-position"
          itemSize={3}
          count={particleCount}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#B794F6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export function ThreeScene({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#B794F6" />
      <pointLight position={[5, -5, 5]} intensity={0.5} color="#7DD3C0" />

      {/* Environment */}
      <Environment preset="city" />

      {/* 3D Elements */}
      <FloatingHeart position={isMobile ? [-3.5, 2, -3] : [-4, 1.5, -3]} />
      <FloatingGift position={isMobile ? [3.5, -2, -2] : [4, -1.5, -2]} />
      <FloatingStar position={isMobile ? [-3, -2.5, -2] : [-3.5, -2.5, -2]} />
      <FloatingStar position={isMobile ? [3, 2.5, -3] : [3.5, 2.5, -3]} />
      <FloatingHeart position={isMobile ? [0, 3.5, -4] : [0, 3.5, -5]} />

      {/* Particle field */}
      <ParticleField />
    </>
  );
}

export function ThankYouCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: isMobile ? [0, 0, 6] : [0, 0, 8],
          fov: isMobile ? 60 : 45,
        }}
        className="absolute inset-0"
      >
        <ThreeScene isMobile={isMobile} />
      </Canvas>

      {/* Text Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="font-sans font-bold text-7xl md:text-9xl text-center text-foreground tracking-tight text-balance mb-4">
            Thank You
          </h1>
          <p
            className={`font-sans text-xl md:text-2xl text-center text-muted-foreground max-w-2xl mx-auto px-6 transition-all duration-1000 delay-300 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Your kindness and support mean the world to us
          </p>
        </div>

        {/* Decorative elements */}
        <div
          className={`mt-12 transition-all duration-1000 delay-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex gap-2 items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse delay-150" />
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300" />
          </div>
        </div>
      </div>

      {/* Bottom message */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none z-10">
        <div
          className={`transition-all duration-1000 delay-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-sans text-sm text-muted-foreground">
            With gratitude and appreciation
          </p>
        </div>
      </div>
    </div>
  );
}
