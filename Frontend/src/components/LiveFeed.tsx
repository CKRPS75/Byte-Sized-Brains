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
      {/* Sensor Cards Grid */}
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

      {/* Charts */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Graphs</h2>
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

      {/* ESP32 Integration Info */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white mb-3">ESP32 Integration Guide</h3>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>To connect your ESP32, configure it to send HTTP POST requests to this endpoint:</p>
          <code className="block bg-slate-100 dark:bg-slate-900 p-3 rounded mt-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            POST /api/sensor-data<br/>
            Content-Type: application/json<br/>
            <br/>
            {JSON.stringify({
              temperature: 24.5,
              airHumidity: 65,
              soilMoisture: 42,
              sunlight: 75
            }, null, 2)}
          </code>
          <p className="mt-3">Or use WebSocket connection for real-time streaming at: <code className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">ws://YOUR_SERVER/sensor-stream</code></p>
        </div>
      </div>
    </div>
  );
}