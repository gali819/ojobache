import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function CarouselFotos({ fotos }) {
  const [idx, setIdx] = useState(0)

  if (!fotos || fotos.length === 0) return null

  const prev = () => setIdx((i) => (i === 0 ? fotos.length - 1 : i - 1))
  const next = () => setIdx((i) => (i === fotos.length - 1 ? 0 : i + 1))

  return (
    <div className="relative w-full aspect-video bg-gray-100 rounded-xl overflow-hidden">
      <img
        src={fotos[idx].url}
        alt={`Foto ${idx + 1}`}
        className="w-full h-full object-cover"
      />
      {fotos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1"
          >
            <ChevronRight size={18} />
          </button>
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
            {idx + 1} / {fotos.length}
          </span>
        </>
      )}
    </div>
  )
}

export default CarouselFotos
