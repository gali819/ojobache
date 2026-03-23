import { useEffect, useState } from 'react'
import { getEstadisticas } from '../services/api'
import { Cloud, Map, Zap } from 'lucide-react'

const ALIAS = import.meta.env.VITE_ALIAS_DONACION || 'alias.mercadopago'

function Donaciones() {
  const [totalBaches, setTotalBaches] = useState(null)
  const [copiado, setCopiado] = useState(false)
  const anio = new Date().getFullYear()

  useEffect(() => {
    getEstadisticas()
      .then((res) => {
        const data = res.data.data ?? res.data
        setTotalBaches(data.total_baches ?? null)
      })
      .catch(() => {
        // Statistics unavailable — badge simply won't render
      })
  }, [])

  const copiarAlias = () => {
    navigator.clipboard.writeText(ALIAS).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    })
  }

  return (
    <div style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen">
      {/* ── Hero ── */}
      <div
        className="py-14 px-4 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1D3557, #2A9D8F)' }}
      >
        <div className="text-6xl mb-4">🕳️</div>
        <h1 className="text-4xl font-extrabold mb-2">OjoBache</h1>
        <p className="text-lg opacity-90 mb-4">Hecho con amor por un vecino de Tucumán</p>
        {totalBaches !== null && (
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
            Ya mapeamos {totalBaches} baches en Tucumán 🗺️
          </span>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
        {/* ── Historia personal ── */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-700 leading-relaxed">
            OjoBache nació de la bronca de esquivar baches todos los días.
            Si esta herramienta te sirve para moverte mejor por la ciudad,
            considerá invitarme un café ☕
          </p>
        </div>

        {/* ── Donación ── */}
        <div
          className="bg-white rounded-xl shadow-md p-6"
          style={{ border: '2px solid #E63946' }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-2">Apoyá el proyecto</h2>
          <p className="text-gray-600 text-sm mb-5">
            Tu donación ayuda a mantener los servidores andando
          </p>
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3">
            <span className="text-2xl font-mono font-bold text-gray-800 flex-1 break-all">
              {ALIAS}
            </span>
            <button
              onClick={copiarAlias}
              className="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
              style={{
                backgroundColor: copiado ? '#2A9D8F' : '#E63946',
                color: 'white',
              }}
            >
              {copiado ? '¡Copiado! ✓' : 'Copiar alias'}
            </button>
          </div>
        </div>

        {/* ── Transparencia ── */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">¿Para qué se usa?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center gap-3">
              <Cloud size={20} className="text-blue-400 flex-shrink-0" />
              <span>Hosting del servidor</span>
            </li>
            <li className="flex items-center gap-3">
              <Map size={20} className="text-green-500 flex-shrink-0" />
              <span>Mantenimiento del mapa</span>
            </li>
            <li className="flex items-center gap-3">
              <Zap size={20} className="text-yellow-500 flex-shrink-0" />
              <span>Mejoras y nuevas funciones</span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="text-center text-sm text-gray-400 py-8">
        Desarrollado con 💙 en Tucumán, Argentina — {anio}
      </footer>
    </div>
  )
}

export default Donaciones
