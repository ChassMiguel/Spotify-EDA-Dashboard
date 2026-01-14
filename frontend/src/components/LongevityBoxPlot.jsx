import React, { useMemo } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BoxPlotShape = (props) => {
  const { x, y, width, height, payload } = props;

  if (!payload || height <= 0) return null;

  const { min, q1, median, q3, max } = payload;
  if (min == null || max == null) return null;

  const valueToPixel = (value) => {
    const ratio = value / max;
    return y + height * (1 - ratio);
  };

  const pixelMin = valueToPixel(min);
  const pixelQ1 = valueToPixel(q1);
  const pixelMedian = valueToPixel(median);
  const pixelQ3 = valueToPixel(q3);
  const pixelMax = valueToPixel(max);

  const center = x + width / 2;
  const boxWidth = Math.min(width * 0.6, 60);

  const color = payload.type === 'Clean' ? '#66C2A5' : '#FC8D62';
  const strokeColor = '#ddd';

  return (
    <g>
      <line x1={center} y1={pixelMin} x2={center} y2={pixelQ1} stroke={strokeColor} strokeWidth={2} />
      <line x1={center} y1={pixelQ3} x2={center} y2={pixelMax} stroke={strokeColor} strokeWidth={2} />

      <line x1={center - boxWidth / 4} y1={pixelMin} x2={center + boxWidth / 4} y2={pixelMin} stroke={strokeColor} strokeWidth={2} />
      <line x1={center - boxWidth / 4} y1={pixelMax} x2={center + boxWidth / 4} y2={pixelMax} stroke={strokeColor} strokeWidth={2} />

      <rect
        x={center - boxWidth / 2}
        y={pixelQ3}
        width={boxWidth}
        height={Math.max(pixelQ1 - pixelQ3, 2)}
        fill={color}
        stroke={strokeColor}
        rx={4}
      />

      <line
        x1={center - boxWidth / 2}
        y1={pixelMedian}
        x2={center + boxWidth / 2}
        y2={pixelMedian}
        stroke="#333"
        strokeWidth={3}
      />
    </g>
  );
};

const getBoxPlotValues = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null;
  const sorted = [...dataArray].sort((a, b) => a - b);
  
  const quantile = (arr, q) => {
    const pos = (arr.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
      return sorted[base];
    }
  };

  return {
    min: sorted[0],
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.50),
    q3: quantile(sorted, 0.75),
    max: sorted[sorted.length - 1]
  };
};

const LongevityBoxPlot = ({ data }) => {
  
  const { chartData, maxVal } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], maxVal: 100 };

    const songCounts = {};
    data.forEach(row => {
      const id = row.spotify_id;
      if (!songCounts[id]) {
        let isExplicit = row.is_explicit;
        if (typeof isExplicit === 'string') isExplicit = isExplicit === 'true' || isExplicit === 'True';
        
        songCounts[id] = { count: 0, isExplicit };
      }
      songCounts[id].count += 1;
    });

    const cleanArr = [];
    const explicitArr = [];
    Object.values(songCounts).forEach(item => {
      if (item.isExplicit) explicitArr.push(item.count);
      else cleanArr.push(item.count);
    });

    const cleanStats = getBoxPlotValues(cleanArr);
    const explicitStats = getBoxPlotValues(explicitArr);

    const result = [];
    let globalMax = 0;

    if (cleanStats) {
      result.push({ type: 'Clean', ...cleanStats });
      globalMax = Math.max(globalMax, cleanStats.max);
    }
    if (explicitStats) {
      result.push({ type: 'Explicit', ...explicitStats });
      globalMax = Math.max(globalMax, explicitStats.max);
    }

    return { chartData: result, maxVal: globalMax };
  }, [data]);

  if (!chartData.length) return <div style={{color: '#888'}}>Loading Data...</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
        
        <XAxis 
          dataKey="type" 
          stroke="#ccc" 
          tick={{ fill: '#ccc', fontSize: 14 }}
          tickLine={false}
        />
        
        <YAxis 
          stroke="#ccc" 
          domain={[0, dataMax => Math.ceil(dataMax * 1.1)]} 
        />
        
        <Tooltip 
          cursor={{ fill: 'transparent' }}
          contentStyle={{ backgroundColor: '#222', border: '1px solid #444', borderRadius: '8px' }}
          formatter={(value, name, props) => {
            const { min, q1, median, q3, max } = props.payload;
            if (name === 'max') return [null, null];
            return [
              <div key="stats" style={{ textAlign: 'left', color: '#ccc' }}>
                <div>Max: {max} days</div>
                <div>Q3: {Math.round(q3)}</div>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>Median: {Math.round(median)}</div>
                <div>Q1: {Math.round(q1)}</div>
                <div>Min: {min}</div>
              </div>, 
              ''
            ];
          }}
        />
        <Bar
          dataKey="max"
          barSize={60}
          isAnimationActive={false}
          shape={(props) => <BoxPlotShape {...props} />}
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default LongevityBoxPlot;