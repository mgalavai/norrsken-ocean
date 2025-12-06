import { Suspense } from 'react';
import { BuilderUI } from './components/Lab/BuilderUI';
import { WorldScene } from './components/World/WorldScene';
import { MissionBriefing } from './components/World/MissionBriefing';
import { DeploymentScene } from './components/Simulation/DeploymentScene';
import { SimulationUI } from './components/Simulation/SimulationUI';
import { MainMenu } from './components/UI/MainMenu';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store/useGameStore';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

function App() {
  const { view } = useGameStore();

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* GLOBAL UI or Overlay could go here */}

      {view === 'LAB' && (
        <BuilderUI />
      )}

      {view === 'MENU' && <MainMenu />}

      {(view === 'WORLD' || view === 'MENU') && (
        <>
          {/* Explicitly force full viewport for World Scene */}
          <div className="fixed inset-0 w-full h-full z-10 bg-gray-950 flex items-center justify-center">
            <WorldScene />
          </div>
        </>
      )}

      {view === 'WORLD' && (
        <MissionBriefing />
      )}

      {(view === 'SIMULATION' || view === 'RESULT') && (
        <>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
            <color attach="background" args={['#001e36']} /> {/* Deep Ocean Blue */}
            <fog attach="fog" args={['#001e36', 5, 20]} />
            <Suspense fallback={null}>
              <DeploymentScene />
            </Suspense>
            <OrbitControls maxPolarAngle={Math.PI / 2} minDistance={2} maxDistance={15} />
          </Canvas>
          <SimulationUI />
        </>
      )}
    </div>
  );
}

export default App;
