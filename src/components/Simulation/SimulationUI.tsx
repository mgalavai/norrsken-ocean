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
            <div className="absolute inset-0 z-50 flex items-center justify-center p-8">
                <div className="max-w-2xl w-full">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className={`text-6xl font-bold mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                            {isSuccess ? 'MISSION SUCCESS' : 'MISSION FAILED'}
                        </h1>
                        <p className="text-xl text-gray-400">
                            {selectedMission?.title}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {/* Global Impact */}
                        <div className="bg-gray-900/80 border border-white/10 rounded-lg p-6">
                            <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-wider text-sm">Global Impact</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Temperature</span>
                                    <span className={globalStats.temperature < 50 ? 'text-green-400' : 'text-red-400'}>
                                        {globalStats.temperature.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Toxicity</span>
                                    <span className={globalStats.toxicity < 50 ? 'text-green-400' : 'text-red-400'}>
                                        {globalStats.toxicity.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Acidity</span>
                                    <span className={globalStats.acidity < 50 ? 'text-green-400' : 'text-red-400'}>
                                        {globalStats.acidity.toFixed(0)}%
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Extinction Risk</span>
                                    <span className={globalStats.extinctionRisk < 50 ? 'text-green-400' : 'text-red-400'}>
                                        {globalStats.extinctionRisk.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Science Points */}
                        <div className="bg-gray-900/80 border border-white/10 rounded-lg p-6">
                            <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-wider text-sm">Resources</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Evolution Cost</span>
                                    <span className="text-red-400">-{evolutionCost} SP</span>
                                </div>
                                {isSuccess && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Mission Reward</span>
                                        <span className="text-green-400">+{spGained} SP</span>
                                    </div>
                                )}
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between font-bold">
                                    <span className="text-white">Net Change</span>
                                    <span className={netSP >= 0 ? 'text-green-400' : 'text-red-400'}>
                                        {netSP >= 0 ? '+' : ''}{netSP} SP
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Message */}
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 mb-8">
                        <p className="text-blue-200 text-center">
                            {isSuccess
                                ? "The ecosystem is responding positively. Your organisms have successfully adapted and are beginning to restore balance."
                                : "The organisms failed to establish a stable colony. The environmental stressors were too severe for the current design."}
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => {
                            setView('WORLD');
                            // Clear the selected mission to close the briefing modal
                            useGameStore.setState({ selectedMission: null });
                        }}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded uppercase tracking-widest shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.02]"
                    >
                        Return to World Map
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
            {/* Top Bar Stats */}
            {/* Top Bar Stats */}
            <div className="pointer-events-auto bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-lg text-white w-full max-w-md mx-auto mt-4">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="text-gray-300 font-bold text-sm uppercase tracking-wider">Bio-Synthesis</h3>
                    <span className="text-cyan-400 font-mono font-bold">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="mt-4 font-mono text-xs text-green-400 h-20 overflow-hidden flex flex-col justify-end bg-black/50 p-2 rounded border border-gray-700/50">
                    {logs.map((log, i) => <p key={i} className="truncate">&gt; {log}</p>)}
                </div>
            </div>
        </div>
    );
};
