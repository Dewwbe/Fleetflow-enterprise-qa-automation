package fleetflow.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class LoginPage {
  private final WebDriver driver;

  private final By emailInput = By.cssSelector("[data-testid='login-email']");
  private final By passwordInput = By.cssSelector("[data-testid='login-password']");
  private final By submitButton = By.cssSelector("[data-testid='login-submit']");
  private final By errorMessage = By.cssSelector("[data-testid='login-error']");

  public LoginPage(WebDriver driver) {
    this.driver = driver;
  }

  public void open(String baseUrl) {
    driver.get(baseUrl + "/");
  }

  public void loginAs(String email, String password) {
    WebElement email_ = driver.findElement(emailInput);
    email_.clear();
    email_.sendKeys(email);
    WebElement pwd = driver.findElement(passwordInput);
    pwd.clear();
    pwd.sendKeys(password);
    driver.findElement(submitButton).click();
  }

  public boolean hasError() {
    return !driver.findElements(errorMessage).isEmpty();
  }
}
