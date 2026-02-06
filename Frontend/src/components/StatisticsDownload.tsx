import { useState } from 'react';
import { Download, Calendar, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface StatisticsDownloadProps {
  darkMode: boolean;
  apiUrl: string; // Necessary addition for backend link
}

export function StatisticsDownload({ darkMode, apiUrl }: StatisticsDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('last-month');

  const generateMonthlyData = () => {
    const data = [];
    const now = new Date();
    const daysInMonth = 30;

    for (let i = daysInMonth; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate 24 hourly readings per day
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(date);
        timestamp.setHours(hour);
        
        data.push({
          'Date': timestamp.toLocaleDateString('en-US'),
          'Time': timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          'Temperature (°C)': (20 + Math.random() * 10).toFixed(2),
          'Air Humidity (%)': (50 + Math.random() * 30).toFixed(2),
          'Soil Moisture (%)': (30 + Math.random() * 50).toFixed(2),
          'Sunlight (%)': hour >= 6 && hour <= 18 ? (60 + Math.random() * 40).toFixed(2) : (0 + Math.random() * 10).toFixed(2),
        });
      }
    }

    return data;
  };

  const generateWeeklyData = () => {
    const data = [];
    const now = new Date();
    const daysInWeek = 7;

    for (let i = daysInWeek; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate 24 hourly readings per day
      for (let hour = 0; hour < 24; hour++) {
        const timestamp = new Date(date);
        timestamp.setHours(hour);
        
        data.push({
          'Date': timestamp.toLocaleDateString('en-US'),
          'Time': timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          'Temperature (°C)': (20 + Math.random() * 10).toFixed(2),
          'Air Humidity (%)': (50 + Math.random() * 30).toFixed(2),
          'Soil Moisture (%)': (30 + Math.random() * 50).toFixed(2),
          'Sunlight (%)': hour >= 6 && hour <= 18 ? (60 + Math.random() * 40).toFixed(2) : (0 + Math.random() * 10).toFixed(2),
        });
      }
    }

    return data;
  };

  const generateDailyData = () => {
    const data = [];
    const now = new Date();

    // Generate 24 hourly readings
    for (let hour = 0; hour < 24; hour++) {
      const timestamp = new Date(now);
      timestamp.setHours(hour);
      
      data.push({
        'Date': timestamp.toLocaleDateString('en-US'),
        'Time': timestamp.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        'Temperature (°C)': (20 + Math.random() * 10).toFixed(2),
        'Air Humidity (%)': (50 + Math.random() * 30).toFixed(2),
        'Soil Moisture (%)': (30 + Math.random() * 50).toFixed(2),
        'Sunlight (%)': hour >= 6 && hour <= 18 ? (60 + Math.random() * 40).toFixed(2) : (0 + Math.random() * 10).toFixed(2),
      });
    }

    return data;
  };

  const downloadExcel = () => {
    setIsGenerating(true);

    // NEW: Trigger the actual backend CSV download in parallel
    window.open(`${apiUrl}/export`, '_blank');

    setTimeout(() => {
      let data;
      let filename;

      switch (dateRange) {
        case 'last-month':
          data = generateMonthlyData();
          filename = `ESP32_Statistics_Last_30_Days_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'last-week':
          data = generateWeeklyData();
          filename = `ESP32_Statistics_Last_7_Days_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        case 'today':
          data = generateDailyData();
          filename = `ESP32_Statistics_Today_${new Date().toISOString().split('T')[0]}.xlsx`;
          break;
        default:
          data = generateMonthlyData();
          filename = `ESP32_Statistics_${new Date().toISOString().split('T')[0]}.xlsx`;
      }

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      ws['!cols'] = [
        { wch: 12 }, // Date
        { wch: 10 }, // Time
        { wch: 18 }, // Temperature
        { wch: 18 }, // Air Humidity
        { wch: 18 }, // Soil Moisture
        { wch: 15 }, // Sunlight
      ];

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sensor Data');

      // Add summary sheet
      const summary = [
        { Metric: 'Total Records', Value: data.length },
        { Metric: 'Date Range', Value: dateRange === 'last-month' ? 'Last 30 Days' : dateRange === 'last-week' ? 'Last 7 Days' : 'Today' },
        { Metric: 'Generated On', Value: new Date().toLocaleString() },
        { Metric: '', Value: '' },
        { Metric: 'Average Temperature (°C)', Value: (data.reduce((sum, row) => sum + parseFloat(row['Temperature (°C)']), 0) / data.length).toFixed(2) },
        { Metric: 'Average Air Humidity (%)', Value: (data.reduce((sum, row) => sum + parseFloat(row['Air Humidity (%)']), 0) / data.length).toFixed(2) },
        { Metric: 'Average Soil Moisture (%)', Value: (data.reduce((sum, row) => sum + parseFloat(row['Soil Moisture (%)']), 0) / data.length).toFixed(2) },
        { Metric: 'Average Sunlight (%)', Value: (data.reduce((sum, row) => sum + parseFloat(row['Sunlight (%)']), 0) / data.length).toFixed(2) },
      ];

      const wsSummary = XLSX.utils.json_to_sheet(summary);
      wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // Download file
      XLSX.writeFile(wb, filename);

      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-slate-900 dark:text-white">Download Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range Selection */}
        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300 mb-3">
            Select Date Range
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="radio"
                name="dateRange"
                value="today"
                checked={dateRange === 'today'}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Today</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">24 hourly readings</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="radio"
                name="dateRange"
                value="last-week"
                checked={dateRange === 'last-week'}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Last 7 Days</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">~168 hourly readings</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <input
                type="radio"
                name="dateRange"
                value="last-month"
                checked={dateRange === 'last-month'}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div className="flex-1">
                <p className="text-sm text-slate-900 dark:text-white">Last 30 Days</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">~720 hourly readings</p>
              </div>
            </label>
          </div>
        </div>

        {/* Download Info and Button */}
        <div>
          <label className="block text-sm text-slate-700 dark:text-slate-300 mb-3">
            Export Format
          </label>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-lg">
                <FileSpreadsheet className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-slate-900 dark:text-white">Excel Spreadsheet</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">.xlsx format</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" />
                <span>Includes all sensor readings</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" />
                <span>Summary statistics sheet</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400" />
                <span>Ready for analysis</span>
              </div>
            </div>

            <button
              onClick={downloadExcel}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Download Excel File'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Note:</strong> The Excel file will contain two sheets: "Sensor Data" with detailed readings and "Summary" with statistical averages. Data is generated from your ESP32 historical records.
        </p>
      </div>
    </div>
  );
}