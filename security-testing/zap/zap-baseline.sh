#!/usr/bin/env bash
# OWASP ZAP baseline scan against the frontend + each service's health/API surface.
# Requires Docker (uses the official zaproxy/zap-stable image).
set -euo pipefail

TARGET="${1:-http://host.docker.internal:5173}"
REPORT_DIR="$(dirname "$0")/reports"
mkdir -p "$REPORT_DIR"

docker run --rm -v "$REPORT_DIR:/zap/wrk:rw" \
  -t zaproxy/zap-stable zap-baseline.py \
  -t "$TARGET" \
  -r "baseline-report.html" \
  -J "baseline-report.json" \
  -I
