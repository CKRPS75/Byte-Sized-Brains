import { useEffect, useState } from 'react';
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
  config: any;   // Added: Live configuration from App.tsx
  apiUrl: string; // Added: Backend URL
}

export function ControlPanel({ darkMode, config, apiUrl }: ControlPanelProps) {
  // Use the 'override' status from the database as the source of truth for Manual Mode
  const isManualMode = config.override;

  const [devices, setDevices] = useState<ControlDevice[]>([
    {
      id: 'fanStatus',
      name: 'Fan',
      icon: <Fan className={`w-5 h-5 ${config.fanStatus ? 'animate-spin' : ''}`} />,
      status: config.fanStatus,
      color: 'orange',
    },
    {
      id: 'pumpStatus',
      name: 'Water Pump',
      icon: <Droplet className="w-5 h-5" />,
      status: config.pumpStatus,
      color: 'green',
    },
    {
      id: 'misterStatus',
      name: 'Humidifier',
      icon: <Wind className="w-5 h-5" />,
      status: config.misterStatus,
      color: 'blue',
    },
    {
      id: 'lightStatus',
      name: 'UV Lights',
      icon: <Lightbulb className="w-5 h-5" />,
      status: config.lightStatus,
      color: 'yellow',
    },
  ]);

  // Sync internal device state whenever the global config (from App.tsx) updates
  useEffect(() => {
    setDevices([
      { id: 'fanStatus', name: 'Fan', icon: <Fan className={`w-5 h-5 ${config.fanStatus ? 'animate-spin' : ''}`} />, status: config.fanStatus, color: 'orange' },
      { id: 'pumpStatus', name: 'Water Pump', icon: <Droplet className="w-5 h-5" />, status: config.pumpStatus, color: 'green' },
      { id: 'misterStatus', name: 'Humidifier', icon: <Wind className="w-5 h-5" />, status: config.misterStatus, color: 'blue' },
      { id: 'lightStatus', name: 'UV Lights', icon: <Lightbulb className="w-5 h-5" />, status: config.lightStatus, color: 'yellow' },
    ]);
  }, [config]);

  const toggleDevice = async (id: string) => {
    if (!isManualMode) return;
    
    // Find the current status and flip it
    const currentDevice = devices.find(d => d.id === id);
    if (!currentDevice) return;

    try {
      // Send update to Node.js backend
      await axios.post(`${apiUrl}/config`, {
        [id]: !currentDevice.status
      });
    } catch (error) {
      console.error(`Failed to toggle ${id}`);
    }
  };

  const toggleManualMode = async () => {
    try {
      // Toggle the 'override' flag in the database
      await axios.post(`${apiUrl}/config`, {
        override: !isManualMode
      });
    } catch (error) {
      console.error("Failed to toggle Manual Mode");
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-semibold">Device Control</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isManualMode ? 'Manual control enabled' : 'System is running in automatic mode'}
          </p>
        </div>
        
        <button
          onClick={toggleManualMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium ${
            isManualMode 
              ? 'bg-orange-500 text-white shadow-md hover:bg-orange-600' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
          }`}
        >
          <Power className="w-4 h-4" />
          {isManualMode ? 'Manual Mode: ON' : 'Manual Mode: OFF'}
        </button>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-300 ${!isManualMode ? 'opacity-60 pointer-events-none grayscale-[0.5]' : ''}`}>
        {devices.map((device) => {
          const colors = getColorClasses(device.color, device.status);
          return (
            <div
              key={device.id}
              className={`${colors.bg} border ${colors.border} rounded-lg p-4 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={colors.text}>
                  {device.icon}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${device.status ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                  {device.status ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{device.name}</p>
              <button
                onClick={() => toggleDevice(device.id)}
                disabled={!isManualMode}
                className={`w-full py-2 rounded-lg transition-colors text-white text-sm ${colors.button} ${colors.buttonHover} disabled:cursor-not-allowed`}
              >
                {device.status ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          );
        })}
      </div>
      
      {!isManualMode && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          Automatic control active. Enable Manual Mode to override.
        </div>
      )}
    </div>
  );
}
