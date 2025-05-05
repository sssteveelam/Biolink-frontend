// src/components/home/ThreeBackground.jsx
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Torus } from "@react-three/drei"; // Dùng component có sẵn cho tiện
import * as THREE from "three";

// Component cho một hình khối bay lơ lửng
function FloatingShape({ initialPosition, color, shapeType }) {
  const meshRef = useRef();
  const timeRef = useRef(Math.random() * 10000); // Thời gian ngẫu nhiên để các shape không đồng bộ

  // Dùng useMemo để geometry và material không tạo lại mỗi frame
  const geometry = useMemo(() => {
    const size = Math.random() * 1.5 + 0.8; // Kích thước ngẫu nhiên nhỏ hơn chút
    if (shapeType === 0) return new THREE.SphereGeometry(size, 16, 16);
    if (shapeType === 1)
      return new THREE.BoxGeometry(size * 1.2, size * 1.2, size * 1.2);
    return new THREE.TorusGeometry(size, size * 0.3, 16, 32);
  }, [shapeType]);

  const material = useMemo(
    () =>
      new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.7, // Tăng opacity chút
        shininess: 80,
      }),
    [color]
  );

  // Animation loop cho từng shape
  useFrame((state, delta) => {
    if (meshRef.current) {
      timeRef.current += delta * 0.5; // Tốc độ animation chậm hơn
      const speedFactor = 0.5; // Giảm tốc độ chung
      // Float nhẹ nhàng hơn
      meshRef.current.position.y =
        initialPosition.y + Math.sin(timeRef.current * speedFactor) * 2;
      meshRef.current.position.x =
        initialPosition.x + Math.cos(timeRef.current * speedFactor * 0.8) * 1.5; // Thêm chút di chuyển ngang

      // Rotate chậm
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={initialPosition}
      geometry={geometry}
      material={material}
    />
  );
}

// Component chính chứa Canvas 3D
function ThreeBackground() {
  const shapes = useMemo(() => {
    const colors = [0x6366f1, 0x8b5cf6, 0xec4899, 0x10b981, 0x3b82f6];
    const tempShapes = [];
    for (let i = 0; i < 25; i++) {
      // Tăng số lượng shapes
      const shapeType = Math.floor(Math.random() * 3);
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 60, // Phân bố rộng hơn
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 60 - 20 // Đẩy ra xa hơn chút
      );
      const color = colors[Math.floor(Math.random() * colors.length)];
      tempShapes.push({ id: i, position, color, shapeType });
    }
    return tempShapes;
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 35], fov: 60 }} // Điều chỉnh camera
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.1,
      }}
      gl={{ alpha: true, antialias: true }} // Cho phép nền trong suốt và khử răng cưa
    >
      <ambientLight intensity={0.6} /> {/* Ánh sáng môi trường */}
      <directionalLight position={[5, 5, 5]} intensity={1} />{" "}
      {/* Ánh sáng hướng */}
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.5}
        color="#ffffff"
      />{" "}
      {/* Thêm point light */}
      {shapes.map((shape) => (
        <FloatingShape
          key={shape.id}
          initialPosition={shape.position}
          color={shape.color}
          shapeType={shape.shapeType}
        />
      ))}
    </Canvas>
  );
}

export default ThreeBackground;
