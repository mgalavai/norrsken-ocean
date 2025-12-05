import React, { Suspense } from 'react';
import { LabScene } from './components/Lab/LabScene';
import { BuilderUI } from './components/Lab/BuilderUI';
import { WorldScene } from './components/World/WorldScene';
import { MissionBriefing } from './components/World/MissionBriefing';
import { DeploymentScene } from './components/Simulation/DeploymentScene';
import { SimulationUI } from './components/Simulation/SimulationUI';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store/useGameStore';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';

function App() {
  const { view, currentOrganism } = useGameStore();

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      {/* GLOBAL UI or Overlay could go here */}

      {view === 'LAB' && (
        <>
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
            <color attach="background" args={['#050510']} />
            <Suspense fallback={null}>
              <LabScene />
            </Suspense>
            <OrbitControls minDistance={4} maxDistance={15} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          </Canvas>
          <BuilderUI />
        </>
      )}

      {view === 'WORLD' && (
        <>
          {/* Explicitly force full viewport for World Scene */}
          <div className="fixed inset-0 w-full h-full z-10 bg-gray-950 flex items-center justify-center">
            <WorldScene />
          </div>
          <MissionBriefing />
        </>
      )}

      {view === 'SIMULATION' && (
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

      {view === 'RESULT' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {/* Reuse SimulationUI for result mostly, or dedicated component. Logic inside SimUI handles it for now. */}
          <SimulationUI />
        </div>
      )}
    </div>
  );
}

export default App;
