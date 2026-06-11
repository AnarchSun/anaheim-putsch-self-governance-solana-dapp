// FILE: anchor/programs/anaheim/src/contexts/create_post.rs
use anchor_lang::prelude::*;

use crate::state::{PostAccount, UserAccount};

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = user,
        space = PostAccount::SIZE,
        seeds = [
            b"post",
            user.key().as_ref(),
            user_profile.post_count.to_le_bytes().as_ref()
        ],
        bump
    )]
    pub post: Account<'info, PostAccount>,

    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}