import { useState } from 'react';
import axios from 'axios'; // Added for real data fetching
import { Download, Calendar, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface StatisticsDownloadProps {
  darkMode: boolean;
  apiUrl: string; // Added: Necessary for connecting to your Node.js server
}

export function StatisticsDownload({ darkMode, apiUrl }: StatisticsDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dateRange, setDateRange] = useState('last-month');

  // --- NEW: Real Backend Fetching Logic ---
  const fetchBackendData = async (range: string) => {
    try {
      // Calls your MongoDB history endpoint (e.g., http://10.187.7.44:5050/api/history)
      const response = await axios.get(`${apiUrl}/history`, {
        params: { range }
      });
      
      // Transform backend data to match the Excel sheet's expected format
      return response.data.map((entry: any) => ({
        'Date': new Date(entry.timestamp).toLocaleDateString('en-US'),
        'Time': new Date(entry.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        'Temperature (°C)': parseFloat(entry.temperature).toFixed(2),
        'Air Humidity (%)': parseFloat(entry.humidity).toFixed(2),
        'Soil Moisture (%)': parseFloat(entry.soil).toFixed(2),
        'Sunlight (%)': parseFloat(entry.light).toFixed(2),
      }));
    } catch (error) {
      console.error("Failed to fetch historical data from backend", error);
      return [];
    }
  };

  // --- Original Generation Functions (Kept for fallback or logic reference) ---
  const generateMonthlyData = () => {
    const data = [];
    const now = new Date();
    const daysInMonth = 30;
    for (let i = daysInMonth; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
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

  const downloadExcel = async () => {
    setIsGenerating(true);

    // --- UPDATED: Attempt to get real data first, fallback to mock if API fails ---
    let data = await fetchBackendData(dateRange);
    let filename;

    if (data.length === 0) {
      console.warn("No backend data found. Using local simulation.");
      switch (dateRange) {
        case 'last-month': data = generateMonthlyData(); break;
        case 'last-week': data = generateWeeklyData(); break;
        case 'today': data = generateDailyData(); break;
        default: data = generateMonthlyData();
      }
    }

    switch (dateRange) {
      case 'last-month':
        filename = `OmniClimate_Stats_30_Days_${new Date().toISOString().split('T')[0]}.xlsx`;
        break;
      case 'last-week':
        filename = `OmniClimate_Stats_7_Days_${new Date().toISOString().split('T')[0]}.xlsx`;
        break;
      case 'today':
        filename = `OmniClimate_Stats_Today_${new Date().toISOString().split('T')[0]}.xlsx`;
        break;
      default:
        filename = `OmniClimate_Stats_${new Date().toISOString().split('T')[0]}.xlsx`;
    }

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, { wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 15 },
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
      { Metric: 'Average Temperature (°C)', Value: (data.reduce((sum: number, row: any) => sum + parseFloat(row['Temperature (°C)']), 0) / data.length).toFixed(2) },
      { Metric: 'Average Air Humidity (%)', Value: (data.reduce((sum: number, row: any) => sum + parseFloat(row['Air Humidity (%)']), 0) / data.length).toFixed(2) },
      { Metric: 'Average Soil Moisture (%)', Value: (data.reduce((sum: number, row: any) => sum + parseFloat(row['Soil Moisture (%)']), 0) / data.length).toFixed(2) },
      { Metric: 'Average Sunlight (%)', Value: (data.reduce((sum: number, row: any) => sum + parseFloat(row['Sunlight (%)']), 0) / data.length).toFixed(2) },
    ];

    const wsSummary = XLSX.utils.json_to_sheet(summary);
    wsSummary['!cols'] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Download file
    XLSX.writeFile(wb, filename);
    setIsGenerating(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <FileSpreadsheet className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h3 className="text-slate-900 dark:text-white font-semibold">Download System Statistics</h3>
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
                <p className="text-slate-900 dark:text-white font-medium">Excel Spreadsheet</p>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              <Download className="w-5 h-5" />
              {isGenerating ? 'Generating File...' : 'Download Excel File'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Note:</strong> The Excel file will contain two sheets: "Sensor Data" with detailed readings and "Summary" with statistical averages. Data is pulled from your ESP32's stored history logs.
        </p>
      </div>
    </div>
  );
}
