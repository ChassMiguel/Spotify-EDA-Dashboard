import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const MoodLineChart = ({ data }) => {
  const chartData = useMemo(() => {
    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const grouped = {};
    
    daysOrder.forEach(day => {
      grouped[day] = { totalValence: 0, count: 0 };
    });

    data.forEach(song => {
      if (!song.snapshot_date || !song.valence) return;

      const dateObj = new Date(song.snapshot_date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

      if (grouped[dayName]) {
        grouped[dayName].totalValence += song.valence;
        grouped[dayName].count += 1;
      }
    });

    return daysOrder.map(day => {
      const item = grouped[day];
      return {
        day: day,
        avgValence: item.count > 0 ? (item.totalValence / item.count).toFixed(3) : 0
      };
    });

  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={chartData} 
        margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
        
        <XAxis 
          dataKey="day" 
          stroke="#888" 
          tick={{ fill: '#ccc', fontSize: 12 }} 
          tickFormatter={(day) => day.substring(0, 3)} 
        />

        <YAxis 
          stroke="#888" 
          domain={[0.4, 0.7]}
          tick={{ fill: '#888', fontSize: 12 }} 
          label={{ value: 'Happier ↑', angle: -90, position: 'insideLeft', fill: '#555' }}
        />
        
        <Tooltip 
          contentStyle={{ backgroundColor: '#222', border: '1px solid #555', borderRadius: '8px' }}
          itemStyle={{ color: '#1db954' }}
          formatter={(value) => [value, "Avg Valence"]}
          labelStyle={{ color: '#fff', fontWeight: 'bold' }}
        />

        <ReferenceLine y={0.5} stroke="#666" strokeDasharray="3 3" label={{ position: 'right', value: 'Neutral', fill: '#666', fontSize: 10 }} />

        <Line 
          type="monotone" 
          dataKey="avgValence" 
          stroke="#1db954"
          strokeWidth={4} 
          dot={{ r: 6, fill: '#1db954', stroke: '#fff', strokeWidth: 2 }} 
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodLineChart;