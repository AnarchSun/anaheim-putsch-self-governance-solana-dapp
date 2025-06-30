// src/hooks/useHeroSlider.ts
// useHeroSlider.ts
import { useState, useEffect, useMemo } from 'react'

export function useHeroSlider(images?: string[]) {
  const banners = useMemo(
    () =>
      images && images.length > 0
        ? images
        : ['/images/default-slide-1.jpg', '/images/default-slide-2.jpg'],
    [images]
  )

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return // 💥 skip SSR

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [banners])

  return { current, banners }
}
