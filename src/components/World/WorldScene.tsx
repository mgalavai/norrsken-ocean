import { useState, useEffect } from 'react';
import { MISSIONS } from '../../data/oceanData';
import type { Mission } from '../../data/oceanData';
import { useGameStore } from '../../store/useGameStore';
import { fetchOceanTemperatureData } from '../../services/oceanDataService';
import { GlobalStatusPanel } from './GlobalStatusPanel';

// Helper: Equirectangular projection
// Map (Lat, Lon) -> (X%, Y%)
// Longitude: -180 to 180 -> 0% to 100%
// Latitude: 90 to -90 -> 0% to 100%
const getMissionStyle = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
};

const MissionPin = ({ mission, onClick }: { mission: Mission, onClick: () => void }) => {
    const [hovered, setHover] = useState(false);
    const style = getMissionStyle(mission.location[0], mission.location[1]);

    const isCompleted = mission.status === 'COMPLETED';
    const isFailed = mission.status === 'FAILED';
    const isAvailable = mission.status === 'AVAILABLE';

    // Different styles based on status
    let pinColor = 'bg-cyan-400';
    let shadowColor = 'shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    let animation = 'animate-pulse';

    if (isCompleted) {
        pinColor = 'bg-green-500';
        shadowColor = 'shadow-[0_0_10px_rgba(34,197,94,0.5)]';
        animation = ''; // No pulse for completed
    } else if (isFailed) {
        pinColor = 'bg-red-500';
        shadowColor = 'shadow-[0_0_10px_rgba(239,68,68,0.5)]';
        animation = '';
    }

    return (
        <div
            className={`absolute -translate-x-1/2 -translate-y-1/2 group ${isAvailable ? 'cursor-pointer z-10' : 'cursor-default z-0 opacity-60'}`}
            style={style}
            onClick={(e) => {
                e.stopPropagation();
                if (isAvailable) onClick();
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* The Dot */}
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${pinColor} ${shadowColor} ${animation} ${hovered && isAvailable ? 'scale-125 bg-white' : ''}`} />

            {/* Ripple/Sonar Effect (Only for Available) */}
            {isAvailable && (
                <div className="absolute top-0 left-0 w-3 h-3 rounded-full border border-cyan-500 animate-ping opacity-75" />
            )}

            {/* Status Icon Overlay (for Colorblindness/Clarify) */}
            {isCompleted && <div className="absolute -top-4 -right-1 text-[8px] text-green-400 font-bold">✓</div>}
            {isFailed && <div className="absolute -top-4 -right-1 text-[8px] text-red-500 font-bold">✕</div>}

            {/* Tooltip */}
            {(hovered || isAvailable) && (
                <div className={`
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 
                    bg-black/90 border rounded text-xs whitespace-nowrap pointer-events-none transition-all duration-200 
                    ${isCompleted ? 'border-green-500/30 text-green-100' : isFailed ? 'border-red-500/30 text-red-100' : 'border-cyan-500/30 text-cyan-100'}
                    ${hovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'}
                `}>
                    {mission.title}
                    <span className="opacity-50 ml-2 text-[10px] uppercase">[{mission.status}]</span>
                </div>
            )}
        </div>
    );
};

export const WorldScene = () => {
    const missions = useGameStore(state => state.missions || MISSIONS);
    const setSelectedMission = (m: Mission) => useGameStore.setState({ selectedMission: m });

    // Fetch NASA ocean data on mount and generate missions
    useEffect(() => {
        console.log('🌊 WorldScene mounted - fetching ocean data...');

        // Load dynamic missions from ocean data
        const loadDynamicMissions = useGameStore.getState().loadDynamicMissions;
        loadDynamicMissions().then(() => {
            console.log('✅ Dynamic missions loaded');
        });

        // Also fetch and log raw ocean data for debugging
        fetchOceanTemperatureData().then(data => {
            console.log('📊 Ocean Data Retrieved:', data);
            console.table(data.map(d => ({
                Location: d.location,
                SST: `${d.sst}°C`,
                Anomaly: `${d.sstAnomaly > 0 ? '+' : ''}${d.sstAnomaly}°C`,
                Alert: d.bleachingAlert,
                DHW: d.dhw,
                Source: d.dataSource
            })));
        });
    }, []);

    return (
        <div className="w-full h-full bg-gray-950 flex items-center justify-center overflow-hidden relative selection:bg-none select-none">

            <GlobalStatusPanel />

            {/* Map Container - Aspect Ratio 2:1 (Equirectangular) */}
            <div className="relative w-full aspect-[2/1] bg-black/50 border border-white/5 shadow-2xl rounded-sm overflow-hidden group">

                {/* Background Map Image */}
                <img
                    src="/flat_world_map.png"
                    alt="World Map"
                    className="w-full h-full object-cover opacity-80"
                    draggable={false}
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 border border-cyan-900/20 pointer-events-none"></div>

                {/* Pins Layer */}
                {missions.map(mission => (
                    <MissionPin
                        key={mission.id}
                        mission={mission}
                        onClick={() => setSelectedMission(mission)}
                    />
                ))}

            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
        </div>
    );
};
