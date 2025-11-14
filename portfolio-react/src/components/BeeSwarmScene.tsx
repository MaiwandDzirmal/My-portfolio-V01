import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import type { InstancedMesh } from "three";
import { Color, Matrix4, Vector3 } from "three";
import { useTheme } from "../context/ThemeContext";

const FLOWER_COLORS = ["#ff6b6b", "#ffd93d", "#6ee7b7", "#8b5cf6", "#f472b6"];
const BEE_COLORS = ["#fbbf24", "#fcd34d", "#f59e0b"];

function Hive() {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.9, 1.2, 1.2, 12]} />
        <meshStandardMaterial color="#f4a261" metalness={0.1} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <torusGeometry args={[0.6, 0.05, 12, 48]} />
        <meshStandardMaterial color="#f6bd60" metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <circleGeometry args={[0.35, 24]} />
        <meshStandardMaterial color="#3d405b" />
      </mesh>
    </group>
  );
}

function FlowerField() {
  const matrix = useMemo(() => new Matrix4(), []);
  const tempPosition = useMemo(() => new Vector3(), []);
  const petalColor = useMemo(() => new Color(), []);
  const petalsRef = useRef<InstancedMesh>(null);
  const centersRef = useRef<InstancedMesh>(null);

  useEffect(() => {
    const stem = petalsRef.current;
    const center = centersRef.current;
    if (!stem || !center) return;

    const count = stem.count;
    for (let i = 0; i < count; i += 1) {
      const radius = 2 + Math.random() * 5;
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = 0.2 + Math.random() * 0.3;

      matrix.identity();
      matrix.setPosition(x, y, z);
      stem.setMatrixAt(i, matrix);

      tempPosition.set(x, y + 0.25, z);
      matrix.makeTranslation(tempPosition.x, tempPosition.y, tempPosition.z);
      center.setMatrixAt(i, matrix);

      petalColor.set(FLOWER_COLORS[i % FLOWER_COLORS.length]);
      center.setColorAt(i, petalColor);
    }

    stem.instanceMatrix.needsUpdate = true;
    center.instanceMatrix.needsUpdate = true;
    if (center.instanceColor) {
      center.instanceColor.needsUpdate = true;
    }
  }, [matrix, tempPosition, petalColor]);

  useFrame(({ clock }) => {
    const stem = petalsRef.current;
    if (!stem) return;

    const t = clock.getElapsedTime();
    for (let i = 0; i < stem.count; i += 1) {
      stem.getMatrixAt(i, matrix);
      matrix.setPosition(
        matrix.elements[12],
        matrix.elements[13] + Math.sin(t + i) * 0.04,
        matrix.elements[14]
      );
      stem.setMatrixAt(i, matrix);
    }
    stem.instanceMatrix.needsUpdate = true;
  });

  const count = 120;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[8, 64]} />
        <meshStandardMaterial
          color="#84cc16"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <instancedMesh ref={petalsRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.08, 0.08, 0.4, 12]} />
        <meshStandardMaterial color="#4d7c0f" />
      </instancedMesh>
      <instancedMesh ref={centersRef} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial vertexColors />
      </instancedMesh>
    </group>
  );
}

function BeeSwarm({ animationsEnabled }: { animationsEnabled: boolean }) {
  const swarmRef = useRef<InstancedMesh>(null);
  const matrix = useMemo(() => new Matrix4(), []);
  const beeColor = useMemo(() => new Color(), []);

  useEffect(() => {
    const swarm = swarmRef.current;
    if (!swarm) return;

    const count = swarm.count;
    for (let i = 0; i < count; i += 1) {
      const radius = 1.5 + Math.random() * 0.6;
      const angle = Math.random() * Math.PI * 2;
      const height = 0.8 + Math.random() * 0.6;
      matrix.makeTranslation(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      swarm.setMatrixAt(i, matrix);
      beeColor.set(BEE_COLORS[i % BEE_COLORS.length]);
      swarm.setColorAt(i, beeColor);
    }
    swarm.instanceMatrix.needsUpdate = true;
    if (swarm.instanceColor) {
      swarm.instanceColor.needsUpdate = true;
    }
  }, [matrix, beeColor]);

  useFrame(({ clock }) => {
    const swarm = swarmRef.current;
    if (!swarm || !animationsEnabled) return;

    const t = clock.getElapsedTime();
    const count = swarm.count;
    for (let i = 0; i < count; i += 1) {
      const radius = 1.5 + Math.sin(t * 0.8 + i) * 0.4;
      const angle = (i / count) * Math.PI * 2 + t * 0.6;
      const height = 0.9 + Math.sin(t * 1.2 + i) * 0.4;
      matrix.makeTranslation(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );
      swarm.setMatrixAt(i, matrix);
    }
    swarm.instanceMatrix.needsUpdate = true;
  });

  const count = 30;

  return (
    <instancedMesh ref={swarmRef} args={[undefined, undefined, count]}>
      <capsuleGeometry args={[0.1, 0.25, 4, 8]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}

function BeeSwarmSceneInner() {
  const { animationsEnabled } = useTheme();

  return (
    <Canvas
      className="bee-swarm-canvas"
      camera={{ position: [5, 4, 6], fov: 55 }}
      shadows
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#101828"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 6, 3]} intensity={1.1} castShadow />
        <spotLight
          position={[-4, 6, -2]}
          intensity={0.7}
          angle={0.4}
          penumbra={0.5}
          castShadow
        />
        <Hive />
        <FlowerField />
        <BeeSwarm animationsEnabled={animationsEnabled} />
        {animationsEnabled && (
          <Environment preset="sunset" background={false} />
        )}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={animationsEnabled}
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
      </Suspense>
    </Canvas>
  );
}

export default function BeeSwarmScene() {
  return (
    <div className="bee-swarm-wrapper">
      <BeeSwarmSceneInner />
    </div>
  );
}
