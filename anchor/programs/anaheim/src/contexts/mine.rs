// File: contexts/mine.rs
use anchor_lang::prelude::*;

use crate::state::post_account::PostAccount;
#[derive(Accounts)]
pub struct Mine<'info> {
    #[account(mut)]
    pub post: Account<'info, PostAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}
