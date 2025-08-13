// FILE: anchor/programs/anaheim/src/contexts/initialize.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    // The account paying for the new account's rent.
    // It MUST be mutable and a signer.
    #[account(mut)]
    pub payer: Signer<'info>,

    // The new account being created (a PDA).
    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 1 + 1, // Adjust to your actual AnaheimAccount size and discriminator
        seeds = [b"anaheim", payer.key().as_ref()],
        bump
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,

    // The System Program is required by Solana for account creation.
    pub system_program: Program<'info, System>,
}