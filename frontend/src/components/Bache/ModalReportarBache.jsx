import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import useBacheStore from '../../store/useBacheStore'
import { crearBache, subirFoto } from '../../services/api'
import { useUserUUID } from '../../hooks/useUserUUID'
import LoadingSpinner from '../UI/LoadingSpinner'

function ModalReportarBache() {
  const {
    modalReportarAbierto,
    coordenadasNuevoBache,
    cerrarModalReportar,
    agregarBache,
  } = useBacheStore()
  const userUUID = useUserUUID()
  const [cargando, setCargando] = useState(false)
  const [fotos, setFotos] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setCargando(true)
    try {
      const payload = {
        ...data,
        latitud: coordenadasNuevoBache.lat,
        longitud: coordenadasNuevoBache.lng,
        user_uuid: userUUID,
      }
      const res = await crearBache(payload)
      const nuevoBache = res.data.data ?? res.data

      if (fotos.length > 0) {
        const formData = new FormData()
        Array.from(fotos).forEach((f) => formData.append('fotos[]', f))
        formData.append('user_uuid', userUUID)
        await subirFoto(nuevoBache.uuid, formData)
      }

      agregarBache(nuevoBache)
      toast.success('¡Bache reportado!')
      cerrarModalReportar()
      reset()
      setFotos([])
    } catch {
      toast.error('Error al reportar el bache')
    } finally {
      setCargando(false)
    }
  }

  return (
    <AnimatePresence>
      {modalReportarAbierto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center"
          style={{ zIndex: 2000 }}
          onClick={(e) => e.target === e.currentTarget && cerrarModalReportar()}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl p-6"
            style={{ zIndex: 2001 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Reportar bache</h2>
              <button onClick={cerrarModalReportar}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  {...register('descripcion', { required: 'La descripción es obligatoria' })}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describí el bache..."
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fotos (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setFotos(e.target.files)}
                  className="text-sm"
                />
              </div>

              <p className="text-xs text-gray-500">
                Ubicación: {coordenadasNuevoBache?.lat.toFixed(5)},{' '}
                {coordenadasNuevoBache?.lng.toFixed(5)}
              </p>

              <button
                type="submit"
                disabled={cargando}
                className="w-full bg-red-600 text-white rounded-lg py-2 font-semibold hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cargando ? <LoadingSpinner size="sm" /> : null}
                {cargando ? 'Enviando...' : 'Reportar bache'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalReportarBache
