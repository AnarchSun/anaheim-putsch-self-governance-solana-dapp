pub fn string_to_fixed_array<const N: usize>(input: &str) -> [u8; N] {
  let mut buffer = [0u8; N];
  let bytes = input.as_bytes();
  let len = bytes.len().min(N);
  buffer[..len].copy_from_slice(&bytes[..len]);
  buffer
}

pub fn fixed_array_to_string<const N: usize>(input: &[u8; N]) -> String {
  let len = input.iter().position(|&c| c == 0).unwrap_or(N);
  String::from_utf8_lossy(&input[..len]).to_string()
}
