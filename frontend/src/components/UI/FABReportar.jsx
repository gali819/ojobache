import { Plus } from 'lucide-react'

function FABReportar({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-4 bg-red-600 text-white rounded-full p-4 shadow-lg z-40 flex items-center gap-2 md:bottom-6"
      aria-label="Reportar bache"
    >
      <Plus size={24} />
      <span className="hidden md:inline font-semibold">Reportar bache</span>
    </button>
  )
}

export default FABReportar
