// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct AnaheimAccount {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8,
}

impl AnaheimAccount {
  // 8 (discriminator) + 32 (authority) + 8 (count) + 1 (value) = 49
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}