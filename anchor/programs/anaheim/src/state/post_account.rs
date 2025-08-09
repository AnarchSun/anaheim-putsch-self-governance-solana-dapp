// FILE: anchor/programs/anaheim/src/state/post_account.rs
use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;

#[account]
pub struct PostAccount {
  pub author: Pubkey,
  pub timestamp: i64,
  pub content_len: u16,
  pub content: [u8; MAX_CONTENT_LENGTH],
  pub vote_count: i64,
}

impl Default for PostAccount {
 fn default() -> Self {
    Self {
      author: Pubkey::default(),
      timestamp: 0,
      content_len: 0,
      content: [0; MAX_CONTENT_LENGTH],
      vote_count: 0,
    }
  }
}

impl PostAccount {
  // ✅ FIX: The SIZE is 8 (discriminator) + the size of all fields within the struct.
  pub const SIZE: usize = 8 + 32 + 8 + 2 + MAX_CONTENT_LENGTH + 8;
}