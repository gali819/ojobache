import axios from 'axios'
import * as mockApi from './mockApi'

export const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'
const apiBaseUrl = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: `${apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ojobache_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ojobache_admin_token')
    }
    return Promise.reject(error)
  }
)

export const getBaches = isDemoMode
  ? mockApi.getBaches
  : (params) => api.get('/baches', { params })

export const getBache = isDemoMode
  ? mockApi.getBache
  : (uuid) => api.get(`/baches/${uuid}`)

export const crearBache = isDemoMode
  ? mockApi.crearBache
  : (data) => api.post('/baches', data)

export const subirFoto = isDemoMode
  ? mockApi.subirFoto
  : (uuid, formData) =>
      api.post(`/baches/${uuid}/fotos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

export const votar = isDemoMode
  ? mockApi.votar
  : (uuid, data) => api.post(`/baches/${uuid}/votar`, data)

export const getEstadisticas = isDemoMode
  ? mockApi.getEstadisticas
  : () => api.get('/estadisticas')

export const adminLogin = isDemoMode
  ? mockApi.adminLogin
  : (credentials) => api.post('/admin/login', credentials)

export const adminLogout = isDemoMode
  ? mockApi.adminLogout
  : () => api.post('/admin/logout')

export const adminGetBaches = isDemoMode
  ? mockApi.adminGetBaches
  : (params) => api.get('/admin/baches', { params })

export const adminGetEstadisticas = isDemoMode
  ? mockApi.adminGetEstadisticas
  : () => api.get('/admin/estadisticas')

export const adminEliminarBache = isDemoMode
  ? mockApi.adminEliminarBache
  : (uuid) => api.delete(`/admin/baches/${uuid}`)

export const adminEliminarFoto = isDemoMode
  ? mockApi.adminEliminarFoto
  : (id) => api.delete(`/admin/fotos/${id}`)

export const adminActualizarBache = isDemoMode
  ? mockApi.adminActualizarBache
  : (uuid, data) => api.patch(`/admin/baches/${uuid}`, data)

export default isDemoMode ? mockApi.default : api
