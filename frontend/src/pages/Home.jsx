import MapaPrincipal from '../components/Mapa/MapaPrincipal'
import PanelDetalleBache from '../components/Bache/PanelDetalleBache'
import ModalReportarBache from '../components/Bache/ModalReportarBache'
import FABReportar from '../components/UI/FABReportar'
import Navbar from '../components/UI/Navbar'
import BottomNav from '../components/UI/BottomNav'
import useBacheStore from '../store/useBacheStore'

function Home() {
  const abrirModalReportar = useBacheStore((s) => s.abrirModalReportar)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar solo en desktop */}
      <div className="hidden md:block flex-shrink-0" style={{ zIndex: 1000, position: 'relative' }}>
        <Navbar />
      </div>

      {/* Mapa ocupa todo el espacio restante */}
      <div className="flex-1 relative overflow-hidden">
        <MapaPrincipal />
      </div>

      {/* BottomNav solo en mobile */}
      <div className="md:hidden flex-shrink-0" style={{ zIndex: 1000, position: 'relative' }}>
        <BottomNav />
      </div>

      {/* Modales fuera del flujo */}
      <ModalReportarBache />
      <PanelDetalleBache />

      {/* FAB solo en mobile */}
      <div className="md:hidden">
        <FABReportar onClick={() => abrirModalReportar(null)} />
      </div>
    </div>
  )
}

export default Home
