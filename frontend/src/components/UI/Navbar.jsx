import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  return (
    <header className="bg-white shadow-sm sticky top-0" style={{ zIndex: 1000, position: 'relative' }}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/">
          <img src="/logo.png" alt="OjoBache" className="h-10" />
        </Link>
        <div className="hidden md:flex gap-6">
          <Link
            to="/"
            className={`text-sm font-medium ${location.pathname === '/' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
          >
            Mapa
          </Link>
          <Link
            to="/estadisticas"
            className={`text-sm font-medium ${location.pathname === '/estadisticas' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
          >
            Estadísticas
          </Link>
          <Link
            to="/donaciones"
            className={`text-sm font-medium ${location.pathname === '/donaciones' ? 'text-red-600' : 'text-gray-600 hover:text-red-600'}`}
          >
            Donaciones
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
