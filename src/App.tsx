import './App.css'
import { MapContainer, TileLayer } from 'react-leaflet'


function App() {
  return (
    <div id = "wrapper">
      <MapContainer center={[40.505, -100.09]} zoom={5}>
       <TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			  />
      </MapContainer>
    </div>
  )
}



export default App