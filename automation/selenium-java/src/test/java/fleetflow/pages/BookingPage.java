package fleetflow.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.Select;

public class BookingPage {
  private final WebDriver driver;

  private final By vehicleSelect = By.cssSelector("[data-testid='booking-vehicle']");
  private final By startDate = By.cssSelector("[data-testid='booking-start']");
  private final By endDate = By.cssSelector("[data-testid='booking-end']");
  private final By submitButton = By.cssSelector("[data-testid='booking-submit']");
  private final By message = By.cssSelector("[data-testid='booking-message']");
  private final By table = By.cssSelector("[data-testid='bookings-table']");

  public BookingPage(WebDriver driver) {
    this.driver = driver;
  }

  public void bookFirstAvailableVehicle(String start, String end) {
    new Select(driver.findElement(vehicleSelect)).selectByIndex(1);
    driver.findElement(startDate).sendKeys(start);
    driver.findElement(endDate).sendKeys(end);
    driver.findElement(submitButton).click();
  }

  public String getMessage() {
    return driver.findElement(message).getText();
  }

  public boolean isTableVisible() {
    return driver.findElement(table).isDisplayed();
  }
}
