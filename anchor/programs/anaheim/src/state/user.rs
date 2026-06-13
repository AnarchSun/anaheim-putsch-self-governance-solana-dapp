use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub authority: Pubkey,
    pub username: [u8; 32],
    pub username_len: u8,
    pub timestamp: i64,
    pub post_count: u64,
    pub bump: u8,
}
impl User {
    pub const SIZE: usize =
        8 +   // discriminator
            32 +  // authority
            32 +  // username
            1 +   // username_len
            8 +   // timestamp
            8 +   // post_count
            1;    // bump
}