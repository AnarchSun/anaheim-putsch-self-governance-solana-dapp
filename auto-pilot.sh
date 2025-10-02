#!/bin/bash
# auto-pilot.sh
# 🚀 Pilote automatique pour la branche Orion

BRANCH="Orion"
set -e

echo "⚙️ Passage sur la branche $BRANCH..."
git checkout $BRANCH || git checkout -b $BRANCH

while true; do
  echo "🔄 Sync avec remote..."
  git pull origin $BRANCH || true

  echo "🛠️ Build + lint..."
  if pnpm build; then
    echo "✅ Build ok"
  else
    echo "❌ Build failed, commit pour suivi"
  fi

  echo "➕ Ajout des fichiers modifiés..."
  git add .

  ERRORS=$(grep -R "error" -n ./src || true)
  SUMMARY="Orion auto-pilot: $(date '+%Y-%m-%d %H:%M:%S')"
  if [ -n "$ERRORS" ]; then
    SUMMARY="$SUMMARY ⚠️ erreurs détectées"
  fi

  echo "💾 Commit: $SUMMARY"
  git commit -m "$SUMMARY" || echo "ℹ️ Rien à committer"

  echo "📤 Push vers $BRANCH..."
  git push origin $BRANCH || echo "⚠️ Push failed"

  echo "⏱️ Pause 5 min avant la prochaine boucle"
  sleep 300
done
