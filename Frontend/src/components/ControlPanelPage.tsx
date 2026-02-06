import { ControlPanel } from './ControlPanel';
import { ParameterSettings } from './ParameterSettings';

interface ControlPanelPageProps {
  darkMode: boolean;
  config: any;   // Added to receive the live configuration from MongoDB
  apiUrl: string; // Added to receive the backend endpoint URL
}

export function ControlPanelPage({ darkMode, config, apiUrl }: ControlPanelPageProps) {
  return (
    <div className="space-y-8">
      {/* Manual Device Control */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Manual Device Control</h2>
        {/* Passing config and apiUrl to enable real-time hardware toggles */}
        <ControlPanel darkMode={darkMode} config={config} apiUrl={apiUrl} />
      </div>

      {/* Parameter Settings */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Target Parameter Settings</h2>
        {/* Passing config and apiUrl to update dynamic thresholds in the database */}
        <ParameterSettings darkMode={darkMode} config={config} apiUrl={apiUrl} />
      </div>

      {/* Information Panel */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-white mb-3">How It Works</h3>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Manual Control</h4>
            <p>Toggle individual devices on/off directly. Commands are updated in MongoDB and picked up by your ESP32 during its next sync.</p>
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Parameter Settings</h4>
            <p>Set target values for environmental conditions. Your ESP32 will automatically adjust connected devices to maintain these targets based on the cloud configuration.</p>
          </div>
          <div>
            <h4 className="text-slate-800 dark:text-slate-200 mb-1">Automation</h4>
            <p>When parameter settings are saved, the system operates in automatic mode. Switch back to manual control anytime for direct device management through the dashboard override.</p>
          </div>
        </div>
      </div>
    </div>
  );
}