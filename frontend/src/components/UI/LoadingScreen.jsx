import LoadingSpinner from './LoadingSpinner'

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
    }}>
      <LoadingSpinner />
    </div>
  )
}

export default LoadingScreen
