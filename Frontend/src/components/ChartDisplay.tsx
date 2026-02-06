import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDisplayProps {
  title: string;
  data: any[];
  dataKeys: string[];
  colors: string[];
  labels: string[];
  darkMode: boolean;
}

export function ChartDisplay({ title, data, dataKeys, colors, labels, darkMode }: ChartDisplayProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-slate-900 dark:text-white mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#475569' : '#e2e8f0'} 
            />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }}
              stroke={darkMode ? '#475569' : '#cbd5e1'}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: darkMode ? '#94a3b8' : '#64748b' }}
              stroke={darkMode ? '#475569' : '#cbd5e1'}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#1e293b' : 'white',
                border: `1px solid ${darkMode ? '#475569' : '#e2e8f0'}`,
                borderRadius: '8px',
                fontSize: '12px',
                color: darkMode ? '#f1f5f9' : '#0f172a',
              }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: '12px',
                color: darkMode ? '#cbd5e1' : '#64748b',
              }}
              iconType="line"
            />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={2}
                name={labels[index]}
                dot={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
