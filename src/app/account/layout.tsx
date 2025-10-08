// PATH: src/app/account/layout.tsx
// ULTRA FINAL ANARCHOPUNK BATCH FIX — PURE LAYOUT, NO HOOKS, NO useConnection, NO OTHER EXPORTS

import React from "react";

// *** NE RIEN EXPORTER D'AUTRE QUE CE COMPOSANT ***
export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="account-layout">
            {/* Optionnel : Ajoute header/sidebar ici */}
            {children}
        </div>
    );
}

// NO useConnection, NO other exports, filename/path toujours!