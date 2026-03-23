# Test Design & Oracle Selection

## Goals

- Validate UI rendering and interactive behavior (swipes, buttons, photo viewer).
- Ensure deterministic tests despite randomized data and external image URLs.
- Prefer oracles that catch logic regressions while minimizing false positives.

## High-level approach

1. Explore the app entry points (`app.js`, `data.js`) and rely on programmatic DOM manipulation.
2. Replace or stub randomness and time so tests are deterministic (seed RNG, stub Date.now()).
3. Use three test layers:
   - Unit tests for functions (e.g., `determineSwipeDirection`, `pickTags`, `generateProfiles`).
   - Integration DOM tests (JSDOM + Jest) to assert DOM structure and behaviors.
   - End-to-end tests (Playwright or Puppeteer) to simulate swipes, double-tap, and button clicks.

## Testable surface area (from code scan)

- Profile generation: `generateProfiles()` in `app.js` / `data.js`.
- Card creation: `createCard()` produces DOM nodes with right classes and attributes.
- Gesture detection: `determineSwipeDirection()` and drag lifecycle functions.
- Swipe effects: `removeCardWithAnimation()`, `resetCardPosition()`, overlays.
- Photo viewer: `handleDoubleTap()` and `showPhotoViewer()` creating modal and blocking scroll.
- Controls: click handlers for `likeBtn`, `nopeBtn`, `superLikeBtn`, `shuffleBtn`.

## Oracles — types and selection criteria

Selection criteria for oracles:
- Deterministic: oracle should not depend on randomized seeds or external network.
- Precise: should fail only for real regressions (low false-positive rate).
- Fast: suitable for CI (avoid slow external calls).
- Maintainable: easy to update when intentional UI changes occur.

Oracle types we will use (best-first):

1. Deterministic Functional Oracles (best):
   - Assert pure function outputs for known inputs (e.g., `determineSwipeDirection` returns `left|right|up|down|null`).
   - Assert `generateProfiles()` shape and deterministic values when RNG and Date are stubbed.

2. Structural DOM Oracles (good):
   - Check presence and attributes of key elements after render: `.card`, `.card__title`, `data-profile-id` on top card.
   - Verify overlays appear/contain expected text when simulating drag deltas (create a fake drag and assert overlay text and opacity behavior).

3. Behavior/Side-effect Oracles (very useful):
   - After a swipe simulation or button click, assert the card is removed from the DOM and the `cards` array length decreases.
   - For double-tap, assert the photo-viewer modal exists and `document.body.style.overflow` is set.

4. Snapshot Oracles (use with normalization):
   - Use serialized DOM snapshots but normalize dynamic attributes (`id`, `src` URL query params, timestamps) to avoid brittle failures.

5. End-to-end Oracles (for user flows):
   - Simulate a right-swipe and assert the next top card becomes interactive and the previous card is removed.
   - Simulate shuffle and assert new cards are rendered.
   - Keep E2E limited to a few core flows to control CI runtime.

6. Accessibility Oracles (important):
   - `deck` has `aria-live` and `aria-busy` toggled appropriately.
   - Buttons have appropriate `aria-label`/title attributes.

7. Statistical Oracles (for randomness quality — optional):
   - Run `generateProfiles()` many times (in a separate slow test) and assert tag distribution roughly matches expected diversity.

## Implementation details / practical test patterns

- Test harness: use `Jest` + `jsdom` for unit and DOM tests. Use `Playwright` for E2E.
- Mocking:
  - Replace `Math.random` with a seeded PRNG during tests (or stub to fixed outputs).
  - Stub `Date.now()` to a fixed timestamp when testing `id` generation.
  - Replace network image URLs by normalizing or by pointing to a static placeholder (or stub `<img>` loading behavior in JSDOM).
- Normalization helpers:
  - Strip or replace `img.src` query params and `id` tokens in snapshots.
  - Provide a `createDeterministicProfiles()` test helper that seeds predictable profiles.

## Example test cases (representative)

- Unit: `determineSwipeDirection` returns `right` for endX-startX=100, single axis.
- Unit: `pickTags()` returns a Set of length 4 (no duplicates) when RNG is stubbed.
- DOM: After calling `resetDeck()`, the `#deck` contains 12 `.card` elements and top card has `data-profile-id`.
- DOM: Simulate a horizontal drag > threshold on top card -> overlay shows `LIKE` and after release card removed.
- E2E: Click `like` button -> first card disappears and a new top card exists.

## Test data strategy

- Provide fixtures (small canned profile arrays) to replace `generateProfiles()` in integration tests.
- Keep one fixture that includes edge cases: minimal tags, max age, missing bio.

## CI considerations

- Keep unit and DOM tests fast; only a small E2E suite runs in CI.
- Cache Playwright browsers in CI and limit parallelism to avoid flakiness.

## Next steps I can take

- Scaffold `package.json` test scripts, add `jest` and `playwright` config and a small test that asserts `determineSwipeDirection` behavior.
- Or implement the deterministic profile helper and a first DOM test for `createCard()`.

---

If you'd like, I can now scaffold the test runner and add the first unit and DOM test files. Which should I start with: `determineSwipeDirection` unit test or a DOM test for `createCard()`?
