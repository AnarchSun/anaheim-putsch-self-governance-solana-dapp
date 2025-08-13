// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct AnaheimAccount {
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8,
  pub user: Pubkey,
  pub system_program: Pubkey,
  pub rent: Pubkey,
  pub token_program: Pubkey,
  pub token_mint: Pubkey,
  pub token_account: Pubkey,
  pub token_authority: Option<Pubkey>,
  pub token_amount: u64,
  pub token_decimals: u8,
  pub token_symbol: String,
  pub token_name: String,
  pub token_uri: String,
  pub token_metadata_program: Pubkey,
  pub token_metadata_authority: Option<Pubkey>,
  pub bump: String,
}

impl AnaheimAccount {
  // 8 (discriminator) + 32 (authority) + 8 (count) + 1 (value) = 49
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}