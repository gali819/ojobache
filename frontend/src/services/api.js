import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
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

export const getBaches = (params) => api.get('/baches', { params })
export const getBache = (uuid) => api.get(`/baches/${uuid}`)
export const crearBache = (data) => api.post('/baches', data)
export const subirFoto = (uuid, formData) =>
  api.post(`/baches/${uuid}/fotos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
export const votar = (uuid, data) => api.post(`/baches/${uuid}/votar`, data)
export const getEstadisticas = () => api.get('/estadisticas')
export const adminLogin = (credentials) => api.post('/admin/login', credentials)
export const adminLogout = () => api.post('/admin/logout')
export const adminGetBaches = (params) => api.get('/admin/baches', { params })
export const adminGetEstadisticas = () => api.get('/admin/estadisticas')
export const adminEliminarBache = (uuid) => api.delete(`/admin/baches/${uuid}`)
export const adminEliminarFoto = (id) => api.delete(`/admin/fotos/${id}`)
export const adminActualizarBache = (uuid, data) =>
  api.patch(`/admin/baches/${uuid}`, data)

export default api
