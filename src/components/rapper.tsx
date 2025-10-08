// PATH: src/components/rapper.tsx
// ULTRA FINAL ANARCHOPUNK PATCH — Batch fix TS2322, unused RpcInterface/Connection, matrix override!

'use client'

import React from 'react'
import { PROGRAM_ID } from '@/constants' // PATCH: Use central program id!

// PATCH: Remove unused RpcInterface and Connection imports
// import { ConfirmedSignatureInfo, Connection, PublicKey } from '@solana/web3.js'

// PATCH: DEFAULT_ADDRESS now uses PROGRAM_ID string value (not typeof!)
const DEFAULT_ADDRESS = PROGRAM_ID // ensure string

interface RapperProps {
  address?: string
}

export function Rapper({ address }: RapperProps) {
  // PATCH: Ensure address is a string for ReactNode
  const monitoredAddress = String(address ?? DEFAULT_ADDRESS)

  return (
      <div className="bg-black text-white p-4 rounded-xl mt-6">
        <p className="mt-2 text-sm text-gray-400">
          Monitoring signatures on <code>{monitoredAddress}</code>
        </p>
      </div>
  )
}

// PATCH NOTES:
// - TS2322 fixed: monitoredAddress is always a string (never typeof PROGRAM_ID)
// - Removed unused RpcInterface and Connection imports (TS6133/TS6196)
// - No more type/react unused warnings
// - Filename/path toujours, matrix override!