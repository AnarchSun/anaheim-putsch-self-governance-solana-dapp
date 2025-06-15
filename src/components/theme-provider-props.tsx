// src/components/theme-provider-props.tsx
'use client'

import { Attribute } from 'next-themes'
import { ScriptProps } from 'next/script'
import { PropsWithChildren } from 'react'

export interface ThemeProviderProps extends PropsWithChildren {
  themes?: string[]
  forcedTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  storageKey?: string
  defaultTheme?: string
  attribute?: Attribute | Attribute[]
  value?: ValueObject
  nonce?: string
  scriptProps?: ScriptProps
}
export interface ValueObject {
  [p: string]: string
}
