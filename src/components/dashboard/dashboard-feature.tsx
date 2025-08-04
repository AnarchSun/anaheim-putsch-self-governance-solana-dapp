// FILE: src/components/dashboard/dashboard-feature.tsx

import { AppHero } from '@/components/app-hero'

const links: { label: string; href: string }[] = [
    { label: 'Raydium r=3.57/USDT Liquidity Pool', href: 'https://raydium.io/liquidity-pools/?token=GETtSamgoHWLdrQv7nEzWrtPXNQxvbtPjv8eABZgHNTU' },
    { label: 'r=3.57 Putsch Token on Solscan', href: 'https://solscan.io/token/GETtSamgoHWLdrQv7nEzWrtPXNQxvbtPjv8eABZgHNTU' },
    { label: 'Chaotic Fractal AttraKThor Governance DAO', href: 'https://v2.realms.today/dao/DAnNQ7S9ofKG9LnYVnUEL6rZtM92TacwMEPxpXroAX7K/proposals' },
    { label: 'anaheim-putsch-self-governance-solana-dapp GitHub', href: 'https://github.com/RastaDjuss/anaheim-putsch-self-governance-solana-dapp.git' },
]

export function DashboardFeature() {
    return (
        // The outer div no longer has any layout classes.
        // It will now fit perfectly inside the .content-box from app-layout.
        <div className="text-center">
            <AppHero title="gm" subtitle="Say hi to your new Solana app." />
            <div className="py-6">
                <div className="space-y-2">
                    <p>Here are some helpful links to get you started.</p>
                    {links.map((link, index) => (
                        <div key={index}>
                            <a
                                href={link.href}
                                className="hover:text-gray-500 dark:hover:text-gray-300"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {link.label}
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}