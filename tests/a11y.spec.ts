import "dotenv/config";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
}

test.describe("Accessibility", () => {
  test("login page has no automatically detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "TaskFlow" })).toBeVisible();

    await expectNoA11yViolations(page);
  });

  test("signup mode has no automatically detectable WCAG A/AA violations", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /sign up|zarejestruj/i }).click();

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/hasło|password/i)).toBeVisible();

    await expectNoA11yViolations(page);
  });

  test("dashboard has no automatically detectable WCAG A/AA violations", async ({ page }) => {
    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;

    if (!email || !password) {
      throw new Error("Missing E2E_EMAIL or E2E_PASSWORD. Add them to your .env file.");
    }

    await page.goto("/login?redirect=%2F");

    const form = page.locator("form");

    const emailInput = form.getByLabel(/email/i);
    const passwordInput = form.getByLabel(/hasło|password/i);
    const loginButton = form.getByRole("button", { name: /^zaloguj$/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled({ timeout: 10000 });

    await emailInput.fill(email);
    await passwordInput.fill(password);

    await expect(emailInput).toHaveValue(email);
    await expect(passwordInput).toHaveValue(password);

    await loginButton.click();

    await expect(page.getByRole("heading", { name: /my tasks/i })).toBeVisible({
      timeout: 20000,
    });

    await expect(page.getByText(/manage and track your daily tasks/i)).toBeVisible();

    await expectNoA11yViolations(page);
  });
});
