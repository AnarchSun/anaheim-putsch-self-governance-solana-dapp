# ./Dockerfile
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Versions
ENV SOLANA_VERSION=2.1.1 \
    ANCHOR_VERSION=0.31.1 \
    PNPM_VERSION=8.15.5 \
    NODE_VERSION=20.12.2

# Install core tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git unzip pkg-config build-essential libssl-dev \
    libudev-dev clang cmake xz-utils ca-certificates \
    python3 python3-pip sudo openssh-client jq gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install PNPM globally
RUN npm install -g pnpm@${PNPM_VERSION}

# Install Rust + Anchor
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y \
    && . $HOME/.cargo/env \
    && rustup default stable \
    && cargo install --git https://github.com/coral-xyz/anchor --tag v${ANCHOR_VERSION} anchor-cli

# Install Solana CLI
RUN curl -sSfL https://release.solana.com/v${SOLANA_VERSION}/install | bash \
    && ln -s $HOME/.local/share/solana/install/active_release/bin/solana /usr/local/bin/solana

# Setup working directory and copy files
WORKDIR /app
COPY . .

# Install deps and build
RUN pnpm install
RUN pnpm build || true  # <- remplace selon ton projet

EXPOSE 3000
CMD ["pnpm", "dev"]
