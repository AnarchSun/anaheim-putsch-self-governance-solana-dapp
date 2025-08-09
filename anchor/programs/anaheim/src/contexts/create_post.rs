// FILE: anchor/programs/anaheim/src/contexts/create_post.rs
use anchor_lang::prelude::*;
use crate::state::{Post, UserAccount}; // Import both state structs

#[derive(Accounts)]
pub struct CreatePost<'info> {
    // ✅ This field is named `post` to match the handler.
    #[account(
        init,
        payer = user,
        space = 8 + Post::BASE_SIZE, // Start with the minimum space for resizing.
        seeds = [b"post", user.key().as_ref(), user_profile.post_count.to_le_bytes().as_ref()],
        bump
    )]
    pub post: Account<'info, Post>,

    // ✅ This context now has a dedicated `user_profile` field.
    #[account(
        mut,
        seeds = [b"user", user.key().as_ref()],
        bump,
    )]
    pub user_profile: Account<'info, UserAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}