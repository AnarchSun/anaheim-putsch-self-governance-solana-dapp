'use client'

import { useProgramInfo } from '@/hooks/useProgramInfo'

export default function ProgramInfoDisplay() {
  const { data, isLoading, error } = useProgramInfo()

  if (isLoading) return <p>Loading program info...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="bg-black text-green-400 p-4 border border-accent rounded-lg shadow-lg">
      <p>Program ID: <code>{data?.programId}</code></p>
    </div>
  )
}
