import { useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const ModalBienvenida = () => {
  const [mostrar, setMostrar] = useState(false)

  useEffect(() => {
    const visto = localStorage.getItem('ojobache_tutorial_visto')
    if (!visto) {
      setTimeout(() => setMostrar(true), 1000)
    }
  }, [])

  const cerrar = () => {
    localStorage.setItem('ojobache_tutorial_visto', 'true')
    setMostrar(false)
  }

  const pasos = [
    {
      emoji: '📍',
      titulo: 'Reportá un bache',
      texto: 'Mantené presionado el mapa medio segundo o usá el botón + para reportar un bache en ese punto.',
    },
    {
      emoji: '📸',
      titulo: 'Agregá una foto',
      texto: 'Sacale una foto al bache y subila para que todos puedan verlo claramente.',
    },
    {
      emoji: '✅',
      titulo: 'Votá el estado',
      texto: '¿Ya lo arreglaron? Tocá el bache en el mapa y avisale a la comunidad.',
    },
  ]

  return (
    <AnimatePresence>
      {mostrar && (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center"
          style={{ zIndex: 3000 }}
          onClick={(e) => e.target === e.currentTarget && cerrar()}
        >
          <Motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl p-6"
            style={{ zIndex: 3001 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">¡Bienvenido a OjoBache! 👋</h2>
              <button onClick={cerrar} aria-label="Cerrar">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              Ayudá a mejorar las calles de tu ciudad reportando baches.
            </p>

            <div className="space-y-4 mb-6">
              {pasos.map((paso, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-2xl">{paso.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{paso.titulo}</p>
                    <p className="text-xs text-gray-500">{paso.texto}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={cerrar}
              className="w-full text-white rounded-lg py-2 font-semibold transition"
              style={{ backgroundColor: '#E63946' }}
            >
              ¡Entendido, empezar!
            </button>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  )
}

export default ModalBienvenida
