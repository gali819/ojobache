const DEMO_BACHES_KEY = 'ojobache_demo_baches'
const DEMO_VOTOS_KEY = 'ojobache_demo_votos'
const DEMO_DELAY_MS = 220

const DEMO_ADMIN = {
  email: 'admin@ojobache.com',
  password: 'demo1234',
  name: 'Admin demo',
}

const wait = (data, status = 200) =>
  new Promise((resolve) => {
    globalThis.setTimeout(() => resolve({ data, status }), DEMO_DELAY_MS)
  })

const fail = (status, message) =>
  Promise.reject({
    message,
    response: {
      status,
      data: { message },
    },
  })

const daysAgo = (days, hours = 0) =>
  new Date(Date.now() - ((days * 24) + hours) * 60 * 60 * 1000).toISOString()

const demoPhoto = (label, color = '#E63946') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop stop-color="${color}" offset="0"/>
          <stop stop-color="#1D3557" offset="1"/>
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#g)"/>
      <path d="M0 310 C130 270 210 360 340 315 C470 270 580 335 800 285 L800 450 L0 450 Z" fill="#2f3640" opacity=".9"/>
      <ellipse cx="390" cy="335" rx="110" ry="34" fill="#111827" opacity=".55"/>
      <ellipse cx="390" cy="328" rx="76" ry="22" fill="#030712" opacity=".65"/>
      <circle cx="650" cy="96" r="54" fill="#F4A261" opacity=".85"/>
      <text x="40" y="78" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700" fill="white">OjoBache demo</text>
      <text x="40" y="124" font-family="Inter, Arial, sans-serif" font-size="24" fill="white" opacity=".88">${label}</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const seedBaches = () => [
  {
    id: 1,
    uuid: 'demo-centro-001',
    lat: -26.8241,
    lng: -65.2226,
    direccion: 'Av. Mate de Luna al 1600, Centro',
    descripcion: 'Bache profundo en el carril derecho, peligroso para motos.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-001',
    votos_activo: 12,
    votos_resuelto: 1,
    created_at: daysAgo(1, 3),
    updated_at: daysAgo(1, 3),
    fotos: [{ id: 101, path: 'demo/centro.svg', url: demoPhoto('Centro') }],
  },
  {
    id: 2,
    uuid: 'demo-yerba-002',
    lat: -26.8169,
    lng: -65.2832,
    direccion: 'Avenida Aconquija al 900, Yerba Buena',
    descripcion: 'Hundimiento del asfalto cerca de la parada de colectivo.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-002',
    votos_activo: 8,
    votos_resuelto: 0,
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    fotos: [{ id: 102, path: 'demo/yerba.svg', url: demoPhoto('Yerba Buena', '#F4A261') }],
  },
  {
    id: 3,
    uuid: 'demo-norte-003',
    lat: -26.8122,
    lng: -65.2148,
    direccion: 'Muñecas y Santiago, Barrio Norte',
    descripcion: 'Varios baches chicos seguidos, conviene reducir la velocidad.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-003',
    votos_activo: 6,
    votos_resuelto: 2,
    created_at: daysAgo(5, 5),
    updated_at: daysAgo(5, 5),
    fotos: [],
  },
  {
    id: 4,
    uuid: 'demo-sur-004',
    lat: -26.8351,
    lng: -65.2249,
    direccion: 'Lavalle al 2100, Barrio Sur',
    descripcion: 'Pozo con agua acumulada despues de la lluvia.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-004',
    votos_activo: 10,
    votos_resuelto: 1,
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
    fotos: [{ id: 104, path: 'demo/sur.svg', url: demoPhoto('Barrio Sur', '#2A9D8F') }],
  },
  {
    id: 5,
    uuid: 'demo-villa-005',
    lat: -26.839,
    lng: -65.209,
    direccion: 'Republica de Siria al 400, Villa Urquiza',
    descripcion: 'Bache sobre la esquina, se abre mas con cada lluvia.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-005',
    votos_activo: 5,
    votos_resuelto: 0,
    created_at: daysAgo(12),
    updated_at: daysAgo(12),
    fotos: [],
  },
  {
    id: 6,
    uuid: 'demo-banda-006',
    lat: -26.8334,
    lng: -65.1675,
    direccion: 'Ruta 9 acceso, Banda del Rio Sali',
    descripcion: 'Asfalto roto cerca del ingreso principal.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-006',
    votos_activo: 14,
    votos_resuelto: 3,
    created_at: daysAgo(14, 2),
    updated_at: daysAgo(14, 2),
    fotos: [{ id: 106, path: 'demo/banda.svg', url: demoPhoto('Banda del Rio Sali', '#E76F51') }],
  },
  {
    id: 7,
    uuid: 'demo-talitas-007',
    lat: -26.783,
    lng: -65.1942,
    direccion: 'Av. San Martin, Las Talitas',
    descripcion: 'Hundimiento marcado en media calzada.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-007',
    votos_activo: 7,
    votos_resuelto: 0,
    created_at: daysAgo(18),
    updated_at: daysAgo(18),
    fotos: [],
  },
  {
    id: 8,
    uuid: 'demo-san-pablo-008',
    lat: -26.8608,
    lng: -65.219,
    direccion: 'Camino principal, San Pablo',
    descripcion: 'Bache grande en curva, dificil de ver de noche.',
    estado: 'resuelto',
    reporter_uuid: 'demo-reporter-008',
    votos_activo: 2,
    votos_resuelto: 7,
    created_at: daysAgo(22),
    updated_at: daysAgo(4),
    fotos: [{ id: 108, path: 'demo/san-pablo.svg', url: demoPhoto('San Pablo', '#457B9D') }],
  },
  {
    id: 9,
    uuid: 'demo-alberdi-009',
    lat: -26.811,
    lng: -65.2391,
    direccion: 'Av. Ejercito del Norte al 300, Alberdi',
    descripcion: 'Reportado por vecinos, pendiente de reparar.',
    estado: 'activo',
    reporter_uuid: 'demo-reporter-009',
    votos_activo: 4,
    votos_resuelto: 1,
    created_at: daysAgo(26),
    updated_at: daysAgo(26),
    fotos: [],
  },
  {
    id: 10,
    uuid: 'demo-lomas-010',
    lat: -26.7898,
    lng: -65.246,
    direccion: 'Sector 12, Lomas de Tafi',
    descripcion: 'Bache reparado segun votos de la comunidad.',
    estado: 'resuelto',
    reporter_uuid: 'demo-reporter-010',
    votos_activo: 1,
    votos_resuelto: 9,
    created_at: daysAgo(29),
    updated_at: daysAgo(6),
    fotos: [],
  },
]

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}

const readJson = (key, fallback) => {
  const storage = getStorage()
  if (!storage) return fallback

  try {
    const raw = storage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    storage.removeItem(key)
    return fallback
  }
}

const writeJson = (key, value) => {
  const storage = getStorage()
  if (!storage) return

  storage.setItem(key, JSON.stringify(value))
}

const getBachesFromStorage = () => {
  const existing = readJson(DEMO_BACHES_KEY, null)
  if (Array.isArray(existing)) {
    return existing
  }

  const seeded = seedBaches()
  writeJson(DEMO_BACHES_KEY, seeded)
  return seeded
}

const saveBaches = (baches) => writeJson(DEMO_BACHES_KEY, baches)

const sortByDateDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at)

const normalizeBache = (bache) => ({
  ...bache,
  lat: Number(bache.lat),
  lng: Number(bache.lng),
  votos_activo: Number(bache.votos_activo ?? 0),
  votos_resuelto: Number(bache.votos_resuelto ?? 0),
  fotos: Array.isArray(bache.fotos) ? bache.fotos : [],
})

const haversineKm = (from, to) => {
  const toRad = (value) => (Number(value) * Math.PI) / 180
  const radiusKm = 6371
  const dLat = toRad(to.lat - from.lat)
  const dLng = toRad(to.lng - from.lng)
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)

  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const applyGeoFilter = (baches, params = {}) => {
  if (params.lat == null || params.lng == null) {
    return baches
  }

  const center = { lat: Number(params.lat), lng: Number(params.lng) }
  const radio = Number(params.radio ?? 10)

  if (Number.isNaN(center.lat) || Number.isNaN(center.lng) || Number.isNaN(radio)) {
    return baches
  }

  return baches.filter((bache) => haversineKm(center, bache) <= radio)
}

const fileToDataUrl = (file) =>
  new Promise((resolve) => {
    if (!file || typeof FileReader === 'undefined') {
      resolve(null)
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })

const formatDateKey = (date) => date.toISOString().slice(0, 10)

const getZona = (direccion = '') => {
  const zonas = [
    'Yerba Buena',
    'Tafi',
    'Las Talitas',
    'Banda del Rio Sali',
    'San Pablo',
    'Alberdi',
    'Villa Urquiza',
    'Lomas de Tafi',
    'Barrio Norte',
    'Barrio Sur',
    'Centro',
  ]

  return zonas.find((zona) => direccion.toLowerCase().includes(zona.toLowerCase())) ?? 'Otras zonas'
}

const calcularEstadisticas = (baches) => {
  const ahora = new Date()
  const inicioSemana = new Date(ahora)
  inicioSemana.setDate(ahora.getDate() - 7)

  const inicioMes = new Date(ahora)
  inicioMes.setDate(ahora.getDate() - 30)

  const barriosMap = baches
    .filter((bache) => bache.estado === 'activo')
    .reduce((acc, bache) => {
      const zona = getZona(bache.direccion)
      acc[zona] = (acc[zona] ?? 0) + 1
      return acc
    }, {})

  const barrios = Object.entries(barriosMap)
    .map(([zona, total]) => ({ zona, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)

  const porDiaMap = baches.reduce((acc, bache) => {
    const fecha = formatDateKey(new Date(bache.created_at))
    acc[fecha] = (acc[fecha] ?? 0) + 1
    return acc
  }, {})

  const por_dia = Array.from({ length: 30 }, (_, index) => {
    const date = new Date(ahora)
    date.setDate(ahora.getDate() - (29 - index))
    const fecha = formatDateKey(date)

    return {
      fecha,
      total: porDiaMap[fecha] ?? 0,
    }
  })

  return {
    total_baches: baches.length,
    baches_activos: baches.filter((bache) => bache.estado === 'activo').length,
    baches_resueltos: baches.filter((bache) => bache.estado === 'resuelto').length,
    baches_esta_semana: baches.filter((bache) => new Date(bache.created_at) >= inicioSemana).length,
    baches_este_mes: baches.filter((bache) => new Date(bache.created_at) >= inicioMes).length,
    barrios,
    por_dia,
    total_votos: baches.reduce(
      (total, bache) => total + Number(bache.votos_activo ?? 0) + Number(bache.votos_resuelto ?? 0),
      0,
    ),
    baches_sin_foto: baches.filter((bache) => !bache.fotos?.length).length,
  }
}

export const getBaches = (params = {}) => {
  const baches = getBachesFromStorage()
    .map(normalizeBache)
    .filter((bache) => bache.estado === 'activo')
    .sort(sortByDateDesc)

  const filtrados = applyGeoFilter(baches, params)

  return wait({
    data: filtrados,
    total: filtrados.length,
  })
}

export const getBache = (uuid) => {
  const bache = getBachesFromStorage().map(normalizeBache).find((item) => item.uuid === uuid)

  if (!bache) {
    return fail(404, 'Bache no encontrado.')
  }

  return wait(bache)
}

export const crearBache = (data) => {
  const baches = getBachesFromStorage()
  const now = new Date().toISOString()
  const uuid = globalThis.crypto?.randomUUID?.() ?? `demo-${Date.now()}`
  const nuevoBache = normalizeBache({
    id: Date.now(),
    uuid,
    lat: Number(data.lat),
    lng: Number(data.lng),
    direccion: data.direccion || 'Reporte demo, San Miguel de Tucuman',
    descripcion: data.descripcion || 'Bache reportado desde la demo estatica.',
    estado: 'activo',
    reporter_uuid: data.reporter_uuid,
    votos_activo: 1,
    votos_resuelto: 0,
    created_at: now,
    updated_at: now,
    fotos: [],
  })

  saveBaches([nuevoBache, ...baches])

  return wait(nuevoBache, 201)
}

export const subirFoto = async (uuid, formData) => {
  const baches = getBachesFromStorage()
  const bache = baches.find((item) => item.uuid === uuid)

  if (!bache) {
    return fail(404, 'Bache no encontrado.')
  }

  const file = formData?.get?.('foto')
  const dataUrl = await fileToDataUrl(file)
  const foto = {
    id: Date.now(),
    bache_id: bache.id,
    path: `demo/${uuid}/${file?.name ?? 'foto'}`,
    url: dataUrl || demoPhoto('Foto demo', '#457B9D'),
    created_at: new Date().toISOString(),
  }

  bache.fotos = [...(bache.fotos ?? []), foto]
  saveBaches(baches)

  return wait(foto, 201)
}

export const votar = (uuid, data) => {
  const baches = getBachesFromStorage()
  const bache = baches.find((item) => item.uuid === uuid)

  if (!bache) {
    return fail(404, 'Bache no encontrado.')
  }

  const votos = readJson(DEMO_VOTOS_KEY, {})
  const voterUuid = data?.voter_uuid ?? 'anon'
  const voteKey = `${uuid}:${voterUuid}`

  if (votos[voteKey]) {
    return fail(409, 'Ya votaste en este bache.')
  }

  if (data?.tipo === 'resuelto') {
    bache.votos_resuelto = Number(bache.votos_resuelto ?? 0) + 1
  } else {
    bache.votos_activo = Number(bache.votos_activo ?? 0) + 1
  }

  if (bache.votos_resuelto >= 5 && bache.votos_resuelto > bache.votos_activo) {
    bache.estado = 'resuelto'
  } else if (bache.estado === 'resuelto' && bache.votos_activo >= 3) {
    bache.estado = 'activo'
  }

  bache.updated_at = new Date().toISOString()
  votos[voteKey] = data?.tipo ?? 'activo'
  writeJson(DEMO_VOTOS_KEY, votos)
  saveBaches(baches)

  return wait({
    votos_activo: bache.votos_activo,
    votos_resuelto: bache.votos_resuelto,
    estado: bache.estado,
  })
}

export const getEstadisticas = () => wait(calcularEstadisticas(getBachesFromStorage().map(normalizeBache)))

export const adminLogin = ({ email, password }) => {
  if (email !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) {
    return fail(401, 'Credenciales demo: admin@ojobache.com / demo1234')
  }

  return wait({
    token: 'demo-admin-token',
    admin: {
      name: DEMO_ADMIN.name,
      email: DEMO_ADMIN.email,
    },
  })
}

export const adminLogout = () => wait({ message: 'Sesion cerrada.' })

export const adminGetBaches = (params = {}) => {
  const page = Math.max(1, Number(params.page ?? 1))
  const perPage = 25
  let baches = getBachesFromStorage().map(normalizeBache).sort(sortByDateDesc)

  if (params.estado) {
    baches = baches.filter((bache) => bache.estado === params.estado)
  }

  if (params.fecha_desde) {
    baches = baches.filter((bache) => formatDateKey(new Date(bache.created_at)) >= params.fecha_desde)
  }

  if (params.fecha_hasta) {
    baches = baches.filter((bache) => formatDateKey(new Date(bache.created_at)) <= params.fecha_hasta)
  }

  const total = baches.length
  const start = (page - 1) * perPage

  return wait({
    data: baches.slice(start, start + perPage),
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(total / perPage)),
      per_page: perPage,
      total,
    },
  })
}

export const adminGetEstadisticas = getEstadisticas

export const adminEliminarBache = (uuid) => {
  const baches = getBachesFromStorage()
  saveBaches(baches.filter((bache) => bache.uuid !== uuid))

  return wait({ message: 'Bache eliminado correctamente.' })
}

export const adminEliminarFoto = (id) => {
  const baches = getBachesFromStorage().map((bache) => ({
    ...bache,
    fotos: (bache.fotos ?? []).filter((foto) => String(foto.id) !== String(id)),
  }))

  saveBaches(baches)

  return wait({ message: 'Foto eliminada correctamente.' })
}

export const adminActualizarBache = (uuid, data) => {
  const baches = getBachesFromStorage()
  const bache = baches.find((item) => item.uuid === uuid)

  if (!bache) {
    return fail(404, 'Bache no encontrado.')
  }

  Object.assign(bache, data, { updated_at: new Date().toISOString() })
  saveBaches(baches)

  return wait(normalizeBache(bache))
}

export default {
  getBaches,
  getBache,
  crearBache,
  subirFoto,
  votar,
  getEstadisticas,
  adminLogin,
  adminLogout,
  adminGetBaches,
  adminGetEstadisticas,
  adminEliminarBache,
  adminEliminarFoto,
  adminActualizarBache,
}
