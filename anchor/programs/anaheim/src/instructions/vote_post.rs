// FILE: anchor/programs/anaheim/src/instructions/vote_post.rs
// C'EST LA SEULE ET UNIQUE VERSION DE CE CODE QUI DOIT EXISTER

use anchor_lang::prelude::*;
use crate::state::{PostAccount, UserVoteMarker};
use crate::error::ErrorCode;

// --- CONTEXTE DE L'INSTRUCTION ---
#[derive(Accounts)]
pub struct VotePost<'info> {
    #[account(mut)]
    pub post: Account<'info, PostAccount>,

    #[account(
        init,
        payer = user,
        space = UserVoteMarker::SIZE,
        seeds = [b"vote_marker", user.key().as_ref(), post.key().as_ref()],
        bump
    )]
    pub vote_marker: Account<'info, UserVoteMarker>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// --- HANDLER (LOGIQUE) DE L'INSTRUCTION ---
pub fn vote_post_handler(ctx: Context<VotePost>, upvote: bool) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let vote_marker = &mut ctx.accounts.vote_marker;

    if upvote {
        post.vote_count = post.vote_count.checked_add(1).ok_or(ErrorCode::Overflow)?;
    } else {
        post.vote_count = post.vote_count.saturating_sub(1);
    }

    vote_marker.has_voted = true;
    vote_marker.is_upvote = upvote;
    vote_marker.post = post.key();
    vote_marker.user = ctx.accounts.user.key();

    // ✅ SOLUTION FINALE : On accède à la bump comme un champ de struct normal.
    vote_marker.bump = ctx.bumps.vote_marker;

    Ok(())
}