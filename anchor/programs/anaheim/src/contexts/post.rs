use anchor_lang::prelude::*;
use crate::state::Post;

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(init, payer = user, space = 8 + 280 + 2 + 8 + 32 + 8)]
    pub post: Account<'info, Post>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}