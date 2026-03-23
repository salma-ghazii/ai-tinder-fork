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

test('showPhotoViewer creates modal and blocks body scroll; closePhotoViewer cleans up', () => {
  const app = require('../../app.js');

  const profile = {
    id: 'p_test',
    name: 'Test',
    age: 25,
    img: 'https://example.com/img.jpg',
    title: 'Tester',
    city: 'Testville',
    bio: 'Bio',
    tags: ['A','B']
  };

  app.showPhotoViewer(profile);

  const modal = document.querySelector('.photo-viewer');
  expect(modal).toBeTruthy();
  expect(document.body.style.overflow).toBe('hidden');

  // Close and assert cleanup
  app.closePhotoViewer();
  expect(document.querySelector('.photo-viewer')).toBeNull();
  expect(document.body.style.overflow).toBe('');
});
