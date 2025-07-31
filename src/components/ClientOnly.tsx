// FILE: src/components/ClientOnly.tsx
'use client';

import React, { useState, useEffect, ReactNode } from 'react';

export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null; // Return nothing on the server and during the initial client render.
  }

  return <>{children}</>;
}