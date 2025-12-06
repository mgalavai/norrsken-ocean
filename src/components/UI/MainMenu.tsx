import { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';

export const MainMenu = () => {
    const { resetGame, setView, hasStarted } = useGameStore();
    const [showAbout, setShowAbout] = useState(false);

    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm">
            {/* Background Gradient Mesh Effect (Subtle) */}
            <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Main Title Container */}
            <div className="mb-20 text-center relative z-10">
                <div className="inline-block relative">
                    {/* Decorative Brackets around Title */}
                    <div className="absolute -top-6 -left-8 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50"></div>
                    <div className="absolute -bottom-6 -right-8 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50"></div>

                    <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-400 tracking-tighter mb-2 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        BIO-ARCHITECT
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-cyan-500/60 font-mono text-sm tracking-[0.4em] uppercase">
                        <span className="h-px w-12 bg-cyan-900"></span>
                        <span>Global Restoration Initiative</span>
                        <span className="h-px w-12 bg-cyan-900"></span>
                    </div>
                </div>
            </div>

            {/* Menu Buttons */}
            <div className="flex flex-col gap-5 w-full max-w-sm relative z-10">

                {/* Continue Game (Only if game has started) */}
                <button
                    onClick={() => setView('WORLD')}
                    disabled={!hasStarted}
                    className={`
                        group relative w-full py-5 px-8 rounded-sm overflow-hidden transition-all duration-300 border
                        ${hasStarted
                            ? 'bg-black/40 border-cyan-500/30 text-white hover:bg-cyan-900/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer'
                            : 'bg-black/20 border-white/5 text-gray-700 cursor-not-allowed grayscale opacity-50'
                        }
                    `}
                >
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-sm font-bold tracking-[0.2em] uppercase">Resume Session</span>
                        {hasStarted && <span className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-widest">Protocol Active</span>}
                    </div>
                    {/* Hover Effect */}
                    {hasStarted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    )}
                </button>

                {/* New Game */}
                <button
                    onClick={resetGame}
                    className="
                        group relative w-full py-5 px-8 bg-cyan-600 hover:bg-cyan-500 rounded-sm shadow-[0_0_25px_rgba(8,145,178,0.4)] 
                        transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(8,145,178,0.6)]
                        text-white border border-cyan-400/50
                    "
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-black tracking-[0.15em] uppercase">Initialize Protocol</span>
                        <span className="text-[10px] text-cyan-100/60 font-mono uppercase tracking-widest">New Simulation Sequence</span>
                    </div>
                </button>

                {/* About */}
                <button
                    onClick={() => setShowAbout(true)}
                    className="
                        w-full py-4 px-8 rounded-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5
                        transition-all duration-300 text-xs uppercase tracking-[0.2em] font-bold mt-4
                    "
                >
                    System Information
                </button>
            </div>

            {/* Version Footer */}
            <div className="absolute bottom-8 right-8 text-[10px] text-cyan-900/50 font-mono tracking-widest">
                v0.9.2-BETA // NORRSKEN :: SYSTEM_READY
            </div>

            {/* About Modal */}
            {showAbout && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setShowAbout(false)}
                >
                    <div
                        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-2xl w-full p-10 relative shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-3xl font-bold text-white mb-6">System Information</h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                <strong className="text-cyan-400">Bio-Architect</strong> is a simulation platform designed to reconstruct planetary ecosystems heavily damaged by climate collapse.
                            </p>
                            <p>
                                As the lead Bio-Architect, your mission is to use the <span className="font-mono text-xs bg-gray-800 p-1 rounded border border-gray-700">Protein Matrix</span> to synthesize novel organisms capable of surviving extreme environments and restoring ecological balance.
                            </p>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-800">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Designed By</h4>
                                    <p className="text-white">Antigravity Agent</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Framework</h4>
                                    <p className="text-white">React + Three.js + Zustand</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Data Sources (Real-time)</h4>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                                        <span className="text-white">NASA JPL MUR SST</span> (Sea Surface Temperature)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                                        <span className="text-white">NOAA Coral Reef Watch</span> (Bleaching Alerts)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                                        <span className="text-white">GEBCO</span> (Bathymetry & Ocean Features)
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAbout(false)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
