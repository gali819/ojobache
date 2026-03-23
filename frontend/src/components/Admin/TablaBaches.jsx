import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminGetBaches, adminEliminarBache, adminActualizarBache } from '../../services/api'
import BadgeEstado from '../UI/BadgeEstado'
import LoadingSpinner from '../UI/LoadingSpinner'
import { formatearFechaCorta } from '../../utils/helpers'
import { Trash2, RefreshCw, Eye, Pencil, X, Check } from 'lucide-react'

const ESTADOS = ['activo', 'en_proceso', 'resuelto']

// ── Confirmation modal ────────────────────────────────────────────────────────
function ModalConfirmar({ mensaje, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
        <p className="text-gray-800 mb-6 text-center">{mensaje}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────────
function ModalEditar({ bache, onGuardar, onCerrar }) {
  const [descripcion, setDescripcion] = useState(bache.descripcion ?? '')
  const [estado, setEstado] = useState(bache.estado ?? 'activo')
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    setGuardando(true)
    try {
      await onGuardar(bache.uuid, { descripcion, estado })
      onCerrar()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Editar bache</h3>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {ESTADOS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCerrar}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={16} />
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main table ────────────────────────────────────────────────────────────────
function TablaBaches() {
  const navigate = useNavigate()
  const [baches, setBaches] = useState([])
  const [cargando, setCargando] = useState(true)
  const [pagina, setPagina] = useState(1)
  const [meta, setMeta] = useState(null)

  // Filters
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroDesde, setFiltroDesde] = useState('')
  const [filtroHasta, setFiltroHasta] = useState('')

  // Modals
  const [bacheAEliminar, setBacheAEliminar] = useState(null)
  const [bacheAEditar, setBacheAEditar] = useState(null)

  const cargar = (p = 1, filtros = {}) => {
    setCargando(true)
    const params = { page: p }
    if (filtros.estado) params.estado = filtros.estado
    if (filtros.desde) params.fecha_desde = filtros.desde
    if (filtros.hasta) params.fecha_hasta = filtros.hasta

    adminGetBaches(params)
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

  const aplicarFiltros = () => {
    cargar(1, { estado: filtroEstado, desde: filtroDesde, hasta: filtroHasta })
  }

  const exportarPDF = () => {
    window.print()
  }

  const confirmarEliminar = async () => {
    if (!bacheAEliminar) return
    try {
      await adminEliminarBache(bacheAEliminar)
      toast.success('Bache eliminado')
      cargar(pagina, { estado: filtroEstado, desde: filtroDesde, hasta: filtroHasta })
    } catch {
      toast.error('Error al eliminar')
    } finally {
      setBacheAEliminar(null)
    }
  }

  const guardarEdicion = async (uuid, datos) => {
    try {
      await adminActualizarBache(uuid, datos)
      setBaches((prev) =>
        prev.map((b) => (b.uuid === uuid ? { ...b, ...datos } : b))
      )
      toast.success('Bache actualizado')
    } catch {
      toast.error('Error al actualizar')
      // Re-throw so ModalEditar stays open and the user can retry
      throw new Error('update failed')
    }
  }

  const verEnMapa = (bache) => {
    navigate('/', { state: { bacheUuid: bache.uuid } })
  }

  if (cargando) return <LoadingSpinner className="my-8" />

  return (
    <>
      {bacheAEliminar && (
        <ModalConfirmar
          mensaje="¿Eliminar este bache? Esta acción no se puede deshacer."
          onConfirmar={confirmarEliminar}
          onCancelar={() => setBacheAEliminar(null)}
        />
      )}
      {bacheAEditar && (
        <ModalEditar
          bache={bacheAEditar}
          onGuardar={guardarEdicion}
          onCerrar={() => setBacheAEditar(null)}
        />
      )}

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Todos</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            value={filtroDesde}
            onChange={(e) => setFiltroDesde(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            value={filtroHasta}
            onChange={(e) => setFiltroHasta(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          onClick={aplicarFiltros}
          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-semibold"
        >
          Aplicar filtros
        </button>
        <button
          onClick={exportarPDF}
          className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50"
          title="Imprime la tabla usando el diálogo del navegador (guardá como PDF)"
        >
          Imprimir / PDF
        </button>
        <button
          onClick={() => cargar(pagina, { estado: filtroEstado, desde: filtroDesde, hasta: filtroHasta })}
          className="ml-auto text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700"
        >
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto bg-white rounded-xl shadow print:shadow-none">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Dirección</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Votos A/R</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Fotos</th>
              <th className="px-4 py-3 text-left print:hidden">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {baches.map((b) => (
              <tr key={b.uuid} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  {b.uuid?.slice(0, 8)}
                </td>
                <td className="px-4 py-3 max-w-xs truncate text-gray-700" title={b.direccion}>
                  {b.direccion ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <BadgeEstado estado={b.estado} />
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {b.votos_activo ?? 0} / {b.votos_resuelto ?? 0}
                </td>
                <td className="px-4 py-3 text-gray-400">{formatearFechaCorta(b.created_at)}</td>
                <td className="px-4 py-3 text-gray-600">{b.fotos?.length ?? 0}</td>
                <td className="px-4 py-3 print:hidden">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => verEnMapa(b)}
                      title="Ver en mapa"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => setBacheAEditar(b)}
                      title="Editar"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setBacheAEliminar(b.uuid)}
                      title="Eliminar"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {baches.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No hay baches que coincidan con los filtros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {meta && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            disabled={pagina <= 1}
            onClick={() => cargar(pagina - 1, { estado: filtroEstado, desde: filtroDesde, hasta: filtroHasta })}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Anterior
          </button>
          <span>
            Página {pagina} de {meta.last_page ?? '?'} — Total {meta.total ?? '?'} baches
          </span>
          <button
            disabled={!meta.last_page || pagina >= meta.last_page}
            onClick={() => cargar(pagina + 1, { estado: filtroEstado, desde: filtroDesde, hasta: filtroHasta })}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  )
}

export default TablaBaches
