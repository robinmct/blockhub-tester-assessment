# Test Evidence Report — Activities Feature

**Date:** 2026-05-07
**Time:** 23:10 (UTC)
**Command:** `npx playwright test tests/activities.spec.ts --reporter=list`

---

## Summary

| Test Name | Status | Screenshot File |
|-----------|--------|-----------------|
| ACT-001: Activities page loads with HTTP 200 and no console errors | ✅ PASS | act-001-page-load.png |
| ACT-002: Page heading or title contains "Activities" related text | ✅ PASS | act-002-title-check.png |
| ACT-003: At least one activity card or list item is visible | ✅ PASS | act-003-activity-cards-visible.png |
| ACT-004: Each visible activity card contains a title and at least one other piece of info | ✅ PASS | act-004-card-content.png |
| ACT-005: Clicking an activity card navigates to a detail page | ✅ PASS | act-005-card-navigation.png |
| ACT-006: Activity detail page contains a CTA button | ✅ PASS | act-006-detail-cta.png |
| ACT-007: Unauthenticated user clicking CTA is shown a login prompt or redirected | ✅ PASS | act-007-unauthenticated-cta.png |
| ACT-008: Activities page renders correctly at 1280px desktop viewport | ✅ PASS | act-008-desktop-1280.png |
| ACT-009: Activities page renders correctly at 375px mobile viewport with no horizontal overflow | ✅ PASS | act-009-mobile-375.png |

**Result: 9/9 passed (6.2s)**

---

## Failures

None. All tests passed.

---

## Screenshots

All screenshots saved to: `test-results/screenshots/`

```
act-001-page-load.png
act-002-title-check.png
act-003-activity-cards-visible.png
act-004-card-content.png
act-005-card-navigation.png
act-006-detail-cta.png
act-007-unauthenticated-cta.png
act-008-desktop-1280.png
act-009-mobile-375.png
```

---

## HTML Report

Generated at: `blockhub-tests/playwright-report/index.html`
Open with: `npx playwright show-report` (from `blockhub-tests/` directory)

---

## GitHub Actions CI Note

The test suite is configured to run in headless CI environments via GitHub Actions. The Playwright configuration in `playwright.config.ts` uses Chromium and targets headless execution by default. On CI, workers are set to 1 (`workers: process.env.CI ? 1 : undefined`) and retries are enabled (`retries: process.env.CI ? 2 : 0`). Screenshots are captured on failure for artifact upload.

---