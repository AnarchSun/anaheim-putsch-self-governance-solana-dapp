FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive

ENV SOLANA_VERSION=2.1.1 \
    ANCHOR_VERSION=0.31.1 \
    PNPM_VERSION=8.15.5 \
    NODE_VERSION=20.12.2

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git unzip pkg-config build-essential \
    libssl-dev libudev-dev clang cmake xz-utils \
    llvm protobuf-compiler ca-certificates \
    python3 python3-pip sudo openssh-client jq gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g pnpm@${PNPM_VERSION}

RUN curl https://sh.rustup.rs -sSf | bash -s -- -y \
    && . $HOME/.cargo/env \
    && rustup default stable \
    && cargo install --git https://github.com/coral-xyz/anchor --tag v${ANCHOR_VERSION} anchor-cli

RUN sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)" \
    && ln -s $HOME/.local/share/solana/install/active_release/bin/solana /usr/local/bin/solana

WORKDIR /app
COPY . .

RUN pnpm install && pnpm up
RUN pnpm anchor:build || true

EXPOSE 3000
CMD ["pnpm","dev"]
