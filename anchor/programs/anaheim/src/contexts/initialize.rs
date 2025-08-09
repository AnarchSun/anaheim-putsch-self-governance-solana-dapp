// FILE: anchor/programs/anaheim/src/contexts/initialize.rs
use anchor_lang::prelude::*;
use crate::state::AnaheimAccount; // Import the state struct this context initializes

#[derive(Accounts)]
pub struct Initialize<'info> {
    // The main program account to be created
    #[account(
        init,
        payer = user, // The 'user' (the signer) will pay for the account's creation
        space = 8 + AnaheimAccount::SIZE, // 8 for discriminator + size of the state
        seeds = [b"anaheim", user.key().as_ref()], // Unique PDA for the program's state
        bump
    )]
    pub anaheim_account: Account<'info, AnaheimAccount>,

    // The user who is initializing the program and paying the fees
    #[account(mut)]
    // ✅ FIX: This field is named `user` to match `ctx.accounts.user` in the handler.
    pub user: Signer<'info>,

    // The Solana System Program, required for account creation (`init`)
    pub system_program: Program<'info, System>,
}