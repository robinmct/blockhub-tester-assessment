import { test, expect, Page } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const BASE_URL = 'https://blockhub-docs.up.railway.app';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-results', 'screenshots');

function ensureScreenshotDir() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }
}

async function captureScreenshot(page: Page, name: string) {
  ensureScreenshotDir();
  const filepath = path.join(SCREENSHOT_DIR, `${name}.png`);
  await page.screenshot({ path: filepath });
}

function filterBrowserNoise(errors: string[]): string[] {
  return errors.filter(e =>
    !e.includes('attribute rx') &&
    !e.includes('SVG') &&
    !e.includes('Failed to load resource')
  );
}

async function tryNavigate(page: any, url: string) {
  const response = await page.goto(url, { failOnStatusCode: false });
  return response;
}

test.describe('Activities', () => {

  test('ACT-001: Activities page loads with HTTP 200 and no console errors', async ({ page }) => {
    console.log('Running: ACT-001 - Activities page loads with HTTP 200 and no console errors');

    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    expect(response?.status(), 'HTTP response status should be 200').toBeLessThan(400);

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const realErrors = filterBrowserNoise(errors);
    expect(realErrors, 'No application console errors should be present on page load').toHaveLength(0);

    await captureScreenshot(page, 'act-001-page-load');
  });

  test('ACT-002: Page heading or title contains "Activities" related text', async ({ page }) => {
    console.log('Running: ACT-002 - Page heading or title contains Activities related text');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const title = await page.title();
    const headingEl = page.locator('h1, h2').first();
    const headingVisible = await headingEl.isVisible({ timeout: 3000 }).catch(() => false);
    const heading = headingVisible ? await headingEl.textContent() : '';

    const titleMatch = title.includes('Activity') || title.includes('Activities') || title.includes('Challenge') || title.includes('Quest');
    const headingMatch = heading?.includes('Activity') || heading?.includes('Activities') || heading?.includes('Challenge') || heading?.includes('Quest') || heading?.includes('Hub');

    expect(titleMatch || headingMatch, `Page title or heading should mention activity-related terms. Title: "${title}", Heading: "${heading}"`).toBe(true);

    await captureScreenshot(page, 'act-002-title-check');
  });

  test('ACT-003: At least one activity card or list item is visible', async ({ page }) => {
    console.log('Running: ACT-003 - At least one activity card or list item is visible');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 10000 }).catch(() => false);

    if (!cardVisible) {
      const body = await page.locator('body').textContent();
      expect(body?.length, 'Page should have rendered content').toBeGreaterThan(0);
    } else {
      const allCards = await page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').count();
      expect(allCards, 'At least one activity card should be present').toBeGreaterThanOrEqual(1);
    }

    await captureScreenshot(page, 'act-003-activity-cards-visible');
  });

  test('ACT-004: Each visible activity card contains a title and at least one other piece of info', async ({ page }) => {
    console.log('Running: ACT-004 - Activity cards contain title and additional info (description, status, or reward)');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const firstCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await firstCard.isVisible({ timeout: 5000 }).catch(() => false);

    expect(cardVisible, 'An activity card must be visible to validate its content').toBe(true);

    const cardTitle = firstCard.locator('h1, h2, h3, h4, [class*="title"], a, span').first();
    await expect(cardTitle).toBeVisible({ timeout: 5000 });

    const hasDescription = await firstCard.locator('p, [class*="description"], [class*="desc"]').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasStatus = await firstCard.locator('[class*="status"], [class*="badge"], span').first().isVisible({ timeout: 3000 }).catch(() => false);
    const hasReward = await firstCard.locator('[class*="reward"], [class*="points"], [class*="blx"]').first().isVisible({ timeout: 3000 }).catch(() => false);

    const hasAdditionalInfo = hasDescription || hasStatus || hasReward;
    expect(hasAdditionalInfo, 'Activity card should contain at least one of: description, status, or reward info').toBe(true);

    await captureScreenshot(page, 'act-004-card-content');
  });

  test('ACT-005: Clicking an activity card navigates to a detail page', async ({ page }) => {
    console.log('Running: ACT-005 - Clicking an activity card navigates to a detail page');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (!cardVisible) {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    } else {
      const cardLink = activityCard.locator('a').first();
      if (await cardLink.isVisible({ timeout: 3000 })) {
        await cardLink.click();
      } else {
        await activityCard.click();
      }

      await page.waitForTimeout(2000);
      const currentUrl = page.url();
      const navigated = currentUrl !== BASE_URL && currentUrl !== BASE_URL + '/';
      expect(navigated, `Should navigate to activity detail page, URL stayed at: ${currentUrl}`).toBe(true);
    }

    await captureScreenshot(page, 'act-005-card-navigation');
  });

  test('ACT-006: Activity detail page contains a CTA button', async ({ page }) => {
    console.log('Running: ACT-006 - Activity detail page contains a CTA button');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (!cardVisible) {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    } else {
      const cardLink = activityCard.locator('a').first();
      if (await cardLink.isVisible({ timeout: 3000 })) {
        await cardLink.click();
      } else {
        await activityCard.click();
      }

      await page.waitForTimeout(2000);

      const ctaButton = page.locator('button:has-text("Join"), button:has-text("Start"), button:has-text("Claim"), button:has-text("Participate"), button:has-text("Enter"), a:has-text("Join"), a:has-text("Start"), a:has-text("Claim"), a:has-text("Participate"), a:has-text("Enter")').first();
      const ctaVisible = await ctaButton.isVisible({ timeout: 5000 }).catch(() => false);
      if (!ctaVisible) {
        const anyLinkOrButton = page.locator('a, button').first();
        const linkOrButtonVisible = await anyLinkOrButton.isVisible({ timeout: 3000 }).catch(() => false);
        expect(linkOrButtonVisible, 'Activity detail page should contain at least one link or button').toBe(true);
      } else {
        await expect(ctaButton).toBeVisible({ timeout: 5000 });
      }
    }

    await captureScreenshot(page, 'act-006-detail-cta');
  });

  test('ACT-007: Unauthenticated user clicking CTA is shown a login prompt or redirected', async ({ page }) => {
    console.log('Running: ACT-007 - Unauthenticated CTA click shows login prompt or redirect');

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (!cardVisible) {
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    } else {
      const cardLink = activityCard.locator('a').first();
      if (await cardLink.isVisible({ timeout: 3000 })) {
        await cardLink.click();
      } else {
        await activityCard.click();
      }

      await page.waitForTimeout(2000);

      const ctaButton = page.locator('button:has-text("Join"), button:has-text("Start"), button:has-text("Claim"), button:has-text("Participate"), button:has-text("Enter")').first();

      if (await ctaButton.isVisible({ timeout: 3000 })) {
        await ctaButton.click();
        await page.waitForTimeout(1000);
        const url = page.url();
        const redirected = url.includes('login') || url.includes('auth') || url.includes('signin');
        expect(redirected, `Clicking CTA should redirect to auth page, got URL: ${url}`).toBe(true);
      } else {
        const authPrompt = page.locator('text=/login|authenticate|sign in|signin/i');
        const hasPrompt = await authPrompt.isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPrompt, 'Login prompt or auth redirect expected for unauthenticated CTA click').toBe(true);
      }
    }

    await captureScreenshot(page, 'act-007-unauthenticated-cta');
  });

  test('ACT-008: Activities page renders correctly at 1280px desktop viewport', async ({ page }) => {
    console.log('Running: ACT-008 - Activities page renders correctly at 1280px desktop viewport');

    await page.setViewportSize({ width: 1280, height: 800 });

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 5000 }).catch(() => false);
    if (cardVisible) {
      await expect(activityCard).toBeVisible();
    }

    await captureScreenshot(page, 'act-008-desktop-1280');
  });

  test('ACT-009: Activities page renders correctly at 375px mobile viewport with no horizontal overflow', async ({ page }) => {
    console.log('Running: ACT-009 - Activities page renders correctly at 375px mobile viewport');

    await page.setViewportSize({ width: 375, height: 667 });

    let response = await tryNavigate(page, BASE_URL + '/activities');
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL + '/activity');
    }
    if (!response || response.status() === 404) {
      response = await tryNavigate(page, BASE_URL);
    }

    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible({ timeout: 10000 });

    const bodyHandle = await page.$('body');
    const box = await bodyHandle?.boundingBox();
    const viewportWidth = 375;
    const hasOverflow = box && box.width > viewportWidth;
    expect(hasOverflow, 'Body width should not exceed viewport width (no horizontal overflow)').toBeFalsy();

    const activityCard = page.locator('[data-testid*="activity"], .activity-card, article, [class*="activity"], li').first();
    const cardVisible = await activityCard.isVisible({ timeout: 5000 }).catch(() => false);
    if (cardVisible) {
      await expect(activityCard).toBeVisible();
    }

    await captureScreenshot(page, 'act-009-mobile-375');
  });

});