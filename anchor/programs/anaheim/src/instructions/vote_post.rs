<<<<<<< HEAD
// FILE: anchor/programs/anaheim/src/instructions/vote_post.rs
=======

>>>>>>> main
use anchor_lang::prelude::*;

use crate::contexts::vote_post::VotePost;
use crate::error::ErrorCode;
use crate::state::post_account::PostAccount;
use crate::state::user_vote_marker::UserVoteMarker;

<<<<<<< HEAD
pub fn handler(ctx: Context<VotePost>, _bump: u8, upvote: bool) -> Result<()> {
    let post: &mut Account<PostAccount> = &mut ctx.accounts.post;
    let vote_marker: &mut Account<UserVoteMarker> = &mut ctx.accounts.vote_marker;

    if upvote {
        post.vote_count = post.vote_count.checked_add(1).ok_or(ErrorCode::Overflow)?;
    } else {
        post.vote_count = post.vote_count.saturating_sub(1);
    }

    vote_marker.user = ctx.accounts.authority.key(); // ✅ CORRIGÉ
    vote_marker.post = post.key();
    vote_marker.is_upvote = upvote;
    vote_marker.has_voted = true;

=======
#[derive(Accounts)]
pub struct VotePost<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut)]
    pub post: Account<'info, PostAccount>,

    #[account(
        init_if_needed,
        payer = user,
        space = UserVoteMarker::SIZE,
        seeds = [b"vote", user.key().as_ref(), post.key().as_ref()],
        bump
    )]
    pub vote_marker: Account<'info, UserVoteMarker>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<VotePost>, upvote: bool) -> Result<()> {
    let post = &mut ctx.accounts.post;
    let vote_marker = &mut ctx.accounts.vote_marker;

    require!(!vote_marker.has_voted, ErrorCode::AlreadyVoted);

    if upvote {
        post.vote_count += 1;
    } else {
        post.vote_count = post.vote_count.saturating_sub(1);
    }

    vote_marker.has_voted = true;
>>>>>>> main
    Ok(())
}
