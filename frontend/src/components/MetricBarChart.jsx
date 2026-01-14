import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const MetricBarChart = ({ data }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const happySongs = data.filter(song => song.valence >= 0.5);
    const sadSongs = data.filter(song => song.valence < 0.5);

    const getAvg = (list, field) => {
      if (list.length === 0) return 0;
      const sum = list.reduce((acc, curr) => acc + (Number(curr[field]) || 0), 0);
      return parseFloat((sum / list.length).toFixed(2));
    };

    return [
      {
        metric: 'Energy',
        Happy: getAvg(happySongs, 'energy'),
        Sad: getAvg(sadSongs, 'energy'),
      },
      {
        metric: 'Danceability',
        Happy: getAvg(happySongs, 'danceability'),
        Sad: getAvg(sadSongs, 'danceability'),
      }
    ];
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={chartData} 
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
        
        <XAxis 
          dataKey="metric" 
          stroke="#ccc" 
          tick={{ fill: '#ccc', fontSize: 14, fontWeight: 'bold' }} 
          tickLine={false}
          axisLine={{ stroke: '#555' }}
        />
        
        <YAxis 
          stroke="#888" 
          tick={{ fill: '#888', fontSize: 12 }} 
          domain={[0, 1]} 
        />
        
        <Tooltip 
          cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #555', color: '#fff', borderRadius: '8px' }} 
        />
        
        <Legend wrapperStyle={{ paddingTop: '10px' }}/>
        
        <Bar 
          dataKey="Happy" 
          fill="#4caf50" 
          name="Happy (Valence > 0.5)" 
          radius={[4, 4, 0, 0]} 
        />
        
        <Bar 
          dataKey="Sad" 
          fill="#2196f3" 
          name="Sad (Valence < 0.5)" 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MetricBarChart;