const estadoConfig = {
  activo: { label: 'Activo', className: 'bg-red-100 text-red-700' },
  resuelto: { label: 'Resuelto', className: 'bg-teal-100 text-teal-700' },
  en_proceso: { label: 'En proceso', className: 'bg-yellow-100 text-yellow-700' },
}

function BadgeEstado({ estado }) {
  const config = estadoConfig[estado] ?? { label: estado, className: 'bg-gray-100 text-gray-700' }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  )
}

export default BadgeEstado
