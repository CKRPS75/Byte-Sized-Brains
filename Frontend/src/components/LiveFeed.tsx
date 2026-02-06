import { SensorCard } from './SensorCard';
import { ChartDisplay } from './ChartDisplay';
import { Thermometer, Droplets, Sprout, Sun } from 'lucide-react';

interface SensorData {
  temperature: number;
  airHumidity: number;
  soilMoisture: number;
  sunlight: number;
  timestamp: number;
}

interface HistoricalData {
  time: string;
  temperature: number;
  airHumidity: number;
  soilMoisture: number;
  sunlight: number;
}

interface LiveFeedProps {
  sensorData: SensorData;
  historicalData: HistoricalData[];
  darkMode: boolean;
}

export function LiveFeed({ sensorData, historicalData, darkMode }: LiveFeedProps) {
  return (
    <div className="space-y-8">
      {/* Sensor Cards Grid - Real-time Data Mapping */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Current Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorCard
            title="Temperature"
            value={sensorData.temperature.toFixed(1)}
            unit="°C"
            icon={<Thermometer className="w-6 h-6" />}
            color="orange"
            min={10}
            max={60}
            current={sensorData.temperature}
            darkMode={darkMode}
          />
          <SensorCard
            title="Air Humidity"
            value={sensorData.airHumidity.toFixed(1)}
            unit="%"
            icon={<Droplets className="w-6 h-6" />}
            color="blue"
            min={0}
            max={100}
            current={sensorData.airHumidity}
            darkMode={darkMode}
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData.soilMoisture.toFixed(1)}
            unit="%"
            icon={<Sprout className="w-6 h-6" />}
            color="green"
            min={0}
            max={100}
            current={sensorData.soilMoisture}
            darkMode={darkMode}
          />
          <SensorCard
            title="Sunlight"
            value={sensorData.sunlight.toFixed(1)}
            unit="%"
            icon={<Sun className="w-6 h-6" />}
            color="yellow"
            min={0}
            max={100}
            current={sensorData.sunlight}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Charts - Visualizing Backend Historical Logs */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">System Graphs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartDisplay
            title="Temperature & Humidity"
            data={historicalData}
            dataKeys={['temperature', 'airHumidity']}
            colors={['#f97316', '#3b82f6']}
            labels={['Temperature (°C)', 'Humidity (%)']}
            darkMode={darkMode}
          />
          <ChartDisplay
            title="Soil Moisture & Sunlight"
            data={historicalData}
            dataKeys={['soilMoisture', 'sunlight']}
            colors={['#22c55e', '#eab308']}
            labels={['Soil Moisture (%)', 'Sunlight (%)']}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* ESP32 Integration Info - Kept for Troubleshooting */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <h3 className="text-slate-900 dark:text-white">Active Connection Point</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>Your ESP32 is currently sending data to your server at <strong>10.187.7.44</strong>. The web dashboard receives updates via the following schema:</p>
          <code className="block bg-slate-100 dark:bg-slate-900 p-3 rounded mt-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            GET /api/latest<br/>
            Content-Type: application/json<br/>
            <br/>
            {JSON.stringify({
              sensors: {
                temperature: sensorData.temperature,
                humidity: sensorData.airHumidity,
                soil: sensorData.soilMoisture,
                light: sensorData.sunlight
              }
            }, null, 2)}
          </code>
          <p className="mt-3 italic text-xs">Note: Ensure your ESP32 and this PC remain on the <strong>Galaxy A14 5G 8BC8</strong> hotspot for data to sync.</p>
        </div>
      </div>
    </div>
  );
}
