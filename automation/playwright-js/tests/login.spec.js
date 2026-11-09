import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('fleet manager can log in and see approve/reject actions', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-email').fill('manager@fleetflow.test');
    await page.getByTestId('login-password').fill('Manager@123');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('bookings-table')).toBeVisible();
  });

  test('invalid credentials show an error', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('login-email').fill('employee@fleetflow.test');
    await page.getByTestId('login-password').fill('wrong-password');
    await page.getByTestId('login-submit').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
  });
});
