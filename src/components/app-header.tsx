// FILE: src/components/app-header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// FIX: Import your new, client-side-only button wrapper.
import ClientWalletMultiButton from './wallet/ClientWalletMultiButton';

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  function isActive(path: string) {
    return path === '/' ? pathname === '/' : pathname.startsWith(path);
  }

  return (
      <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900">
        <div className="mx-auto flex justify-between items-center">
          <div className="flex items-baseline gap-4">
            <Link className="text-xl font-bold text-neutral-900 dark:text-neutral-100" href="/">
              <span>Anaheim</span>
            </Link>
            <nav className="hidden md:flex items-center">
              <ul className="flex gap-4 flex-nowrap items-center">
                {links.map(({ label, path }) => (
                    <li key={path}>
                      <Link
                          className={`text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white ${
                              isActive(path) ? 'font-semibold text-neutral-900 dark:text-white' : ''
                          }`}
                          href={path}
                      >
                        {label}
                      </Link>
                    </li>
                ))}
              </ul>
            </nav>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
            {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          <div className="hidden md:flex items-center gap-4">
            {/* FIX: Use the new safe component. */}
            <ClientWalletMultiButton />
          </div>

          {showMenu && (
              <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm z-40">
                <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
                  <ul className="flex flex-col gap-4">
                    {links.map(({ label, path }) => (
                        <li key={path}>
                          <Link
                              className={`block text-lg py-2 text-neutral-900 dark:text-neutral-100 hover:text-neutral-500 dark:hover:text-white ${
                                  isActive(path) ? 'font-semibold' : ''
                              }`}
                              href={path}
                              onClick={() => setShowMenu(false)}
                          >
                            {label}
                          </Link>
                        </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-4 mt-4">
                    {/* FIX: Use the new safe component in the mobile menu as well. */}
                    <ClientWalletMultiButton />
                  </div>
                </div>
              </div>
          )}
        </div>
      </header>
  );
}