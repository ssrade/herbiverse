import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

// Loading indicator component
const LoadingIndicator = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10">
    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-white text-lg font-medium">Loading 3D Model...</p>
    <p className="text-gray-300 mt-2 text-sm">This may take a moment depending on your connection</p>
  </div>
);

// Handle WebGL Context Loss
const ContextHandler = () => {
  const { gl } = useThree();

  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault();
      console.log("WebGL context lost");
    };

    const handleContextRestored = () => {
      console.log("WebGL context restored");
    };

    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
    };
  }, [gl]);

  return null;
};

// Camera setup
const CameraSetup = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 6);
    camera.lookAt(0, 0, 0);
    camera.fov = 45;
    camera.near = 0.1;
    camera.far = 1000;
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
};

// Dispose old models to prevent memory leaks
const disposeModel = (scene) => {
  scene.traverse((child) => {
    if (child.isMesh) {
      child.geometry.dispose();
      if (child.material.isMaterial) {
        Object.values(child.material).forEach((value) => {
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        });
      }
    }
  });
};

// 3D Model Component
const Model = ({ modelPath, onLoaded }) => {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);
  const { scene } = useThree();

  useEffect(() => {
    if (gltf.scene) {
      disposeModel(scene); // Dispose previous models
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);

      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      gltf.scene.position.set(-center.x, -center.y, -center.z);
      const scaleFactor = 4 / Math.max(size.x, size.y, size.z);
      gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);

      scene.updateMatrixWorld(true);

      if (onLoaded) onLoaded();
    }

    return () => disposeModel(gltf.scene);
  }, [gltf.scene, scene, onLoaded]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
};

// Herb Model Viewer Component
const HerbModel = ({ modelPath, is3D }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasKey, setCanvasKey] = useState(0);

  useEffect(() => {
    setCanvasKey((prev) => prev + 1);
  }, [modelPath]);

  const handleModelLoaded = () => setIsLoading(false);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setCanvasKey((prev) => prev + 1);
  };

  if (!is3D) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <img src={modelPath.replace(".glb", ".jpg")} alt="2D Model" className="max-h-full max-w-full object-contain" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-800 text-white">
        <p className="mb-4">3D model could not be loaded due to a WebGL context error.</p>
        <button onClick={handleRetry} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Try Again
        </button>
        <button onClick={() => window.location.reload()} className="px-4 py-2 mt-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {isLoading && <LoadingIndicator />}

      <Canvas
        key={canvasKey}
        dpr={[1, 2]}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        onCreated={({ gl }) => {
          gl.outputEncoding = THREE.sRGBEncoding;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.5;
        }}
      >
        <CameraSetup />
        <ContextHandler />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />

        <Suspense fallback={null}>
          <Model modelPath={modelPath} onLoaded={handleModelLoaded} />
        </Suspense>

        <OrbitControls enablePan={false} enableZoom={true} minDistance={2} maxDistance={100} enableRotate={true} target={[0, 0, 0]} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default HerbModel;