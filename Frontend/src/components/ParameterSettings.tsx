import { useState } from "react";
import axios from "axios"; // Added for backend communication
import {
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Save,
} from "lucide-react";

export interface Parameter {
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
  parameters: Parameter[];
  onUpdateParameter: (id: string, value: number) => void;
  apiUrl: string; // Added: To send data to the correct backend endpoint
}

export function ParameterSettings({
  darkMode,
  parameters,
  onUpdateParameter,
  apiUrl, // Destructured
}: ParameterSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  const updateParameter = (id: string, value: number) => {
    onUpdateParameter(id, value);
  };

  const saveParameters = async () => {
    setIsSaving(true);

    // Map the current local parameter IDs to the naming convention used in your MongoDB/Arduino logic
    const configPayload = {
      tempLimit: parameters.find(p => p.id === 'temperature')?.value,
      humidityLimit: parameters.find(p => p.id === 'humidity')?.value,
      soilLimit: parameters.find(p => p.id === 'soilMoisture')?.value,
      sunlightLimit: parameters.find(p => p.id === 'sunlight')?.value,
      override: false // Saving parameters usually implies returning to Auto mode
    };

    try {
      // Send the bundled configuration to the Node.js server
      await axios.post(`${apiUrl}/config`, configPayload);
      console.log("Parameters successfully synced to backend:", configPayload);
    } catch (error) {
      console.error("Failed to sync parameters to backend.");
    } finally {
      // Brief delay for visual feedback on the button
      setTimeout(() => {
        setIsSaving(false);
      }, 8000);
    }
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
        <h3 className="text-slate-900 dark:text-white font-semibold">
          Target Thresholds
        </h3>
        <button
          onClick={saveParameters}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Syncing..." : "Save to System"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parameters.map((param) => {
          const colors = getColorClasses(param.color);
          return (
            <div
              key={param.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4 transition-all`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={colors.text}>{param.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {param.name}
                  </p>
                  <p className={`${colors.text} font-bold text-lg`}>
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
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>System Logic:</strong> Saving these settings will update the 
          Automation thresholds. The ESP32 will use these values to trigger 
          Fans, Pumps, and Misters until you switch back to Manual Mode.
        </p>
      </div>
    </div>
  );
}
