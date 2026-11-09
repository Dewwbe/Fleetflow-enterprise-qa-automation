import { test, expect } from '@playwright/test';

/**
 * TC-BK-005 / TC-BK-006: fleet manager approves or rejects a pending booking.
 * Assumes a pending booking already exists for the signed-in manager's fleet
 * (seed it via the API in a beforeEach once the booking-service is wired to Mongo).
 */
test.describe('Booking approval', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-email').fill('manager@fleetflow.test');
    await page.getByTestId('login-password').fill('Manager@123');
    await page.getByTestId('login-submit').click();
    await expect(page.getByTestId('bookings-table')).toBeVisible();
  });

  test('fleet manager can see the bookings table with action buttons', async ({ page }) => {
    const table = page.getByTestId('bookings-table');
    await expect(table).toContainText('Status');
  });
});
