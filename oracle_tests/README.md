
# oracle_tests — how to run

This folder contains tests and instructions for the project's testing strategy and which behaviors each test asserts.

Prerequisites

- Node.js and npm installed.

Install dev dependencies and run tests from the project root (`ai-tinder-fork`):

```bash
npm install
npm test
```

Overview of included tests

- [ai-tinder-fork/oracle_tests/__tests__/determineSwipeDirection.test.js](ai-tinder-fork/oracle_tests/__tests__/determineSwipeDirection.test.js)
	- Unit tests for the `determineSwipeDirection` function.
	- Verifies horizontal and vertical swipe detection, and that small movements return `null`.

- [ai-tinder-fork/oracle_tests/__tests__/createCard.dom.test.js](ai-tinder-fork/oracle_tests/__tests__/createCard.dom.test.js)
	- DOM integration test that calls `resetDeck()` and asserts the DOM structure.
	- Checks that 12 `.card` elements render, the top card has a `data-profile-id`, and card sub-elements (like `.card__title`) exist.

Notes

- Tests run in Jest's `jsdom` environment. `app.js` is instrumented to export key functions for testing (`determineSwipeDirection`, `resetDeck`, `createCard`, etc.).
- The tests stub a minimal DOM (elements with ids `deck`, `likeBtn`, `nopeBtn`, `superLikeBtn`, `shuffleBtn`) before requiring `app.js`.
- If `app.js` changes its DOM expectations, update tests accordingly.

Want me to run the tests here and report results? 
