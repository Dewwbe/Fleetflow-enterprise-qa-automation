# FleetFlow — Enterprise Fleet & Vehicle Management System

**Testing Beyond Functionality. Engineering for Reliability.**

FleetFlow is a web-based fleet management platform (vehicles, drivers, bookings, trips,
maintenance, fuel) built as the base application for an **EPIC Lanka QA Automation
Internship** portfolio project. The application is intentionally kept small; the bulk of
the engineering effort goes into the QA framework around it — manual test design, UI and
API automation, performance testing, and security testing.

See the companion project plan document for the full scope, workflows, test strategy and
timeline.

## Repository layout

```
FleetFlow/
├── application/              # the app under test (microservices + frontend)
│   ├── frontend/              # React (Vite)
│   ├── auth-service/          # Node.js + Express
│   ├── vehicle-service/
│   ├── driver-service/
│   ├── booking-service/
│   ├── trip-service/
│   └── maintenance-service/
├── manual-testing/           # test plan, test cases, scenarios, RTM, defect reports
├── automation/
│   ├── selenium-java/         # Selenium + Java + TestNG UI automation
│   ├── playwright-js/         # Playwright cross-browser UI automation
│   ├── rest-assured/          # REST Assured API automation
│   └── cucumber/              # Gherkin scenarios + step definitions
├── performance-testing/
│   └── jmeter/                # JMeter test plans (load + concurrency)
├── security-testing/
│   └── zap/                   # OWASP ZAP baseline/full scan configs
├── docker/                   # docker-compose for the full stack
├── jenkins/                   # Jenkinsfile
└── .github/workflows/         # GitHub Actions CI
```

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React (Vite) |
| Backend | Node.js + Express, one service per module |
| Architecture | Microservices |
| Database | MongoDB (one database, per-service collections) |
| Messaging | RabbitMQ (async events: booking approved, trip assigned) |
| UI automation | Java + Selenium + TestNG, Playwright + JavaScript |
| API automation | REST Assured, Postman |
| BDD | Cucumber (Gherkin) |
| Performance | Apache JMeter |
| Security | OWASP ZAP |
| Code quality | SonarQube |
| CI/CD | Jenkins, GitHub Actions, Docker |

## Quick start (local)

```bash
# 1. copy environment defaults
cp .env.example .env

# 2. start MongoDB, RabbitMQ, all 6 services and the frontend
cd docker
docker compose up --build

# frontend:        http://localhost:5173
# auth-service:     http://localhost:4001
# vehicle-service:  http://localhost:4002
# driver-service:   http://localhost:4003
# booking-service:  http://localhost:4004
# trip-service:     http://localhost:4005
# maintenance-service: http://localhost:4006
```

Each service also runs standalone for development:

```bash
cd application/booking-service
npm install
npm run dev
```

## Running the QA suites

| Suite | Command |
| --- | --- |
| Selenium + TestNG | `cd automation/selenium-java && mvn test` |
| Playwright | `cd automation/playwright-js && npm install && npx playwright test` |
| REST Assured | `cd automation/rest-assured && mvn test` |
| Cucumber | `cd automation/cucumber && mvn test` |
| JMeter | `jmeter -n -t performance-testing/jmeter/booking-load-test.jmx -l results.jtl` |
| OWASP ZAP baseline | `bash security-testing/zap/zap-baseline.sh` |

CI runs smoke + API automation on every push; the full suite (UI + performance + security)
runs nightly and on release branches — see `.github/workflows/ci.yml` and `jenkins/Jenkinsfile`.

## Status

Scaffold generated from the project plan. Each service currently ships minimal in-memory
routes so the automation frameworks have real endpoints and pages to run against from day
one; replace the in-memory stores with MongoDB models as each module is implemented.
