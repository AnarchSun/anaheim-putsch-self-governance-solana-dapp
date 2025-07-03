// src/app/page.tsx
'use client'

import HeroSlider from '@/components/HeroSlider'

export default function Page() {
  const images = [
    '/banners/anarcrypt-slider-1.png',
    '/banners/anarcrypt-stake-mining.png',
  ]

  return (
    <main className="w-screen h-screen bg-black">
      <HeroSlider images={images} />
    </main>
  )
}
