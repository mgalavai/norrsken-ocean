import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MISSIONS } from '../../data/oceanData';
import type { Mission } from '../../data/oceanData';
import { useGameStore } from '../../store/useGameStore';

// Helper to convert Lat/Lon to Vector3 on sphere
const latLonToVector3 = (lat: number, lon: number, radius: number): [number, number, number] => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = (radius * Math.sin(phi) * Math.sin(theta));
    const y = (radius * Math.cos(phi));
    return [x, y, z];
};

const MissionPin = ({ mission, onClick }: { mission: Mission, onClick: () => void }) => {
    const position = latLonToVector3(mission.location[0], mission.location[1], 2.05);
    const [hovered, setHover] = useState(false);

    return (
        <group position={position}>
            <mesh
                onClick={(e) => { e.stopPropagation(); onClick(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={hovered ? '#ffffff' : '#00ffff'} opacity={0.8} transparent />
            </mesh>
            {/* Animated Rings */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.1, 0.12, 32]} />
                <meshBasicMaterial color="#00ffff" side={THREE.DoubleSide} transparent opacity={0.5} />
            </mesh>
            <Html distanceFactor={10}>
                <div
                    className={`px-2 py-1 bg-black/80 border border-cyan-500/50 rounded text-[10px] text-cyan-300 whitespace-nowrap pointer-events-none transition-opacity ${hovered ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transform: 'translate3d(-50%, -150%, 0)' }}
                >
                    {mission.title}
                </div>
            </Html>
        </group>
    );
};

export const WorldScene = () => {
    const sphereRef = useRef<THREE.Mesh>(null);
    const missions = useGameStore(state => state.missions || MISSIONS);
    const setSelectedMission = (m: Mission) => useGameStore.setState({ selectedMission: m });

    useFrame(() => {
        if (sphereRef.current) {
            sphereRef.current.rotation.y += 0.0005;
        }
    });

    const earthTexture = useTexture('/earth_texture.jpg');

    return (
        <group>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff00aa" />

            {/* The Globe */}
            <mesh ref={sphereRef} rotation={[0, 0, 0.4]}> {/* Tilt */}
                <sphereGeometry args={[2, 64, 64]} />
                <meshStandardMaterial
                    map={earthTexture}
                    roughness={0.6}
                    metalness={0.1}
                />
            </mesh>

            {/* Grid Overlay for "Digital" feel */}
            <mesh rotation={[0, 0, 0.4]}>
                <sphereGeometry args={[2.01, 32, 32]} />
                <meshBasicMaterial color="#004488" wireframe={true} transparent opacity={0.1} />
            </mesh>

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
