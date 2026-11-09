# Security testing (OWASP ZAP)

- `zap-baseline.sh [target-url]` — passive baseline scan of the frontend (default
  `http://host.docker.internal:5173`).
- `zap-api-scan.sh [target-api-url]` — active API scan against a service (default
  `booking-service` on `4004`). Point it at an OpenAPI/Swagger definition once one exists
  for full endpoint coverage.
- `reports/` (git-ignored) — HTML/JSON scan output, attach to defect reports for any findings.

Role-escalation checks specific to FleetFlow (e.g. "employee attempts to reach admin
endpoints") are also covered as explicit assertions in `automation/rest-assured`, since ZAP's
generic scan won't know FleetFlow's role model.
