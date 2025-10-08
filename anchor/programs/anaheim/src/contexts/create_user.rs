// FILE: anchor/programs/anaheim/src/contexts/handle_create_user
use anchor_lang::prelude::*;
<<<<<<< HEAD
use crate::state::user_account::UserAccount; // Correct import from the state module

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(init, payer = authority, space = UserAccount::SIZE)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
=======

use crate::state::user_account::UserAccount; // 🔁 adapte selon ton arborescence exacte

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + UserAccount::SIZE,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_account: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,

    // 👇 Ceci permet d'accéder au bump sans `ctx.bumps.get(...)`
    pub rent: Sysvar<'info, Rent>,
}
>>>>>>> main
