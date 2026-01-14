import React, { useMemo } from 'react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  ReferenceLine
} from 'recharts';

const ViralScatterPlot = ({ data }) => {
  const { chartData, trendData } = useMemo(() => {
    const formattedData = data
      .slice(0, 500)
      .map(song => ({
        x: song.tempo || 0,
        y: song.daily_movement || 0,
        name: song.name
      }))
      .filter(item => item.x > 0 && item.x < 250);

    const n = formattedData.length;
    if (n === 0) return { chartData: [], trendData: [] };

    const sumX = formattedData.reduce((acc, p) => acc + p.x, 0);
    const sumY = formattedData.reduce((acc, p) => acc + p.y, 0);
    const sumXY = formattedData.reduce((acc, p) => acc + (p.x * p.y), 0);
    const sumXX = formattedData.reduce((acc, p) => acc + (p.x * p.x), 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...formattedData.map(d => d.x));
    const maxX = Math.max(...formattedData.map(d => d.x));

    const trendLine = [
      { x: minX, y: slope * minX + intercept },
      { x: maxX, y: slope * maxX + intercept }
    ];

    return { chartData: formattedData, trendData: trendLine };
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart 
        margin={{ top: 10, right: 30, bottom: 20, left: 10 }}
      >
        <CartesianGrid stroke="#333" strokeDasharray="3 3" vertical={false} />
        
        <ReferenceLine y={0} stroke="#555" strokeWidth={1} />

        <XAxis 
          type="number" 
          dataKey="x" 
          name="Tempo" 
          unit=" BPM" 
          stroke="#666" 
          tick={{ fill: '#888', fontSize: 12 }}
          label={{ value: 'Tempo (BPM)', position: 'insideBottom', offset: -10, fill: '#888', fontSize: 12 }} 
          domain={['dataMin - 10', 'dataMax + 10']}
        />

        <YAxis 
          type="number" 
          dataKey="y" 
          name="Movement" 
          stroke="#666" 
          tick={{ fill: '#888', fontSize: 12 }}
          label={{ 
            value: 'Movement', 
            angle: -90, 
            position: 'insideLeft', 
            style: { textAnchor: 'middle', fill: '#888', fontSize: 12 },
            dx: 5
          }} 
        />

        <Tooltip 
          cursor={{ strokeDasharray: '3 3', stroke: '#555' }}
          contentStyle={{ backgroundColor: '#252525', border: '1px solid #444', borderRadius: '4px', color: '#fff' }}
        />

        <Legend 
          verticalAlign="top" 
          align="right" 
          iconType="circle"
          wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
        />

        <Scatter 
          name="Songs" 
          data={chartData} 
          fill="#1f77b4" 
          shape="circle" 
          fillOpacity={0.6} 
        />

        <Scatter 
          name="Trend Line" 
          data={trendData} 
          line={{ stroke: '#ff4d4d', strokeWidth: 2, strokeDasharray: '4 4' }} 
          lineType="fitting"
          shape={() => null} 
          legendType="line"
          isAnimationActive={false}
        />

      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ViralScatterPlot;