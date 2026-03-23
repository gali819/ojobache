import { create } from 'zustand'
import { getBaches } from '../services/api'

const useBacheStore = create((set) => ({
  baches: [],
  bacheSeleccionado: null,
  cargando: false,
  error: null,
  modalReportarAbierto: false,
  coordenadasNuevoBache: null,
  adminToken: localStorage.getItem('ojobache_admin_token') || null,
  adminUser: null,

  cargarBaches: async (params) => {
    set({ cargando: true, error: null })
    try {
      const res = await getBaches(params)
      set({ baches: res.data.data ?? res.data, cargando: false })
    } catch (err) {
      set({ error: err.message, cargando: false })
    }
  },

  seleccionarBache: (bache) => set({ bacheSeleccionado: bache }),

  cerrarDetalle: () => set({ bacheSeleccionado: null }),

  abrirModalReportar: (coords) =>
    set({ modalReportarAbierto: true, coordenadasNuevoBache: coords }),

  cerrarModalReportar: () =>
    set({ modalReportarAbierto: false, coordenadasNuevoBache: null }),

  agregarBache: (bache) =>
    set((state) => ({ baches: [bache, ...state.baches] })),

  actualizarVotos: (uuid, datos) =>
    set((state) => ({
      baches: state.baches.map((b) =>
        b.uuid === uuid
          ? {
              ...b,
              votos_activo: datos.votos_activo ?? b.votos_activo,
              votos_resuelto: datos.votos_resuelto ?? b.votos_resuelto,
              estado: datos.estado ?? b.estado,
            }
          : b
      ),
    })),

  setAdminToken: (token, user) => {
    localStorage.setItem('ojobache_admin_token', token)
    set({ adminToken: token, adminUser: user })
  },

  clearAdmin: () => {
    localStorage.removeItem('ojobache_admin_token')
    set({ adminToken: null, adminUser: null })
  },
}))

export default useBacheStore
