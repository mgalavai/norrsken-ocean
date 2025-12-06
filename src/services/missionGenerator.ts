/**
 * Dynamic Mission Generator
 * Creates missions from real ocean temperature data
 */

import type { Mission } from '../data/oceanData';
import { fetchOceanTemperatureData, alertLevelToDifficulty, type OceanDataPoint } from './oceanDataService';

/**
 * Generate missions dynamically from ocean data
 */
export async function generateMissionsFromOceanData(): Promise<Mission[]> {
    const oceanData = await fetchOceanTemperatureData();

    return oceanData.map((data) => {
        const missionId = `reef_${data.location.toLowerCase().replace(/\s+/g, '_')}`;
        const difficulty = alertLevelToDifficulty(data.bleachingAlert);

        // Generate mission description based on alert level
        const description = generateDescription(data);

        // Map ocean data to mission difficulty parameters
        const missionDifficulty = {
            temp: Math.round(data.sst), // Use actual SST
            virulence: Math.round(data.dhw * 10), // DHW as acidity proxy
            pollution: difficulty, // Use alert level as pollution
            currents: 20 + (Math.abs(data.coordinates.lat) / 90) * 30 // Latitude-based currents
        };

        return {
            id: missionId,
            title: data.location,
            location: [data.coordinates.lat, data.coordinates.lon] as [number, number],
            description,
            difficulty: missionDifficulty,
            rewards: calculateRewards(data.bleachingAlert),
            status: 'AVAILABLE' as const
        };
    });
}

/**
 * Generate mission description based on ocean conditions
 */
function generateDescription(data: OceanDataPoint): string {
    const { bleachingAlert, sst, sstAnomaly, dhw } = data;

    if (bleachingAlert >= 3) {
        return `CRITICAL: Mass bleaching event detected. SST ${sst}°C (+${sstAnomaly.toFixed(1)}°C anomaly). DHW: ${dhw}. Immediate intervention required.`;
    } else if (bleachingAlert === 2) {
        return `WARNING: Thermal stress accumulating. SST ${sst}°C. Bleaching likely within days. Deploy heat-resistant organisms.`;
    } else if (bleachingAlert === 1) {
        return `WATCH: Elevated temperatures detected. SST ${sst}°C. Monitor closely and prepare adaptive species.`;
    } else {
        return `STABLE: Normal conditions. SST ${sst}°C. Opportunity for preventive ecosystem strengthening.`;
    }
}

/**
 * Calculate mission rewards based on severity
 */
function calculateRewards(alertLevel: number): number {
    switch (alertLevel) {
        case 4: return 300; // ALERT_LEVEL_2 - highest reward
        case 3: return 250; // ALERT_LEVEL_1
        case 2: return 200; // WARNING
        case 1: return 150; // WATCH
        default: return 100; // NO_STRESS
    }
}
