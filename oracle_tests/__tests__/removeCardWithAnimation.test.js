/* eslint-env jest */

beforeEach(() => {
  document.body.innerHTML = `
    <section id="deck"></section>
    <button id="shuffleBtn"></button>
    <button id="likeBtn"></button>
    <button id="nopeBtn"></button>
    <button id="superLikeBtn"></button>
  `;
  jest.resetModules();
});

test('removeCardWithAnimation removes the card from DOM after animation timeout', () => {
  const app = require('../../app.js');

  const card = document.createElement('div');
  card.className = 'card';
  document.body.appendChild(card);

  jest.useFakeTimers();

  app.removeCardWithAnimation(card, 'like');

  // Fast-forward timers (300ms in implementation)
  jest.advanceTimersByTime(300);

  expect(card.parentNode).toBeNull();

  jest.useRealTimers();
});
