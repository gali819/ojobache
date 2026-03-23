import { useEffect, useState } from 'react'
import { getEstadisticas } from '../services/api'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const COLORS = ['#E63946', '#F4A261', '#2A9D8F']

function Estadisticas() {
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEstadisticas()
      .then((res) => setStats(res.data.data ?? res.data))
      .catch(() => setError('Error al cargar estadísticas'))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <LoadingSpinner className="mt-20" size="lg" />
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>
  if (!stats) return null

  const pieData = [
    { name: 'Activos', value: stats.activos ?? 0 },
    { name: 'En proceso', value: stats.en_proceso ?? 0 },
    { name: 'Resueltos', value: stats.resueltos ?? 0 },
  ]

  const barData = stats.por_zona ?? []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Estadísticas</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={stats.total_baches} color="text-gray-800" />
        <StatCard label="Activos" value={stats.activos} color="text-red-600" />
        <StatCard label="En proceso" value={stats.en_proceso} color="text-orange-500" />
        <StatCard label="Resueltos" value={stats.resueltos} color="text-teal-600" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Distribución por estado</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {barData.length > 0 && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="font-semibold mb-4">Baches por zona</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="zona" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#E63946" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <p className={`text-3xl font-bold ${color}`}>{value ?? 0}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export default Estadisticas
