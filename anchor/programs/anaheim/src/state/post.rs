// FILE: anchor/programs/anaheim/src/state/post.rs
use anchor_lang::prelude::*;

#[account]
pub struct Post {
  pub author: Pubkey,
  pub content: [u8; 280],
  pub content_len: u16,
  pub vote_count: i64,
  pub timestamp: i64,
  pub bump: u8,
}
impl Post {
  pub const SIZE: usize =
    32 + // author
        280 + // content
        8 + // timestamp
        8 + // id
        1; // bump
}