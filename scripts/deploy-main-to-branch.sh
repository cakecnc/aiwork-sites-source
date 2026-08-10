#!/usr/bin/env bash
set -euo pipefail

target="${1:?Usage: $0 <staging|prod>}"

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

current_branch="$(git -C "$PROJECT_ROOT" rev-parse --abbrev-ref HEAD)"
if [ "$current_branch" != "main" ]; then
  echo "main 브랜치에서 실행해 주세요. 현재 브랜치: $current_branch"
  exit 1
fi

if [ -n "$(git -C "$PROJECT_ROOT" status --porcelain)" ]; then
  echo "main 브랜치에 커밋되지 않은 변경이 있습니다."
  exit 1
fi

git -C "$PROJECT_ROOT" fetch origin main --prune >/dev/null
local_sha="$(git -C "$PROJECT_ROOT" rev-parse HEAD)"
remote_main_sha="$(get_remote_sha main)"

if [ -z "$remote_main_sha" ]; then
  echo "origin/main을 조회할 수 없습니다."
  exit 1
fi

if [ "$local_sha" != "$remote_main_sha" ]; then
  echo "main 브랜치와 origin/main이 다릅니다."
  echo "로컬 HEAD:      $local_sha"
  echo "원격 main:      $remote_main_sha"
  echo "먼저 'git push origin main' 후 실행해 주세요."
  exit 1
fi

main_sha="$local_sha"
git -C "$PROJECT_ROOT" push origin "$main_sha:refs/heads/$target"

echo "[main -> $target] git sync: $main_sha"
echo "branch SHA: $(get_remote_sha "$target")"

if [ "${CLOUDFLARE_API_TOKEN:-}" = "" ] || [ "${CLOUDFLARE_PAGES_PROJECT_NAME:-}" = "" ]; then
  echo "Cloudflare 배포 환경 변수가 없어 Git 브랜치 동기화까지만 수행했습니다."
  exit 0
fi

npm -C "$PROJECT_ROOT" run build

npx -y wrangler pages deploy "$PROJECT_ROOT/dist" \
  --project-name "$CLOUDFLARE_PAGES_PROJECT_NAME" \
  --branch "$target" \
  --commit-hash "$main_sha" \
  --commit-message "deploy($target) from main ${main_sha}"

echo "Cloudflare deploy command issued for $target"
echo "branch SHA: $(get_remote_sha "$target")"
