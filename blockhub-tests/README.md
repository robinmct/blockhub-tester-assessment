# BlockHub Activities Feature — Test Suite

This is the Playwright + TypeScript automated test suite for the **Activities** feature of BlockHub — a blockchain/Web3 platform.

## What Is Tested

The Activities feature allows users to participate in blockchain-related tasks, challenges, and events on BlockHub. This test suite validates the end-to-end correctness of the feature, including:

- Page load and HTTP 200 response
- Page title and heading content
- Activity card listing and visibility
- Activity card content (title, description, status, reward)
- Navigation from card to detail page
- CTA button presence on detail pages
- Unauthenticated user redirect/prompt behavior
- Responsive rendering at desktop (1280×800) and mobile (375×667) viewports

Activities was chosen as the initial test target because it represents the most user-facing entry point for engagement on the platform, covering UI rendering, navigation, authentication gating, and responsive design in a single cohesive feature area.

## Local Setup

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
cd blockhub-tests
npm install
```

### Install Playwright browsers

```bash
npx playwright install chromium
```

### Run tests

```bash
npx playwright test
```

### Run with list reporter

```bash
npx playwright test tests/activities.spec.ts --reporter=list
```

### Generate HTML report

```bash
npx playwright show-report
```

---

## GitHub Actions CI Setup

The test suite is configured to run in CI via GitHub Actions. The workflow is defined in `.github/workflows/playwright.yml` (to be added) and includes:

- **Headless execution:** Playwright runs Chromium in headless mode by default.
- **Single worker:** `workers: 1` on CI to avoid port conflicts.
- **Retry on failure:** `retries: 2` for transient failures.
- **Artifact upload:** Screenshots from failed tests are saved to `test-results/` and can be uploaded as build artifacts.
- **Matrix strategy:** Can be extended to test across multiple browser/dimension combinations.

### Sample workflow snippet

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npx playwright install chromium
      - run: npx playwright test
```

---

## Deliverables

| File | Description |
|------|-------------|
| `TEST_PLAN.md` | Full test plan with 20 test cases covering scope, environment, risks, and assumptions |
| `activities.spec.ts` | Playwright + TypeScript test file with 9 automated tests |
| `EVIDENCE.md` | Test run evidence: date, command, pass/fail summary, screenshot list |
| `playwright.config.ts` | Playwright configuration (base URL, reporter, screenshot on failure, output dir) |
| `README.md` | This file |