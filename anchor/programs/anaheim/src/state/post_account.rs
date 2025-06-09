// state/post_account.rs

use anchor_lang::prelude::*;

#[account]
pub struct PostAccount {
  pub content: [u8; 280],
  pub author: Pubkey,
  pub created_at: i64,
  pub vote_count: u64, // <-- Ajoute ce champ ici
}

impl PostAccount {
  pub const SIZE: usize = 8 // Discriminator Anchor
    + 280 // content: [u8; 280]
    + 32 // author: Pubkey
    + 8  // created_at: i64
    + 8; // vote_count: u64
}
