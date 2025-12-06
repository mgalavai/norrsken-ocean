import { useGameStore } from '../../store/useGameStore';
import { useEffect } from 'react';

export const MissionBriefing = () => {
    const { selectedMission, selectMission } = useGameStore();

    // ESC key to close modal
    useEffect(() => {
        if (!selectedMission) return;

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                useGameStore.setState({ selectedMission: null });
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [selectedMission]);

    if (!selectedMission) return null;

    // Calculate alert level from difficulty (reverse engineering from missionGenerator)
    const dhw = selectedMission.difficulty.virulence / 10;


    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => useGameStore.setState({ selectedMission: null })}
        >
            <div
                className="relative w-full max-w-lg bg-black/80 border border-white/10 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Grid Background */}
                <div className="absolute inset-0 bg-cyan-900/5 z-0" />
                <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-screen"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30 z-20 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30 z-20 pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 p-8 space-y-8">

                    {/* Header */}
                    <div className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase font-mono">{selectedMission.title}</h2>
                                <div className="h-1 w-24 bg-cyan-500/50 mt-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-cyan-100/80 text-sm leading-relaxed border-l-2 border-cyan-500/20 pl-4 py-1 font-mono">
                        {selectedMission.description}
                    </p>

                    {/* Ocean Data Stats */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] mb-4 border-b border-white/10 pb-2">Environmental Scan</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {/* SST */}
                            <div className="bg-white/5 p-4 rounded-sm border-l-2 border-red-500/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-sm bg-red-500"></div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Temperature</span>
                                </div>
                                <span className="text-2xl font-mono text-white">{selectedMission.difficulty.temp}°C</span>
                            </div>

                            {/* DHW */}
                            <div className="bg-white/5 p-4 rounded-sm border-l-2 border-yellow-500/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className={`w-1.5 h-1.5 rounded-sm ${dhw >= 4 ? 'bg-orange-500' : 'bg-yellow-400'}`}></div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Heat Stress</span>
                                </div>
                                <span className="text-2xl font-mono text-white">{dhw.toFixed(1)} <span className="text-xs text-gray-500">DHW</span></span>
                            </div>

                            {/* Pollution */}
                            <div className="bg-white/5 p-4 rounded-sm border-l-2 border-yellow-400/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-sm bg-yellow-400"></div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Toxicity</span>
                                </div>
                                <span className="text-2xl font-mono text-white">{selectedMission.difficulty.pollution}%</span>
                            </div>

                            {/* Acidity */}
                            <div className="bg-white/5 p-4 rounded-sm border-l-2 border-purple-500/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-sm bg-purple-500"></div>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Acidity</span>
                                </div>
                                <span className="text-2xl font-mono text-white">{selectedMission.difficulty.virulence} <span className="text-xs text-gray-500">pH-</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Reward Info */}
                    <div className="bg-cyan-900/20 border border-cyan-500/20 rounded-sm p-4 flex items-center justify-between">
                        <div>
                            <div className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1">Evolution Potential</div>
                            <div className="text-2xl font-black text-white font-mono">{selectedMission.rewards} <span className="text-sm text-cyan-500">SP</span></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex gap-4">
                        <button
                            onClick={() => useGameStore.setState({ selectedMission: null })}
                            className="flex-1 py-4 rounded-sm border border-white/10 bg-transparent text-gray-400 font-bold uppercase tracking-widest hover:bg-white/5 hover:text-white hover:border-white/30 transition-all duration-200 text-xs"
                        >
                            Abort Mission
                        </button>

                        <button
                            onClick={() => selectMission(selectedMission.id)}
                            className="flex-1 py-4 rounded-sm bg-cyan-600 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.4)] hover:bg-cyan-500 hover:shadow-[0_0_30px_rgba(8,145,178,0.6)] hover:-translate-y-0.5 transition-all duration-200 text-xs flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            <span className="relative z-10">Deploy Organism</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
