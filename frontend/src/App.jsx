import { useEffect, useState } from "react";
import axios from 'axios'
import './App.css'

import LongevityBoxPlot from './components/LongevityBoxPlot';
import MoodLineChart from './components/MoodLineChart';
import MetricBarChart from './components/MetricBarChart';
import ViralScatterPlot from './components/ViralScatterPlot';
import AvgDurationCard from './components/AvgDurationCard';

function App(){

  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() =>{
    
    const fetchdata = async () => {
      try {
        const response = await axios.get(("http://127.0.0.1:8000/api/spotify-data"))
        
        console.log("DATA RECEIVED:", response.data)
        setSongs(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }
    fetchdata()
  }, [])

  const averageValence = songs.length 
    ? (songs.reduce((acc, curr) => acc + (curr.valence || 0), 0) / songs.length).toFixed(3)
    : 0;

  if (loading) return <div style={{ color:'white', padding:'20px' }}>Loading Dashboard...</div>;
  
  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto", color: "#fff", fontFamily: 'sans-serif' }}>
      
      <h1 style={{ marginBottom: "30px" }}>Music Trends Dashboard</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: '300px' }}>
          
          <div style={cardStyle}>
            <h3 style={titleStyle}>Daily Mood Trend (Valence)</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
               <MoodLineChart data={songs} />
            </div>
          </div>

          <div style={{...cardStyle, alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)'}}>
            <h2 style={{ margin: 0, opacity: 0.9 }}>Overall Valence</h2>
            <div style={{ fontSize: '4rem', fontWeight: 'bold' }}>{averageValence}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: '350px' }}>
          
          <div style={cardStyle}>
            <h3 style={titleStyle}>Energy vs. Danceability</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <MetricBarChart data={songs} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ ...cardStyle, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <h4 style={{ margin: 0, color: '#aaa' }}>Total Songs</h4>
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1db954' }}>{songs.length}</span>
            </div>
             <AvgDurationCard data={songs} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '400px' }}>
          
          <div style={cardStyle}>
            <h3 style={titleStyle}>Viral Speed</h3>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ViralScatterPlot data={songs} />
            </div>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Longevity (Clean vs. Explicit)</h3>
            <div style={{ height: '300px', width: '100%' }}>
               <LongevityBoxPlot data={songs} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}


const cardStyle = {
  background: '#232323',
  borderRadius: '15px',
  padding: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden' 
};

const titleStyle = { margin: '0 0 15px 0', fontSize: '1.1rem', color: '#ddd' };

export default App
