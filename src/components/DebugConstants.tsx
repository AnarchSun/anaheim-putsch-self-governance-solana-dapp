'use client'

import React, { useEffect } from 'react'
import { CLUSTER, DEFAULT_ADDRESS, PROGRAM_IDS } from '../lib/constants'

export function DebugConstants() {
  useEffect(() => {
    console.log('Cluster actif:', CLUSTER)
    console.log('Adresse par défaut:', DEFAULT_ADDRESS)
    console.log('Program IDs:', PROGRAM_IDS)
  }, [])

  return (
    <pre style={{ color: 'lime', background: 'black', padding: '1rem' }}>
      {JSON.stringify({ CLUSTER, DEFAULT_ADDRESS, PROGRAM_IDS }, null, 2)}
    </pre>
  )
}
