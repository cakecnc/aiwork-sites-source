#!/usr/bin/env bash
set -euo pipefail

target="${1:-prod}"
if [ "$target" != "staging" ] && [ "$target" != "prod" ]; then
  echo "Usage: $0 <staging|prod>"
  exit 64
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

get_remote_sha() {
  local branch="$1"
  git -C "$PROJECT_ROOT" ls-remote --refs origin "refs/heads/$branch" | awk 'NR==1 {print $1}'
}

main_sha="$(get_remote_sha main)"
staging_sha="$(get_remote_sha staging)"
prod_sha="$(get_remote_sha prod)"
target_sha="$(get_remote_sha "$target")"

if [ -z "$main_sha" ] || [ -z "$target_sha" ] || [ -z "$staging_sha" ] || [ -z "$prod_sha" ]; then
  echo "원격 브랜치 SHA 조회 실패(브랜치 미존재 가능):"
  [ -z "$main_sha" ] && echo "  - origin/main: not found"
  [ -z "$staging_sha" ] && echo "  - origin/staging: not found"
  [ -z "$prod_sha" ] && echo "  - origin/prod: not found"
  exit 1
fi

echo "Remote branch SHA"
printf 'main   : %s\n' "$main_sha"
printf 'staging: %s\n' "$staging_sha"
printf 'prod   : %s\n' "$prod_sha"
printf 'target : %s (%s)\n' "$target" "$target_sha"

echo "---"

if [ "${CLOUDFLARE_API_TOKEN:-}" = "" ] || [ "${CLOUDFLARE_PAGES_PROJECT_NAME:-}" = "" ]; then
  echo "Cloudflare credential/project env가 없어 Git SHA만 표시합니다."
  exit 0
fi

env_type="preview"
if [ "$target" = "prod" ]; then
  env_type="production"
fi

TARGET_BRANCH="$target" \
CLOUDFLARE_PAGES_PROJECT_NAME="$CLOUDFLARE_PAGES_PROJECT_NAME" \
npx -y wrangler pages deployment list \
  --project-name "$CLOUDFLARE_PAGES_PROJECT_NAME" \
  --environment "$env_type" \
  --json \
  | node - <<'NODE'
const fs = require("node:fs");
const input = fs.readFileSync(0, "utf8").trim();
if (!input) process.exit(0);
const payload = JSON.parse(input);
const list = Array.isArray(payload) ? payload : Array.isArray(payload.deployments) ? payload.deployments : [];
if (list.length === 0) {
  console.log("Cloudflare deployment list: none");
  process.exit(0);
}
const target = process.env.TARGET_BRANCH || "";
const match = list.find((entry) => {
  const meta = entry.metadata || entry.deployment?.metadata || {};
  const branch = meta.branch || entry.branch || entry.deployment?.branch || "";
  return branch === target;
}) || list[0];

const meta = match.metadata || match.deployment?.metadata || {};
const branch = meta.branch || match.branch || match.deployment?.branch || "-";
const hash = meta.commit_hash || match.commit_hash || match.deployment?.metadata?.commit_hash || "-";
const created = match.created_on || match.created_at || meta.created_on || "-";
console.log(`Cloudflare latest branch candidate: branch=${branch} sha=${hash} created=${created}`);
NODE
