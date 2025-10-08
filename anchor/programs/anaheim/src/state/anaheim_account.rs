// anchor/programs/anaheim-old/src/state/anaheim_account.rs
use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
  pub authority: Pubkey, // 32 bytes
  pub count: u64,        // 8 bytes
  pub value: u8,         // 1 byte
  pub timestamp: i64,    // 8 bytes
  pub vote_count: u64,   // 8 bytes
<<<<<<< HEAD
}

impl AnaheimAccount {
  /// Discriminator = 8 bytes auto-géré par Anchor
  pub const SIZE: usize = 32  // authority
    + 8   // count
    + 1   // value
    + 8   // timestamp
    + 8;  // vote_count
=======
  pub bump: u8,
}

impl AnaheimAccount {
  pub const SIZE: usize = 32  // authority
      + 8   // count
      + 1   // value
      + 8   // timestamp
      + 8   // vote_count
      + 1;  // bump
>>>>>>> main
}

