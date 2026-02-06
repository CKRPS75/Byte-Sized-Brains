import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { LiveFeed } from "./LiveFeed";
import { ControlPanelPage } from "./ControlPanelPage";
import { ReportDownloadPage } from "./ReportDownloadPage";
import { Wifi, WifiOff, LogOut, Moon, Sun } from "lucide-react";

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
  data: any;    // New prop
  apiUrl: string; // New prop
}

export function Dashboard({
  onLogout,
  darkMode,
  toggleDarkMode,
  data,
  apiUrl
}: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<"live-feed" | "control-panel" | "report">("live-feed");
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 24.5,
    airHumidity: 65,
    soilMoisture: 42,
    sunlight: 75,
    timestamp: Date.now(),
  });
  const [isConnected, setIsConnected] = useState(true);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);

  // UPDATED: Now uses real data from backend folder
  useEffect(() => {
    if (data && data.sensors) {
      const { sensors } = data;
      const newData: SensorData = {
        temperature: sensors.temperature || 0,
        airHumidity: sensors.humidity || 0,
        soilMoisture: sensors.soil || 0,
        sunlight: sensors.light || 0,
        timestamp: Date.now(),
      };
      setSensorData(newData);
      setIsConnected(true);

      const timeStr = new Date().toLocaleTimeString("en-US", {
        hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit",
      });

      setHistoricalData((prev) => {
        const updated = [...prev, { ...newData, time: timeStr }];
        return updated.slice(-20);
      });
    }
  }, [data]);

  const renderPage = () => {
    switch (currentPage) {
      case "live-feed":
        return <LiveFeed sensorData={sensorData} historicalData={historicalData} darkMode={darkMode} />;
      case "control-panel":
        return <ControlPanelPage darkMode={darkMode} config={data.config} apiUrl={apiUrl} />;
      case "report":
        return <ReportDownloadPage darkMode={darkMode} apiUrl={apiUrl} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
       {/* Original Header & Navigation JSX remains 100% the same as your code */}
       <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-slate-900 dark:text-white">Automated Climate Control System</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <><Wifi className="w-5 h-5 text-green-600" /><span className="text-sm text-green-600">Connected</span></>
                ) : (
                  <><WifiOff className="w-5 h-5 text-red-600" /><span className="text-sm text-red-600">Disconnected</span></>
                )}
              </div>
              <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900">
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border text-slate-700 rounded-lg">
                <LogOut className="w-4 h-4" /> <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
          <Navigation currentPage={currentPage} onPageChange={setCurrentPage} darkMode={darkMode} />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">{renderPage()}</div>
    </div>
  );
}