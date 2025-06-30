// src/components/ui/FancyCard.tsx
import React from 'react'

export default function FancyCard({
                                    children,
                                    title,
                                  }: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="w-full max-w-xl p-6 bg-neutral-900 rounded-xl shadow-xl border border-neutral-700">
      <h2 className="text-2xl font-bold text-accent mb-4">{title}</h2>
      <div className="text-white">{children}</div>
    </div>
  )
}
