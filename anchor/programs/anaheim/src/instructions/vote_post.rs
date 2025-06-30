
use anchor_lang::prelude::*;

use crate::error::error_code as OtherErrorCode;
use crate::state::{PostAccount as OtherPostAccount, UserVoteMarker as OtherUserVoteMarker};
// src/state.rs
use anchor_lang::prelude::*;

#[account]
pub struct PostAccount {
    pub author: Pubkey,
    pub vote_count: u64,
    // ... autres champs ...
}

#[account]
pub struct UserVoteMarker {
    pub has_voted: bool,
    pub is_upvote: bool,
    pub post: Pubkey,
    pub user: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("User has already voted.")]
    AlreadyVoted,
    #[msg("Overflow occurred during vote count.")]
    Overflow,
    #[msg("Invalid authority on post.")]
    InvalidAuthority,
}

impl UserVoteMarker {
    pub const SIZE: usize = 1 + 1 + 32 + 32; // bool + bool + Pubkey + Pubkey (ajuster selon alignement)
}

#[derive(Accounts)]
#[instruction(bump: u8)]  // Ajout du paramètre bump pour implémenter Bumps
pub struct VotePost<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        has_one = author @ ErrorCode::InvalidAuthority,  // Vérification de l'auteur
    )]
    pub post: Account<'info, PostAccount>,

    #[account(
        init_if_needed,
        payer = user,
        space = UserVoteMarker::SIZE,
        seeds = [b"vote", user.key().as_ref(), post.key().as_ref()],
        bump,
    )]
    pub vote_marker: Account<'info, UserVoteMarker>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(bump: u8)] // nécessaire pour utiliser bump dans seeds
pub struct VotePost<'info> {
    // ...
    #[account(
        init_if_needed,
        payer = user,
        space = UserVoteMarker::SIZE,
        seeds = [b"vote", user.key().as_ref(), post.key().as_ref()],
        bump = bump,
    )]
    pub vote_marker: Account<'info, UserVoteMarker>,
    // ...
}

pub fn handler(ctx: Context<VotePost>, bump: u8, upvote: bool) -> Result<()> {
    ctx.accounts.validate()?;

    let post = &mut ctx.accounts.post;
    let vote_marker = &mut ctx.accounts.vote_marker;

    if vote_marker.has_voted {
        return err!(ErrorCode::AlreadyVoted);
    }

    if upvote {
        post.vote_count = post.vote_count.checked_add(1).ok_or(ErrorCode::Overflow)?;
    } else {
        post.vote_count = post.vote_count.saturating_sub(1);
    }

    vote_marker.has_voted = true;
    vote_marker.is_upvote = upvote;
    vote_marker.post = post.key();
    vote_marker.user = ctx.accounts.user.key();

    Ok(())
}
