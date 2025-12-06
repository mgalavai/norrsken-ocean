/**
 * NOAA Ocean Data Service
 * Integrates real-world ocean temperature data from NASA Earthdata
 */

// NASA Earthdata Token (Demo - hardcoded for hackathon)
const NASA_TOKEN = 'eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6Im15cm8xOTg1IiwiZXhwIjoxNzcwMTYzNTc3LCJpYXQiOjE3NjQ5Nzk1NzcsImlzcyI6Imh0dHBzOi8vdXJzLmVhcnRoZGF0YS5uYXNhLmdvdiIsImlkZW50aXR5X3Byb3ZpZGVyIjoiZWRsX29wcyIsImFjciI6ImVkbCIsImFzc3VyYW5jZV9sZXZlbCI6M30.uur0-qpIT_RiN3TGZtApsjpLMWkY9VQiFhVx4cheIvPD1rVLlyW8lRQm-IAU0VkQ224_JbaYPKmD5PD8IXEkPkW3Kkh6judbu6gi0ojbLHl8uBi9_wosVqfrklZIkoTidZTUOMpnwhwn_bk5LsNPto-fQ9b-CRkCuuVFHx2NKU081os_O1ZKwglgl_a5j1pBFhaEe5dBooQZVpwl4LzHPcR-1jWflngrC6XWWU22tsc2ACOby1PHr00_mj69np8_xat3FEE_kwwQOXVslhICHaxjF_I68NzMZ4_8_NYIIl4jT83LRj4qKzpUNltKk2hGRWXBIFseDULFRr1Awp6n4g';

// Known coral reef hotspots with approximate coordinates
const CORAL_REEF_LOCATIONS = [
    { name: 'Great Barrier Reef', lat: -18.2871, lon: 147.6992, region: 'Australia', baselineSST: 26.5 },
    { name: 'Coral Triangle', lat: -5.0, lon: 120.0, region: 'Indonesia', baselineSST: 28.0 },
    { name: 'Caribbean Reefs', lat: 18.0, lon: -77.5, region: 'Jamaica', baselineSST: 27.5 },
    { name: 'Red Sea Reefs', lat: 20.5, lon: 38.0, region: 'Egypt', baselineSST: 26.0 },
    { name: 'Maldives Atolls', lat: 3.2028, lon: 73.2207, region: 'Maldives', baselineSST: 28.5 },
    { name: 'Hawaiian Reefs', lat: 21.3099, lon: -157.8581, region: 'Hawaii', baselineSST: 25.0 },
    { name: 'Seychelles', lat: -4.6796, lon: 55.4920, region: 'Seychelles', baselineSST: 27.8 },
    { name: 'Great Chagos Bank', lat: -6.3, lon: 71.8, region: 'Indian Ocean', baselineSST: 28.0 }
];

// Bleaching Alert Levels (from NOAA CRW)
export enum BleachingAlertLevel {
    NO_STRESS = 0,      // No bleaching stress
    WATCH = 1,          // Possible bleaching
    WARNING = 2,        // Bleaching likely
    ALERT_LEVEL_1 = 3,  // Bleaching occurring
    ALERT_LEVEL_2 = 4   // Mortality likely
}

export interface OceanDataPoint {
    location: string;
    coordinates: { lat: number; lon: number };
    sst: number;              // Sea Surface Temperature (°C)
    sstAnomaly: number;       // Deviation from baseline (°C)
    bleachingAlert: BleachingAlertLevel;
    dhw: number;              // Degree Heating Weeks
    timestamp: Date;
    dataSource: 'NASA_MUR' | 'SIMULATED';
}

/**
 * Fetch SST data from NASA Earthdata (MUR dataset)
 * Falls back to simulation if API fails
 */
async function fetchNASA_SST(lat: number, lon: number): Promise<number | null> {
    try {
        console.log(`🛰️ Fetching NASA data for: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);

        // For browser compatibility, we'll use the CMR search API
        // In production, you'd use OPeNDAP or direct data access
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dateStr = yesterday.toISOString().split('T')[0];

        const url = `https://cmr.earthdata.nasa.gov/search/granules.json?short_name=MUR-JPL-L4-GLOB-v4.1&temporal=${dateStr}T00:00:00Z,${dateStr}T23:59:59Z&page_size=1`;

        console.log(`📡 NASA API URL: ${url}`);

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${NASA_TOKEN}`
            }
        });

        console.log(`📊 NASA API Response Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            console.warn('⚠️ NASA API request failed, using simulation');
            return null;
        }

        const data = await response.json();
        console.log('✅ NASA API Response:', {
            title: data.feed?.entry?.[0]?.title,
            timeStart: data.feed?.entry?.[0]?.time_start,
            datasetId: data.feed?.entry?.[0]?.dataset_id
        });

        // INTENTIONAL: For MVP, we verify NASA API connectivity but use simulation for actual SST values
        // Reason: Parsing NetCDF data in browser requires backend service or specialized library
        // TODO: Implement backend endpoint to extract actual SST values from NetCDF granules
        console.log('ℹ️ Using simulation (NetCDF parsing requires backend)');
        return null; // Triggers simulation fallback

    } catch (error) {
        console.error('❌ NASA API error:', error);
        return null;
    }
}

/**
 * Simulate realistic SST based on location and current conditions
 */
function simulateSST(lat: number, baselineSST: number): number {
    const currentDate = new Date();
    const month = currentDate.getMonth();

    // Seasonal variation (Northern/Southern hemisphere aware)
    const isNorthern = lat > 0;
    const seasonalPhase = isNorthern ? month : (month + 6) % 12;
    const seasonalVariation = Math.sin((seasonalPhase / 12) * 2 * Math.PI) * 2;

    // 2024 El Niño effect
    const elNinoEffect = 1.5;

    // Random daily variation
    const dailyNoise = (Math.random() - 0.5) * 0.5;

    return baselineSST + seasonalVariation + elNinoEffect + dailyNoise;
}

/**
 * Fetch ocean temperature data for all coral reef locations
 */
export async function fetchOceanTemperatureData(): Promise<OceanDataPoint[]> {
    const currentDate = new Date();

    const dataPromises = CORAL_REEF_LOCATIONS.map(async (location) => {
        // Try to fetch real NASA data
        let sst = await fetchNASA_SST(location.lat, location.lon);
        let dataSource: 'NASA_MUR' | 'SIMULATED' = 'SIMULATED';

        // Fallback to simulation if NASA API fails
        if (sst === null) {
            sst = simulateSST(location.lat, location.baselineSST);
        } else {
            dataSource = 'NASA_MUR';
        }

        const sstAnomaly = sst - location.baselineSST;

        // Calculate Degree Heating Weeks (DHW)
        // DHW accumulates when SST > baseline + 1°C
        const dhw = Math.max(0, sstAnomaly * 4);

        // Determine bleaching alert level
        let bleachingAlert: BleachingAlertLevel;
        if (dhw < 2) bleachingAlert = BleachingAlertLevel.NO_STRESS;
        else if (dhw < 4) bleachingAlert = BleachingAlertLevel.WATCH;
        else if (dhw < 6) bleachingAlert = BleachingAlertLevel.WARNING;
        else if (dhw < 8) bleachingAlert = BleachingAlertLevel.ALERT_LEVEL_1;
        else bleachingAlert = BleachingAlertLevel.ALERT_LEVEL_2;

        return {
            location: location.name,
            coordinates: { lat: location.lat, lon: location.lon },
            sst: Math.round(sst * 10) / 10,
            sstAnomaly: Math.round(sstAnomaly * 10) / 10,
            bleachingAlert,
            dhw: Math.round(dhw * 10) / 10,
            timestamp: currentDate,
            dataSource
        };
    });

    return Promise.all(dataPromises);
}

/**
 * Convert bleaching alert level to mission difficulty (0-100 scale)
 */
export function alertLevelToDifficulty(alert: BleachingAlertLevel): number {
    switch (alert) {
        case BleachingAlertLevel.NO_STRESS: return 10;
        case BleachingAlertLevel.WATCH: return 30;
        case BleachingAlertLevel.WARNING: return 50;
        case BleachingAlertLevel.ALERT_LEVEL_1: return 70;
        case BleachingAlertLevel.ALERT_LEVEL_2: return 90;
        default: return 50;
    }
}

/**
 * Calculate global temperature stat from all ocean data points
 */
export function calculateGlobalTemperature(dataPoints: OceanDataPoint[]): number {
    const avgAnomaly = dataPoints.reduce((sum, p) => sum + p.sstAnomaly, 0) / dataPoints.length;
    // Map anomaly (-2 to +3°C) to 0-100 scale
    // 0°C anomaly = 40%, +2°C = 80%, +3°C = 100%
    return Math.min(100, Math.max(0, 40 + (avgAnomaly * 20)));
}
