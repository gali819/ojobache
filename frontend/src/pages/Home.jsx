import MapaPrincipal from '../components/Mapa/MapaPrincipal'
import PanelDetalleBache from '../components/Bache/PanelDetalleBache'
import ModalReportarBache from '../components/Bache/ModalReportarBache'
import FABReportar from '../components/UI/FABReportar'
import useBacheStore from '../store/useBacheStore'

function Home() {
  const abrirModalReportar = useBacheStore((s) => s.abrirModalReportar)

  return (
    <div className="relative">
      <MapaPrincipal />
      <PanelDetalleBache />
      <ModalReportarBache />
      <FABReportar onClick={() => abrirModalReportar(null)} />
    </div>
  )
}

export default Home
