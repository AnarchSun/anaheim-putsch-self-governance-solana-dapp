// src/app/layout.tsx (server component)
import { AppProviders } from '@/components/app-providers'
import ClientHeader from "@/components/ClientHeader";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
        <body className="h-full bg-black text-white">
        <AppProviders>
            <ClientHeader />
            <main style={{ padding: 16 }}>{children}</main>
        </AppProviders>
        </body>
        </html>
    )
}
