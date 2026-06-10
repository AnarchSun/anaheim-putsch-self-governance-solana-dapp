use anchor_lang::prelude::*;
use crate::error::ErrorCode;
use crate::constants::MAX_USERNAME_LENGTH;

pub fn validate_username(username: &str) -> Result<()> {
  let trimmed = username.trim();
  if trimmed.is_empty() {
    return err!(ErrorCode::InvalidContent);
  }
  if trimmed.len() > MAX_USERNAME_LENGTH {
    return err!(ErrorCode::UsernameTooLong);
  }
  Ok(())
}
