import { Activity, Sliders, FileBarChart } from 'lucide-react';

interface NavigationProps {
  currentPage: 'live-feed' | 'control-panel' | 'report';
  onPageChange: (page: 'live-feed' | 'control-panel' | 'report') => void;
  darkMode: boolean;
}

export function Navigation({ currentPage, onPageChange, darkMode }: NavigationProps) {
  const navItems = [
    {
      id: 'live-feed' as const,
      label: 'Live Feed',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'control-panel' as const,
      label: 'Control Panel',
      icon: <Sliders className="w-5 h-5" />,
    },
    {
      id: 'report' as const,
      label: 'Report Download',
      icon: <FileBarChart className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="flex gap-2 overflow-x-auto">
      {navItems.map((item) => {
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
