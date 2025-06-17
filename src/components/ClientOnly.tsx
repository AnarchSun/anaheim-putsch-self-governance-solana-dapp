// src/components/ClientOnly.tsx
"use client"
import { ReactNode } from "react"

export default function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>
}
