#!/bin/bash
set -e

echo "🔨 Building Anchor programs..."
anchor build

echo "📦 Copying IDL files..."
node ./post-build-copy.mjs

