// src/contexts/MiningContext.tsx
'use client'

import { createContext } from 'react'

export const MiningContext = createContext<{
    state: any
    setState: React.Dispatch<React.SetStateAction<any>>
} | null>(null)
