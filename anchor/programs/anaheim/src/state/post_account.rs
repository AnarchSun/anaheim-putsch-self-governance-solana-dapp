<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/state/post_account.rs
=======
// state/post_account.rs

>>>>>>> main
use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;

#[account]
pub struct PostAccount {
<<<<<<< HEAD
  pub content: [u8; MAX_CONTENT_LENGTH], // Using fixed-size array
  pub author: Pubkey,
  pub created_at: i64,
}

impl PostAccount {
  pub const SIZE: usize = 8 + MAX_CONTENT_LENGTH + 32 + 8;
}
=======
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
>>>>>>> main
