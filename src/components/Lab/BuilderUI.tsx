import { useGameStore } from '../../store/useGameStore';
import { ProteinMatrix } from './ProteinMatrix';

export const BuilderUI = () => {
    const { setView, selectedMission, currentOrganism } = useGameStore();

    return (
        <div className="absolute inset-0">

            {/* 1. Background Image Layer - BOTTOM LAYER */}
            <img
                src="/lab_background.jpeg"
                alt="Lab Background"
                className="absolute inset-0 w-full h-full object-contain object-left"
            />


            {/* 2. The Matrix Controller - positioned over the tablet screen */}
            <div
                className="absolute pointer-events-auto"
                style={{ top: '388px', left: '362px', transform: 'translate(-50%, -50%)' }}
            >
                <ProteinMatrix />
            </div>


            {/* 3. The Right UI Panel (Analysis & Actions) */}
            <div className="absolute top-0 right-0 h-full w-[450px] bg-black/20 backdrop-blur-md border-l border-white/5 p-8 flex flex-col pointer-events-auto">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                        THE LAB
                    </h1>
                    <div className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <span>Project:</span>
                        <span className="text-white font-semibold">{selectedMission?.title || 'Unknown Protocol'}</span>
                    </div>
                </div>

                {/* Organism Status (Derived from Pulse Matrix) */}
                <div className="flex-1 space-y-8">

                    {/* Visualizer Placeholder (The 3D helix is behind everything in canvas, this is just stats text) */}
                    <div className="bg-gray-900/50 rounded-lg p-6 border border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                        <h3 className="text-lg font-bold text-white mb-4 flex justify-between">
                            <span>Analysis</span>
                            <span className="text-cyan-400 text-sm font-mono animate-pulse">LIVE</span>
                        </h3>

                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Survival Probability</span>
                                <span className="text-green-400 font-bold">
                                    {(currentOrganism.attributes.heatRes + currentOrganism.attributes.integrity + currentOrganism.attributes.filtration) / 3 > 30 ? 'HIGH' : 'CRITICAL'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Resources Used</span>
                                <span className="text-white">125 / 500 nW</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-200 leading-relaxed">
                        <strong className="block mb-1 text-blue-400">ADVISORY:</strong>
                        Use the <span className="text-white font-bold">Genetic Matrix</span> on the datapad to shape the protein's evolutionary path.
                        <br />
                        <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-400">
                            <li>Up/Down controls stability (Heat vs Cold).</li>
                            <li>Left/Right controls metabolic output (Growth vs Filtration).</li>
                        </ul>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                    <button
                        onClick={() => setView('WORLD')}
                        className="w-full py-3 rounded border border-gray-600 text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-xs"
                    >
                        Abort Sequence
                    </button>

                    <button
                        onClick={() => {
                            // Run simulation
                            setView('SIMULATION');
                            // setTimeout(() => completeMission(true), 3000); // Hacky sim for now
                        }}
                        className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.02]"
                    >
                        Initiate Deployment
                    </button>
                </div>
            </div>

        </div>
    );
};
