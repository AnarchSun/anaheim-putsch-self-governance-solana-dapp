use anchor_lang::prelude::*;
/// Structure représentant un Post
#[account]
pub struct PostAccount {
  pub content: String,
  pub author: Pubkey,
  pub timestamp: i64,
}

/// Implémentation de la taille requise pour le `PostAccount`
impl PostAccount {
  pub const SIZE: usize = 8 + 4 + MAX_CONTENT_LENGTH + 32 + 8; // Taille totale
}
