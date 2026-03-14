#!/usr/bin/env bash
# deploy.sh — Build both escape rooms and push to gh-pages
# Usage: bash deploy.sh
set -e

REPO="https://github.com/aybc2025/escaperoom.git"
DEPLOY_DIR="_deploy"

echo "=== Building Space ==="
npm install --prefix . --silent
npm run build --prefix .
# Output: dist/

echo ""
echo "=== Building Island ==="
cd island
npm install --silent
npm run build
# Output: island/build/
cd ..

echo ""
echo "=== Assembling deploy folder ==="
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Root files (landing page, unified manifest, unified SW)
cp root-static/index.html "$DEPLOY_DIR/index.html"
cp root-static/manifest.json "$DEPLOY_DIR/manifest.json"
cp root-static/sw.js "$DEPLOY_DIR/sw.js"

# Shared icons (from Space public — used by root manifest)
mkdir -p "$DEPLOY_DIR/icons"
cp public/icons/icon-192.png "$DEPLOY_DIR/icons/"
cp public/icons/icon-512.png "$DEPLOY_DIR/icons/"

# Space game → /space/ subfolder
mkdir -p "$DEPLOY_DIR/space"
cp -r dist/* "$DEPLOY_DIR/space/"
# Space's own icons already exist at root — remove duplicate from space/
rm -rf "$DEPLOY_DIR/space/icons"

# Island game → /island/ subfolder
mkdir -p "$DEPLOY_DIR/island"
cp -r island/build/* "$DEPLOY_DIR/island/"
# Island has its own theme icons — keep them at /island/icons/
# Remove island's own sw.js and manifest.json (using root versions)
rm -f "$DEPLOY_DIR/island/sw.js"
rm -f "$DEPLOY_DIR/island/manifest.json"

# Prevent Jekyll processing on GitHub Pages
touch "$DEPLOY_DIR/.nojekyll"

echo ""
echo "=== Deploy structure ==="
find "$DEPLOY_DIR" -not -path '*/.git/*' | sort | head -40

echo ""
echo "=== Pushing to gh-pages ==="
cd "$DEPLOY_DIR"
git init -b gh-pages
git add -A
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push --force "$REPO" gh-pages:gh-pages
cd ..
rm -rf "$DEPLOY_DIR"

echo ""
echo "Done! Live at: https://aybc2025.github.io/escaperoom/"
echo ""
echo "IMPORTANT: After each deploy, bump CACHE_VERSION in root-static/sw.js"
echo "to ensure PWA auto-updates on all installed devices."
