import { create } from 'zustand';
import type { BioModule } from '../data/modules';
import { MISSIONS } from '../data/oceanData';
import type { Mission } from '../data/oceanData';

export type GameView = 'WORLD' | 'LAB' | 'SIMULATION' | 'RESULT';

interface GameState {
    view: GameView;
    sciencePoints: number;
    selectedMission: Mission | null;
    missions: Mission[];

    // Lab State
    currentOrganism: {
        sequence: (BioModule | null)[]; // Visual representation
        attributes: { // Derived from Folding Matrix
            heatRes: number;
            integrity: number;
            growth: number;
            filtration: number;
        };
    };

    // The Matrix Controller State (-1 to 1)
    foldingState: { x: number; y: number; };

    // Global Environmental State (0 to 100, where 100 is catastrophe)
    globalStats: {
        temperature: number; // Global Warning
        toxicity: number;    // Pollution Levels
        acidity: number;     // Ocean Acidification
        extinctionRisk: number;
    };

    // Actions
    setView: (view: GameView) => void;
    selectMission: (missionId: string) => void;
    setFoldingState: (x: number, y: number) => void;
    clearOrganism: () => void;
    completeMission: (success: boolean) => void;
    loadDynamicMissions: () => Promise<void>;
}

export const useGameStore = create<GameState>((set) => ({
    view: 'WORLD',
    sciencePoints: 100, // Starting points
    selectedMission: null,
    missions: MISSIONS,

    // Initial World State (Already in trouble)
    globalStats: {
        temperature: 40,
        toxicity: 30,
        acidity: 20,
        extinctionRisk: 25
    },

    currentOrganism: {
        sequence: Array(15).fill(null), // We might procedureally fill this now
        attributes: { heatRes: 50, integrity: 50, growth: 50, filtration: 50 }
    },

    foldingState: { x: 0, y: 0 },

    setView: (view) => set({ view }),

    selectMission: (missionId) => set((state) => ({
        selectedMission: state.missions.find(m => m.id === missionId) || null,
        view: 'LAB' // Auto switch to Lab when mission selected
    })),

    setFoldingState: (x, y) => set(() => {
        // Calculate derived stats
        // Top (Y=1): Heat, Bottom (Y=-1): Integrity
        // Right (X=1): Filtration, Left (X=-1): Growth
        // CENTER (0,0): Balanced (50% all)

        // Map [-1, 1] to [0, 100] linear trade-off
        const heatRes = ((y + 1) / 2) * 100;        // -1 -> 0, 0 -> 50, 1 -> 100
        const integrity = ((1 - y) / 2) * 100;      // 1 -> 0, 0 -> 50, -1 -> 100
        const filtration = ((x + 1) / 2) * 100;     // -1 -> 0, 0 -> 50, 1 -> 100
        const growth = ((1 - x) / 2) * 100;         // 1 -> 0, 0 -> 50, -1 -> 100

        // Procedurally generate "Sequence" for visual flair
        // If Y > 0.5 -> Red modules
        // If X > 0.5 -> Purple modules
        // etc.
        const newSequence = Array(15).fill(null).map((_, i) => {
            if (i % 2 === 0) return null; // Spacing
            if (y > 0.2 && i < 7) return { id: 's_heat', type: 'TETRAHEDRON' as const, color: '#ef4444', name: 'Heat', cost: 10, stats: { heatRes: 10, structuralIntegrity: 0, growthRate: 0, filtration: 0 }, description: 'Heat' };
            if (y < -0.2 && i < 7) return { id: 's_cold', type: 'CUBE' as const, color: '#3b82f6', name: 'Cold', cost: 10, stats: { heatRes: 0, structuralIntegrity: 10, growthRate: 0, filtration: 0 }, description: 'Cold' };
            if (x > 0.2 && i >= 7) return { id: 's_filt', type: 'CYLINDER' as const, color: '#a855f7', name: 'Filt', cost: 10, stats: { heatRes: 0, structuralIntegrity: 0, growthRate: 0, filtration: 10 }, description: 'Filt' };
            if (x < -0.2 && i >= 7) return { id: 's_grow', type: 'SPHERE' as const, color: '#22c55e', name: 'Grow', cost: 10, stats: { heatRes: 0, structuralIntegrity: 0, growthRate: 10, filtration: 0 }, description: 'Grow' };
            return null;
        });

        return {
            foldingState: { x, y },
            currentOrganism: {
                sequence: newSequence, // For the 3D view
                attributes: { heatRes, integrity, filtration, growth }
            }
        };
    }),

    clearOrganism: () => set({ foldingState: { x: 0, y: 0 }, currentOrganism: { sequence: [], attributes: { heatRes: 50, integrity: 50, growth: 50, filtration: 50 } } }),

    completeMission: (success) => set((state) => {
        if (!state.selectedMission) return state;

        // Calculate evolution cost
        const evolutionCost = Math.round((Math.abs(state.foldingState.x) + Math.abs(state.foldingState.y)) * 100);

        // 1. Calculate World Degradation (Time passing)
        // Every mission adds stress to non-addressed areas
        let newStats = {
            temperature: Math.min(100, state.globalStats.temperature + 5),
            toxicity: Math.min(100, state.globalStats.toxicity + 5),
            acidity: Math.min(100, state.globalStats.acidity + 5),
            extinctionRisk: Math.min(100, state.globalStats.extinctionRisk + 5)
        };

        // 2. Heal if Successful
        if (success) {
            // Need to define which mission affects which stat.
            // For now, simple heuristics based on title keywords or ID.
            const title = state.selectedMission.title.toLowerCase();
            if (title.includes('coral') || title.includes('heat')) {
                newStats.temperature = Math.max(0, newStats.temperature - 20);
                newStats.extinctionRisk = Math.max(0, newStats.extinctionRisk - 10);
            }
            if (title.includes('plastic') || title.includes('clean')) {
                newStats.toxicity = Math.max(0, newStats.toxicity - 25);
            }
            if (title.includes('ice') || title.includes('arctic')) {
                newStats.temperature = Math.max(0, newStats.temperature - 10);
                newStats.acidity = Math.max(0, newStats.acidity - 15);
            }
        }

        // Calculate SP changes
        const spGained = success ? state.selectedMission.rewards : 0;
        const spLost = evolutionCost;
        const netSP = spGained - spLost;

        return {
            view: 'RESULT',
            sciencePoints: state.sciencePoints + netSP,
            globalStats: newStats,
            missions: state.missions.map(m =>
                m.id === state.selectedMission?.id
                    ? { ...m, status: success ? 'COMPLETED' : 'FAILED' }
                    : m
            )
        };
    }),

    loadDynamicMissions: async () => {
        const { generateMissionsFromOceanData } = await import('../services/missionGenerator');
        const dynamicMissions = await generateMissionsFromOceanData();
        console.log('🎯 Generated dynamic missions:', dynamicMissions);
        set({ missions: dynamicMissions });
    }
}));
