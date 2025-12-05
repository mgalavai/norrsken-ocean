import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { SequenceEditor } from './SequenceEditor';

export const BuilderUI = () => {
    const sciencePoints = useGameStore(state => state.sciencePoints);
    const clearOrganism = useGameStore(state => state.clearOrganism);
    const setView = useGameStore(state => state.setView);
    const sequence = useGameStore(state => state.currentOrganism.sequence);

    const totalStats = useMemo(() => sequence.reduce((acc, m) => {
        if (!m) return acc;
        return {
            heatRes: acc.heatRes + m.stats.heatRes,
            structuralIntegrity: acc.structuralIntegrity + m.stats.structuralIntegrity,
            growthRate: acc.growthRate + m.stats.growthRate,
            filtration: acc.filtration + m.stats.filtration
        };
    }, { heatRes: 0, structuralIntegrity: 0, growthRate: 0, filtration: 0 }), [sequence]);

    return (
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
            {/* Header Stats */}
            <div className="flex justify-between items-start pointer-events-auto">
                <div className="bg-gray-900/95 p-4 rounded-xl border border-gray-700 text-white shadow-xl min-w-[200px]">
                    <h2 className="text-xl font-bold text-white mb-2">
                        LABORATORY
                    </h2>
                    <div className="mt-2 space-y-1 text-sm font-mono text-gray-300">
                        <p>Science Points: <span className="text-yellow-400">{sciencePoints}</span></p>
                        <div className="h-px bg-white/10 my-2"></div>
                        <p>Heat Res: <span className="text-red-400">{totalStats.heatRes}</span></p>
                        <p>Integrity: <span className="text-blue-400">{totalStats.structuralIntegrity}</span></p>
                        <p>Growth: <span className="text-green-400">{totalStats.growthRate}</span></p>
                        <p>Filtration: <span className="text-yellow-400">{totalStats.filtration}</span></p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={clearOrganism}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-lg border border-red-500/30 text-xs transition-colors"
                    >
                        Reset DNA
                    </button>
                    <button
                        onClick={() => setView('WORLD')}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
                    >
                        Back to Map
                    </button>
                </div>
            </div>

            {/* Bottom Editor Area */}
            <div className="flex flex-col items-center gap-4 pb-4">

                <SequenceEditor />

                <button
                    onClick={() => setView('SIMULATION')}
                    className="pointer-events-auto bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105 border border-green-400/50"
                >
                    DEPLOY ORGANISM
                </button>
            </div>
        </div>
    );
};
