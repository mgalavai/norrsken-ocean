import { useGameStore } from '../../store/useGameStore';

export const GlobalStatusPanel = () => {
    const stats = useGameStore(state => state.globalStats);

    const StatBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
        <div className="flex flex-col gap-1 w-full max-w-[200px]">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-400 font-mono">
                <span>{label}</span>
                <span className={value > 80 ? 'text-red-500 animate-pulse' : 'text-gray-300'}>{value}%</span>
            </div>
            <div className="h-2 w-full bg-gray-900 border border-gray-700/50 rounded-sm overflow-hidden">
                <div
                    className="h-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${value}%`, backgroundColor: color }}
                >
                    {/* Glossy shine */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-white/30"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="absolute top-0 left-0 w-full z-20 pointer-events-none">
            {/* Glass Panel Container */}
            <div className="container mx-auto mt-4 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl flex justify-between items-center gap-8 pointer-events-auto">

                <div className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] border-r border-white/10 pr-6">
                    Planet Status
                </div>

                <div className="flex flex-1 justify-between gap-8">
                    <StatBar label="Temperature" value={stats.temperature} color="#ef4444" /> {/* Red */}
                    <StatBar label="Toxicity" value={stats.toxicity} color="#a855f7" />    {/* Purple */}
                    <StatBar label="Acidity (pH)" value={stats.acidity} color="#eab308" />   {/* Yellow */}
                    <StatBar label="Extinction Risk" value={stats.extinctionRisk} color="#f97316" /> {/* Orange */}
                </div>

                {/* Science Points (Moved here for better dashboard feel) */}
                <div className="text-right border-l border-white/10 pl-6">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Research Budget</div>
                    <div className="text-xl font-mono text-cyan-400">{useGameStore(state => state.sciencePoints)} SP</div>
                </div>

            </div>

            {/* Critical Warning if any stat is critical */}
            {(stats.temperature > 80 || stats.toxicity > 80) && (
                <div className="w-full text-center mt-2 animate-pulse">
                    <span className="text-red-500 font-mono bg-black/80 px-4 py-1 rounded border border-red-500/50">
                        ⚠️ CRITICAL PLANETARY INSTABILITY DETECTED
                    </span>
                </div>
            )}
        </div>
    );
};
