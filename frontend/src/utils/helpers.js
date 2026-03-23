const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

export function formatearFecha(dateString) {
  const d = new Date(dateString)
  const dia = d.getDate()
  const mes = MESES[d.getMonth()]
  const anio = d.getFullYear()
  return `${dia} de ${mes} de ${anio}`
}

export function formatearFechaCorta(dateString) {
  const d = new Date(dateString)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

export function tiempoTranscurrido(dateString) {
  const ahora = new Date()
  const fecha = new Date(dateString)
  const diffMs = ahora - fecha
  const diffMin = Math.floor(diffMs / 60000)
  const diffHoras = Math.floor(diffMin / 60)
  const diffDias = Math.floor(diffHoras / 24)
  const diffMeses = Math.floor(diffDias / 30)

  if (diffMin < 1) return 'hace un momento'
  if (diffMin < 60) return `hace ${diffMin} minuto${diffMin !== 1 ? 's' : ''}`
  if (diffHoras < 24) return `hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`
  if (diffDias < 30) return `hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`
  return `hace ${diffMeses} mes${diffMeses !== 1 ? 'es' : ''}`
}

export function esReciente(dateString, dias = 7) {
  const fecha = new Date(dateString)
  const ahora = new Date()
  const diffMs = ahora - fecha
  const diffDias = diffMs / (1000 * 60 * 60 * 24)
  return diffDias < dias
}

export function obtenerColorMarcador(bache) {
  if (bache.estado === 'resuelto') return '#2A9D8F'
  if (esReciente(bache.created_at, 7)) return '#E63946'
  return '#F4A261'
}
