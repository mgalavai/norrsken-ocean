import { useGameStore } from '../../store/useGameStore';
import { useEffect } from 'react';

// Alert level colors and labels
const ALERT_STYLES = {
    0: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'NO STRESS', border: 'border-green-500/30' },
    1: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'WATCH', border: 'border-yellow-500/30' },
    2: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'WARNING', border: 'border-orange-500/30' },
    3: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'ALERT L1', border: 'border-red-500/30' },
    4: { color: 'text-red-600', bg: 'bg-red-600/20', label: 'ALERT L2', border: 'border-red-600/30' }
};

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
    let alertLevel = 0;
    if (dhw >= 8) alertLevel = 4;
    else if (dhw >= 6) alertLevel = 3;
    else if (dhw >= 4) alertLevel = 2;
    else if (dhw >= 2) alertLevel = 1;

    const alertStyle = ALERT_STYLES[alertLevel as keyof typeof ALERT_STYLES];

    return (
        <div
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => useGameStore.setState({ selectedMission: null })}
        >
            <div
                className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >

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

                    {/* Header with Alert Badge */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-white tracking-tight">{selectedMission.title}</h2>
                            <div className={`px-3 py-1 rounded-full ${alertStyle.bg} ${alertStyle.border} border`}>
                                <span className={`text-xs font-bold ${alertStyle.color} uppercase tracking-wider`}>
                                    {alertStyle.label}
                                </span>
                            </div>
                        </div>
                        <div className="h-1 w-24 bg-blue-600 rounded-full"></div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-300 text-sm leading-relaxed border-l-2 border-gray-700 pl-4 py-1">
                        {selectedMission.description}
                    </p>

                    {/* Ocean Data Stats */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Ocean Conditions</h3>

                        <div className="grid grid-cols-2 gap-3">
                            {/* SST */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                                    <span className="text-xs text-gray-400 uppercase">Sea Temp</span>
                                </div>
                                <span className="text-lg font-bold text-white">{selectedMission.difficulty.temp}°C</span>
                            </div>

                            {/* DHW */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-2 h-2 rounded-full ${alertLevel >= 2 ? 'bg-orange-500' : 'bg-yellow-400'} shadow-[0_0_8px_rgba(250,204,21,0.6)]`}></div>
                                    <span className="text-xs text-gray-400 uppercase">DHW</span>
                                </div>
                                <span className="text-lg font-bold text-white">{dhw.toFixed(1)}</span>
                                <span className="text-xs text-gray-500 ml-1">weeks</span>
                            </div>

                            {/* Pollution */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></div>
                                    <span className="text-xs text-gray-400 uppercase">Pollution</span>
                                </div>
                                <span className="text-lg font-bold text-white">{selectedMission.difficulty.pollution}%</span>
                            </div>

                            {/* Acidity */}
                            <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
                                    <span className="text-xs text-gray-400 uppercase">Acidity</span>
                                </div>
                                <span className="text-lg font-bold text-white">{selectedMission.difficulty.virulence}</span>
                            </div>
                        </div>
                    </div>

                    {/* Reward Info */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-blue-400 uppercase tracking-wider mb-1">Mission Reward</div>
                                <div className="text-2xl font-bold text-white">{selectedMission.rewards} SP</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-gray-400">Severity</div>
                                <div className={`text-sm font-bold ${alertStyle.color}`}>
                                    {alertLevel === 4 ? 'CRITICAL' : alertLevel === 3 ? 'HIGH' : alertLevel === 2 ? 'MODERATE' : alertLevel === 1 ? 'LOW' : 'MINIMAL'}
                                </div>
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
