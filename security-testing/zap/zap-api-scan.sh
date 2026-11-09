#!/usr/bin/env bash
# OWASP ZAP API scan against booking-service, driven by an OpenAPI/Postman definition.
# TC relevance: "Employee attempts to access admin endpoints" and similar role-escalation checks
# should additionally be covered by the REST Assured security tests (see automation/rest-assured).
set -euo pipefail

TARGET_API="${1:-http://host.docker.internal:4004}"
REPORT_DIR="$(dirname "$0")/reports"
mkdir -p "$REPORT_DIR"

docker run --rm -v "$REPORT_DIR:/zap/wrk:rw" \
  -t zaproxy/zap-stable zap-api-scan.py \
  -t "$TARGET_API" \
  -f openapi \
  -r "api-scan-report.html" \
  -I
