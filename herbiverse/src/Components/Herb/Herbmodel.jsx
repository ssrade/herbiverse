import React, { useRef, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

// Extend THREE with components from drei
import { extend } from '@react-three/fiber';
extend({ OrbitControls, PerspectiveCamera });

// Loading indicator component
const LoadingIndicator = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-10">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-white text-lg font-medium">Loading 3D Model...</p>
      <p className="text-gray-300 mt-2 text-sm">This may take a moment depending on your connection</p>
    </div>
  );
};

// Context loss handler
const ContextHandler = () => {
  const { gl } = useThree();
  
  useEffect(() => {
    // Handle context loss
    const handleContextLost = (event) => {
      console.log("WebGL context lost, preventing default");
      event.preventDefault();
    };
    
    // Handle context restoration
    const handleContextRestored = () => {
      console.log("WebGL context restored");
      gl.initTexture(); // Reinitialize textures
      gl.renderLists.dispose(); // Clear render lists
    };
    
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);
  
  return null;
};

// Fixed camera setup with consistent parameters
const CameraSetup = () => {
  const { camera, gl } = useThree();
  
  useEffect(() => {
    // Force reset camera position on every mount
    camera.position.set(0, 2, 6);
    camera.fov = 45;
    camera.near = 0.1;
    camera.far = 1000;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    
    // Clear any cached renderer state
    gl.setPixelRatio(window.devicePixelRatio);
    
    return () => {
      // Clean up to prevent state persistence
      camera.position.set(0, 0, 0);
      camera.rotation.set(0, 0, 0);
      camera.updateProjectionMatrix();
    };
  }, [camera, gl]);
  
  return null;
};

const Model = ({ modelPath, onLoaded }) => {
  const modelRef = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);
  const { scene } = useThree();

  useEffect(() => {
    if (gltf.scene) {
      // Reset entire scene first to avoid state persistence
      scene.children.forEach(child => {
        if (child.type === "Group") {
          child.position.set(0, 0, 0);
          child.rotation.set(0, 0, 0);
          child.scale.set(1, 1, 1);
        }
      });
      
      // Reset model properties explicitly
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.scale.set(1, 1, 1);
      
      // Recalculate bounding box
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Apply consistent centering
      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;

      // Apply FIXED scale - using the exact same value every time
      const maxDim = Math.max(size.x, size.y, size.z);
      const absoluteScale = 4; // Fixed absolute scale value
      const fixedScale = absoluteScale / maxDim;
      gltf.scene.scale.set(fixedScale, fixedScale, fixedScale);
      
      // Force update matrices
      gltf.scene.updateMatrix();
      scene.updateMatrixWorld(true);
      
      // Signal that the model has loaded
      if (onLoaded) {
        onLoaded();
      }
    }
    
    // Complete cleanup on unmount
    return () => {
      if (modelRef.current) {
        modelRef.current.position.set(0, 0, 0);
        modelRef.current.rotation.set(0, 0, 0);
        modelRef.current.scale.set(1, 1, 1);
      }
    };
  }, [gltf.scene, scene, onLoaded]);

  // Consistent slow rotation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
};

const HerbModel = ({ modelPath, is3D }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Key for forcing remount
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Start a timeout to show an extended loading message if loading takes too long
  useEffect(() => {
    if (is3D && isLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 8000); // Show additional message after 8 seconds
      
      return () => clearTimeout(timer);
    }
  }, [is3D, isLoading]);

  // Handle errors in the Canvas
  const handleError = (error) => {
    console.error("THREE.js Error:", error);
    setHasError(true);
    setIsLoading(false);
  };

  // Handle model loaded
  const handleModelLoaded = () => {
    setIsLoading(false);
  };

  // Try to recover from errors
  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setLoadingTimeout(false);
    setKey(prevKey => prevKey + 1); // Force remount of Canvas
  };

  if (!is3D) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <img
          src={modelPath.replace(".glb", ".jpg")}
          alt="2D Model"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-800 text-white">
        <p className="mb-4">3D model could not be loaded due to a WebGL context error.</p>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 mt-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <LoadingIndicator />
      )}
      
      {/* Extended loading message */}
      {isLoading && loadingTimeout && (
        <div className="absolute bottom-4 left-0 right-0 bg-yellow-600 text-white p-2 text-center mx-4 rounded">
          The model is taking longer than expected to load. This could be due to a large file size or slow connection.
        </div>
      )}

<Canvas 
  key={key} 
  dpr={[1, 2]} 
  onCreated={({ gl }) => {
    gl.powerPreference = 'high-performance';
    gl.outputEncoding = THREE.sRGBEncoding;
    gl.toneMapping = THREE.ACESFilmicToneMapping;  // Enhanced brightness & contrast
    gl.toneMappingExposure = 1.5;  // Boost visibility
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }}
  onError={handleError}
>

        <CameraSetup />
        <ContextHandler /> {/* Add context handler */}
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />

        <Suspense fallback={null}>
          <Model modelPath={modelPath} onLoaded={handleModelLoaded} />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          enableZoom={true} 
          minDistance={2}
          maxDistance={100}
          enableRotate={true} 
          target={[0, 0, 0]}
          makeDefault
        />

        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default HerbModel;