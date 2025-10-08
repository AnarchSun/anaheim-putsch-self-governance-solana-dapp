// File: programs/anaheim/src/lib.rs
#![allow(deprecated)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

// External module declarations
pub mod close;
pub mod constants;
pub mod contexts;
pub mod error;
pub mod handlers;
pub mod instructions;
pub mod post;
pub mod state;
pub mod utils;

pub use contexts::{
    create_user::CreateUser,
    create_post::CreatePost,
    vote_post::VotePost,
    mine::Mine,
    update::UpdatePost,
};

use handlers::{
    handle_create_post::handle_create_post,
    handle_create_user::handle_create_user,
    handler_mine::handle_mine,
    update_post::handle_update_post,
    handle_increment::handle_increment,
    vote_post::handler,
};

pub use instructions::{
    use_anaheim::UseAnaheim,
    initialize::Initialize,
};
pub use close::close_anaheim::CloseAnaheim;
#[cfg(test)]
pub mod test_post_account;
pub mod validate_post_content;

// Program ID
declare_id!("2Mva4MMAcZJM5dP851ijcdeUHpju4MdQPevhV5SnvATM");

#[program]
pub mod anaheim {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        handlers::initialize_handler::handle_initialize(_ctx)
    }

    pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
        handle_create_user(ctx, username)
    }

    pub fn create_post(ctx: Context<CreatePost>, _content: String) -> Result<()> {
        handle_create_post(ctx)
    }

    pub fn vote_post(ctx: Context<VotePost>, bump: u8, upvote: bool) -> Result<()> {
        handler(ctx, bump, upvote)
    }

    pub fn mine(ctx: Context<Mine>) -> Result<()> {
        handle_mine(ctx)
    }

    pub fn update_post(ctx: Context<UpdatePost>, new_content: String) -> Result<()> {
        handle_update_post(ctx, new_content)
    }

    pub fn increment(ctx: Context<UseAnaheim>) -> Result<()> {
        handle_increment(ctx)
    }

    pub fn decrement(ctx: Context<UpdatePost>) -> Result<()> {
        ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment_by_one(ctx: Context<UpdatePost>) -> Result<()> {
        ctx.accounts.anaheim.count = ctx.accounts.anaheim.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn set(ctx: Context<UseAnaheim>, value: u64) -> Result<()> {
        ctx.accounts.anaheim.count = value;
        Ok(())
    }

    pub fn close(ctx: Context<CloseAnaheim>) -> Result<()> {
        close::close_anaheim::handler(ctx)
    }
}
