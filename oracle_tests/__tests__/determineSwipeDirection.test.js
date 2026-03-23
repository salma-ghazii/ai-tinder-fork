/* eslint-env jest */

// Unit tests for determineSwipeDirection

beforeEach(() => {
  // Ensure a minimal DOM exists before requiring app.js (app.js queries DOM at load)
  document.body.innerHTML = `
    <section id="deck"></section>
    <button id="shuffleBtn"></button>
    <button id="likeBtn"></button>
    <button id="nopeBtn"></button>
    <button id="superLikeBtn"></button>
  `;
  // Clear any cached modules to re-evaluate app.js if necessary
  jest.resetModules();
});

test('determineSwipeDirection returns right for positive horizontal swipe', () => {
  const app = require('../../app.js');
  expect(app.determineSwipeDirection(150, 10, 10, 10)).toBe('right');
});

test('determineSwipeDirection returns left for negative horizontal swipe', () => {
  const app = require('../../app.js');
  expect(app.determineSwipeDirection(-100, 0, 100, 0)).toBe('left');
});

test('determineSwipeDirection returns up for sufficient upward swipe', () => {
  const app = require('../../app.js');
  // endX, endY, startX, startY -> upward swipe: endY < startY
  expect(app.determineSwipeDirection(0, 0, 0, 100)).toBe('up');
});

test('determineSwipeDirection returns null for small movements', () => {
  const app = require('../../app.js');
  expect(app.determineSwipeDirection(5, 5, 0, 0)).toBeNull();
});
