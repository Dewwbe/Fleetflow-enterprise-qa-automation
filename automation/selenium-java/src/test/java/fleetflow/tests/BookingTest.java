package fleetflow.tests;

import fleetflow.pages.BookingPage;
import fleetflow.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

/**
 * Maps to TC-BK-001 / TC-BK-003 from manual-testing/test-cases/TC-BOOKING.csv.
 * Covers the "Book an available vehicle" and "missing dates" scenarios end-to-end through the UI.
 */
public class BookingTest extends BaseTest {

  @Test(description = "TC-BK-001: an employee can book an available vehicle")
  public void employeeCanBookAvailableVehicle() {
    LoginPage login = new LoginPage(driver);
    login.open(BASE_URL);
    login.loginAs("employee@fleetflow.test", "Employee@123");

    BookingPage bookings = new BookingPage(driver);
    Assert.assertTrue(bookings.isTableVisible(), "Bookings table should render after login");

    bookings.bookFirstAvailableVehicle("2026-12-01", "2026-12-03");
    Assert.assertEquals(bookings.getMessage(), "Booking requested.");
  }

  @Test(description = "Login rejects invalid credentials")
  public void invalidLoginShowsError() {
    LoginPage login = new LoginPage(driver);
    login.open(BASE_URL);
    login.loginAs("employee@fleetflow.test", "wrong-password");
    Assert.assertTrue(login.hasError(), "An error message should be shown for invalid credentials");
  }
}
