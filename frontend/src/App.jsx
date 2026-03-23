import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import L from 'leaflet'
import Navbar from './components/UI/Navbar'
import BottomNav from './components/UI/BottomNav'
import Home from './pages/Home'
import Estadisticas from './pages/Estadisticas'
import Donaciones from './pages/Donaciones'
import NotFound from './pages/NotFound'
import LoginAdmin from './components/Admin/LoginAdmin'
import DashboardAdmin from './components/Admin/DashboardAdmin'
import LoadingScreen from './components/UI/LoadingScreen'
import useBacheStore from './store/useBacheStore'

// Fix íconos Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
})

const RutaProtegida = ({ children }) => {
  const adminToken = useBacheStore(state => state.adminToken)
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-shrink-0" style={{ zIndex: 1000, position: 'relative' }}>
        <Navbar />
      </div>
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estadisticas" element={<Layout><Estadisticas /></Layout>} />
        <Route path="/donaciones" element={<Layout><Donaciones /></Layout>} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/dashboard" element={<RutaProtegida><DashboardAdmin /></RutaProtegida>} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
