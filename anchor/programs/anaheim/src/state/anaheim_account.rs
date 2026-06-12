// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u64,
  pub bump: u8,
}

impl AnaheimAccount {
  pub const SIZE: usize = 8 + 32 + 8 + 8 + 1;
}