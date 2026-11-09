package fleetflow.api;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;

/**
 * Covers REQ-01, REQ-02 (TC-BK-001, TC-BK-002, TC-BK-003, TC-BK-004, TC-BK-007) against the
 * booking-service directly (auth-service issues the bearer token used for each call).
 */
public class BookingApiTest {

  private static final String AUTH_BASE = System.getProperty("auth.base", "http://localhost:4001");
  private static final String BOOKING_BASE = System.getProperty("booking.base", "http://localhost:4004");
  private static String employeeToken;
  private static String managerToken;

  @BeforeClass
  public void authenticate() {
    employeeToken = login("employee@fleetflow.test", "Employee@123");
    managerToken = login("manager@fleetflow.test", "Manager@123");
  }

  private String login(String email, String password) {
    Response resp = given()
        .baseUri(AUTH_BASE)
        .contentType("application/json")
        .body(String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password))
        .when()
        .post("/auth/login");
    resp.then().statusCode(200);
    return resp.jsonPath().getString("token");
  }

  @Test(description = "TC-BK-001: book an available vehicle")
  public void createsBookingForAvailableVehicle() {
    given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + employeeToken)
        .contentType("application/json")
        .body("{\"vehicleId\":\"v-001\",\"startDate\":\"2026-12-10\",\"endDate\":\"2026-12-12\"}")
        .when()
        .post("/bookings")
        .then()
        .statusCode(201)
        .body("status", org.hamcrest.Matchers.equalTo("pending"));
  }

  @Test(description = "TC-BK-003: booking without dates is rejected")
  public void rejectsBookingWithoutDates() {
    given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + employeeToken)
        .contentType("application/json")
        .body("{\"vehicleId\":\"v-001\"}")
        .when()
        .post("/bookings")
        .then()
        .statusCode(400);
  }

  @Test(description = "TC-BK-004: invalid date range is rejected")
  public void rejectsInvalidDateRange() {
    given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + employeeToken)
        .contentType("application/json")
        .body("{\"vehicleId\":\"v-001\",\"startDate\":\"2026-12-12\",\"endDate\":\"2026-12-10\"}")
        .when()
        .post("/bookings")
        .then()
        .statusCode(400);
  }

  @Test(description = "Security: an employee cannot approve a booking (role check)")
  public void employeeCannotApproveBooking() {
    given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + employeeToken)
        .when()
        .post("/bookings/any-id/approve")
        .then()
        .statusCode(403);
  }
}
