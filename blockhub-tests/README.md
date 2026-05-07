# BlockHub Activities Feature — Test Suite

> **Note:** This test suite is a *sample demonstration* created for assessment purposes. Testing was performed against a publicly accessible BlockHub documentation site (`https://blockhub-docs.up.railway.app`). The Activities feature tab referenced in the test plan may not exist or be accessible in the live BlockHub product environment.

---

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

## Deliverables

| File | Description |
|------|-------------|
| `TEST_PLAN.md` | Full test plan with 20 test cases |
| `activities.spec.ts` | Playwright + TypeScript test file with 9 automated tests |
| `EVIDENCE.md` | Test run evidence: date, command, pass/fail summary, screenshot list |
| `playwright.config.ts` | Playwright configuration |