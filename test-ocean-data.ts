import { fetchOceanTemperatureData, calculateGlobalTemperature, alertLevelToDifficulty, BleachingAlertLevel } from './src/services/oceanDataService.js';

async function testOceanData() {
    console.log('🌊 Fetching Ocean Temperature Data...\n');

    const data = await fetchOceanTemperatureData();

    console.log('📊 Current Ocean Conditions:\n');
    data.forEach(point => {
        const alertName = BleachingAlertLevel[point.bleachingAlert];
        const difficulty = alertLevelToDifficulty(point.bleachingAlert);

        console.log(`📍 ${point.location}`);
        console.log(`   Coordinates: ${point.coordinates.lat.toFixed(2)}°, ${point.coordinates.lon.toFixed(2)}°`);
        console.log(`   SST: ${point.sst}°C (${point.sstAnomaly > 0 ? '+' : ''}${point.sstAnomaly}°C anomaly)`);
        console.log(`   DHW: ${point.dhw} (Degree Heating Weeks)`);
        console.log(`   Alert: ${alertName} (Difficulty: ${difficulty}%)`);
        console.log('');
    });

    const globalTemp = calculateGlobalTemperature(data);
    console.log(`🌡️  Global Temperature Stat: ${globalTemp.toFixed(0)}%`);

    const criticalReefs = data.filter(p => p.bleachingAlert >= BleachingAlertLevel.WARNING);
    console.log(`\n⚠️  ${criticalReefs.length} reef(s) in critical condition`);
}

testOceanData();
