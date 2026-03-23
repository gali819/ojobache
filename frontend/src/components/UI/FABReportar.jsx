import { Plus } from 'lucide-react'

function FABReportar({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '16px',
        zIndex: 1000,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: '#E63946',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label="Reportar bache"
    >
      <Plus size={24} />
    </button>
  )
}

export default FABReportar
