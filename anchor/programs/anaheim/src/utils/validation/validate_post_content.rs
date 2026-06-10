use anchor_lang::prelude::*;
use crate::constants::MAX_CONTENT_LENGTH;
use crate::error::ErrorCode;


pub fn validate_post_content(content: &str) -> Result<()> {
  let trimmed = content.chars().filter(|c| !c.is_whitespace()).collect::<String>();
  if trimmed.is_empty() {
    return err!(ErrorCode::InvalidContent);
  }
  if trimmed.len() > MAX_CONTENT_LENGTH {
    return err!(ErrorCode::ContentTooLong);
  }
  Ok(())
}
