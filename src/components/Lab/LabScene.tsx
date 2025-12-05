import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { Float, Environment, Line } from '@react-three/drei';
import * as THREE from 'three';

const ModuleMesh = ({ type, position, color, isGhost }: { type?: string, position: [number, number, number], color?: string, isGhost?: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (meshRef.current && !isGhost) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.rotation.z += 0.005;
        }
    });

    if (isGhost) {
        return (
            <mesh position={position}>
                <sphereGeometry args={[0.2]} />
                <meshStandardMaterial color="#444" wireframe opacity={0.3} transparent />
            </mesh>
        );
    }

    return (
        <mesh ref={meshRef} position={position}>
            {type === 'TETRAHEDRON' && <tetrahedronGeometry args={[0.5]} />}
            {type === 'CUBE' && <boxGeometry args={[0.6, 0.6, 0.6]} />}
            {type === 'SPHERE' && <sphereGeometry args={[0.4]} />}
            {type === 'CYLINDER' && <cylinderGeometry args={[0.3, 0.3, 0.8]} />}
            {/* Fallback shape if type is undefined/weird */}
            {!type && <dodecahedronGeometry args={[0.4]} />}

            <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.8}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </mesh>
    );
};

export const LabScene = () => {
    const sequence = useGameStore(state => state.currentOrganism.sequence);

    // Calculate positions for the spiral
    const points = useMemo(() => {
        return sequence.map((_, i) => {
            // AlphaFold-ish Helix curve
            const t = i * 0.5;
            const radius = 2;
            const x = Math.cos(t) * radius;
            const z = Math.sin(t) * radius;
            const y = (i * 0.4) - (sequence.length * 0.2); // Center vertically
            return new THREE.Vector3(x, y, z);
        });
    }, [sequence.length]);

    return (
        <group>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <pointLight position={[-10, -5, -5]} color="#4400ff" intensity={3} />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
                <group rotation={[0.5, 0, 0]}> {/* Tilt for better view */}

                    {/* Render The Backbone Line */}
                    <Line
                        points={points}
                        color="#ffffff"
                        lineWidth={3}
                        opacity={0.2}
                        transparent
                    />

                    {/* Render Modules/Ghost Nodes */}
                    {sequence.map((mod, index) => (
                        <ModuleMesh
                            key={`node-${index}`}
                            type={mod?.type}
                            position={[points[index].x, points[index].y, points[index].z]}
                            color={mod?.color}
                            isGhost={!mod}
                        />
                    ))}
                </group>
            </Float>

            <Environment preset="city" />
        </group>
    );
};
