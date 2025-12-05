import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { Group, Mesh } from "three";
import { useMemo } from "react";

type SnakeStyle = "classic" | "colorful" | "metallic";

interface Snake3DProps {
  style?: SnakeStyle;
  segments?: number;
}

function SnakeSegment({
  position,
  index,
  totalSegments,
  style,
}: {
  position: [number, number, number];
  index: number;
  totalSegments: number;
  style: SnakeStyle;
}) {
  const meshRef = useRef<Mesh>(null);

  // Animate slight movement
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime + index * 0.5) * 0.1;
      meshRef.current.rotation.x =
        Math.cos(state.clock.elapsedTime + index * 0.3) * 0.05;
    }
  });

  const getMaterial = () => {
    switch (style) {
      case "classic":
        return (
          <meshStandardMaterial
            color={index === 0 ? "#4caf50" : "#66bb6a"}
            metalness={0.1}
            roughness={0.7}
          />
        );
      case "colorful":
        const hue = (index / totalSegments) * 360;
        return (
          <meshStandardMaterial
            color={`hsl(${hue}, 70%, 50%)`}
            metalness={0.2}
            roughness={0.6}
          />
        );
      case "metallic":
        return (
          <meshStandardMaterial
            color={index === 0 ? "#c0c0c0" : "#a0a0a0"}
            metalness={0.9}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        );
    }
  };

  return (
    <mesh ref={meshRef} position={position} castShadow receiveShadow>
      <sphereGeometry args={[0.3, 16, 16]} />
      {getMaterial()}
    </mesh>
  );
}

function SnakeHead({
  position,
  style,
}: {
  position: [number, number, number];
  style: SnakeStyle;
}) {
  const headRef = useRef<Group>(null);
  const eye1Ref = useRef<Mesh>(null);
  const eye2Ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const getHeadMaterial = () => {
    switch (style) {
      case "classic":
        return (
          <meshStandardMaterial
            color="#4caf50"
            metalness={0.1}
            roughness={0.7}
          />
        );
      case "colorful":
        return (
          <meshStandardMaterial
            color="#ff6b6b"
            metalness={0.2}
            roughness={0.6}
          />
        );
      case "metallic":
        return (
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.9}
            roughness={0.2}
            envMapIntensity={1.5}
          />
        );
    }
  };

  return (
    <group ref={headRef} position={position}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        {getHeadMaterial()}
      </mesh>
      {/* Eyes */}
      <mesh ref={eye1Ref} position={[-0.15, 0.1, 0.35]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh ref={eye2Ref} position={[0.15, 0.1, 0.35]} castShadow>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Tongue */}
      <mesh position={[0, -0.2, 0.4]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.2]} />
        <meshStandardMaterial color="#ff1744" />
      </mesh>
    </group>
  );
}

function Snake3DModel({
  style,
  segments = 8,
}: {
  style: SnakeStyle;
  segments: number;
}) {
  const groupRef = useRef<Group>(null);

  // Create snake body positions in a curve
  const positions = useMemo(() => {
    const pos: [number, number, number][] = [];
    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const x = Math.sin(t * Math.PI * 2) * 0.5;
      const y = Math.cos(t * Math.PI * 2) * 0.3;
      const z = -t * 2;
      pos.push([x, y, z]);
    }
    return pos;
  }, [segments]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <SnakeHead position={positions[0]} style={style} />
      {positions.slice(1).map((pos, index) => (
        <SnakeSegment
          key={index}
          position={pos}
          index={index + 1}
          totalSegments={segments}
          style={style}
        />
      ))}
    </group>
  );
}

function Snake3DScene({
  style,
  segments,
}: {
  style: SnakeStyle;
  segments: number;
}) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 50 }}
      shadows
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#1a1a2e"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        {style === "metallic" && (
          <Environment preset="sunset" background={false} />
        )}
        <Snake3DModel style={style} segments={segments} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          autoRotate={false}
          minDistance={3}
          maxDistance={10}
        />
      </Suspense>
    </Canvas>
  );
}

export default function Snake3D({
  style = "classic",
  segments = 8,
}: Snake3DProps) {
  return (
    <div style={{ width: "100%", height: "500px", position: "relative" }}>
      <Snake3DScene style={style} segments={segments} />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        Style: {style.charAt(0).toUpperCase() + style.slice(1)}
      </div>
    </div>
  );
}
