import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { X, ThumbsUp, CheckCircle } from 'lucide-react'
import useBacheStore from '../../store/useBacheStore'
import { votar } from '../../services/api'
import { useUserUUID } from '../../hooks/useUserUUID'
import BadgeEstado from '../UI/BadgeEstado'
import { formatearFecha, tiempoTranscurrido } from '../../utils/helpers'
import CarouselFotos from './CarouselFotos'

function PanelDetalleBache() {
  const { bacheSeleccionado, cerrarDetalle, actualizarVotos } = useBacheStore()
  const userUUID = useUserUUID()
  const [votando, setVotando] = useState(false)

  const handleVotar = async (tipo) => {
    if (!bacheSeleccionado) return
    setVotando(true)
    try {
      const res = await votar(bacheSeleccionado.uuid, {
        tipo,
        user_uuid: userUUID,
      })
      actualizarVotos(bacheSeleccionado.uuid, res.data.data ?? res.data)
      toast.success('Voto registrado')
    } catch {
      toast.error('Ya votaste o ocurrió un error')
    } finally {
      setVotando(false)
    }
  }

  return (
    <AnimatePresence>
      {bacheSeleccionado && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
          style={{ zIndex: 2001 }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <BadgeEstado estado={bacheSeleccionado.estado} />
              <button onClick={cerrarDetalle}>
                <X size={20} />
              </button>
            </div>

            {bacheSeleccionado.fotos?.length > 0 && (
              <CarouselFotos fotos={bacheSeleccionado.fotos} />
            )}

            <p className="text-gray-800 mt-3 text-sm">{bacheSeleccionado.descripcion}</p>

            <p className="text-xs text-gray-400 mt-1">
              {tiempoTranscurrido(bacheSeleccionado.created_at)} ·{' '}
              {formatearFecha(bacheSeleccionado.created_at)}
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleVotar('activo')}
                disabled={votando}
                className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-red-50 text-red-600 border-red-200 disabled:opacity-50"
              >
                <ThumbsUp size={16} />
                Activo ({bacheSeleccionado.votos_activo ?? 0})
              </button>
              <button
                onClick={() => handleVotar('resuelto')}
                disabled={votando}
                className="flex-1 flex items-center justify-center gap-2 border rounded-lg py-2 text-sm hover:bg-teal-50 text-teal-600 border-teal-200 disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Resuelto ({bacheSeleccionado.votos_resuelto ?? 0})
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PanelDetalleBache
