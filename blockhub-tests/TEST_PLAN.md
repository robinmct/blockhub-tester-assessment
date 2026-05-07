# Test Plan: BlockHub Activities

## 1. Feature Overview

The **Activities** feature on BlockHub allows users to participate in blockchain and Web3-related tasks, challenges, and events. Each activity has a title, description, reward, and status (upcoming, ongoing, completed). Users can browse activities, join or start them, and claim rewards upon completion. Activities may be categorized by type (e.g., quest, challenge, event) and may require authentication before joining.

---

## 2. Test Scope

### In Scope
- Activities page load and UI rendering
- Activity listing display (cards or list items)
- Activity card content: title, description, status, reward
- Navigation from activity card to detail page
- Activity detail page with full description and CTA button
- Unauthenticated access handling for join/start actions
- Activity state display (upcoming, ongoing, completed)
- Empty state when no activities are available
- Mobile responsiveness of the activities list
- No console errors on page load (performance)

### Out of Scope
- User authentication (login/register flows)
- Reward redemption or wallet management
- Admin-side activity creation or management
- Backend task completion validation
- Payment processing
- Performance/load testing under high concurrency

---

## 3. Test Environment

| Item | Detail |
|------|--------|
| Base URL | https://blockhub-docs.up.railway.app |
| Target Browser | Chromium (Desktop Chrome profile) |
| Test Directory | `./tests/` |
| Artifacts | `./test-results/` (screenshots on failure) |
| Framework | Playwright + TypeScript |
| Test User | Pre-seeded test account; unauthenticated session for redirect tests |

---

## 4. Test Cases

| Test ID | Title | Preconditions | Steps | Expected Result | Priority |
|---------|-------|---------------|-------|-----------------|----------|
| ACT-001 | Activities page loads with correct heading and no layout breaks | None | Navigate to `/activities` or base URL | Page renders with a visible heading; no broken layout; no console errors | High |
| ACT-002 | Activities page title contains "Activity" or "Challenge" | None | Navigate to Activities page; inspect page title | Title includes "Activity", "Activities", "Challenge", or "Quest" | Medium |
| ACT-003 | Activity listing is visible with cards or list items | At least 3 activities exist | Load Activities page; count rendered items | All available activities display as cards or list items | High |
| ACT-004 | Each activity card shows title, description, and status | Activities exist | Inspect first activity card | Title, description snippet, and status badge (e.g., Ongoing, Upcoming) are visible | High |
| ACT-005 | Activity card displays reward information | Activities with rewards exist | Locate a rewarded activity card; inspect content | Reward amount or badge (e.g., "+50 BLX") is visible on the card | Medium |
| ACT-006 | Clicking an activity card navigates to its detail page | At least one activity exists | Click on an activity card; check URL | URL changes to activity detail; page shows full description | High |
| ACT-007 | Activity detail page shows full description and CTA button | Activity exists | Navigate to detail page of an activity | Full description text is present; CTA button (e.g., "Join", "Start", "Claim") is visible and clickable | High |
| ACT-008 | CTA button is disabled or shows "Joined" for completed activities | User has already completed an activity | Open detail page of a completed activity | CTA button is disabled or shows "Completed" status; not re-joinable | Medium |
| ACT-009 | Unauthenticated user clicking Join/Start is redirected to login | No active session | On Activities page, click "Join" or "Start" on any activity | User is redirected to login page or an auth prompt overlay appears | High |
| ACT-010 | Category or filter UI is present and functional | Activities are categorized | Look for filter tabs or dropdown; click a category | Activity list updates to show only items in that category | Medium |
| ACT-011 | Ongoing activities display "Ongoing" or "Live" status correctly | Multiple activity states exist | Identify an active activity; inspect its status label | "Ongoing", "Active", or "Live" badge is displayed correctly | High |
| ACT-012 | Completed activities display "Completed" or "Done" state | User has at least one completed activity | Find a completed activity; inspect its display | "Completed", "Done", or checkmark status is visible instead of a live badge | Medium |
| ACT-013 | Empty state is displayed when no activities are available | No activities exist in the system | Load Activities page with no data | Placeholder message such as "No activities available" or "Check back soon" is displayed | Low |
| ACT-014 | Activities list is responsive at 375px mobile viewport | None | Set viewport to 375×667; load Activities page | Activity cards or list items reflow correctly; no horizontal overflow | High |
| ACT-015 | Activities list is responsive at 1280px desktop viewport | None | Set viewport to 1280×800; load Activities page | Layout is clean; cards are properly spaced; no content cutoff | Medium |
| ACT-016 | No console errors occur on Activities page load | None | Open browser DevTools console; navigate to Activities page | Zero console errors (Error level); warnings are acceptable | Medium |
| ACT-017 | Reward tooltip or badge is visible on activity cards | Activities have reward data | Hover over or inspect activity cards with rewards | Reward information is displayed clearly on the card | Low |
| ACT-018 | Upcoming activities show a start date or countdown | Upcoming activities exist | Locate an upcoming activity; inspect content | Start date, "Starts in X days", or countdown indicator is visible | Low |
| ACT-019 | Pagination or infinite scroll works when listing many activities | More than 10 activities exist | Scroll to bottom of activity list | More items load or a pagination control is visible | Low |
| ACT-020 | Activity detail page URL is shareable and direct-accessible | Activity exists | Copy activity detail URL; open in new tab | Page loads correctly with full content; no 404 | Medium |

---

## 5. Risks and Assumptions

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| Activity cards do not have semantic class names, making selection brittle | Medium | Medium | Use multiple fallback selectors; add data-testid attributes via feedback to devs |
| Category filter is client-side only and may not trigger network request | Low | Low | Add explicit wait for UI update after filter click |
| Reward display differs across activity types causing inconsistent assertions | Medium | Low | Group assertions by activity type; use flexible reward locator |
| Flaky test due to lazy-loaded activity cards | Medium | Medium | Use `waitForSelector` before interacting with cards; increase timeout |
| Empty state renders as hidden element instead of visible placeholder | Low | Medium | Assert visibility explicitly; check that list container is empty, not just hidden |

### Assumptions

- The test environment (`blockhub-docs.up.railway.app`) is stable and reachable during test execution.
- Activities page is accessible at `/activities` or a path containing "activity" relative to the base URL.
- Activity cards render within 5 seconds of page load under normal network conditions.
- Reward amounts and status badges use consistent labeling across all activity types.
- The platform does not require authentication to view the Activities listing page.
- CTA buttons are always present on the activity detail page regardless of user state.

---

*Document version: 2.0 | Last updated: 2026-05-07*