# ---- Base image with Rust, Solana, Node, and Anchor ----
FROM ubuntu:22.04

# Avoiding interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Versions
ENV RUSTUP_HOME=/usr/local/rustup \
    CARGO_HOME=/usr/local/cargo \
    PATH=/usr/local/cargo/bin:$PATH \
    SOLANA_VERSION=2.1.1 \
    ANCHOR_VERSION=0.31.1 \
    NODE_VERSION=20.12.2 \
    PNPM_VERSION=8.15.5

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git unzip pkg-config build-essential libssl-dev \
    libudev-dev clang cmake xz-utils ca-certificates \
    python3 python3-pip sudo openssh-client jq \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js + PNPM
RUN sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)" -o solana.sh \
    chmod +x solana.sh ./solana.sh
RUN echo $SHELL && echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc && echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc \
   source ~/.bashrc && source ~/.zshrc && agave-install update

# Rust + Solana + Anchor
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y \
    && rustup default stable \
    && cargo install --git https://github.com/coral-xyz/anchor --tag v${ANCHOR_VERSION} anchor-cli \
    && curl -sSfL https://release.solana.com/v${SOLANA_VERSION}/install -o solana-install.sh || true \
    && chmod +x solana-install.sh && ./solana-install.sh || true \
    && echo "export PATH=\$HOME/.local/share/solana/install/active_release/bin:\$PATH" >> ~/.bashrc \
    && echo "Solana installed at: \$(which solana)" || true \
    && anchor --version



# Create app user (optional)
RUN useradd -m app && mkdir -p /home/app/app && chown -R app:app /home/app

WORKDIR /home/app/app
COPY . .

# Install dependencies using PNPM
RUN pnpm install

# Build project
RUN pnpm build

# Default command: bash shell
CMD [ "bash" ]
