use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {

  #[msg("User has already voted.")]
  AlreadyVoted,

  #[msg("Invalid content.")]
  InvalidContent,

  #[msg("Content too long.")]
  ContentTooLong,

  #[msg("Username too long.")]
  UsernameTooLong,

  #[msg("Invalid username.")]
  InvalidUsername,

  #[msg("Username too short dude!")]
  UsernameTooShort,

  #[msg("Overflow occurred.")]
  Overflow,

  #[msg("Underflow occurred.")]
  Underflow,

  #[msg("Username already exists.")]
  UsernameExists,

  #[msg("Unauthorized action.")]
  Unauthorized,
  
  #[msg("Invalid authority on post.")]
  InvalidAuthority,
}
