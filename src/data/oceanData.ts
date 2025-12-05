export interface Mission {
    id: string;
    title: string;
    location: [number, number]; // Lat, Lon
    description: string;
    difficulty: {
        temp: number; // Requires Heat Res
        virulence: number; // Requires Growth
        pollution: number; // Requires Filtration
        currents: number; // Requires Integrity
    };
    status: 'LOCKED' | 'AVAILABLE' | 'COMPLETED' | 'FAILED';
    rewards: number; // Science Points
}

export const MISSIONS: Mission[] = [
    {
        id: 'm1_coral',
        title: 'Great Barrier Reef',
        location: [-18.2871, 147.6992],
        description: 'Severe bleaching event detected. Sea surface temperatures exceeding 30°C.',
        difficulty: { temp: 40, virulence: 0, pollution: 5, currents: 10 }, // Typo in virulence fixed to 0 for now or handled
        status: 'AVAILABLE',
        rewards: 100
    },
    {
        id: 'm2_gyre',
        title: 'Great Pacific Garbage Patch',
        location: [32.0, -145.0],
        description: 'High concentration of microplastics. Filter feeders required.',
        difficulty: { temp: 10, virulence: 0, pollution: 50, currents: 5 },
        status: 'AVAILABLE',
        rewards: 150
    },
    {
        id: 'm3_baltic',
        title: 'Baltic Sea Dead Zone',
        location: [59.0, 20.0],
        description: 'Anoxic waters due to eutrophication. Needs resilient organisms.',
        difficulty: { temp: 15, virulence: 30, pollution: 20, currents: 5 }, // Virulence here maps to Acidity/pH in UI
        status: 'LOCKED',
        rewards: 200
    }
];
