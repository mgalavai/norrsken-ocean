import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useGLTF, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { MISSIONS } from '../../data/oceanData';
import type { Mission } from '../../data/oceanData';
import { useGameStore } from '../../store/useGameStore';

// Helper to convert Lat/Lon to Vector3 on sphere
// Radius 2 matches the scale={2} of a standard unit sphere model
const latLonToVector3 = (lat: number, lon: number, radius: number): [number, number, number] => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return [x, y, z];
};

const MissionPin = ({ mission, onClick }: { mission: Mission, onClick: () => void }) => {
    // Exact surface radius for scale 2 is 2. 
    // We float it slightly above (2.02) to avoid z-fighting clipping
    const position = latLonToVector3(mission.location[0], mission.location[1], 2.02);
    const [hovered, setHover] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            const t = clock.getElapsedTime();
            const scale = 1 + Math.sin(t * 3) * 0.2; // Pulsate
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={position} lookAt={new THREE.Vector3(0, 0, 0)}>
            {/* The Dot */}
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[0.04, 16, 16]} />
                <meshBasicMaterial color={hovered ? '#ffffff' : '#00ffff'} toneMapped={false} />
            </mesh>

            {/* Glow Halo */}
            <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.3} toneMapped={false} />
            </mesh>

            <Html distanceFactor={10} zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
                <div
                    className={`px-2 py-1 bg-black/80 border border-cyan-500/50 rounded text-[10px] text-cyan-300 whitespace-nowrap transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transform: 'translate3d(-50%, -150%, 0)' }}
                >
                    {mission.title}
                </div>
            </Html>
        </group>
    );
};

export const WorldScene = () => {
    const missions = useGameStore(state => state.missions || MISSIONS);
    const setSelectedMission = (m: Mission) => useGameStore.setState({ selectedMission: m });
    const { scene } = useGLTF('/realistic_earth_8k.glb');

    return (
        <group>
            {/* Controls: Drag to rotate, No zoom, No Pan */}
            <OrbitControls
                enableZoom={false}
                enablePan={false}
                rotateSpeed={0.6}
                minPolarAngle={0}
                maxPolarAngle={Math.PI}
            />

            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4400ff" />

            {/* The Clean Globe Model */}
            <primitive
                object={scene}
                scale={2}
                rotation={[0, 0, 0]} // Reset rotation
            />

            {/* Pins */}
            {missions.map(mission => (
                <MissionPin
                    key={mission.id}
                    mission={mission}
                    onClick={() => setSelectedMission(mission)}
                />
            ))}
        </group>
    );
};
