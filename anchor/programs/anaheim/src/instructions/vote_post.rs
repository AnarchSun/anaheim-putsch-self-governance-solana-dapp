
use anchor_lang::prelude::*;

use crate::state::{PostAccount, UserVoteMarker};
use crate::error::ErrorCode;

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
    Ok(())
}
