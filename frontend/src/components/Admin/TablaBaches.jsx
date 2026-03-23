import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { adminGetBaches, adminEliminarBache, adminActualizarBache } from '../../services/api'
import BadgeEstado from '../UI/BadgeEstado'
import LoadingSpinner from '../UI/LoadingSpinner'
import { formatearFechaCorta } from '../../utils/helpers'
import { Trash2, RefreshCw } from 'lucide-react'

const ESTADOS = ['activo', 'en_proceso', 'resuelto']

function TablaBaches() {
  const [baches, setBaches] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [meta, setMeta] = useState(null)

  const cargar = (p = 1) => {
    setCargando(true)
    adminGetBaches({ page: p })
      .then((res) => {
        setBaches(res.data.data ?? res.data)
        setMeta(res.data.meta ?? null)
        setPagina(p)
      })
      .catch(() => toast.error('Error al cargar baches'))
      .finally(() => setCargando(false))
  }

  useEffect(() => {
    cargar()
  }, [])

  const eliminar = async (uuid) => {
    if (!confirm('¿Eliminar este bache?')) return
    try {
      await adminEliminarBache(uuid)
      toast.success('Bache eliminado')
      cargar(pagina)
    } catch {
      toast.error('Error al eliminar')
    }
  }

  const cambiarEstado = async (uuid, estado) => {
    try {
      await adminActualizarBache(uuid, { estado })
      setBaches((prev) =>
        prev.map((b) => (b.uuid === uuid ? { ...b, estado } : b))
      )
      toast.success('Estado actualizado')
    } catch {
      toast.error('Error al actualizar')
    }
  }

  if (cargando) return <LoadingSpinner className="my-8" />

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-lg">Baches</h2>
        <button onClick={() => cargar(pagina)} className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Votos A/R</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {baches.map((b) => (
              <tr key={b.uuid} className="hover:bg-gray-50">
                <td className="px-4 py-3 max-w-xs truncate">{b.descripcion}</td>
                <td className="px-4 py-3">
                  <select
                    value={b.estado}
                    onChange={(e) => cambiarEstado(b.uuid, e.target.value)}
                    className="text-xs border rounded px-1 py-0.5"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-gray-400">{formatearFechaCorta(b.created_at)}</td>
                <td className="px-4 py-3">{b.votos_activo ?? 0} / {b.votos_resuelto ?? 0}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => eliminar(b.uuid)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {meta && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={pagina <= 1}
            onClick={() => cargar(pagina - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Anterior
          </button>
          <span>Página {pagina} de {meta.last_page ?? '?'}</span>
          <button
            disabled={!meta.last_page || pagina >= meta.last_page}
            onClick={() => cargar(pagina + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default TablaBaches
