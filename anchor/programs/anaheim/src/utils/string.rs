// programs/anaheim/src/utils/string.rs
use std::str;

/// Safely decode `[u8]` to `&str`, trimming nulls and handling invalid UTF-8.
pub fn decode_utf8_trimmed(bytes: &[u8]) -> &str {
  str::from_utf8(bytes)
    .unwrap_or("<Invalid UTF-8>")
    .trim_end_matches('\0')
}
