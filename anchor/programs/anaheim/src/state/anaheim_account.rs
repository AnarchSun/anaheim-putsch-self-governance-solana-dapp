<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
=======
// anchor/programs/anaheim-old/src/state/anaheim_account.rs
>>>>>>> main
use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
<<<<<<< HEAD
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8,
=======
  pub authority: Pubkey, // 32 bytes
  pub count: u64,        // 8 bytes
  pub value: u8,         // 1 byte
  pub timestamp: i64,    // 8 bytes
  pub vote_count: u64,   // 8 bytes
  pub bump: u8,
>>>>>>> main
}
impl AnaheimAccount {
<<<<<<< HEAD
  pub const SIZE: usize = 8 + 32 + 8 + 1;
}
=======
  pub const SIZE: usize = 32  // authority
      + 8   // count
      + 1   // value
      + 8   // timestamp
      + 8   // vote_count
      + 1;  // bump
}

>>>>>>> main
