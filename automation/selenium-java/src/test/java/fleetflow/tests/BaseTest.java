package fleetflow.tests;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

public abstract class BaseTest {
  protected WebDriver driver;
  protected static final String BASE_URL = System.getProperty("base.url", "http://localhost:5173");

  @BeforeMethod
  public void setUp() {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    if (Boolean.parseBoolean(System.getProperty("headless", "true"))) {
      options.addArguments("--headless=new");
    }
    driver = new ChromeDriver(options);
    driver.manage().window().maximize();
  }

  @AfterMethod
  public void tearDown() {
    if (driver != null) driver.quit();
  }
}
