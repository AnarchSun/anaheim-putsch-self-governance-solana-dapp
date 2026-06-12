#![allow(unexpected_cfgs)]
#![allow(deprecated)]

use anchor_lang::prelude::*;

pub mod constants;
pub mod contexts;
pub mod error;
pub mod handlers;
pub mod state;
pub mod utils;

use crate::contexts::{
  create_post::CreatePost,
  create_user::CreateUser,
  initialize::Initialize,
};

pub use crate::handlers::{
  handle_create_post::handle_create_post,
  initialize_handler::initialize_handler,
};

declare_id!("GLVH5PNybwuUQsKU2auqhm7eUTfhdHRQw9mYnuthz6yA");

#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    initialize_handler(ctx)
  }

  pub fn create_user(
    ctx: Context<CreateUser>,
    username: String,
  ) -> Result<()> {
    create_user(ctx, username)
  }

  pub fn create_post(
    ctx: Context<CreatePost>,
    content: String,
  ) -> Result<()> {
    handle_create_post(ctx, content)
  }
}