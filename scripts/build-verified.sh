#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

vinext="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm run install:ci and wait for it to finish before building." >&2
  exit 69
fi

echo "Running bounded vinext build..."
node --input-type=module - \
  "${vinext}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${SITES_BUILD_KILL_AFTER:-10s}" <<'NODE'
import { spawn } from "node:child_process";

const [command, timeoutText, killAfterText] = process.argv.slice(2);
const units = { ms: 1, s: 1_000, m: 60_000, h: 3_600_000 };

function milliseconds(value, name) {
  const match = /^(\d+)(ms|s|m|h)$/.exec(value);
  if (!match || Number(match[1]) === 0) {
    throw new Error(`${name} must be a positive duration such as 500ms, 10s, or 3m`);
  }
  return Number(match[1]) * units[match[2]];
}

const timeout = milliseconds(timeoutText, "SITES_BUILD_TIMEOUT");
const killAfter = milliseconds(killAfterText, "SITES_BUILD_KILL_AFTER");
const child = spawn(command, ["build"], { detached: true, stdio: "inherit" });

function signalGroup(signal) {
  try {
    process.kill(-child.pid, signal);
  } catch (error) {
    if (error.code !== "ESRCH") throw error;
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => signalGroup(signal));
}

let timedOut = false;
let killTimer;
const timeoutTimer = setTimeout(() => {
  timedOut = true;
  console.error(`vinext build exceeded ${timeoutText}; sending SIGTERM.`);
  signalGroup("SIGTERM");
  killTimer = setTimeout(() => signalGroup("SIGKILL"), killAfter);
}, timeout);

const result = await new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("exit", (code, signal) => resolve({ code, signal }));
});

clearTimeout(timeoutTimer);
clearTimeout(killTimer);
if (timedOut) process.exit(124);
if (result.signal) {
  console.error(`vinext build terminated by ${result.signal}.`);
  process.exit(1);
}
process.exit(result.code ?? 1);
NODE

"${script_dir}/validate-artifact.sh"
