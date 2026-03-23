import { useRef, useCallback } from 'react'

export function useLongPress(callback, ms = 500) {
  const timerRef = useRef(null)

  const start = useCallback(() => {
    timerRef.current = setTimeout(() => {
      callback()
    }, ms)
  }, [callback, ms])

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseLeave: cancel,
    onTouchStart: start,
    onTouchEnd: cancel,
  }
}
