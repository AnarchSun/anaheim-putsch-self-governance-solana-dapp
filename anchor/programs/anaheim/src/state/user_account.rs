// FILE: anchor/programs/anaheim/src/state/user_account.rs
use anchor_lang::prelude::*;
use crate::constants::MAX_USERNAME_LENGTH;

#[account]
#[derive(Default)]
pub struct UserAccount {
  pub authority: Pubkey,
  pub timestamp: i64,
  pub username_len: u8,
  pub username: [u8; MAX_USERNAME_LENGTH],
  pub post_count: u64,
  pub bump: u8,
}

impl UserAccount {
  // The total size needed for space allocation
  pub const SIZE: usize = 32 + 8 + 1 + MAX_USERNAME_LENGTH + 8;
}