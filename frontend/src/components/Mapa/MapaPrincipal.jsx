import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import useBacheStore from '../../store/useBacheStore'
import MarcadorBache from './MarcadorBache'
import ControlUbicacion from './ControlUbicacion'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const TUCUMAN_CENTER = [-26.8241, -65.2226]
const ZOOM_INICIAL = 13
const HINT_KEY = 'ojobache_hint_shown'
const LONGPRESS_MS = 500

const iconoUsuario = L.divIcon({
  className: '',
  html: `<div style="
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #3B82F6;
    border: 3px solid white;
    box-shadow: 0 0 0 2px #3B82F6;
    animation: pulse-ubicacion 1.5s ease-in-out infinite;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function GeolocalizacionInicial({ onPosicion }) {
  const map = useMap()

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude }
        map.setView([pos.lat, pos.lng], ZOOM_INICIAL)
        onPosicion(pos)
      },
      () => {},
    )
  }, [map, onPosicion])

  return null
}

function MapaEventosToque({ abrirModalReportar }) {
  const timerRef = useRef(null)

  useMapEvents({
    touchstart(e) {
      if (e.originalEvent.touches.length !== 1) return
      const latlng = e.latlng
      timerRef.current = setTimeout(() => {
        if (latlng) abrirModalReportar({ lat: latlng.lat, lng: latlng.lng })
      }, LONGPRESS_MS)
    },
    touchend() {
      clearTimeout(timerRef.current)
      timerRef.current = null
    },
    touchmove() {
      clearTimeout(timerRef.current)
      timerRef.current = null
    },
    contextmenu(e) {
      abrirModalReportar({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
  })

  return null
}

function MapaPrincipal() {
  const { baches, cargarBaches, abrirModalReportar } = useBacheStore()
  const [posUsuario, setPosUsuario] = useState(null)
  const [mostrarHint, setMostrarHint] = useState(false)

  useEffect(() => {
    cargarBaches()
    if (!localStorage.getItem(HINT_KEY)) {
      setMostrarHint(true)
      localStorage.setItem(HINT_KEY, '1')
      setTimeout(() => setMostrarHint(false), 4000)
    }
  }, [cargarBaches])

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={TUCUMAN_CENTER}
        zoom={ZOOM_INICIAL}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeolocalizacionInicial onPosicion={setPosUsuario} />
        <MapaEventosToque abrirModalReportar={abrirModalReportar} />
        <ControlUbicacion />
        {posUsuario && (
          <Marker
            position={[posUsuario.lat, posUsuario.lng]}
            icon={iconoUsuario}
            interactive={false}
          />
        )}
        <MarkerClusterGroup>
          {baches.map((bache) => (
            <MarcadorBache key={bache.uuid} bache={bache} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      {mostrarHint && (
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
          background: 'rgba(29,53,87,0.9)',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          📍 Mantené presionado para reportar un bache
        </div>
      )}
    </div>
  )
}

export default MapaPrincipal
