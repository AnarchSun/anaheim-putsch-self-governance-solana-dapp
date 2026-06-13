pub fn string_to_fixed_array<const N: usize>(input: &str) -> [u8; N] {
  let mut buffer = [0u8; N];
  let bytes = input.as_bytes();

  let len = bytes.len().min(N);
  buffer[..len].copy_from_slice(&bytes[..len]);

  buffer
}

pub fn fixed_array_to_string<const N: usize>(input: &[u8; N]) -> String {
  let len = input.iter()
      .position(|&c| c == 0)
      .unwrap_or(N);

  // STRICT UTF-8 (NO LOSSY FALLBACK)
  match std::str::from_utf8(&input[..len]) {
    Ok(s) => s.to_string(),
    Err(_) => {
      // fallback safe mode for corrupted state
      String::from("<invalid_utf8>")
    }
  }
}
