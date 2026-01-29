# The "Ironclad" Testing Suite

**Category:** Testing
**Quarter:** Q1
**T-shirt Size:** M

## Why This Matters

The codebase currently has _zero_ automated tests. This makes refactoring risky and features prone to regression. As we plan ambitious features like "Snapshot Diffing," we need a safety net. A modern testing pipeline ensures that API changes don't break the frontend and that utility logic (date formatting, URL parsing) remains correct.

## Current State

-  No test runner configured.
-  No unit tests.
-  No integration tests.
-  `package.json` has no test scripts.

## Proposed Future State

A comprehensive testing pyramid:

-  **Unit (Vitest):** fast tests for `lib/utils`, `formatters.ts`, and hooks.
-  **Component (React Testing Library):** Verifying UI states (loading, error, empty) in isolation.
-  **E2E (Playwright):** Simulating a real user searching for a URL and verifying the timeline renders.
-  **CI (GitHub Actions):** Blocking PRs if tests fail.

## Key Deliverables

-  [ ] Install and configure Vitest & React Testing Library.
-  [ ] Write unit tests for `formatters.ts` and `cleanUrl` logic.
-  [ ] Write component tests for `SearchForm` and `StatusBadge`.
-  [ ] Install and configure Playwright.
-  [ ] Create a critical path E2E test: Load home -> Type URL -> Search -> Verify Results.
-  [ ] Setup `.github/workflows/ci.yml` to run `pnpm test` and `pnpm lint`.

## Prerequisites

-  None.

## Risks & Open Questions

-  **Flakiness:** E2E tests involving external APIs (Wayback Machine) can be flaky. We must mock the API responses in Playwright network interception.
-  **Velocity:** Initial setup slows down development slightly, but pays off in Q2/Q3.

## Notes

Prioritize mocking the `api/wayback` route in E2E tests to avoid hitting the real Internet Archive during CI runs.
