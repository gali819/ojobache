import { Link, useLocation } from 'react-router-dom'
import { Map, BarChart2, Heart, Shield } from 'lucide-react'

const navItems = [
  { to: '/', icon: Map, label: 'Mapa' },
  { to: '/estadisticas', icon: BarChart2, label: 'Stats' },
  { to: '/donaciones', icon: Heart, label: 'Donar' },
  { to: '/admin', icon: Shield, label: 'Admin' },
]

function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center py-2 text-xs ${active ? 'text-red-600' : 'text-gray-500'}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
