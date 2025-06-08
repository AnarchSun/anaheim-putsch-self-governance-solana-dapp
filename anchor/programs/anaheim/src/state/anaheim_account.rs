use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
  pub authority: Pubkey, // 32 bytes
  pub count: u64,        // 8 bytes
  pub value: u8,         // 1 byte
  pub timestamp: i64,    // 8 bytes
  pub vote_count: u64,   // 8 bytes
}

impl AnaheimAccount {
  /// Discriminator = 8 bytes auto-géré par Anchor
  pub const SIZE: usize = 32  // authority
    + 8   // count
    + 1   // value
    + 8   // timestamp
    + 8;  // vote_count
}
