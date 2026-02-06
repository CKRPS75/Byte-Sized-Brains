import { ControlPanel } from './ControlPanel';
import { ParameterSettings, Parameter } from './ParameterSettings';

interface ControlPanelPageProps {
  darkMode: boolean;
  parameters: Parameter[];
  onUpdateParameter: (id: string, value: number) => void;
  config: any;   // Added: Live configuration (relay states) from App.tsx
  apiUrl: string; // Added: Backend URL for direct API calls
}

export function ControlPanelPage({ 
  darkMode, 
  parameters, 
  onUpdateParameter,
  config, // Added
  apiUrl  // Added
}: ControlPanelPageProps) {
  return (
    <div className="space-y-8">
      {/* Manual Device Control */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Manual Device Control</h2>
        {/* Pass the live config and API URL to the sub-component */}
        <ControlPanel 
          darkMode={darkMode} 
          config={config} 
          apiUrl={apiUrl} 
        />
      </div>

      {/* Parameter Settings */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Target Parameter Settings</h2>
        <ParameterSettings 
          darkMode={darkMode} 
          parameters={parameters}
          onUpdateParameter={onUpdateParameter}
        />
      </div>

      {/* Information Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white mb-3">How It Works</h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Manual Control</h4>
            <p>Toggle individual devices on/off directly. Commands are sent immediately to your ESP32 device.</p>
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Parameter Settings</h4>
            <p>Set target values for environmental conditions. Your ESP32 will automatically adjust connected devices to maintain these targets.</p>
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Automation</h4>
            <p>When parameter settings are saved, the system operates in automatic mode. Switch back to manual control anytime for direct device management.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
