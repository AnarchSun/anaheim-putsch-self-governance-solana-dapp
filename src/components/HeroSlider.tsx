// src/components/HeroSlider.tsx
'use client'

import React, { useState, useEffect } from 'react'
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
    }, 4000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <div className="relative w-full max-w-screen overflow-hidden h-[720px] box-border">
      {banners.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out
            ${index === current ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'}`}
        >
          <Image
            src={src}
            alt={`slide-${index}`}
            fill
            style={{ objectFit: 'cover' }}
            priority={index === current} // charge prioritairement l’image active
            draggable={false}
          />
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-white transition-colors
              ${i === current ? 'bg-white' : 'bg-white/40 hover:bg-white'}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
