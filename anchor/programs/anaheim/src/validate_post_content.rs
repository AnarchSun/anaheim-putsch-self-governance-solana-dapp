use crate::constants::MAX_MESSAGE_LENGTH;

/// anarcrypt.sol/anaheim-putsch-self-governance-solana-dapp/anchor/programs/anaheim/src/validate_post_content.rs
/// Vérifie que `content` n'est pas vide et ne dépasse pas la longueur max.
/// Retourne `Ok(())` ou une chaîne d'erreur statique.
#[allow(dead_code)]
pub fn validate_post_content(content: &str) -> Result<(), &'static str> {
  let trimmed = content.trim();
  if trimmed.is_empty() {
    return Err("Content is empty.");
  }
  if trimmed.len() > MAX_MESSAGE_LENGTH {
    return Err("Content exceeds max allowable length.");
  }
  Ok(())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_empty_content() {
    assert_eq!(validate_post_content(""), Err("Content is empty."));
    assert_eq!(validate_post_content("   "), Err("Content is empty."));
  }

  #[test]
  fn test_content_too_long() {
    let too_long = "a".repeat(MAX_MESSAGE_LENGTH + 1);
    assert_eq!(
      validate_post_content(&too_long),
      Err("Content exceeds max allowable length.")
    );
  }

  #[test]
  fn test_content_max_length() {
    let exact = "a".repeat(MAX_MESSAGE_LENGTH);
    assert!(validate_post_content(&exact).is_ok());
  }

  #[test]
  fn test_valid_content() {
    assert!(validate_post_content("Hello, world!").is_ok());
  }

  #[test]
  fn test_special_chars() {
    assert!(validate_post_content("🚀✨💡").is_ok());
  }
}
