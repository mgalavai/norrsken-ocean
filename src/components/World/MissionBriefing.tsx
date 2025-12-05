// import { useRef, useState } from 'react'; // React import removed as no hooks used
import { useGameStore } from '../../store/useGameStore';

export const MissionBriefing = () => {
    const { selectedMission, selectMission } = useGameStore();

    if (!selectedMission) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden">

                {/* Grid Background */}
                <div className="absolute inset-0 bg-gray-950/50 z-0" />
                <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mix-blend-overlay"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '30px 30px'
                    }}>
                </div>

                {/* Content Container */}
                <div className="relative z-10 p-8 space-y-6">

                    {/* Header */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">{selectedMission.title}</h2>
                        <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-gray-700 pl-4 py-1">
                        {selectedMission.description}
                    </p>

                    {/* Threats Stats */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Environmental Threats</h3>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                <span className="text-sm font-medium text-gray-200">Temp: {selectedMission.difficulty.temp}°C</span>
                            </div>

                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
                                <span className="text-sm font-medium text-gray-200">Pollution: {selectedMission.difficulty.pollution}%</span>
                            </div>

                            <div className="bg-black/40 p-3 rounded-lg border border-white/5 flex items-center gap-3 col-span-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                                <span className="text-sm font-medium text-gray-200">Acidity (pH): {selectedMission.difficulty.virulence}</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={() => useGameStore.setState({ selectedMission: null })}
                            className="flex-1 py-3.5 rounded-lg border border-gray-700 bg-transparent text-gray-400 font-medium hover:bg-white/5 hover:text-white transition-all duration-200"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={() => selectMission(selectedMission.id)}
                            className="flex-1 py-3.5 rounded-lg bg-blue-600 text-white font-bold shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:shadow-[0_4px_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            <span>Design Organism</span>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
