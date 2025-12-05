import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MODULES } from '../../data/modules';

export const SequenceEditor = () => {
    const sequence = useGameStore(state => state.currentOrganism.sequence);
    const toggleModuleInSlot = useGameStore(state => state.toggleModuleInSlot);
    const sciencePoints = useGameStore(state => state.sciencePoints);

    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    // Split sequence into rows for visual staggering/chain effect if desired
    // For now, a simple wrapped flex container with connectors

    return (
        <div className="relative w-full max-w-4xl mx-auto pointer-events-auto">
            {/* Module Picker Overlay (when a slot is selected) */}
            {selectedSlot !== null && (
                <div className="absolute bottom-full left-0 w-full mb-4 bg-gray-900/95 border border-gray-700 rounded-xl p-4 shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                        <h3 className="text-white font-bold text-lg">Select Module for Slot {selectedSlot + 1}</h3>
                        <button
                            onClick={() => setSelectedSlot(null)}
                            className="text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {Object.values(MODULES).map((mod) => {
                            const currentMod = sequence[selectedSlot];
                            const costDiff = mod.cost - (currentMod ? currentMod.cost : 0);
                            const canAfford = sciencePoints >= costDiff;

                            return (
                                <button
                                    key={mod.id}
                                    onClick={() => {
                                        if (canAfford) {
                                            toggleModuleInSlot(selectedSlot, mod);
                                            setSelectedSlot(null);
                                        }
                                    }}
                                    disabled={!canAfford && costDiff > 0}
                                    className={`
                    flex flex-col items-center p-3 rounded-lg border w-28 shrink-0 transition-all
                    ${canAfford ? 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-white/50' : 'bg-gray-900 border-gray-800 opacity-50 cursor-not-allowed'}
                  `}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full mb-2 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                        style={{ backgroundColor: mod.color, boxShadow: `0 0 8px ${mod.color}` }}
                                    ></div>
                                    <span className="text-xs font-bold text-white mb-1">{mod.name}</span>
                                    <span className="text-[10px] text-gray-400 text-center leading-tight h-8 overflow-hidden">{mod.description}</span>
                                    <span className={`text-xs font-mono mt-2 ${costDiff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {costDiff > 0 ? `-${costDiff}` : `+${Math.abs(costDiff)}`} SP
                                    </span>
                                </button>
                            );
                        })}

                        {/* Clear Slot Option */}
                        {sequence[selectedSlot] && (
                            <button
                                onClick={() => {
                                    // Logic to clear/toggle is handled by store if passing same module, 
                                    // but we might want explicit clear. Re-using clear logic via "Empty" could be nice,
                                    // but for now let's just use the toggle or a dedicated clear button if needed.
                                    // Actually, let's just close for now, or add a specific Clear btn.
                                }}
                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-red-900/50 bg-red-900/10 hover:bg-red-900/30 w-24 shrink-0 transition-all group"
                            >
                                <span className="text-red-400 group-hover:text-red-300 text-xs font-bold">Clear Slot</span>
                            </button>
                        )}

                    </div>
                </div>
            )}

            {/* The Gene Chain */}
            <div className="flex flex-wrap justify-center items-center gap-2 p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl">
                {sequence.map((mod, i) => (
                    <div key={i} className="relative group">
                        {/* Connector Line (except for last) */}
                        {i < sequence.length - 1 && (
                            <div className="absolute top-1/2 left-full w-4 h-0.5 bg-gray-800 -z-10 -ml-1"></div>
                        )}

                        <button
                            onClick={() => setSelectedSlot(selectedSlot === i ? null : i)}
                            className={`
                w-12 h-12 flex items-center justify-center
                border-2 rotate-45 transition-all duration-300
                ${selectedSlot === i ? 'scale-110 z-10' : 'hover:scale-105'}
                ${mod
                                    ? 'border-gray-600 bg-gray-900 shadow-[0_0_15px_rgba(0,0,0,0.5)]'
                                    : 'border-gray-800 bg-black/50 hover:border-gray-600'}
              `}
                            style={mod ? { borderColor: mod.color, boxShadow: `0 0 10px ${mod.color}40` } : {}}
                        >
                            <div className="-rotate-45 flex items-center justify-center w-full h-full">
                                {mod ? (
                                    <div
                                        className="w-4 h-4 rounded-sm shadow-sm"
                                        style={{ backgroundColor: mod.color }}
                                    ></div>
                                ) : (
                                    <span className="text-gray-700 text-[10px] font-mono">{i + 1}</span>
                                )}
                            </div>
                        </button>

                        {/* Tooltip */}
                        {mod && selectedSlot !== i && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black border border-gray-700 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                {mod.name}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
