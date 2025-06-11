// ===================== contexts/create_user.rs =====================
use anchor_lang::prelude::*;

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
