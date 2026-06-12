use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub authority: Pubkey,
    pub username: [u8; 32],
    pub post_count: u64,
    pub bump: u8,
}