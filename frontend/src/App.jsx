import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/UI/Navbar'
import BottomNav from './components/UI/BottomNav'
import Home from './pages/Home'
import Estadisticas from './pages/Estadisticas'
import Donaciones from './pages/Donaciones'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Navbar />
      <main className="pb-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/donaciones" element={<Donaciones />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
