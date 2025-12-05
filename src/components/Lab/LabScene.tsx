import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { Float, Environment, Stage } from '@react-three/drei';
import * as THREE from 'three';

const ModuleMesh = ({ type, position, color }: { type: string, position: [number, number, number], color: string }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle breathing animation
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            {type === 'TETRAHEDRON' && <tetrahedronGeometry args={[0.5]} />}
            {type === 'CUBE' && <boxGeometry args={[0.7, 0.7, 0.7]} />}
            {type === 'SPHERE' && <sphereGeometry args={[0.4]} />}
            {type === 'CYLINDER' && <cylinderGeometry args={[0.3, 0.3, 0.8]} />}
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.8} />
        </mesh>
    );
};

export const LabScene = () => {
    const { currentOrganism } = useGameStore();

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Central Core */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, 0, 0]}>
                    <icosahedronGeometry args={[0.6, 1]} />
                    <meshStandardMaterial color="#ffffff" emissive="#44aaff" emissiveIntensity={0.5} wireframe={true} />
                </mesh>

                {/* Attached Modules */}
                {currentOrganism.modules.map((mod, index) => {
                    // Simple logic: stack them in a spiral for now
                    const angle = index * 1.5;
                    const radius = 1 + (index * 0.1);
                    const x = Math.cos(angle) * radius;
                    const y = (index * 0.4) - 2; // Grow downwards
                    const z = Math.sin(angle) * radius;

                    return (
                        <ModuleMesh
                            key={`${mod.id}-${index}`}
                            type={mod.type}
                            position={[x, y, z]}
                            color={mod.color}
                        />
                    );
                })}
            </Float>

            <Environment preset="city" />
        </group>
    );
};
