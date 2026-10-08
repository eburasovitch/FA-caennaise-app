#!/bin/bash
# Installe playwright-cli pour que Claude puisse ouvrir le site et prendre des captures.
set -euo pipefail
if ! command -v playwright-cli >/dev/null 2>&1; then
  npm install -g @playwright/cli@latest >/dev/null 2>&1 || echo "playwright-cli: installation impossible" >&2
fi

# Dans les sessions cloud, Chromium est préinstallé ici : on indique ce navigateur à playwright-cli.
if [ -x /opt/pw-browsers/chromium ] && [ ! -f "$CLAUDE_PROJECT_DIR/.playwright/cli.config.json" ]; then
  mkdir -p "$CLAUDE_PROJECT_DIR/.playwright"
  echo '{"browser":{"browserName":"chromium","launchOptions":{"executablePath":"/opt/pw-browsers/chromium"}}}' \
    > "$CLAUDE_PROJECT_DIR/.playwright/cli.config.json"
fi
