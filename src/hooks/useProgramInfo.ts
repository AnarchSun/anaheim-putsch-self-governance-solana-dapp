// Exemple React (src/hooks/useProgramInfo.ts)
'use client'

import { useQuery } from '@tanstack/react-query'

export function useProgramInfo() {
  return useQuery({
    queryKey: ['programInfo'],
    queryFn: async () => {
      const res = await fetch('/api/program-info')
      if (!res.ok) throw new Error('Failed to fetch program info')
      return res.json()
    },
  })
}
