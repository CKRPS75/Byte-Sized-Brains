import { ReactNode } from 'react';

interface SensorCardProps {
  title: string;
  value: string;
  unit: string;
  icon: ReactNode;
  color: 'orange' | 'blue' | 'green' | 'yellow';
  min: number;
  max: number;
  current: number;
  darkMode: boolean;
}

const colorStyles = {
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    progress: 'bg-orange-500 dark:bg-orange-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    progress: 'bg-blue-500 dark:bg-blue-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    progress: 'bg-green-500 dark:bg-green-400',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    progress: 'bg-yellow-500 dark:bg-yellow-400',
  },
};

export function SensorCard({ title, value, unit, icon, color, min, max, current, darkMode }: SensorCardProps) {
  const styles = colorStyles[color];
  
  // Logic: Calculate the progress percentage for the visual bar based on current ESP32 readings
  const percentage = ((current - min) / (max - min)) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{title}</p>
          <div className="flex items-baseline gap-1">
            {/* Real-time value from the backend */}
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>
          </div>
        </div>
        <div className={`${styles.bg} ${styles.text} p-3 rounded-lg border ${styles.border} shadow-sm`}>
          {icon}
        </div>
      </div>
      
      {/* Progress bar: Dynamically updates as sensor data changes */}
      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden shadow-inner">
        <div
          className={`${styles.progress} h-full rounded-full transition-all duration-1000 ease-in-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          MIN: {min}{unit}
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          MAX: {max}{unit}
        </span>
      </div>
    </div>
  );
}
