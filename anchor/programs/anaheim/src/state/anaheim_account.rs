// anchor/programs/anaheim/src/state/anaheim_account.rs
use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
  pub authority: Pubkey, // 32 bytes
  pub count: u64,        // 8 bytes
  pub value: u8,         // 1 byte
  pub timestamp: i64,    // 8 bytes
  pub vote_count: u64,   // 8 bytes
  pub bump: u8,
}

impl AnaheimAccount {
  pub const SIZE: usize = 32 + 8 + 1 + 8 + 8 + 1;
}
