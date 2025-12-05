import { useGameStore } from '../../store/useGameStore';
import { ProteinMatrix } from './ProteinMatrix';

export const BuilderUI = () => {
    const { setView, selectedMission, currentOrganism, sciencePoints, foldingState } = useGameStore();

    // Calculate Deployment Cost based on evolution complexity
    const evolutionCost = Math.round((Math.abs(foldingState.x) + Math.abs(foldingState.y)) * 100);
    const canAfford = sciencePoints >= evolutionCost;

    return (
        <div className="absolute inset-0 flex items-center justify-center">

            {/* Centered Content Container */}
            <div className="relative flex items-center gap-16">

                {/* Left: Background Image with Matrix */}
                <div className="relative">
                    <img
                        src="/lab_background.jpeg"
                        alt="Lab Background"
                        className="h-screen w-auto object-contain"
                    />

                    {/* Matrix Controller - positioned over the tablet screen */}
                    <div
                        className="absolute pointer-events-auto"
                        style={{ top: '388px', left: '362px', transform: 'translate(-50%, -50%)' }}
                    >
                        <ProteinMatrix />
                    </div>
                </div>

                {/* Right: UI Panel */}
                <div className="w-[400px] flex flex-col gap-6 pointer-events-auto">

                    {/* Header */}
                    <div>
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

                        {/* Analysis Card */}
                        <div className="bg-gray-950/90 rounded-lg p-6 border border-white/5 shadow-2xl backdrop-blur-sm">
                            <div className="flex justify-between items-baseline mb-6">
                                <h3 className="text-xl font-bold text-white">Analysis</h3>
                                <span className="text-cyan-400 text-xs font-bold tracking-widest animate-pulse">LIVE</span>
                            </div>

                            <div className="space-y-6 font-mono text-sm">
                                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                    <span className="text-gray-400 uppercase text-xs tracking-wider">Evolution Cost</span>
                                    <span className="text-white font-bold tracking-widest">
                                        {evolutionCost} <span className="text-gray-600">/</span> <span className="text-cyan-400">{sciencePoints} SP</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Heat</div>
                                        <div className="text-red-500 font-bold text-xl">{currentOrganism.attributes.heatRes.toFixed(0)}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Integrity</div>
                                        <div className="text-blue-500 font-bold text-xl">{currentOrganism.attributes.integrity.toFixed(0)}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Filtration</div>
                                        <div className="text-purple-500 font-bold text-xl">{currentOrganism.attributes.filtration.toFixed(0)}%</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Growth</div>
                                        <div className="text-green-500 font-bold text-xl">{currentOrganism.attributes.growth.toFixed(0)}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-200 leading-relaxed">
                            <strong className="block mb-1 text-blue-400">ADVISORY:</strong>
                            Use the <span className="text-white font-bold">Genetic Matrix</span> on the datapad to shape the protein's evolutionary path.
                            <br />
                            <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-400">
                                <li>Higher specialization increases <span className="text-cyan-400">Evolution Cost</span>.</li>
                                <li>Balance your available SP budget carefully.</li>
                            </ul>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-white/10 pt-6 space-y-4">
                        <button
                            onClick={() => setView('WORLD')}
                            className="w-full py-3 rounded border border-gray-600 text-gray-400 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest text-xs"
                        >
                            Abort Sequence
                        </button>

                        <button
                            onClick={() => {
                                // Run simulation
                                if (canAfford) {
                                    setView('SIMULATION');
                                }
                            }}
                            disabled={!canAfford}
                            className={`w-full py-4 font-bold rounded uppercase tracking-[0.2em] transition-all hover:scale-[1.02] ${canAfford
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(8,145,178,0.4)]'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {canAfford ? 'Initiate Deployment' : 'Insufficient Resources'}
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};
