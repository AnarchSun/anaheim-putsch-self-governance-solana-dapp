// FILE: anchor/programs/anaheim/src/state/post.rs
use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;

#[account]
pub struct Post {
  pub author: Pubkey,
  pub timestamp: i64,
  pub content_len: u16,
  pub content: [u8; MAX_CONTENT_LENGTH],
}

impl Post {
  // Base size for dynamic resizing, NOT including the content string itself.
  pub const BASE_SIZE: usize = 32 + 8 + 4; // author + timestamp + String length prefix
}