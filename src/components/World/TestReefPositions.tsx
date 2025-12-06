/**
 * Test Coral Reef Pin Positions
 * This component overlays the 8 real coral reef locations on the map
 * to verify they're positioned correctly in the ocean
 */

// Coral reef locations (from oceanDataService)
const CORAL_REEF_LOCATIONS = [
    { name: 'Great Barrier Reef', lat: -18.2871, lon: 147.6992 },
    { name: 'Coral Triangle', lat: -5.0, lon: 120.0 },
    { name: 'Caribbean Reefs', lat: 18.0, lon: -77.5 },
    { name: 'Red Sea Reefs', lat: 20.5, lon: 38.0 }, // Fixed: moved to Red Sea water
    { name: 'Maldives Atolls', lat: 3.2028, lon: 73.2207 },
    { name: 'Hawaiian Reefs', lat: 21.3099, lon: -157.8581 },
    { name: 'Seychelles', lat: -4.6796, lon: 55.4920 },
    { name: 'Great Chagos Bank', lat: -6.3, lon: 71.8 }
];

// Equirectangular projection (same as WorldScene)
const getMissionStyle = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
};

export const TestReefPositions = () => {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {CORAL_REEF_LOCATIONS.map((reef, i) => {
                const style = getMissionStyle(reef.lat, reef.lon);
                return (
                    <div
                        key={i}
                        className="absolute w-4 h-4 -ml-2 -mt-2 pointer-events-auto"
                        style={style}
                    >
                        {/* Pin marker */}
                        <div className="relative">
                            <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                            {/* Label */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                {reef.name}
                                <div className="text-[10px] text-gray-400">
                                    {reef.lat.toFixed(2)}°, {reef.lon.toFixed(2)}°
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
