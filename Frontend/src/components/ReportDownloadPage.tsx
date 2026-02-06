import { StatisticsDownload } from './StatisticsDownload';
import { FileSpreadsheet, TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface ReportDownloadPageProps {
  darkMode: boolean;
  apiUrl: string; // Added to receive the backend URL from Dashboard.tsx
}

export function ReportDownloadPage({ darkMode, apiUrl }: ReportDownloadPageProps) {
  return (
    <div className="space-y-8">
      {/* Statistics Download */}
      <div>
        <h2 className="text-slate-900 dark:text-white mb-4">Export Sensor Data</h2>
        {/* Passing apiUrl so StatisticsDownload can trigger the CSV export route */}
        <StatisticsDownload darkMode={darkMode} apiUrl={apiUrl} />
      </div>

      {/* Report Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white">Detailed Data</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Export includes all sensor readings with timestamps from MongoDB, ready for analysis in Excel or other tools.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white">Statistics</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Automatic calculations of averages, min/max values, and trends for each sensor parameter based on historical logs.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white">Date Range</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Choose from predefined ranges or select custom dates to export exactly the data you need from your database.
          </p>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 rounded-lg shadow-sm p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-0.5" />
          <div>
            <h3 className="text-slate-900 dark:text-white mb-2">Using Your Reports</h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p><strong>Data Analysis:</strong> Open the Excel file to create custom charts, pivot tables, and perform statistical analysis.</p>
              <p><strong>Compliance:</strong> Maintain historical records for agricultural or environmental monitoring compliance requirements.</p>
              <p><strong>Optimization:</strong> Identify patterns and optimize your environmental control strategies based on historical trends.</p>
              <p><strong>Sharing:</strong> Share reports with team members, consultants, or stakeholders for collaborative decision-making.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}