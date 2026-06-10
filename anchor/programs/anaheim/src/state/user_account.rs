<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/state/user_account.rs
=======
// ===================== state/user_account.rs =====================
>>>>>>> main
use anchor_lang::prelude::*;

#[account]
pub struct UserAccount {
<<<<<<< HEAD
  pub username: String,
  pub authority: Pubkey,
  pub bump: u8,
  pub timestamp: i64,
}

impl UserAccount {
  pub const SIZE: usize = 8 + 4 + 32 + 1 + 8;
=======
  pub username: [u8; 32],
  pub authority: Pubkey,
  pub timestamp: i64,
  pub bump: u8,
}

impl UserAccount {
  pub const SIZE: usize = 32 + 32 + 8 + 1; // username + authority + timestamp + bump
>>>>>>> main
}

