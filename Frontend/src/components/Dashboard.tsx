import { useEffect, useState } from "react";
import axios from 'axios';
import { Navigation } from "./Navigation";
import { LiveFeed } from "./LiveFeed";
import { ControlPanelPage } from "./ControlPanelPage";
import { ReportDownloadPage } from "./ReportDownloadPage";
import { CropPresetsPage } from "./CropPresetsPage";
import { Parameter } from "./ParameterSettings";
import { Wifi, WifiOff, LogOut, Moon, Sun, Thermometer, Droplets, Sprout } from "lucide-react";

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
  data: any;       
  userRole: string; 
  apiUrl: string;   
}

export function Dashboard({ onLogout, darkMode, toggleDarkMode, data, userRole, apiUrl }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<"live-feed" | "control-panel" | "crop-presets" | "report">("live-feed");
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: 'temperature', name: 'Temperature', icon: <Thermometer className="w-5 h-5" />, value: 25, unit: '°C', min: 10, max: 60, step: 0.5, color: 'orange' },
    { id: "humidity", name: "Air Humidity", icon: <Droplets className="w-5 h-5" />, value: 60, unit: "%", min: 0, max: 100, step: 1, color: "blue" },
    { id: "soilMoisture", name: "Soil Moisture", icon: <Sprout className="w-5 h-5" />, value: 50, unit: "%", min: 0, max: 100, step: 1, color: "green" },
    { id: "sunlight", name: "Sunlight", icon: <Sun className="w-5 h-5" />, value: 70, unit: "%", min: 0, max: 100, step: 1, color: "yellow" },
  ]);

  useEffect(() => {
    // Prevent crash if backend data hasn't arrived yet
    if (!data || !data.config || !data.sensors) return;

    // 1. Sync threshold sliders with current backend settings
    setParameters(prev => prev.map(p => {
        if (p.id === 'temperature') return { ...p, value: data.config.tempLimit ?? p.value };
        if (p.id === 'humidity') return { ...p, value: data.config.humidityLimit ?? p.value };
        if (p.id === 'soilMoisture') return { ...p, value: data.config.soilLimit ?? p.value };
        if (p.id === 'sunlight') return { ...p, value: data.config.sunlightLimit ?? p.value };
        return p;
    }));

    // 2. Map ESP32 keys (humidity, soil, light) to Graph labels
    const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });
    setHistoricalData(prev => [...prev, {
        time: timeStr,
        temperature: Number(data.sensors.temperature) || 0,
        airHumidity: Number(data.sensors.humidity) || 0, // Maps short 'h' from ESP32
        soilMoisture: Number(data.sensors.soil) || 0,    // Maps short 's' from ESP32
        sunlight: Number(data.sensors.light) || 0        // Maps short 'l' from ESP32
    }].slice(-20));
  }, [data]);

  const handleUpdateParameter = async (id: string, value: number) => {
    try {
        const updateKey = id === 'temperature' ? 'tempLimit' : 
                          id === 'humidity' ? 'humidityLimit' :
                          id === 'soilMoisture' ? 'soilLimit' : 'sunlightLimit';
        await axios.post(`${apiUrl}/config`, { [updateKey]: value });
    } catch (error) {
        console.error("Sync failed for parameter update");
    }
  };

  const handleApplyPreset = async (values: any) => {
    try {
        await axios.post(`${apiUrl}/config`, {
            tempLimit: values.temperature,
            humidityLimit: values.humidity,
            soilLimit: values.soilMoisture,
            sunlightLimit: values.sunlight,
            override: false 
        });
        setCurrentPage('live-feed');
    } catch (error) {
        console.error("Sync failed for preset application");
    }
  };

  const renderPage = () => {
    // Bridge the gap: Extract raw sensor data into named props for LiveFeed
    const sensorPayload = {
        temperature: data?.sensors?.temperature || 0,
        airHumidity: data?.sensors?.humidity || 0, // Fixed: Using backend 'humidity'
        soilMoisture: data?.sensors?.soil || 0,    // Fixed: Using backend 'soil'
        sunlight: data?.sensors?.light || 0,       // Fixed: Using backend 'light'
        timestamp: Date.now()
    };

    switch (currentPage) {
      case "live-feed":
        return <LiveFeed sensorData={sensorPayload} historicalData={historicalData} darkMode={darkMode} />;
      case "control-panel":
        return <ControlPanelPage darkMode={darkMode} parameters={parameters} onUpdateParameter={handleUpdateParameter} config={data?.config || {}} apiUrl={apiUrl} />;
      case "crop-presets":
        return <CropPresetsPage darkMode={darkMode} onApplyPreset={handleApplyPreset} />;
      case "report":
        return <ReportDownloadPage darkMode={darkMode} apiUrl={apiUrl} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-slate-900 dark:text-white font-bold text-xl">OmniClimate IoT</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {data?.sensors?.temperature ? (
                  <><Wifi className="w-4 h-4 text-green-500 animate-pulse" /><span className="text-xs font-bold text-green-600">ONLINE</span></>
                ) : (
                  <><WifiOff className="w-4 h-4 text-slate-400" /><span className="text-xs font-bold text-slate-400">SYNCING...</span></>
                )}
              </div>
              <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button onClick={onLogout} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-sm font-medium">Logout</button>
            </div>
          </div>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} darkMode={darkMode} userRole={userRole} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">{renderPage()}</div>
    </div>
  );
}
