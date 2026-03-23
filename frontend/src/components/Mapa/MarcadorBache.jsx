import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import useBacheStore from '../../store/useBacheStore'
import { obtenerColorMarcador } from '../../utils/helpers'

function crearIcono(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 24px;
      height: 24px;
      border-radius: 50% 50% 50% 0;
      background: ${color};
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  })
}

function MarcadorBache({ bache }) {
  const seleccionarBache = useBacheStore((s) => s.seleccionarBache)
  const color = obtenerColorMarcador(bache)

  return (
    <Marker
      position={[bache.latitud, bache.longitud]}
      icon={crearIcono(color)}
      eventHandlers={{ click: () => seleccionarBache(bache) }}
    >
      <Popup>
        <strong>{bache.descripcion?.slice(0, 60) ?? 'Sin descripción'}</strong>
      </Popup>
    </Marker>
  )
}

export default MarcadorBache
