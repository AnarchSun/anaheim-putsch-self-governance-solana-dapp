// FILE: anchor/programs/anaheim/src/contexts/mine.rs
use anchor_lang::prelude::*;
use crate::state::PostAccount; // Import the state we are modifying

#[derive(Accounts)]
pub struct Mine<'info> {
    // We need to modify the post's vote_count, so the account must be mutable.
    #[account(mut)]
    pub post: Account<'info, PostAccount>,
}