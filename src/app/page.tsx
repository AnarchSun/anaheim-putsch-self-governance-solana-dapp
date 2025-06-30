// src/app/page.tsx
'use client'

import React from 'react'
import HeroSlider from '@/components/HeroSlider'

function ProgramInfoDisplay() {
  return null
}

export default function Page() {
  const images = [
    '/banners/anarcrypt-slider-1.png',
    '/banners/anarcrypt-stake-mining.png',
  ]

  return (
    <div className="w-full">
      <div>
        <h2>Hello World</h2>
        <p>This is a minimal test page with black background and white text.</p>
      </div>
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6 text-white">Anaheim Putsch</h1>
        <ProgramInfoDisplay />
      </div>
      <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">Anaheim Putsch</h1>
      <HeroSlider images={images} />
    </div>
  )
}
