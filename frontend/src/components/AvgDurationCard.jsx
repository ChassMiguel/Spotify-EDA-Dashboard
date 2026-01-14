import React, { useMemo } from 'react';

const AvgDurationCard = ({ data }) => {
  
  const durationStr = useMemo(() => {
    if (!data || data.length === 0) return "0:00";

    const totalMs = data.reduce((acc, song) => acc + (Number(song.duration_ms) || 0), 0);
    
    const avgMs = totalMs / data.length;

    const totalSeconds = Math.floor(avgMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [data]);

  return (
    <div style={cardStyle}>
      <h4 style={{ margin: 0, color: '#aaa' }}>Avg Duration</h4>
      <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>
        {durationStr}
      </span>
    </div>
  );
};

const cardStyle = {
  background: '#232323',
  borderRadius: '15px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', 
  alignItems: 'center',
  flex: 1,
  minHeight: '100px'
};

export default AvgDurationCard;