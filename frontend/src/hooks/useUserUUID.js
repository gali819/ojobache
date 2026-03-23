import { useState } from 'react'

export function useUserUUID() {
  const [uuid, setUuid] = useState(() => {
    let stored = localStorage.getItem('ojobache_user_uuid')
    if (!stored) {
      stored = crypto.randomUUID()
      localStorage.setItem('ojobache_user_uuid', stored)
    }
    return stored
  })

  return uuid
}
