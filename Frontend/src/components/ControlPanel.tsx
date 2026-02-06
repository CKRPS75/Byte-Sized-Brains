import { useState, useEffect } from 'react';
import axios from 'axios';
import { Fan, Droplet, Wind, Lightbulb, Power } from 'lucide-react';

interface ControlDevice {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: boolean;
  color: string;
}

interface ControlPanelProps {
  darkMode: boolean;
  config: any;
  apiUrl: string;
}

export function ControlPanel({ darkMode, config, apiUrl }: ControlPanelProps) {
  const [devices, setDevices] = useState<ControlDevice[]>([
    { id: 'fan', name: 'Fan', icon: <Fan className="w-5 h-5" />, status: false, color: 'orange' },
    { id: 'pump', name: 'Water Pump', icon: <Droplet className="w-5 h-5" />, status: false, color: 'green' },
    { id: 'humidifier', name: 'Humidifier', icon: <Wind className="w-5 h-5" />, status: false, color: 'blue' },
    { id: 'uvlights', name: 'UV Lights', icon: <Lightbulb className="w-5 h-5" />, status: false, color: 'yellow' },
  ]);

  // Sync internal device state with MongoDB config
  useEffect(() => {
    if (config) {
      setDevices(prev => prev.map(device => {
        if (device.id === 'fan') return { ...device, status: config.fanStatus };
        if (device.id === 'pump') return { ...device, status: config.pumpStatus };
        if (device.id === 'humidifier') return { ...device, status: config.misterStatus }; // Mapping to misterStatus
        if (device.id === 'uvlights') return { ...device, status: config.lightStatus };   // Mapping to lightStatus
        return device;
      }));
    }
  }, [config]);

  const updateSystemConfig = async (updatedFields: any) => {
    try {
      // Ensure we send all fields so MongoDB findOneAndUpdate works correctly
      const fullNewConfig = { ...config, ...updatedFields };
      await axios.post(`${apiUrl}/admin/config`, fullNewConfig);
    } catch (error) {
      console.error("Failed to update hardware status:", error);
    }
  };

  const toggleDevice = (id: string) => {
    if (!config.override) {
      alert("Please enable 'Manual Override' first to control devices!");
      return;
    }

    const device = devices.find(d => d.id === id);
    if (!device) return;

    // Fixed Mapping: Matches your server.js schema fields
    if (id === 'fan') updateSystemConfig({ fanStatus: !device.status });
    if (id === 'pump') updateSystemConfig({ pumpStatus: !device.status });
    if (id === 'humidifier') updateSystemConfig({ misterStatus: !device.status });
    if (id === 'uvlights') updateSystemConfig({ lightStatus: !device.status });
  };

  // ... (getColorClasses function remains the same)
  const getColorClasses = (color: string, status: boolean) => {
    const colors: Record<string, { bg: string; border: string; text: string; button: string; buttonHover: string }> = {
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        button: status ? 'bg-orange-500 dark:bg-orange-600' : 'bg-slate-200 dark:bg-slate-700',
        buttonHover: status ? 'hover:bg-orange-600 dark:hover:bg-orange-700' : 'hover:bg-slate-300 dark:hover:bg-slate-600',
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        button: status ? 'bg-blue-500 dark:bg-blue-600' : 'bg-slate-200 dark:bg-slate-700',
        buttonHover: status ? 'hover:bg-blue-600 dark:hover:bg-blue-700' : 'hover:bg-slate-300 dark:hover:bg-slate-600',
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        button: status ? 'bg-green-500 dark:bg-green-600' : 'bg-slate-200 dark:bg-slate-700',
        buttonHover: status ? 'hover:bg-green-600 dark:hover:bg-green-700' : 'hover:bg-slate-300 dark:hover:bg-slate-600',
      },
      yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        button: status ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-slate-200 dark:bg-slate-700',
        buttonHover: status ? 'hover:bg-yellow-600 dark:hover:bg-yellow-700' : 'hover:bg-slate-300 dark:hover:bg-slate-600',
      },
    };
    return colors[color];
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-slate-900 dark:text-white">Manual Device Control</h3>
        <button 
          onClick={() => updateSystemConfig({ override: !config.override })}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${config.override ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}
        >
          <Power className="w-4 h-4" />
          {config.override ? "Manual Override: ON" : "Enable Manual Override"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map((device) => {
          const colors = getColorClasses(device.color, device.status);
          return (
            <div
              key={device.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4 transition-all ${!config.override && 'opacity-60 cursor-not-allowed'}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={colors.text}>{device.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${device.status ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {device.status ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{device.name}</p>
              <button
                disabled={!config.override}
                onClick={() => toggleDevice(device.id)}
                className={`w-full py-2 rounded-lg transition-colors text-white text-sm ${colors.button} ${colors.buttonHover} disabled:cursor-not-allowed`}
              >
                {device.status ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}