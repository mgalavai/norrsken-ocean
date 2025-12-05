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
        modules: BioModule[];
    };

    // Actions
    setView: (view: GameView) => void;
    selectMission: (missionId: string) => void;
    addModule: (module: BioModule) => void;
    clearOrganism: () => void;
    completeMission: (success: boolean) => void;
}

export const useGameStore = create<GameState>((set) => ({
    view: 'WORLD',
    sciencePoints: 100, // Starting points
    selectedMission: null,
    missions: MISSIONS,

    currentOrganism: {
        modules: []
    },

    setView: (view) => set({ view }),

    selectMission: (missionId) => set((state) => ({
        selectedMission: state.missions.find(m => m.id === missionId) || null,
        view: 'LAB' // Auto switch to Lab when mission selected
    })),

    addModule: (module) => set((state) => {
        if (state.sciencePoints < module.cost) return state;
        return {
            sciencePoints: state.sciencePoints - module.cost,
            currentOrganism: {
                modules: [...state.currentOrganism.modules, module]
            }
        };
    }),

    clearOrganism: () => set((state) => {
        // Refund points (simple logic for now)
        const refund = state.currentOrganism.modules.reduce((acc, m) => acc + m.cost, 0);
        return {
            sciencePoints: state.sciencePoints + refund,
            currentOrganism: { modules: [] }
        };
    }),

    completeMission: (success) => set((state) => {
        if (!state.selectedMission) return state;
        return {
            view: 'RESULT',
            sciencePoints: success ? state.sciencePoints + state.selectedMission.rewards : state.sciencePoints,
            missions: state.missions.map(m =>
                m.id === state.selectedMission?.id
                    ? { ...m, status: success ? 'COMPLETED' : 'FAILED' }
                    : m
            )
        };
    })
}));
