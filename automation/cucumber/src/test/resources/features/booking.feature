Feature: Vehicle booking and approval
  As an employee I want to request a vehicle
  so that a fleet manager can approve or reject the request.

  Background:
    Given the employee "employee@fleetflow.test" is authenticated
    And the fleet manager "manager@fleetflow.test" is authenticated

  Scenario: Book an available vehicle
    When the employee requests vehicle "v-001" from "2026-12-10" to "2026-12-12"
    Then the booking is created with status "pending"

  Scenario: Book an already reserved vehicle
    Given vehicle "v-001" already has an approved booking from "2026-12-10" to "2026-12-12"
    When the employee requests vehicle "v-001" from "2026-12-11" to "2026-12-13"
    Then the booking request is rejected with a conflict

  Scenario: Fleet manager approves a pending booking
    Given the employee has a pending booking for vehicle "v-002"
    When the fleet manager approves the booking
    Then the booking status becomes "approved"

  Scenario: Fleet manager cannot approve the same booking twice
    Given the employee has an approved booking for vehicle "v-002"
    When the fleet manager approves the booking again
    Then the booking request is rejected with a conflict
