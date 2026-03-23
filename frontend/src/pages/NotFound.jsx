import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center" style={{ backgroundColor: '#F8F9FA' }}>
      <span className="text-8xl mb-6" role="img" aria-label="bache">🕳️</span>
      <h1 className="text-4xl font-bold mb-2" style={{ color: '#1D3557' }}>
        ¡Caíste en un bache!
      </h1>
      <p className="text-lg text-gray-500 mb-8">Esta página no existe</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl font-semibold text-white shadow-md hover:opacity-90 transition"
        style={{ backgroundColor: '#E63946' }}
      >
        Volver al mapa
      </Link>
    </div>
  )
}

export default NotFound
