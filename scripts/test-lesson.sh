#!/usr/bin/env bash
# Smoke-test a lesson before teaching it.
# Usage: ./scripts/test-lesson.sh N      (e.g. 3 for lesson-03)
#
# Fails fast and loud. Run this in pre-flight for every session.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Usage: $0 <lesson-number>" >&2
  exit 2
fi

N=$(printf "%02d" "$1")
TAG="lesson-${N}"

echo "==> checking out ${TAG}"
git checkout "${TAG}"

# lesson-00 has no app yet
if [ "$1" -eq 0 ]; then
  echo "==> lesson-00 has no app to test. Verifying docs only."
  test -f README.md && test -f docs/TEACHER.md && test -f docs/LEARNER.md
  echo "OK"
  exit 0
fi

echo "==> install"
pnpm install --frozen-lockfile

if [ -f .env.local ]; then
  echo "==> .env.local present"
else
  echo "WARN: .env.local missing — copy from .env.example before running app code" >&2
fi

if [ "$1" -ge 2 ]; then
  echo "==> db push"
  pnpm db:push
  echo "==> db seed"
  pnpm db:seed || true   # idempotency is solved per-lesson
fi

echo "==> lint"
pnpm lint
echo "==> typecheck"
pnpm typecheck
echo "==> unit tests"
pnpm test --run

if [ "$1" -ge 5 ]; then
  echo "==> e2e tests"
  pnpm test:e2e
fi

echo "==> build"
pnpm build

echo
echo "ALL CHECKS PASSED for ${TAG}"
