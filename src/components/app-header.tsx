// src/components/app-header.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { ThemeSelect } from '@/components/theme-select'
import { WalletUiDropdown } from '@/components/solana/wallet/wallet-ui-dropdown'
import { WalletStatus } from '@/components/solana/wallet/wallet-status'


export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname()
  const [showMenu, setShowMenu] = useState(false)

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path)
  }
  // src/components/solana/solana-provider.tsx (ou cluster-button.tsx selon ta structure)

  type ClusterButtonProps = {
    size?: 'sm' | 'md' | 'lg'  // ou juste 'sm' pour commencer
    // d’autres props éventuelles
  }

  function ClusterButton({ size = 'md' }: ClusterButtonProps) {
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-base px-3 py-2'

    return (
      <button className={`rounded bg-blue-600 text-white hover:bg-blue-700 transition ${sizeClass}`}>
        Cluster
      </button>
    )
  }


  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <Link className="text-xl hover:text-neutral-500 dark:hover:text-white" href="/">
            <span>Placeholder</span>
          </Link>
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 flex-nowrap items-center">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    className={`hover:text-neutral-500 dark:hover:text-white ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''}`}
                    href={path}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <WalletStatus />  {/* TODO ORION: lots of love. Blessed Be and Merry Meet. 🌒🌓🌕 */}
          <WalletUiDropdown />
          <ClusterButton size="sm" />
          <ThemeSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <Link
                      className={`hover:text-neutral-500 dark:hover:text-white block text-lg py-2  ${isActive(path) ? 'text-neutral-500 dark:text-white' : ''} `}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletStatus />  {/* TODO ORION: lots of love. Blessed Be and Merry Meet. 🌒🌓🌕 */}
                <WalletUiDropdown />
                <ClusterButton />
                <ThemeSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
