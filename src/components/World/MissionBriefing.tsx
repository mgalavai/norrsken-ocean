// import { useRef, useState } from 'react'; // React import removed as no hooks used
import { useGameStore } from '../../store/useGameStore';

export const MissionBriefing = () => {
    const { selectedMission, selectMission } = useGameStore();

    if (!selectedMission) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-gray-900 border border-gray-600 rounded-lg max-w-md w-full p-6 shadow-2xl relative overflow-hidden">

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 relative z-10">{selectedMission.title}</h2>
                <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 to-transparent mb-4"></div>

                <p className="text-gray-300 mb-6 text-sm leading-relaxed relative z-10">
                    {selectedMission.description}
                </p>

                <div className="space-y-3 mb-6 relative z-10">
                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Environmental Threats</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="bg-black/50 p-2 rounded border border-white/5 flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span className="text-xs text-gray-300">Temp: {selectedMission.difficulty.temp}°C</span>
                        </div>
                        <div className="bg-black/50 p-2 rounded border border-white/5 flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span className="text-xs text-gray-300">Pollution: {selectedMission.difficulty.pollution}%</span>
                        </div>
                        <div className="bg-black/50 p-2 rounded border border-white/5 flex gap-2 items-center">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-xs text-gray-300">Acidity: {selectedMission.difficulty.virulence}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <button
                        onClick={() => useGameStore.setState({ selectedMission: null })} // Close
                        className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 hover:bg-white/5 transition-colors text-sm font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => selectMission(selectedMission.id)} // Store handles switch to LAB
                        className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span>Design Organism</span>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </button>
                </div>

            </div>
        </div>
    );
};
