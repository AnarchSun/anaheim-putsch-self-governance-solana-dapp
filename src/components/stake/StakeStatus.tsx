// Path: components/stake/StakeStatus.tsx
// ULTRA FINAL ANARCHOPUNK PATCH: Clean, DRY, and only UI. No initializer logic here.
// Use in any page/component as <StakeStatus address={address} client={client} />

import React from "react";

export function StakeStatus({
                                address,
                                client,
                                initializeStakeAccount,
                            }: {
    address: string;
    client: any;
    initializeStakeAccount: (address: string, client: any) => Promise<any>;
}) {
    const [initError, setInitError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const onInit = async () => {
        setInitError(null);
        setIsLoading(true);
        try {
            await initializeStakeAccount(address, client);
        } catch (e: any) {
            setInitError(e.message || "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {initError && (
                <pre style={{ color: "red", whiteSpace: "pre-wrap" }}>
          {initError}
        </pre>
            )}
            <button onClick={onInit} disabled={isLoading}>
                Initialiser mon compte Anaheim
            </button>
        </div>
    );
}