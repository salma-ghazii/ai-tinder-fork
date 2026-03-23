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

test('generateProfiles produces deterministic shape when RNG and Date are stubbed', () => {
  const MathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
  const DateNow = jest.spyOn(Date, 'now').mockReturnValue(1600000000000);

  const app = require('../../app.js');
  const profiles = app.generateProfiles(3);

  expect(profiles.length).toBe(3);
  profiles.forEach((p) => {
    expect(p).toHaveProperty('id');
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('age');
    expect(p).toHaveProperty('tags');
    expect(Array.isArray(p.tags)).toBe(true);
    expect(p.tags.length).toBeGreaterThan(0);
    // tags should be unique within profile
    expect(new Set(p.tags).size).toBe(p.tags.length);
  });

  MathRandom.mockRestore();
  DateNow.mockRestore();
});
