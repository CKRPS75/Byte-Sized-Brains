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
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <h3 className="text-slate-900 dark:text-white font-semibold mb-4">{title}</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#334155' : '#f1f5f9'} // Refined grid visibility for dark mode
            />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }}
              stroke={darkMode ? '#475569' : '#cbd5e1'}
              minTickGap={30}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }}
              stroke={darkMode ? '#475569' : '#cbd5e1'}
              domain={[0, 'auto']} // Ensures graphs scale based on real sensor data
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ fontWeight: 500 }}
              labelStyle={{ color: darkMode ? '#94a3b8' : '#64748b', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '11px',
                color: darkMode ? '#cbd5e1' : '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.025em'
              }}
              iconType="circle"
              iconSize={8}
            />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={2.5} // Increased thickness for better visibility
                name={labels[index]}
                dot={false}
                isAnimationActive={false} // Disabled for zero-latency real-time updates
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
