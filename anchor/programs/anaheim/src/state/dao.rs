use anchor_lang::prelude::*;

#[account]
pub struct Dao {
    pub authority: Pubkey,
    pub total_posts: u64,
    pub bump: u8,
}