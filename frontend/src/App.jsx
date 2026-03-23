import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/UI/Navbar'
import BottomNav from './components/UI/BottomNav'
import Home from './pages/Home'
import Estadisticas from './pages/Estadisticas'
import Donaciones from './pages/Donaciones'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

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
        <Route path="/admin" element={<Layout><Admin /></Layout>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
