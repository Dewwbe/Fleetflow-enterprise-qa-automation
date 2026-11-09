# Performance testing (JMeter)

- `booking-concurrency-test.jmx` — TC-BK-008: two employees booking the same vehicle for an
  overlapping window at the same time. Exactly one `POST /bookings` should return 201, the
  other 409. Replace `EMPLOYEE_TOKEN` with a real JWT from `POST /auth/login` before running.
- `vehicle-search-load-test.jmx` — 100 concurrent users calling `GET /vehicles` (the
  "Performance" scenario in the QA strategy table).

Run headless:

```bash
jmeter -n -t booking-concurrency-test.jmx -l results-concurrency.jtl
jmeter -n -t vehicle-search-load-test.jmx -l results-load.jtl -e -o report/
```
