package fleetflow.steps;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;

import static io.restassured.RestAssured.given;
import static org.testng.Assert.assertEquals;

/**
 * Minimal step definitions wired to the real services via REST Assured. Fill in
 * BASE URLs / tokens via environment variables when the services are live.
 */
public class BookingSteps {

  private static final String AUTH_BASE = System.getProperty("auth.base", "http://localhost:4001");
  private static final String BOOKING_BASE = System.getProperty("booking.base", "http://localhost:4004");

  private String employeeToken;
  private String managerToken;
  private Response lastResponse;
  private String lastBookingId;

  @Given("the employee {string} is authenticated")
  public void employeeIsAuthenticated(String email) {
    employeeToken = login(email, "Employee@123");
  }

  @Given("the fleet manager {string} is authenticated")
  public void managerIsAuthenticated(String email) {
    managerToken = login(email, "Manager@123");
  }

  @When("the employee requests vehicle {string} from {string} to {string}")
  public void employeeRequestsVehicle(String vehicleId, String start, String end) {
    lastResponse = given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + employeeToken)
        .contentType("application/json")
        .body(String.format("{\"vehicleId\":\"%s\",\"startDate\":\"%s\",\"endDate\":\"%s\"}", vehicleId, start, end))
        .post("/bookings");
    if (lastResponse.statusCode() == 201) {
      lastBookingId = lastResponse.jsonPath().getString("id");
    }
  }

  @Then("the booking is created with status {string}")
  public void bookingIsCreatedWithStatus(String status) {
    assertEquals(lastResponse.statusCode(), 201);
    assertEquals(lastResponse.jsonPath().getString("status"), status);
  }

  @Then("the booking request is rejected with a conflict")
  public void bookingRequestIsRejected() {
    assertEquals(lastResponse.statusCode(), 409);
  }

  @Given("vehicle {string} already has an approved booking from {string} to {string}")
  public void vehicleAlreadyHasApprovedBooking(String vehicleId, String start, String end) {
    employeeRequestsVehicle(vehicleId, start, end);
    approveLastBooking();
  }

  @Given("the employee has a pending booking for vehicle {string}")
  public void employeeHasPendingBooking(String vehicleId) {
    employeeRequestsVehicle(vehicleId, "2026-12-20", "2026-12-22");
  }

  @Given("the employee has an approved booking for vehicle {string}")
  public void employeeHasApprovedBooking(String vehicleId) {
    employeeRequestsVehicle(vehicleId, "2026-12-25", "2026-12-27");
    approveLastBooking();
  }

  @When("the fleet manager approves the booking")
  public void fleetManagerApprovesBooking() {
    approveLastBooking();
  }

  @When("the fleet manager approves the booking again")
  public void fleetManagerApprovesBookingAgain() {
    approveLastBooking();
  }

  @Then("the booking status becomes {string}")
  public void bookingStatusBecomes(String status) {
    assertEquals(lastResponse.statusCode(), 200);
    assertEquals(lastResponse.jsonPath().getString("status"), status);
  }

  private void approveLastBooking() {
    lastResponse = given()
        .baseUri(BOOKING_BASE)
        .header("Authorization", "Bearer " + managerToken)
        .post("/bookings/" + lastBookingId + "/approve");
  }

  private String login(String email, String password) {
    Response resp = given()
        .baseUri(AUTH_BASE)
        .contentType("application/json")
        .body(String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password))
        .post("/auth/login");
    return resp.jsonPath().getString("token");
  }
}
