import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import useBacheStore from '../../store/useBacheStore'
import MarcadorBache from './MarcadorBache'
import ControlUbicacion from './ControlUbicacion'
import { useLongPress } from '../../hooks/useLongPress'

const MENDOZA_CENTER = [-32.8908, -68.8272]
const ZOOM_INICIAL = 13

function MapaEventos({ onLongPress }) {
  useMapEvents({
    contextmenu(e) {
      onLongPress({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })
  return null
}

function MapaPrincipal() {
  const { baches, cargarBaches, abrirModalReportar } = useBacheStore()

  useEffect(() => {
    cargarBaches()
  }, [cargarBaches])

  const handleLongPress = (coords) => {
    abrirModalReportar(coords)
  }

  return (
    <div className="w-full h-[calc(100vh-112px)] relative">
      <MapContainer
        center={MENDOZA_CENTER}
        zoom={ZOOM_INICIAL}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapaEventos onLongPress={handleLongPress} />
        <ControlUbicacion />
        {baches.map((bache) => (
          <MarcadorBache key={bache.uuid} bache={bache} />
        ))}
      </MapContainer>
    </div>
  )
}

export default MapaPrincipal
