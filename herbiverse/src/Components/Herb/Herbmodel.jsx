import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

// Extend THREE with components from drei
// This is the key fix - we need to extend these components
import { extend } from '@react-three/fiber';
extend({ OrbitControls, PerspectiveCamera });

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

const Model = ({ modelPath }) => {
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
    }
    
    // Complete cleanup on unmount
    return () => {
      if (modelRef.current) {
        modelRef.current.position.set(0, 0, 0);
        modelRef.current.rotation.set(0, 0, 0);
        modelRef.current.scale.set(1, 1, 1);
      }
    };
  }, [gltf.scene, scene]);

  // Consistent slow rotation
  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.002;
    }
  });

  return <primitive ref={modelRef} object={gltf.scene} />;
};

const HerbModel = ({ modelPath, is3D }) => {
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

  // Key prop forces complete remount every time
  return (
    <div className="h-full w-full">
      <Canvas dpr={[1, 2]}>
        <CameraSetup />
        <ambientLight intensity={0.8} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} />

        {/* We moved the Suspense fallback outside of the Canvas */}
        <Model modelPath={modelPath} />

        {/* Use the extended component properly */}
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