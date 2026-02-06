import { useEffect, useState } from "react";
import axios from 'axios';
import { Navigation } from "./Navigation";
import { LiveFeed } from "./LiveFeed";
import { ControlPanelPage } from "./ControlPanelPage";
import { ReportDownloadPage } from "./ReportDownloadPage";
import { CropPresetsPage } from "./CropPresetsPage";
import { Parameter } from "./ParameterSettings";
import { Wifi, WifiOff, LogOut, Moon, Sun, Thermometer, Droplets, Sprout } from "lucide-react";

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

interface DashboardProps {
  onLogout: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  data: any;       // Live data from App.tsx
  userRole: string; // 'manager' or 'farmer'
  apiUrl: string;   // 'http://10.187.7.44:5050/api'
}

export function Dashboard({
  onLogout,
  darkMode,
  toggleDarkMode,
  data,
  userRole,
  apiUrl
}: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<
    "live-feed" | "control-panel" | "crop-presets" | "report"
  >("live-feed");
  
  // Parameters state now reflects the limits fetched from the Backend
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      id: 'temperature',
      name: 'Temperature',
      icon: <Thermometer className="w-5 h-5" />,
      value: data.config.tempLimit || 25,
      unit: '°C',
      min: 10,
      max: 60,
      step: 0.5,
      color: 'orange',
    },
    {
      id: "humidity",
      name: "Air Humidity",
      icon: <Droplets className="w-5 h-5" />,
      value: data.config.humidityLimit || 60,
      unit: "%",
      min: 30,
      max: 90,
      step: 1,
      color: "blue",
    },
    {
      id: "soilMoisture",
      name: "Soil Moisture",
      icon: <Sprout className="w-5 h-5" />,
      value: data.config.soilLimit || 50,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      color: "green",
    },
    {
      id: "sunlight",
      name: "Sunlight",
      icon: <Sun className="w-5 h-5" />,
      value: data.config.sunlightLimit || 70,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      color: "yellow",
    },
  ]);

  // Use live data passed from App.tsx instead of simulations
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  // Sync parameters when backend data changes
  useEffect(() => {
    setParameters(prev => prev.map(p => {
        if (p.id === 'temperature') return { ...p, value: data.config.tempLimit };
        if (p.id === 'humidity') return { ...p, value: data.config.humidityLimit };
        if (p.id === 'soilMoisture') return { ...p, value: data.config.soilLimit };
        if (p.id === 'sunlight') return { ...p, value: data.config.sunlightLimit };
        return p;
    }));

    // Update historical data chart with live points
    const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });
    setHistoricalData(prev => [...prev, {
        time: timeStr,
        temperature: data.sensors.temperature,
        airHumidity: data.sensors.humidity,
        soilMoisture: data.sensors.soil,
        sunlight: data.sensors.light
    }].slice(-20));
  }, [data]);

  // API Call: Update individual thresholds (Manual/Auto toggle logic)
  const handleUpdateParameter = async (id: string, value: number) => {
    try {
        const updateKey = id === 'temperature' ? 'tempLimit' : 
                          id === 'humidity' ? 'humidityLimit' :
                          id === 'soilMoisture' ? 'soilLimit' : 'sunlightLimit';
        
        await axios.post(`${apiUrl}/config`, { [updateKey]: value });
    } catch (error) {
        console.error("Failed to update threshold");
    }
  };

  // API Call: Apply full crop preset from CropPresetsPage
  const handleApplyPreset = async (values: { temperature: number; humidity: number; soilMoisture: number; sunlight: number }) => {
    try {
        await axios.post(`${apiUrl}/config`, {
            tempLimit: values.temperature,
            humidityLimit: values.humidity,
            soilLimit: values.soilMoisture,
            sunlightLimit: values.sunlight,
            override: false // Ensure system returns to Auto mode when preset is applied
        });
        setCurrentPage('control-panel');
    } catch (error) {
        console.error("Failed to apply preset");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "live-feed":
        return (
          <LiveFeed
            sensorData={{
                temperature: data.sensors.temperature,
                airHumidity: data.sensors.humidity,
                soilMoisture: data.sensors.soil,
                sunlight: data.sensors.light,
                timestamp: Date.now()
            }}
            historicalData={historicalData}
            darkMode={darkMode}
          />
        );
      case "control-panel":
        return (
          <ControlPanelPage 
            darkMode={darkMode} 
            parameters={parameters}
            onUpdateParameter={handleUpdateParameter}
            config={data.config} // Passing live config for relay status
            apiUrl={apiUrl}
          />
        );
      case "crop-presets":
        return (
          <CropPresetsPage 
            darkMode={darkMode}
            onApplyPreset={handleApplyPreset}
          />
        );
      case "report":
        return <ReportDownloadPage darkMode={darkMode} apiUrl={apiUrl} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-slate-900 dark:text-white font-bold text-xl">
                OmniClimate <span className="text-blue-500">IoT</span>
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Logged in as {userRole}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {data.sensors.temperature !== 0 ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-green-600 dark:text-green-400 hidden sm:inline">System Live</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <span className="text-sm text-red-600 dark:text-red-400 hidden sm:inline">Disconnected</span>
                  </>
                )}
              </div>

              <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>

              <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:text-red-600 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <Navigation
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            darkMode={darkMode}
            userRole={userRole} // Passing role to Navigation to hide links
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {renderPage()}
      </div>
    </div>
  );
}
