import { Activity, Sliders, FileBarChart, Sprout } from 'lucide-react';

interface NavigationProps {
  currentPage: 'live-feed' | 'control-panel' | 'report' | 'crop-presets';
  onPageChange: (page: 'live-feed' | 'control-panel' | 'report' | 'crop-presets') => void;
  darkMode: boolean;
  userRole: string; // Added prop for Role-Based Access Control
}

export function Navigation({ currentPage, onPageChange, darkMode, userRole }: NavigationProps) {
  const navItems = [
    {
      id: 'live-feed' as const,
      label: 'Live Feed',
      icon: <Activity className="w-5 h-5" />,
      allowedRoles: ['manager', 'farmer'], // Everyone sees the live feed
    },
    {
      id: 'control-panel' as const,
      label: 'Control Panel',
      icon: <Sliders className="w-5 h-5" />,
      allowedRoles: ['manager', 'farmer'], // Everyone can access control
    },
    {
      id: 'crop-presets' as const,
      label: 'Crop Presets',
      icon: <Sprout className="w-5 h-5" />,
      allowedRoles: ['manager'], // Only the manager can set presets
    },
    {
      id: 'report' as const,
      label: 'Report Download',
      icon: <FileBarChart className="w-5 h-5" />,
      allowedRoles: ['manager'], // Only the manager can download reports
    },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto">
      {navItems.map((item) => {
        // --- ROLE FILTER LOGIC ---
        // If the current user's role is not in the allowedRoles list, do not render this button
        if (!item.allowedRoles.includes(userRole)) return null;

        const isActive = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
              isActive
                ? 'bg-orange-500 dark:bg-orange-600 text-white shadow-md'
                : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
