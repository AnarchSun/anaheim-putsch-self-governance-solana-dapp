// FILE: anchor/programs/anaheim/src/contexts/increment.rs
// VERSION FINALE ET CORRECTE

use anchor_lang::prelude::*;
use crate::state::AnaheimAccount; // Assurez-vous que le chemin vers votre état est correct

#[derive(Accounts)]
pub struct Increment<'info> {
    // 1. Le compte est modifié.
    // 'mut` signifie qu'on peut changer ses données.
    // 'has_one = authority` est une contrainte de sécurité : Anchor vérifie
    // automatiquement que le champ `authority` de ce compte est égal
    // à la clé du `Signer` qui suit.
    #[account(mut, has_one = authority)]
    pub anaheim_account: Account<'info, AnaheimAccount>,

    // 2. Le signataire de la transaction.
    // C'est la personne qui prouve son identité et son autorisation.
    pub authority: Signer<'info>,
}