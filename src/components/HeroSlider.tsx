// src/components/HeroSlider.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export type HeroSliderProps = {
  images?: string[]
}

export default function HeroSlider({ images }: HeroSliderProps) {
  const banners = images && images.length > 0 ? images : [
    '/banners/anarcrypt-slider-1.png',
    '/banners/anarcrypt-stake-mining.png',
  ]

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {banners.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out 
            ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}
        >
          <Image
            src={src}
            alt={`slide-${index}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === current}
            draggable={false}
          />
        </div>
      ))}
    </div>
  )
}
