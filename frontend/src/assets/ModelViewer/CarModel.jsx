import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./CarModel.css";

function Car() {
  const { scene } = useGLTF("/models/ertiga.glb");
  const carRef = useRef();

  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
    }
  }, [scene]);

  // 🔥 Auto rotation
  useFrame(() => {
    if (carRef.current) {
      carRef.current.rotation.y += 0.002; // slow smooth rotation
    }
  });

  return (
    <primitive
      ref={carRef}
      object={scene}
      scale={1.5}
      position={[0, 0, 0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}

export default function CarModel() {
  return (
    <div className="car-container">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <Car />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
