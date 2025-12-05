import { useMemo } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { MODULES } from '../../data/modules';

export const BuilderUI = () => {
    const sciencePoints = useGameStore(state => state.sciencePoints);
    const addModule = useGameStore(state => state.addModule);
    const clearOrganism = useGameStore(state => state.clearOrganism);
    const setView = useGameStore(state => state.setView);
    const modules = useGameStore(state => state.currentOrganism.modules);

    const totalStats = useMemo(() => modules.reduce((acc, m) => ({
        heatRes: acc.heatRes + m.stats.heatRes,
        structuralIntegrity: acc.structuralIntegrity + m.stats.structuralIntegrity,
        growthRate: acc.growthRate + m.stats.growthRate,
        filtration: acc.filtration + m.stats.filtration
    }), { heatRes: 0, structuralIntegrity: 0, growthRate: 0, filtration: 0 }), [modules]);

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

                <button
                    onClick={() => setView('WORLD')}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
                >
                    Back to Map
                </button>
            </div>

            {/* Module Palette */}
            <div className="flex gap-4 items-end pointer-events-auto overflow-x-auto pb-4">
                {Object.values(MODULES).map((mod) => (
                    <button
                        key={mod.id}
                        onClick={() => addModule(mod)}
                        disabled={sciencePoints < mod.cost}
                        className={`
              group relative flex flex-col items-center bg-gray-900/90 hover:bg-gray-800 
              p-3 rounded-xl border border-gray-700 w-32 transition-all hover:-translate-y-2
              ${sciencePoints < mod.cost ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/50 cursor-pointer'}
            `}
                    >
                        <div className="w-12 h-12 mb-2 rounded-full border border-gray-600 flex items-center justify-center relative overflow-hidden bg-black">
                            <div style={{ backgroundColor: mod.color }} className="w-6 h-6 opacity-80 blur-sm absolute"></div>
                            <div style={{ backgroundColor: mod.color }} className="w-4 h-4 relative z-10 rounded-sm"></div>
                        </div>
                        <span className="font-bold text-xs text-white mb-1">{mod.name}</span>
                        <span className="text-[10px] text-gray-300 text-center leading-tight mb-2 h-8">{mod.description}</span>
                        <span className="text-xs font-mono text-yellow-400">{mod.cost} SP</span>
                    </button>
                ))}

                <div className="w-px bg-white/20 h-24 mx-2"></div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={clearOrganism}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-200 px-4 py-2 rounded-lg border border-red-500/30 text-xs transition-colors"
                    >
                        Clear
                    </button>
                    <button
                        onClick={() => setView('SIMULATION')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                    >
                        DEPLOY
                    </button>
                </div>
            </div>
        </div>
    );
};
