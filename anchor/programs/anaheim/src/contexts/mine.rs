// FILE: anchor/programs/anaheim/src/contexts/mine.rs
use anchor_lang::prelude::*;
use crate::state::PostAccount; // ou le chemin correct vers votre struct PostAccount

#[derive(Accounts)]
pub struct Mine<'info> {
    // On a besoin de rendre le compte `post` mutable pour pouvoir changer `vote_count`
    #[account(mut)]
    pub post: Account<'info, PostAccount>,
}