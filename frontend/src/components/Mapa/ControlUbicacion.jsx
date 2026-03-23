import { useMap } from 'react-leaflet'
import { useState } from 'react'
import { Locate } from 'lucide-react'

function ControlUbicacion() {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  const centrarEnUbicacion = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.flyTo([coords.latitude, coords.longitude], 16)
        setLocating(false)
      },
      () => {
        setLocating(false)
      }
    )
  }

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px' }}>
      <button
        onClick={centrarEnUbicacion}
        disabled={locating}
        className="bg-white rounded-md shadow p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        title="Centrar en mi ubicación"
      >
        <Locate size={20} />
      </button>
    </div>
  )
}

export default ControlUbicacion
