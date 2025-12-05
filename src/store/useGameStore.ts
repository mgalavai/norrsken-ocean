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
        sequence: (BioModule | null)[]; // Fixed 15 slots
    };

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
    toggleModuleInSlot: (index: number, module: BioModule) => void;
    clearOrganism: () => void;
    completeMission: (success: boolean) => void;
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
        sequence: Array(15).fill(null)
    },

    setView: (view) => set({ view }),

    selectMission: (missionId) => set((state) => ({
        selectedMission: state.missions.find(m => m.id === missionId) || null,
        view: 'LAB' // Auto switch to Lab when mission selected
    })),

    toggleModuleInSlot: (index, module) => set((state) => {
        const currentSequence = [...state.currentOrganism.sequence];
        const existingModule = currentSequence[index];

        // If clicking same module in same slot, remove it (refund)
        if (existingModule && existingModule.id === module.id) {
            const refund = existingModule.cost;
            currentSequence[index] = null;
            return {
                sciencePoints: state.sciencePoints + refund,
                currentOrganism: { sequence: currentSequence }
            };
        }

        // If replacing or adding new
        const costDiff = module.cost - (existingModule ? existingModule.cost : 0);

        if (state.sciencePoints < costDiff) return state; // Can't afford

        currentSequence[index] = module;
        return {
            sciencePoints: state.sciencePoints - costDiff,
            currentOrganism: { sequence: currentSequence }
        };
    }),

    clearOrganism: () => set((state) => {
        // Refund points
        const refund = state.currentOrganism.sequence.reduce((acc, m) => acc + (m ? m.cost : 0), 0);
        return {
            sciencePoints: state.sciencePoints + refund,
            currentOrganism: { sequence: Array(15).fill(null) }
        };
    }),

    completeMission: (success) => set((state) => {
        if (!state.selectedMission) return state;

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

        return {
            view: 'RESULT',
            sciencePoints: success ? state.sciencePoints + state.selectedMission.rewards : state.sciencePoints,
            globalStats: newStats,
            missions: state.missions.map(m =>
                m.id === state.selectedMission?.id
                    ? { ...m, status: success ? 'COMPLETED' : 'FAILED' }
                    : m
            )
        };
    })
}));
