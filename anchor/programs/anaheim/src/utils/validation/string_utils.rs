pub fn str_to_fixed_array<const N: usize>(input: &str) -> Result<[u8; N], &'static str> {
  let bytes = input.as_bytes();
  if bytes.len() > N {
    return Err("String too long");
  }

  let mut buffer = [0u8; N];
  buffer[..bytes.len()].copy_from_slice(bytes);
  Ok(buffer)
}
