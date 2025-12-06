import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Float, Instances, Instance } from '@react-three/drei';

const OrganismInstance = ({ position, modules }: { position: [number, number, number], modules: any[] }) => {
    // Reconstruct the organism for the simulation view
    // In a real app we'd use instanced meshes better, but for MVP we just map local shapes
    return (
        <group position={position}>
            {/* Core */}
            <mesh>
                <icosahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial color="#ffffff" emissive="#44aaff" emissiveIntensity={0.5} />
            </mesh>
            {modules.map((mod, i) => {
                // Reuse layout logic from LabScene (should share code, but duplication is faster for hackathon)
                const angle = i * 1.5;
                const radius = 0.5 + (i * 0.1);
                const x = Math.cos(angle) * radius;
                const y = (i * 0.2) - 0.5;
                const z = Math.sin(angle) * radius;

                return (
                    <mesh key={i} position={[x, y, z]} scale={0.5}>
                        {mod.type === 'TETRAHEDRON' && <tetrahedronGeometry args={[0.5]} />}
                        {mod.type === 'CUBE' && <boxGeometry args={[0.7, 0.7, 0.7]} />}
                        {mod.type === 'SPHERE' && <sphereGeometry args={[0.4]} />}
                        {mod.type === 'CYLINDER' && <cylinderGeometry args={[0.3, 0.3, 0.8]} />}
                        <meshStandardMaterial color={mod.color} />
                    </mesh>
                )
            })}
        </group>
    )
}

export const DeploymentScene = () => {
    const { currentOrganism, selectedMission } = useGameStore();

    // Create a "colony" of organisms
    // For MVP, just random positions
    const colonyPositions = useMemo(() => {
        return Array.from({ length: 15 }).map(() => [
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 2, // Keep near floor
            (Math.random() - 0.5) * 10
        ] as [number, number, number]);
    }, []);

    // Environmental Effects based on Mission
    // e.g., if temp is high, maybe red fog or heat distortion (too complex for MVP, stick to colors)
    const threatColor = (selectedMission?.difficulty.temp || 0) > 25 ? '#ff4400' : '#001e36';

    return (
        <group>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />
            <pointLight position={[-10, -5, -10]} intensity={0.5} color={threatColor} />

            {/* Ocean Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#001122" roughness={0.8} />
            </mesh>

            {/* The Colony */}
            {colonyPositions.map((pos, i) => (
                <Float key={i} speed={1 + Math.random()} rotationIntensity={1} floatIntensity={1}>
                    <OrganismInstance position={pos} modules={currentOrganism.sequence.filter(m => m !== null)} />
                </Float>
            ))}

            {/* Particles/Plankton */}
            <Instances range={100}>
                <sphereGeometry args={[0.02]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                {Array.from({ length: 100 }).map((_, i) => (
                    <Instance
                        key={i}
                        position={[
                            (Math.random() - 0.5) * 20,
                            (Math.random() - 0.5) * 10,
                            (Math.random() - 0.5) * 20
                        ]}
                    />
                ))}
            </Instances>
        </group>
    );
};
