import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import type { Mesh } from "three";
import {
  Color,
  IcosahedronGeometry,
  Float32BufferAttribute,
  Vector3,
} from "three";
import { useTheme } from "../context/ThemeContext";

type FloatingSoccerBallProps = {
  animationsEnabled: boolean;
};

// The 12 pentagon centers of a soccer ball (truncated icosahedron)
// These are the vertices of an icosahedron - the original 12 vertices
const PENTAGON_CENTERS = [
  new Vector3(0, 0.525731, 0.850651),
  new Vector3(0, -0.525731, 0.850651),
  new Vector3(0, 0.525731, -0.850651),
  new Vector3(0, -0.525731, -0.850651),
  new Vector3(0.850651, 0, 0.525731),
  new Vector3(-0.850651, 0, 0.525731),
  new Vector3(0.850651, 0, -0.525731),
  new Vector3(-0.850651, 0, -0.525731),
  new Vector3(0.525731, 0.850651, 0),
  new Vector3(-0.525731, 0.850651, 0),
  new Vector3(0.525731, -0.850651, 0),
  new Vector3(-0.525731, -0.850651, 0),
].map((v) => v.normalize());

function FloatingSoccerBall({ animationsEnabled }: FloatingSoccerBallProps) {
  const meshRef = useRef<Mesh>(null);
  const geometry = useMemo(() => {
    // Use IcosahedronGeometry with 2 subdivisions for smoother appearance
    // while maintaining clear pentagon/hexagon distinction
    const baseGeometry = new IcosahedronGeometry(1.4, 2);
    baseGeometry.toNonIndexed();

    const position = baseGeometry.attributes.position;
    const { count } = position;
    const colors = new Float32Array(count * 3);
    const color = new Color();
    const vertex = new Vector3();
    const faceCenter = new Vector3();

    const faceCount = count / 3;

    // Color each face based on proximity to pentagon centers
    for (let face = 0; face < faceCount; face += 1) {
      faceCenter.set(0, 0, 0);

      // Calculate face center
      for (let vertexIndex = 0; vertexIndex < 3; vertexIndex += 1) {
        const idx = face * 3 + vertexIndex;
        vertex.fromBufferAttribute(position, idx);
        faceCenter.add(vertex);
      }

      faceCenter.divideScalar(3).normalize();

      // Check if this face is close to any pentagon center using dot product
      // A soccer ball has 12 black pentagons and 20 white hexagons
      // Faces near pentagon centers (original icosahedron vertices) are pentagons
      let maxDot = -1;
      for (const pentCenter of PENTAGON_CENTERS) {
        const dot = faceCenter.dot(pentCenter);
        maxDot = Math.max(maxDot, dot);
      }

      // Threshold: faces with dot product > 0.90 are part of pentagons
      // Higher threshold = smaller black pentagons, more white hexagons visible
      // This creates a classic soccer ball pattern with distinct black and white
      const isPentagon = maxDot > 0.90;

      // Black for pentagons, white for hexagons
      color.set(isPentagon ? "#000000" : "#ffffff");

      // Apply color to all vertices of this face
      for (let vertexIndex = 0; vertexIndex < 3; vertexIndex += 1) {
        const baseIndex = (face * 3 + vertexIndex) * 3;
        colors[baseIndex] = color.r;
        colors[baseIndex + 1] = color.g;
        colors[baseIndex + 2] = color.b;
      }
    }

    baseGeometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
    baseGeometry.computeVertexNormals();

    return baseGeometry;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const rotationMultiplier = animationsEnabled ? t : 0;
    meshRef.current.rotation.x = 0.4 + rotationMultiplier * 0.3;
    meshRef.current.rotation.y = 0.6 + rotationMultiplier * 0.45;
    meshRef.current.position.y = animationsEnabled
      ? Math.sin(t * 1.2) * 0.2
      : 0;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        vertexColors
        metalness={0.0}
        roughness={0.85}
        envMapIntensity={0.3}
      />
      <Edges scale={1.002} color="#000000" />
    </mesh>
  );
}

export default function HeroCanvas() {
  const { animationsEnabled } = useTheme();

  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 5], fov: 50 }}
      shadows
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 4, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 3, -4]} intensity={0.4} />
        <pointLight position={[0, 5, 0]} intensity={0.3} />
        <FloatingSoccerBall animationsEnabled={animationsEnabled} />
        {animationsEnabled && (
          <Environment preset="sunset" background={false} />
        )}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={animationsEnabled}
          autoRotateSpeed={2}
        />
      </Suspense>
    </Canvas>
  );
}
