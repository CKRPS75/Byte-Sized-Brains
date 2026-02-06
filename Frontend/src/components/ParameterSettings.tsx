import { useState, useEffect } from "react";
import axios from "axios"; // Necessary for cloud sync
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Save,
} from "lucide-react";

interface Parameter {
  id: string;
  name: string;
  icon: React.ReactNode;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  color: string;
}

interface ParameterSettingsProps {
  darkMode: boolean;
  config: any;   // Prop from Dashboard to track live settings
  apiUrl: string; // Prop from Dashboard for backend location
}

export function ParameterSettings({
  darkMode,
  config,
  apiUrl,
}: ParameterSettingsProps) {
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      id: 'temperature',
      name: 'Temperature',
      icon: <Thermometer className="w-5 h-5" />,
      value: 25,
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
      value: 60,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      color: "blue",
    },
    {
      id: "soilMoisture",
      name: "Soil Moisture",
      icon: <Sprout className="w-5 h-5" />,
      value: 50,
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
      value: 70,
      unit: "%",
      min: 0,
      max: 100,
      step: 1,
      color: "yellow",
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // Sync with MongoDB without removing any state items
  useEffect(() => {
    if (config) {
      setParameters(prev => prev.map(param => {
        if (param.id === 'temperature') return { ...param, value: config.tempLimit || 31 };
        if (param.id === 'soilMoisture') return { ...param, value: config.soilLimit || 30 };
        // NECESSARY CHANGE: Syncing new humidity and sunlight limits
        if (param.id === 'humidity') return { ...param, value: config.humidityLimit || 45 };
        if (param.id === 'sunlight') return { ...param, value: config.sunlightLimit || 20 };
        return param;
      }));
    }
  }, [config]);

  const updateParameter = (id: string, value: number) => {
    setParameters(
      parameters.map((param) =>
        param.id === id ? { ...param, value } : param,
      ),
    );
  };

  const saveParameters = async () => {
    setIsSaving(true);

    // Extract only serializable data (Original logic preserved)
    const parameterValues = parameters.map((param) => ({
      id: param.id,
      name: param.name,
      value: param.value,
      unit: param.unit,
    }));

    // NECESSARY CHANGE: Sending all 4 limits to the backend
    try {
      const updatedConfig = {
        ...config,
        tempLimit: parameters.find(p => p.id === 'temperature')?.value,
        soilLimit: parameters.find(p => p.id === 'soilMoisture')?.value,
        humidityLimit: parameters.find(p => p.id === 'humidity')?.value,
        sunlightLimit: parameters.find(p => p.id === 'sunlight')?.value,
        override: false // Switch back to AUTO mode on save
      };
      await axios.post(`${apiUrl}/admin/config`, updatedConfig);
      console.log("Saving parameters to Backend:", parameterValues);
    } catch (error) {
      console.error("Cloud Save Failed:", error);
    }

    // Original timeout preserved
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<
      string,
      {
        text: string;
        bg: string;
        border: string;
        slider: string;
      }
    > = {
      orange: {
        text: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-900/20",
        border: "border-orange-200 dark:border-orange-800",
        slider: "accent-orange-500",
      },
      blue: {
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        slider: "accent-blue-500",
      },
      green: {
        text: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20",
        border: "border-green-200 dark:border-green-800",
        slider: "accent-green-500",
      },
      yellow: {
        text: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        slider: "accent-yellow-500",
      },
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-900 dark:text-white">
          Parameter Settings
        </h3>
        <button
          onClick={saveParameters}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parameters.map((param) => {
          const colors = getColorClasses(param.color);
          return (
            <div
              key={param.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={colors.text}>{param.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {param.name}
                  </p>
                  <p className={`${colors.text}`}>
                    {param.value}
                    {param.unit}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) =>
                    updateParameter(
                      param.id,
                      parseFloat(e.target.value),
                    )
                  }
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colors.slider}`}
                  style={{
                    background: `linear-gradient(to right, ${darkMode ? "rgb(71, 85, 105)" : "rgb(226, 232, 240)"} 0%, ${darkMode ? "rgb(71, 85, 105)" : "rgb(226, 232, 240)"} ${((param.value - param.min) / (param.max - param.min)) * 100}%, ${darkMode ? "rgb(30, 41, 59)" : "rgb(241, 245, 249)"} ${((param.value - param.min) / (param.max - param.min)) * 100}%, ${darkMode ? "rgb(30, 41, 59)" : "rgb(241, 245, 249)"} 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>
                    {param.min}
                    {param.unit}
                  </span>
                  <span>
                    {param.max}
                    {param.unit}
                  </span>
                </div>

                <input
                  type="number"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) =>
                    updateParameter(
                      param.id,
                      parseFloat(e.target.value) || param.min,
                    )
                  }
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> These parameters will be sent
          to your ESP32 device when you click "Save Settings".
          The device will attempt to maintain these target
          values automatically.
        </p>
      </div>
    </div>
  );
}