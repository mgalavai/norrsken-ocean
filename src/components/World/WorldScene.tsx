import { useState, useEffect } from 'react';
import { MISSIONS } from '../../data/oceanData';
import type { Mission } from '../../data/oceanData';
import { useGameStore } from '../../store/useGameStore';
import { fetchOceanTemperatureData } from '../../services/oceanDataService';

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

    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={style}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {/* The Dot */}
            <div className={`w-3 h-3 rounded-full transition-shadow duration-300 ${hovered ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse'}`} />

            {/* Ripple/Sonar Effect */}
            <div className="absolute top-0 left-0 w-3 h-3 rounded-full border border-cyan-500 animate-ping opacity-75" />

            {/* Tooltip */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/90 border border-cyan-500/30 rounded text-xs text-cyan-100 whitespace-nowrap pointer-events-none transition-all duration-200 ${hovered ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'}`}>
                {mission.title}
            </div>
        </div>
    );
};

import { GlobalStatusPanel } from './GlobalStatusPanel';

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
