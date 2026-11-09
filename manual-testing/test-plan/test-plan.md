# FleetFlow — Test Plan

## 1. Objective
Validate the functionality, reliability, security and performance of the FleetFlow vehicle
booking, driver assignment and maintenance workflows across all user roles.

## 2. Scope
In scope: Authentication, Vehicle Management, Driver Management, Vehicle Booking, Trip
Management, Maintenance, Fuel Management (stub), Reports (stub).
Out of scope: payment processing, third-party fleet telematics integration.

## 3. Test levels
- Unit (developer-owned, out of this plan's scope)
- Functional / UI (manual + Selenium/Playwright)
- API / Integration (Postman, REST Assured)
- Regression (automated, run on every CI build)
- Performance (JMeter)
- Security (OWASP ZAP)
- Compatibility (BrowserStack: Chrome, Firefox, Safari)

## 4. Entry criteria
- Application deployed via `docker compose up` with seeded test accounts
- Test environment URLs and seed data documented in `manual-testing/test-plan/environment.md`

## 5. Exit criteria
- 100% of P1 (blocker/critical) test cases executed and passed
- No open Sev-1/Sev-2 defects
- Automated regression suite green on the release branch

## 6. Roles under test
| Role | Capabilities |
| --- | --- |
| Employee | Request vehicle bookings |
| Fleet Manager | Approve/reject bookings, assign drivers, register maintenance |
| Admin | Full access: manage vehicles, drivers, users |

## 7. Deliverables
- Test cases (`manual-testing/test-cases/`)
- Requirement Traceability Matrix (`manual-testing/RTM/`)
- Defect reports (`manual-testing/defect-reports/`)
- Automated suite results (CI artifacts)

## 8. Risks
- Concurrency defects in booking may not surface without load (mitigated by JMeter concurrency scenario)
- Expired/edge-case licence data must be seeded correctly for driver-assignment negative tests
