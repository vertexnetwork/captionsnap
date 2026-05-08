import { test, expect } from "@playwright/test";

test("share-link round-trip and embed render", async ({ page, browser }) => {
  // 1) Land on the home page
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // 2) Type into the primary text field, then trigger share-link copy
  const sim = page.getByTestId("simulator-root");
  await expect(sim).toBeVisible();

  // Grant clipboard permission on chromium
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  const primary = page.getByLabel(/Primary text/).first();
  await primary.fill("Test ad copy for share-link round trip");

  await page.getByRole("button", { name: /Copy share link/ }).click();

  // 3) Expect the URL to now include ?s=
  const url = page.url();
  expect(url).toMatch(/[?&]s=/);

  // 4) Open the URL in a fresh context and verify state is rehydrated
  const fresh = await browser.newContext();
  const freshPage = await fresh.newPage();
  await freshPage.goto(url);
  await expect(
    freshPage.getByLabel(/Primary text/).first(),
  ).toHaveValue("Test ad copy for share-link round trip");
  await fresh.close();

  // 5) Embed render page renders the simulator in a bare-chrome layout
  await page.goto("/embed/render");
  await expect(page.getByTestId("simulator-root")).toBeVisible();
  // No site header: the brand link should not be present on /embed/render
  await expect(page.locator('a[href="/"]:has-text("CaptionSnap")')).toHaveCount(0);
});
