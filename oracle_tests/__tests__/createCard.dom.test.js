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

test('resetDeck renders 12 cards and top card has data-profile-id', () => {
  const app = require('../../app.js');

  // Call resetDeck which should generate profiles and render them
  app.resetDeck();

  const cards = document.querySelectorAll('.card');
  expect(cards.length).toBe(12);

  const topCard = cards[0];
  expect(topCard).toBeDefined();
  expect(topCard.dataset.profileId).toBeTruthy();
  expect(topCard.querySelector('.card__title')).toBeTruthy();
});
