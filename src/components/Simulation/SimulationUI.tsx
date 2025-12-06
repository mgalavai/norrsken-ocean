import { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const SimulationUI = () => {
    const {
        selectedMission,
        currentOrganism,
        completeMission,
        setView,
        view
    } = useGameStore();

    const [progress, setProgress] = useState(0); // 0-100
    const [status, setStatus] = useState<'RUNNING' | 'SUCCESS' | 'FAILURE'>('RUNNING');
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        if (view !== 'SIMULATION') return;

        const timeouts: number[] = [];

        // Reset state
        setProgress(0);
        setStatus('RUNNING');
        setLogs(['Deploying organisms...']);

        // SIMULATION LOGIC
        const orgStats = currentOrganism.attributes;
        const difficulty = selectedMission?.difficulty || { temp: 0, virulence: 0, pollution: 0, currents: 0 };

        // Calculate success probability based on stat matching
        let survivalScore = 100;
        const requirements: { stat: string; value: number; orgValue: number }[] = [
            { stat: 'Temperature', value: Math.max(0, (difficulty.temp - 20) * 6.6), orgValue: orgStats.heatRes },
            { stat: 'Acidity', value: difficulty.virulence, orgValue: orgStats.integrity },
            { stat: 'Pollution', value: difficulty.pollution, orgValue: orgStats.filtration },
            { stat: 'Currents', value: difficulty.currents, orgValue: orgStats.growth }
        ];

        // Check each requirement
        requirements.forEach(req => {
            const deficit = req.value - req.orgValue;
            if (deficit > 0) {
                survivalScore -= deficit * 1.0; // Stricter penalty: 1% score loss per 1% deficit
                timeouts.push(window.setTimeout(() => {
                    setLogs(l => [...l.slice(-4), `⚠ ${req.stat} stress detected (${req.value}% vs ${req.orgValue.toFixed(0)}%)`]);
                }, Math.random() * 2000));
            } else {
                timeouts.push(window.setTimeout(() => {
                    setLogs(l => [...l.slice(-4), `✓ ${req.stat} adaptation successful`]);
                }, Math.random() * 2000));
            }
        });

        const willSucceed = survivalScore > 30; // Need at least 30% survival score
        const growthSpeed = willSucceed ? 2 : 0.5; // Faster if successful

        const interval = setInterval(() => {
            if (status !== 'RUNNING') return;

            setProgress(prev => {
                const newProgress = prev + growthSpeed;

                // Add progress logs
                if (Math.random() > 0.92) {
                    const messages = willSucceed
                        ? ['Colony expanding...', 'Reproduction stable...', 'Ecosystem integration positive...']
                        : ['Growth slowing...', 'Stress markers elevated...', 'Adaptation struggling...'];
                    setLogs(l => [...l.slice(-4), messages[Math.floor(Math.random() * messages.length)]]);
                }

                if (newProgress >= 100) {
                    setStatus(willSucceed ? 'SUCCESS' : 'FAILURE');
                    completeMission(willSucceed);
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });
        }, 100); // Tick every 100ms

        return () => {
            clearInterval(interval);
            timeouts.forEach(clearTimeout);
        };
    }, [view, currentOrganism, selectedMission, completeMission, status]);

    if (view === 'RESULT') {
        const isSuccess = selectedMission?.status === 'COMPLETED';
        const { globalStats, foldingState } = useGameStore.getState();
        const evolutionCost = Math.round((Math.abs(foldingState.x) + Math.abs(foldingState.y)) * 100);
        const spGained = isSuccess ? (selectedMission?.rewards || 0) : 0;
        const netSP = spGained - evolutionCost;

        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
                <div className="max-w-3xl w-full bg-black/80 border border-white/10 p-8 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">

                    {/* Grid Background Effect */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                            backgroundSize: '30px 30px'
                        }}>
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-cyan-500/30 z-20 pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyan-500/30 z-20 pointer-events-none"></div>

                    {/* Relative Content */}
                    <div className="relative z-10">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <h1 className={`text-6xl font-black tracking-tighter mb-4 ${isSuccess ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                                {isSuccess ? 'PROTOCOL SUCCESS' : 'PROTOCOL FAILURE'}
                            </h1>
                            <div className="flex items-center justify-center gap-4">
                                <div className="h-px w-12 bg-gray-500"></div>
                                <p className="text-xl text-cyan-100 font-mono tracking-widest uppercase">
                                    {selectedMission?.title}
                                </p>
                                <div className="h-px w-12 bg-gray-500"></div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            {/* Global Impact */}
                            <div className="bg-white/5 border-l-2 border-cyan-500/30 p-6 rounded-sm">
                                <h3 className="text-cyan-400 font-bold mb-6 uppercase tracking-[0.2em] text-xs border-b border-white/10 pb-2">Global Impact</h3>
                                <div className="space-y-4 text-sm font-mono">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider text-xs">Temperature</span>
                                        <span className={`font-bold ${globalStats.temperature < 50 ? 'text-green-400' : 'text-red-400'}`}>
                                            {globalStats.temperature.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider text-xs">Toxicity</span>
                                        <span className={`font-bold ${globalStats.toxicity < 50 ? 'text-green-400' : 'text-red-400'}`}>
                                            {globalStats.toxicity.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider text-xs">Acidity</span>
                                        <span className={`font-bold ${globalStats.acidity < 50 ? 'text-green-400' : 'text-red-400'}`}>
                                            {globalStats.acidity.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider text-xs">Extinction Risk</span>
                                        <span className={`font-bold ${globalStats.extinctionRisk < 50 ? 'text-green-400' : 'text-red-400'}`}>
                                            {globalStats.extinctionRisk.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Science Points */}
                            <div className="bg-white/5 border-l-2 border-purple-500/30 p-6 rounded-sm">
                                <h3 className="text-purple-400 font-bold mb-6 uppercase tracking-[0.2em] text-xs border-b border-white/10 pb-2">Resource Analysis</h3>
                                <div className="space-y-4 text-sm font-mono">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider text-xs">Evolution Cost</span>
                                        <span className="text-red-400">-{evolutionCost} SP</span>
                                    </div>
                                    {isSuccess && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400 uppercase tracking-wider text-xs">Mission Reward</span>
                                            <span className="text-green-400">+{spGained} SP</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-white/10 my-2"></div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span className="text-white uppercase tracking-wider text-xs self-center">Net Change</span>
                                        <span className={netSP >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {netSP >= 0 ? '+' : ''}{netSP} SP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Summary Message */}
                        <div className={`p-6 mb-8 border-l-4 ${isSuccess ? 'bg-green-900/10 border-green-500/50' : 'bg-red-900/10 border-red-500/50'}`}>
                            <p className={`${isSuccess ? 'text-green-200' : 'text-red-200'} text-center font-mono text-sm leading-relaxed`}>
                                {isSuccess
                                    ? ">> SIMULATION COMPLETE: ECOSYSTEM STABILIZED. ADAPTATION SUCCESSFUL. SPECIES INTEGRATION CONFIRMED."
                                    : ">> SIMULATION FAILED: CRITICAL SYSTEM STRESS. ORGANISM VIABILITY UNSUSTAINABLE. ABORTING PROTOCOL."}
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={() => {
                                setView('WORLD');
                                // Clear the selected mission to close the briefing modal
                                useGameStore.setState({ selectedMission: null });
                            }}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-5 rounded-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.01] text-xs relative overflow-hidden group"
                        >
                            <span className="relative z-10">Return to World Map</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Bar Stats */}
            <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 p-6 rounded-sm shadow-[0_0_30px_rgba(0,0,0,0.5)] text-white w-full max-w-md mx-auto mt-8 relative overflow-hidden group">

                {/* Decorative border matching Menu */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-cyan-500/50"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-cyan-500/50"></div>

                <div className="flex justify-between items-end mb-4 relative z-10">
                    <div>
                        <h3 className="text-cyan-400 font-bold text-xs uppercase tracking-[0.2em] mb-1">Status Protocol</h3>
                        <div className="text-xl font-black font-mono tracking-tighter">BIO-SYNTHESIS</div>
                    </div>
                    <span className="text-white font-mono font-bold text-2xl">{Math.round(progress)}<span className="text-sm text-gray-500 ml-1">%</span></span>
                </div>

                {/* Segmented Progress Bar */}
                <div className="w-full bg-black/50 h-2 border border-white/10 flex gap-0.5 p-0.5 mb-4 relative z-10">
                    <div
                        className="h-full bg-cyan-500 shadow-[0_0_10px_#22d3ee] transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Console Logs */}
                <div className="font-mono text-[10px] space-y-1 h-24 overflow-hidden flex flex-col justify-end relative z-10">
                    {logs.map((log, i) => (
                        <p key={i} className="truncate text-cyan-200/80 border-l border-cyan-500/20 pl-2 animate-in fade-in slide-in-from-left-2 duration-300">
                            <span className="text-cyan-500 mr-2">&gt;</span>{log}
                        </p>
                    ))}
                </div>

                {/* Grid Background Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none z-0"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}>
                </div>
            </div>
        </div>
    );
};
