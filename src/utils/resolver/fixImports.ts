// src/utils/resolver/fixImports.ts

import { execSync } from "child_process";
import fs from "fs";

export async function fixImports(err: { symbol?: string; message: string }) {
    if (!err.symbol) return { action: "ignore", reason: "no symbol" };

    const symbol = err.symbol;

    // Recherche locale
    try {
        const grep = execSync(`grep -R "export .*${symbol}" src/ || true`).toString();
        if (grep) {
            const file = grep.split(":")[0];
            return { action: "add_import", file, symbol };
        }
    } catch {}

    // Recherche npm registry
    try {
        const search = execSync(`npm search ${symbol} --json --limit=3 || true`).toString();
        if (search) {
            const pkgs = JSON.parse(search);
            if (pkgs.length) {
                return { action: "suggest_package", package: pkgs[0].name, symbol };
            }
        }
    } catch {}

    return { action: "unresolved_import", symbol };
}
