import { useEffect, useState } from "react";
import axios from 'axios' //What is used to interact with the api from the backend
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './App.css'

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

  const explicitCount = songs.filter(song => song.explicit === true).length;
  const cleanCount = songs.length - explicitCount;

  const pieData = [
    { name: 'Explicit', value: explicitCount },
    { name: 'Clean', value: cleanCount }
  ]
  const COLORS = ['#FF8042', '#00C49F'];
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Music Dashboard</h1>
      
      {loading ? (
        <p>Connecting to backend...</p>
      ) : (
        <div>
          <h3>Chart: Property Levels by Song</h3>
          <div style={{ width: '100%', height: 400, marginBottom: '50px' }}>
            <ResponsiveContainer>
              <BarChart
                data={songs}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="name" 
                interval={0}
                angle={-45}
                textAnchor="end"
                height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="energy" fill="#8884d8" name="Energy Level"/>
                <Bar dataKey="danceability" fill="#d88e84" name="Danceability Level"/>
                <Bar dataKey="valence" fill="#87d884" name="Valence Level"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h3>Chart: Explicit vs. Clean Content</h3>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  label
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p style={{marginTop: "50px", color: "#666"}}>
            *Showing {songs.length} songs from the database.
          </p>
        </div>
      )}
    </div>
  )
}


export default App