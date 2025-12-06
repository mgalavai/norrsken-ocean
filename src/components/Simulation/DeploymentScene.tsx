import { useGameStore } from '../../store/useGameStore';
import { OceanWaves } from './OceanWaves';

export const DeploymentScene = () => {
    const { selectedMission } = useGameStore();

    // Environmental Effects based on Mission
    const threatColor = (selectedMission?.difficulty.temp || 0) > 25 ? '#ff4400' : '#001e36';

    return (
        <group>
            <ambientLight intensity={0.6} />
            <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={1.5} />
            <pointLight position={[-10, -5, -10]} intensity={0.3} color={threatColor} />

            {/* Animated Ocean Waves */}
            <OceanWaves />
        </group>
    );
};
