// FILE: anchor/programs/anaheim/src/state/anaheim_account.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;

#[account]
pub struct AnaheimAccount {
  // Ce sont des CHAMPS, pas des méthodes.
  pub authority: Pubkey,
  pub count: u64,
  pub value: u8, // ✅ 'value' est un simple champ public de type u8.
  pub bump: u8,
}

impl AnaheimAccount {
  // La taille du compte doit inclure tous les champs.
  // 8 (discriminator) + 32 (authority) + 8 (count) + 1 (value) + 1 (bump)
  pub const SIZE: usize = 8 + 32 + 8 + 1 + 1;
}

// ✅ IMPORTANT : Assurez-vous qu'il n'y a PAS de fonction comme `pub fn value(&self) -> u8` ici.
// Si vous en avez une, supprimez-la.