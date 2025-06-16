# Base image avec Ubuntu + Rust
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH=/root/.local/share/solana/install/active_release/bin:/root/.cargo/bin:$PATH

# 1. System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl build-essential pkg-config libssl-dev libudev-dev git wget \
  ca-certificates python3 python3-pip zsh gnupg nodejs npm \
  && rm -rf /var/lib/apt/lists/* \
  && apt full-upgrade -y

# 2. Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# 3. Solana CLI
RUN curl -sSfL https://release.solana.com/stable/install | bash

# 4. Node, corepack, pnpm
RUN npm install -g corepack && corepack enable && corepack prepare pnpm@latest --activate

# 5. Anchor CLI via AVM
RUN cargo install --git https://github.com/coral-xyz/anchor avm --force
RUN avm install latest && avm use latest

# 6. Codebase
WORKDIR /app
COPY . .

# 7. JS deps
RUN pnpm install --frozen-lockfile

# 8. Init + deploy
RUN chmod +x scripts/init.sh
RUN ./scripts/init.sh

# 9. Expose shell for dev
CMD ["/bin/bash"]
