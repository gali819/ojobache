import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion as Motion } from 'framer-motion'
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
  const [previews, setPreviews] = useState([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  const descripcion = watch('descripcion') || ''

  const handleFotos = (e) => {
    const archivos = Array.from(e.target.files || [])
    setFotos(archivos)
    const urls = archivos.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
  }

  const eliminarFoto = (idx) => {
    URL.revokeObjectURL(previews[idx])
    setFotos(fotos.filter((_, i) => i !== idx))
    setPreviews(previews.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data) => {
    if (!coordenadasNuevoBache?.lat || !coordenadasNuevoBache?.lng) {
      toast.error('No se detectaron las coordenadas. Intentá de nuevo.')
      return
    }
    setCargando(true)
    try {
      const payload = {
        lat: coordenadasNuevoBache.lat,
        lng: coordenadasNuevoBache.lng,
        descripcion: data.descripcion,
        reporter_uuid: userUUID,
      }
      const res = await crearBache(payload)
      const nuevoBache = res.data.data ?? res.data

      if (fotos.length > 0) {
        for (const foto of fotos) {
          const formData = new FormData()
          formData.append('foto', foto)
          await subirFoto(nuevoBache.uuid, formData)
        }
      }

      agregarBache(nuevoBache)
      toast.success('¡Bache reportado!')
      cerrarModalReportar()
      reset()
      previews.forEach((url) => URL.revokeObjectURL(url))
      setFotos([])
      setPreviews([])
    } catch {
      toast.error('Error al reportar el bache')
    } finally {
      setCargando(false)
    }
  }

  const sinCoordenadas = !coordenadasNuevoBache?.lat || !coordenadasNuevoBache?.lng

  return (
    <AnimatePresence>
      {modalReportarAbierto && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center"
          style={{ zIndex: 2000 }}
          onClick={(e) => e.target === e.currentTarget && cerrarModalReportar()}
        >
          <Motion.div
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
                  {...register('descripcion', {
                    required: 'La descripción es obligatoria',
                    maxLength: { value: 500, message: 'Máximo 500 caracteres' },
                  })}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describí el bache..."
                />
                <div className="flex items-center justify-between mt-1">
                  {errors.descripcion ? (
                    <p className="text-red-500 text-xs">{errors.descripcion.message}</p>
                  ) : (
                    <span />
                  )}
                  <span className={`text-xs ${descripcion.length > 480 ? 'text-red-400' : 'text-gray-400'}`}>
                    {descripcion.length}/500
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotos (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFotos}
                  className="text-sm"
                />
                {previews.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {previews.map((url, idx) => (
                      <div key={idx} className="relative" style={{ width: 80, height: 80 }}>
                        <img
                          src={url}
                          alt={`Foto ${idx + 1}`}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid #e5e7eb',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => eliminarFoto(idx)}
                          style={{
                            position: 'absolute',
                            top: -6,
                            right: -6,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            backgroundColor: '#E63946',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 'bold',
                          }}
                          aria-label="Eliminar foto"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500">
                📍 {coordenadasNuevoBache
                  ? `${coordenadasNuevoBache.lat.toFixed(5)}, ${coordenadasNuevoBache.lng.toFixed(5)}`
                  : 'Sin ubicación'}
              </p>

              <button
                type="submit"
                disabled={cargando || sinCoordenadas}
                className="w-full text-white rounded-lg py-2 font-semibold flex items-center justify-center gap-2 transition"
                style={{
                  backgroundColor: sinCoordenadas ? '#9ca3af' : '#E63946',
                  cursor: sinCoordenadas ? 'not-allowed' : 'pointer',
                }}
              >
                {cargando ? <LoadingSpinner size="sm" /> : null}
                {cargando ? 'Enviando...' : 'Reportar bache'}
              </button>
            </form>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalReportarBache
