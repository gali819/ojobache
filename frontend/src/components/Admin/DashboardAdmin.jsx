import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useBacheStore from '../../store/useBacheStore'
import { adminGetEstadisticas, adminLogout } from '../../services/api'
import TablaBaches from './TablaBaches'
import LoadingSpinner from '../UI/LoadingSpinner'

function DashboardAdmin() {
  const clearAdmin = useBacheStore((s) => s.clearAdmin)
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    adminGetEstadisticas()
      .then((res) => setStats(res.data.data ?? res.data))
      .catch(() => toast.error('Error al cargar estadísticas'))
      .finally(() => setCargando(false))
  }, [])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {
      // silencioso
    }
    clearAdmin()
    toast.success('Sesión cerrada')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>

      {cargando ? (
        <LoadingSpinner className="my-8" />
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total baches" value={stats.total_baches} />
          <StatCard label="Activos" value={stats.activos} />
          <StatCard label="Resueltos" value={stats.resueltos} />
          <StatCard label="En proceso" value={stats.en_proceso} />
        </div>
      ) : null}

      <TablaBaches />
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className="text-3xl font-bold text-red-600">{value ?? 0}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default DashboardAdmin
