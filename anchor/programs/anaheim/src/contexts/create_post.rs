// FILE: anchor/programs/anaheim/src/contexts/create_post.rs
use anchor_lang::prelude::*;
use crate::state::{Post, User};

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = user,
        space = Post::SIZE,
        seeds = [b"post", user.key().as_ref()],
        bump
    )]
    pub post: Account<'info, Post>,

    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, User>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}