export type ModuleType = 'TETRAHEDRON' | 'CUBE' | 'SPHERE' | 'CYLINDER';

export interface BioModule {
    id: string;
    type: ModuleType;
    name: string;
    description: string;
    cost: number;
    stats: {
        heatRes: number;
        structuralIntegrity: number;
        growthRate: number;
        filtration: number;
    };
    color: string;
}

export const MODULES: Record<ModuleType, BioModule> = {
    TETRAHEDRON: {
        id: 'mod_tetra',
        type: 'TETRAHEDRON',
        name: 'Thermo-Shell',
        description: 'Heat resistant crystalline structure.',
        cost: 10,
        stats: { heatRes: 15, structuralIntegrity: 5, growthRate: 0, filtration: 0 },
        color: '#ff4444'
    },
    CUBE: {
        id: 'mod_cube',
        type: 'CUBE',
        name: 'Basalt Block',
        description: 'Heavy reinforced plating.',
        cost: 10,
        stats: { heatRes: 0, structuralIntegrity: 20, growthRate: -5, filtration: 0 },
        color: '#4444ff'
    },
    SPHERE: {
        id: 'mod_sphere',
        type: 'SPHERE',
        name: 'Bio-Core',
        description: 'Rapid cell division unit.',
        cost: 15,
        stats: { heatRes: 0, structuralIntegrity: 0, growthRate: 15, filtration: 0 },
        color: '#44ff44'
    },
    CYLINDER: {
        id: 'mod_cyl',
        type: 'CYLINDER',
        name: 'Filter Tube',
        description: 'Microplastic filtration system.',
        cost: 12,
        stats: { heatRes: 0, structuralIntegrity: 0, growthRate: 0, filtration: 20 },
        color: '#ffff44'
    }
};
