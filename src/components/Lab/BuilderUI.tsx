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
                        style={{ top: '398px', left: '374px', transform: 'translate(-50%, -50%)' }}
                    >
                        <ProteinMatrix />
                    </div>
                </div>

                {/* Right: UI Panel */}
                <div className="w-[400px] flex flex-col pointer-events-auto -mt-[100px]">

                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                            THE LAB
                        </h1>
                        <div className="text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                            <span>Project:</span>
                            <span className="text-white font-semibold">{selectedMission?.title || 'Unknown Protocol'}</span>
                        </div>
                        {selectedMission && (
                            <div className="text-xs text-gray-500 leading-relaxed border-l-2 border-cyan-500/30 pl-3">
                                <div className="mb-1">
                                    <span className="text-gray-400">Challenge:</span> <span className="text-gray-300">{selectedMission.difficulty.temp}°C ocean temperature</span>
                                </div>
                                <div className="text-gray-400">
                                    Design an organism capable of surviving extreme thermal stress and restoring ecosystem balance.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Organism Status (No card wrapper) */}
                    <div className="flex-1 space-y-6 font-mono text-sm">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-gray-400 uppercase text-xs tracking-wider">Evolution Cost</span>
                            <span className="text-white font-bold tracking-widest">
                                {evolutionCost} <span className="text-gray-600">/</span> <span className="text-cyan-400">{sciencePoints} SP</span>
                            </span>
                        </div>

                        {/* Segmented Stat Bars */}
                        <div className="space-y-4">
                            {/* Heat Resistance */}
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                                    <span>Heat Resistance</span>
                                    <div className="bg-red-500/20 border border-red-500/40 px-3 py-1">
                                        <span className="text-red-400 font-bold font-mono">{currentOrganism.attributes.heatRes.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="relative h-3 bg-black/40 border border-white/20 flex">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const segmentValue = (i + 1) * 10;
                                        const isFilled = currentOrganism.attributes.heatRes >= segmentValue;
                                        return (
                                            <div key={i} className="flex-1 relative border-r border-white/10 last:border-r-0">
                                                <div className={`absolute inset-0 transition-all duration-300 ${isFilled ? 'bg-[#ef4444]' : 'bg-transparent'}`} />
                                                {i % 2 === 1 && (
                                                    <div className="absolute -bottom-2 left-0 w-px h-1 bg-white/30" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Integrity */}
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                                    <span>Structural Integrity</span>
                                    <div className="bg-orange-500/20 border border-orange-500/40 px-3 py-1">
                                        <span className="text-orange-400 font-bold font-mono">{currentOrganism.attributes.integrity.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="relative h-3 bg-black/40 border border-white/20 flex">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const segmentValue = (i + 1) * 10;
                                        const isFilled = currentOrganism.attributes.integrity >= segmentValue;
                                        return (
                                            <div key={i} className="flex-1 relative border-r border-white/10 last:border-r-0">
                                                <div className={`absolute inset-0 transition-all duration-300 ${isFilled ? 'bg-[#f97316]' : 'bg-transparent'}`} />
                                                {i % 2 === 1 && (
                                                    <div className="absolute -bottom-2 left-0 w-px h-1 bg-white/30" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Filtration */}
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                                    <span>Toxin Filtration</span>
                                    <div className="bg-purple-500/20 border border-purple-500/40 px-3 py-1">
                                        <span className="text-purple-400 font-bold font-mono">{currentOrganism.attributes.filtration.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="relative h-3 bg-black/40 border border-white/20 flex">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const segmentValue = (i + 1) * 10;
                                        const isFilled = currentOrganism.attributes.filtration >= segmentValue;
                                        return (
                                            <div key={i} className="flex-1 relative border-r border-white/10 last:border-r-0">
                                                <div className={`absolute inset-0 transition-all duration-300 ${isFilled ? 'bg-[#a855f7]' : 'bg-transparent'}`} />
                                                {i % 2 === 1 && (
                                                    <div className="absolute -bottom-2 left-0 w-px h-1 bg-white/30" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Growth */}
                            <div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 flex justify-between items-center">
                                    <span>Growth Rate</span>
                                    <div className="bg-yellow-500/20 border border-yellow-500/40 px-3 py-1">
                                        <span className="text-yellow-400 font-bold font-mono">{currentOrganism.attributes.growth.toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div className="relative h-3 bg-black/40 border border-white/20 flex">
                                    {Array.from({ length: 10 }).map((_, i) => {
                                        const segmentValue = (i + 1) * 10;
                                        const isFilled = currentOrganism.attributes.growth >= segmentValue;
                                        return (
                                            <div key={i} className="flex-1 relative border-r border-white/10 last:border-r-0">
                                                <div className={`absolute inset-0 transition-all duration-300 ${isFilled ? 'bg-[#eab308]' : 'bg-transparent'}`} />
                                                {i % 2 === 1 && (
                                                    <div className="absolute -bottom-2 left-0 w-px h-1 bg-white/30" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-white/10 pt-6 space-y-4 mt-8">
                        <button
                            onClick={() => setView('WORLD')}
                            className="w-full py-4 rounded-sm border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500/10 hover:border-cyan-500/50 hover:text-cyan-200 transition-all uppercase tracking-widest text-xs"
                        >
                            Abort Sequence
                        </button>

                        <button
                            onClick={() => {
                                if (canAfford) {
                                    setView('SIMULATION');
                                }
                            }}
                            disabled={!canAfford}
                            className={`w-full py-4 font-bold rounded-sm uppercase tracking-widest text-xs transition-all hover:scale-[1.02] ${canAfford
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
