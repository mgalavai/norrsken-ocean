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

        // SIMULATION LOGIC
        // Compare stats
        const orgStats = currentOrganism.modules.reduce((acc, m) => ({
            heatRes: acc.heatRes + m.stats.heatRes,
            integrity: acc.integrity + m.stats.structuralIntegrity,
            growth: acc.growth + m.stats.growthRate,
            filtration: acc.filtration + m.stats.filtration
        }), { heatRes: 0, integrity: 0, growth: 0, filtration: 0 });

        const difficulty = selectedMission?.difficulty || { temp: 0, virulence: 0, pollution: 0, currents: 0 };

        // Win Factors
        // 1. Heat check
        let survivalRate = 1.0;
        let reasons = [];

        if (orgStats.heatRes < difficulty.temp) {
            survivalRate -= 0.05; // Fast decay
            if (Math.random() > 0.8) reasons.push("Thermal damage detected...");
        }

        if (orgStats.filtration < difficulty.pollution) {
            survivalRate -= 0.02;
            if (Math.random() > 0.9) reasons.push("Toxins accumulating...");
        }

        // Base growth
        let growthSpeed = 0.5 + (orgStats.growth * 0.1);
        if (growthSpeed < 0.1) growthSpeed = 0.1;

        const interval = setInterval(() => {
            if (status !== 'RUNNING') return;

            setProgress(prev => {
                const newProgress = prev + growthSpeed;

                // Add log occasionally
                if (Math.random() > 0.9 && reasons.length > 0) {
                    setLogs(l => [...l.slice(-4), reasons[Math.floor(Math.random() * reasons.length)]]);
                } else if (Math.random() > 0.95) {
                    setLogs(l => [...l.slice(-4), "Colony expanding..."]);
                }

                if (newProgress >= 100) {
                    setStatus('SUCCESS');
                    completeMission(true);
                    clearInterval(interval);
                    return 100;
                }
                return newProgress;
            });

            // "Damage" logic simulation would go here decreasing a separate health bar
            // For MVP, we just use slow progress as "struggling"
        }, 100); // Tick 100ms

        return () => clearInterval(interval);

    }, [view, currentOrganism, selectedMission]);

    if (view === 'RESULT') {
        const isSuccess = selectedMission?.status === 'COMPLETED';
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-8">
                <div className="text-center">
                    <h1 className={`text-6xl font-bold mb-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                        {isSuccess ? 'MISSION SUCCESS' : 'MISSION FAILED'}
                    </h1>
                    <p className="text-xl text-white mb-8">
                        {isSuccess
                            ? `Ecosystem stabilizing. Earned ${selectedMission?.rewards} Science Points.`
                            : "Organism failed to adapt to environmental stressors."}
                    </p>
                    <button
                        onClick={() => setView('WORLD')}
                        className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform"
                    >
                        Return to Orbit
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
