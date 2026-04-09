import { useMap } from 'react-leaflet'
import { useState } from 'react'
import { LocateFixed } from 'lucide-react'
import toast from 'react-hot-toast'

const ControlUbicacion = () => {
  const map = useMap()
  const [cargando, setCargando] = useState(false)

  const irAUbicacion = () => {
    setCargando(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, {
          duration: 1.5
        })
        setCargando(false)
      },
      () => {
        toast.error('No pudimos obtener tu ubicación')
        setCargando(false)
      }
    )
  }

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '10px', marginRight: '10px', pointerEvents: 'auto' }}>
      <div className="leaflet-control">
        <button
          onClick={irAUbicacion}
          disabled={cargando}
          className="bg-white rounded-md shadow p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          title="Ir a mi ubicación"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <LocateFixed size={20} />
        </button>
      </div>
    </div>
  )
}

export default ControlUbicacion
