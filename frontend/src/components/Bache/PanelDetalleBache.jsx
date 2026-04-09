import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { X, ThumbsUp, CheckCircle, Share2 } from 'lucide-react'
import useBacheStore from '../../store/useBacheStore'
import { getBache, votar } from '../../services/api'
import { useUserUUID } from '../../hooks/useUserUUID'
import BadgeEstado from '../UI/BadgeEstado'
import { formatearFecha, tiempoTranscurrido } from '../../utils/helpers'
import CarouselFotos from './CarouselFotos'

function PanelDetalleBache() {
  const { bacheSeleccionado, cerrarDetalle } = useBacheStore()
  const userUUID = useUserUUID()
  const [votando] = useState(false)
  const [bacheDetalle, setBacheDetalle] = useState(null)

  useEffect(() => {
    if (bacheSeleccionado?.uuid) {
      getBache(bacheSeleccionado.uuid).then(res => {
        setBacheDetalle(res.data)
      })
    } else {
      setBacheDetalle(null)
    }
  }, [bacheSeleccionado])

  const bache = bacheDetalle ?? bacheSeleccionado

  const handleVotar = async (tipo) => {
    try {
      const res = await votar(bacheDetalle.uuid, {
        tipo: tipo,
        voter_uuid: userUUID,
      })
      // guardar en localStorage que ya votó
      const votosGuardados = JSON.parse(
        localStorage.getItem('ojobache_votos') || '{}'
      )
      votosGuardados[bacheDetalle.uuid] = tipo
      localStorage.setItem('ojobache_votos', JSON.stringify(votosGuardados))
      // actualizar estado local con los nuevos contadores
      setBacheDetalle(prev => ({
        ...prev,
        votos_activo: res.data.votos_activo,
        votos_resuelto: res.data.votos_resuelto,
        estado: res.data.estado,
      }))
      if (res.data.estado === 'resuelto') {
        toast.success('¡Bache marcado como resuelto! 🎉')
      } else {
        toast.success('¡Voto registrado. Gracias!')
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error('Ya votaste en este bache')
      } else {
        toast.error('Ocurrió un error al votar')
      }
    }
  }

  const compartir = async () => {
    if (!bache) return
    const url = window.location.origin + '?bache=' + bache.uuid
    const titulo = 'Bache en ' + (bache.direccion || 'Tucumán')
    const texto = 'Hay un bache reportado en ' + (bache.direccion || 'Tucumán')
    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, text: texto, url })
      } catch {
        // usuario canceló
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        toast.success('¡Link copiado!')
      } catch {
        toast.error('No se pudo copiar el link')
      }
    }
  }

  return (
    <AnimatePresence>
      {bacheSeleccionado && (
        <motion.div
          drag="y"
          dragConstraints={{ top: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100) cerrarDetalle()
          }}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
          style={{ zIndex: 2001 }}
        >
          {/* Handle para swipe en mobile */}
          <div className="flex justify-center pt-2 pb-1 md:hidden">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <BadgeEstado estado={bache.estado} />
              <div className="flex items-center gap-2">
                <button
                  onClick={compartir}
                  className="text-gray-500 hover:text-blue-600 transition"
                  aria-label="Compartir"
                >
                  <Share2 size={18} />
                </button>
                <button onClick={cerrarDetalle} aria-label="Cerrar">
                  <X size={20} />
                </button>
              </div>
            </div>

            {bache.fotos?.length > 0 && (
              <CarouselFotos fotos={bache.fotos} />
            )}

            <p className="text-gray-800 mt-3 text-sm">{bache.descripcion}</p>

            <p className="text-xs text-gray-400 mt-1">
              {tiempoTranscurrido(bache.created_at)} ·{' '}
              {formatearFecha(bache.created_at)}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleVotar('activo')}
                disabled={votando}
                className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-red-50 text-red-600 border-red-200 disabled:opacity-50"
              >
                <ThumbsUp size={16} />
                Activo ({bache.votos_activo ?? 0})
              </button>
              <button
                onClick={() => handleVotar('resuelto')}
                disabled={votando}
                className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-teal-50 text-teal-600 border-teal-200 disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Resuelto ({bache.votos_resuelto ?? 0})
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PanelDetalleBache
