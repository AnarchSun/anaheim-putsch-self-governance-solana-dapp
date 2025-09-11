# PATH: docs/batch-fix/matrix-cleanup-cmd.md
# Batch Fix — Universal Matrix Cleanup Command (Punk DAO Lyric)

---

## **Shell Command — Universal Project Cleanup**

### **1. Remove caches & build artifacts**
```bash
# Remove Next.js, Vercel, Yarn, Node, and TypeScript caches
rm -rf .next/ dist/ build/ out/ node_modules/ .yarn/cache/ .yarn/build/ .cache/ .tsbuildinfo .turbo/ .vercel/ coverage/ .eslintcache

# Remove all log, error, debug, and temp files
find . -type f \( -name "*.log" -o -name "*.tmp" -o -name "*.err" -o -name "*.swp" \) -delete

# Remove Docker volumes (if any)
docker system prune -af --volumes

# Remove old lockfiles
rm -f yarn.lock package-lock.json pnpm-lock.yaml

# Remove env backup files
rm -f .env.local.backup .env.production .env.development .env.test .env.example

# Clean up next/image cache
rm -rf public/_next/image