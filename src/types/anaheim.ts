// PATH: src/types/anaheim.ts
// Ultra batch fix: Typescript interfaces/types for Anaheim anchor program
// (pour dapp, validation, props, etc.)

export type AnaheimMetadata = {
    name: string;
    version: string;
    spec: string;
    description: string;
};

export type AnaheimInstruction =
    | { name: "close"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] }
    | { name: "createPost"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: string }[] }
    | { name: "createUser"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: string }[] }
    | { name: "decrement"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] }
    | { name: "increment"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] }
    | { name: "initialize"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] }
    | { name: "set"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: string }[] }
    | { name: "setPoolConfig"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: string }[] }
    | { name: "setPlans"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: any }[] }
    | { name: "depositMiningAndLock"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: { name: string; type: string }[] }
    | { name: "claimAfterMaturity"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] }
    | { name: "emergencyUnlockWithPenalty"; discriminator: number[]; accounts: AnaheimAccountRef[]; args: [] };

export type AnaheimAccountRef = {
    name: string;
    writable?: boolean;
    signer?: boolean;
    address?: string;
    optional?: boolean;
    pda?: { seeds: { kind: string; value?: string; path?: string }[] };
};

export type AnaheimError = {
    code: number;
    name: string;
    msg: string;
};

export type AnaheimAccountType =
    | "anaheimAccount"
    | "postAccount"
    | "userAccount"
    | "poolConfig"
    | "lockPosition";

export type AnaheimAccountDiscriminator = {
    name: AnaheimAccountType;
    discriminator: number[];
};

export type AnaheimStructField = {
    name: string;
    type: string | { option?: string; vec?: any; defined?: string };
};

export type AnaheimTypeDef = {
    name: string;
    docs?: string[];
    type: {
        kind: "struct";
        fields: AnaheimStructField[];
    };
};

export type AnaheimProgram = {
    address: string;
    metadata: AnaheimMetadata;
    docs: string[];
    instructions: AnaheimInstruction[];
    accounts: AnaheimAccountDiscriminator[];
    errors: AnaheimError[];
    types: AnaheimTypeDef[];
};

// PATCH: LockPlan type
export type LockPlan = {
    months: number;
    bonusR357Bps: number;
};

// PATCH: Example usage
// import { AnaheimProgram } from "@/types/anaheim";
// const anaheim: AnaheimProgram = ...;
