// FILE: anchor/programs/anaheim/src/lib.rs
#![allow(unexpected_cfgs)]
#![allow(deprecated)]

use anchor_lang::prelude::*;

pub mod contexts;
pub mod handlers;
pub mod state;
pub mod error;
pub mod constants;
pub mod utils;
pub mod close;
pub mod validate_post_content;
pub mod instructions;

use contexts::{
  create_user::CreateUser,
  create_post::CreatePost,
  increment::Increment,
  decrement::Decrement,
  initialize::Initialize,
};

use handlers::{
  handle_create_user,
  handle_create_post,
  handle_increment,
  initialize_handler,
  decrement_handler,
};

declare_id!("GLVH5PNybwuUQsKU2auqhm7eUTfhdHRQw9mYnuthz6yA");

use contexts::__client_accounts_increment;
#[program]
pub mod anaheim {
  use super::*;

  pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
    initialize_handler(ctx)
  }

  pub fn increment(ctx: Context<Increment>) -> Result<()> {
    handle_increment(ctx)
  }

  pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
    decrement_handler(ctx)
  }

  pub fn create_user(ctx: Context<CreateUser>, username: String) -> Result<()> {
    handle_create_user(ctx, username)
  }

  pub fn create_post(ctx: Context<CreatePost>, content: String) -> Result<()> {
    handle_create_post(ctx, content)
  }
}