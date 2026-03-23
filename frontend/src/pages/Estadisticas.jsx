import { useEffect, useState } from 'react'
import { getEstadisticas } from '../services/api'
import { AlertTriangle, MapPin, CheckCircle, TrendingUp } from 'lucide-react'
import {
  AreaChart,
  Area,
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

// ── Animated counter hook ───────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!target) return
    const start = Date.now()
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

// ── Skeleton placeholder ─────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-xl ${className}`} />
  )
}

// ── Stat card with animated counter ─────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  const count = useCountUp(value ?? 0)
  return (
    <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center gap-2">
      {icon}
      <p className="text-4xl font-extrabold" style={{ color }}>{count}</p>
      <p className="text-sm text-gray-500 text-center">{label}</p>
    </div>
  )
}

// ── Top‑zones list ────────────────────────────────────────────────────────────
function ZonaBar({ zona, total, max }) {
  const pct = max > 0 ? Math.round((total / max) * 100) : 0
  // color: green → red according to proportion
  const r = Math.round(46 + (230 - 46) * (pct / 100))
  const g = Math.round(157 + (57 - 157) * (pct / 100))
  const b = Math.round(143 + (70 - 143) * (pct / 100))
  const barColor = `rgb(${r},${g},${b})`
  return (
    <div className="flex items-center gap-3 py-1">
      <span className="text-sm text-gray-700 w-48 truncate" title={zona}>{zona}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-3">
        <div className="h-3 rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8 text-right">{total}</span>
    </div>
  )
}

// ── Custom tooltip for the area chart ────────────────────────────────────────
function TooltipDias({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-bold text-red-500">{payload[0].value} reportes</p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
function Estadisticas() {
  const [stats, setStats] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargar = () => {
    setCargando(true)
    setError(null)
    getEstadisticas()
      .then((res) => setStats(res.data.data ?? res.data))
      .catch(() => setError('No pudimos cargar las estadísticas. Intentá de nuevo.'))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    getEstadisticas()
      .then((res) => setStats(res.data.data ?? res.data))
      .catch(() => setError('No pudimos cargar las estadísticas. Intentá de nuevo.'))
      .finally(() => setCargando(false))
  }, [])

  // ── Loading skeletons ─────────────────────────────────────────────────────
  if (cargando) {
    return (
      <div style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen">
        {/* Header skeleton */}
        <div className="py-12 px-4" style={{ background: 'linear-gradient(135deg, #1D3557, #2A9D8F)' }}>
          <Skeleton className="h-10 w-64 mx-auto mb-3 bg-white/20" />
          <Skeleton className="h-5 w-48 mx-auto bg-white/20" />
        </div>
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <p className="text-red-500 text-center">{error}</p>
        <button
          onClick={cargar}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!stats) return null

  // ── Data transformations ──────────────────────────────────────────────────
  const porDia = (stats.por_dia ?? []).map((d) => {
    const parts = String(d.fecha).split('-')
    const mm = parts[1] ?? ''
    const dd = parts[2] ?? ''
    return { ...d, label: mm && dd ? `${dd}/${mm}` : d.fecha }
  })

  const barrios = stats.barrios ?? []
  const maxBarrio = barrios.reduce((m, b) => Math.max(m, b.total), 0)

  const pieData = [
    { name: 'Activos', value: stats.baches_activos ?? 0 },
    { name: 'Resueltos', value: stats.baches_resueltos ?? 0 },
  ]
  const hayPie = pieData.some((d) => d.value > 0)

  return (
    <div style={{ backgroundColor: '#F8F9FA' }} className="min-h-screen">
      {/* ── Header ── */}
      <div
        className="py-12 px-4 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1D3557, #2A9D8F)' }}
      >
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">📊 Estadísticas de Tucumán</h1>
        <p className="text-lg opacity-90">El estado real de nuestras calles</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Total reportados"
            value={stats.total_baches}
            color="#E63946"
            icon={<AlertTriangle size={28} color="#E63946" />}
          />
          <StatCard
            label="Siguen activos"
            value={stats.baches_activos}
            color="#F4A261"
            icon={<MapPin size={28} color="#F4A261" />}
          />
          <StatCard
            label="Ya resueltos"
            value={stats.baches_resueltos}
            color="#2A9D8F"
            icon={<CheckCircle size={28} color="#2A9D8F" />}
          />
          <StatCard
            label="Esta semana"
            value={stats.baches_esta_semana}
            color="#1D3557"
            icon={<TrendingUp size={28} color="#1D3557" />}
          />
        </div>

        {/* ── Area chart ── */}
        {porDia.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Reportes de los últimos 30 días</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={porDia}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E63946" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip content={<TooltipDias />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#E63946"
                  strokeWidth={2}
                  fill="url(#areaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ── Top zones ── */}
        {barrios.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Zonas más afectadas</h2>
            <div className="space-y-2">
              {barrios.map((b) => (
                <ZonaBar key={b.zona} zona={b.zona} total={b.total} max={maxBarrio} />
              ))}
            </div>
          </div>
        )}

        {/* ── Pie chart ── */}
        {hayPie && (
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Estado general</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#E63946" />
                  <Cell fill="#2A9D8F" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default Estadisticas
