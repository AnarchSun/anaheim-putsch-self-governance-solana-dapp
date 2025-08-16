// src/components/Devtools.tsx
'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Devtools() {
    return <ReactQueryDevtools initialIsOpen={true} />;
}
