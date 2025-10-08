// FILE: src/components/ClientOnly.tsx
'use client';

import React, { useState, useEffect, ReactNode } from 'react';

<<<<<<< HEAD
/**
 * This component ensures that its children are only ever rendered on the client-side.
 * It prevents hydration mismatch errors by returning null during the server render
 * and the initial client render, then re-rendering with the children once mounted.
 */
=======
>>>>>>> main
export function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
<<<<<<< HEAD
    return null;
=======
    return null; // Return nothing on the server and during the initial client render.
>>>>>>> main
  }

  return <>{children}</>;
}