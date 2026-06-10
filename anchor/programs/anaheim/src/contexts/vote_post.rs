// anchor/programs/anaheim/src/contexts/vote_post.rs
use anchor_lang::prelude::*;
use super::super::state::{post_account::PostAccount, user_vote_marker::UserVoteMarker};

#[derive(Accounts)]
#[instruction(bump: u8)] // ✅ Pour résoudre le trait Bumps
pub struct VotePost<'info> {
    #[account(mut)]
    pub post: Account<'info, PostAccount>,

    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + UserVoteMarker::SIZE,
        seeds = [b"vote_marker", authority.key().as_ref(), post.key().as_ref()],
        bump
    )]
    pub vote_marker: Account<'info, UserVoteMarker>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>, // ✅ obligatoire si tu `init` quelque chose
}
