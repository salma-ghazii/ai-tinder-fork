/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

function loadApp() {
  if (!window.__APP_PARTITION_TESTS_LOADED__) {
    document.body.innerHTML = `
      <div id="deck"></div>
      <button id="shuffleBtn"></button>
      <button id="likeBtn"></button>
      <button id="nopeBtn"></button>
      <button id="superLikeBtn"></button>
    `;
    const script = fs.readFileSync(path.join(__dirname, "app.js"), "utf8");
    window.eval(script);
    window.__APP_PARTITION_TESTS_LOADED__ = true;
  }
  window.resetDeck();
  window.closePhotoViewer();
  return window;
}

describe("Partition tests for app.js", () => {
  describe("determineSwipeDirection partitions", () => {
    test("returns null below threshold", () => {
      const dom = loadApp();
      const result = dom.determineSwipeDirection(30, 20, 0, 0);
      expect(result).toBeNull();
    });

    test("returns null at exact 50 boundary", () => {
      const dom = loadApp();
      expect(dom.determineSwipeDirection(50, 0, 0, 0)).toBeNull();
      expect(dom.determineSwipeDirection(0, -50, 0, 0)).toBeNull();
    });

    test("returns right for valid horizontal right swipe", () => {
      const dom = loadApp();
      const result = dom.determineSwipeDirection(51, 10, 0, 0);
      expect(result).toBe("right");
    });

    test("returns left for valid horizontal left swipe", () => {
      const dom = loadApp();
      const result = dom.determineSwipeDirection(-70, 15, 0, 0);
      expect(result).toBe("left");
    });

    test("returns up for valid vertical up swipe", () => {
      const dom = loadApp();
      const result = dom.determineSwipeDirection(10, -80, 0, 0);
      expect(result).toBe("up");
    });

    test("tie absX==absY over threshold resolves to vertical branch", () => {
      const dom = loadApp();
      const result = dom.determineSwipeDirection(60, -60, 0, 0);
      expect(result).toBe("up");
    });
  });

  describe("showSwipeOverlay partitions", () => {
    test("shows LIKE overlay when horizontal drag exceeds threshold", () => {
      const dom = loadApp();
      const card = dom.document.querySelector(".card");
      dom.startDrag(0, 0, card);
      dom.showSwipeOverlay(40, 5);
      const overlay = card.querySelector(".swipe-overlay--like");
      expect(overlay).not.toBeNull();
    });

    test("shows SUPER LIKE overlay for upward vertical drag", () => {
      const dom = loadApp();
      const card = dom.document.querySelector(".card");
      dom.startDrag(0, 0, card);
      dom.showSwipeOverlay(3, -50);
      const overlay = card.querySelector(".swipe-overlay--superlike");
      expect(overlay).not.toBeNull();
    });

    test("shows no overlay at exact threshold boundary 30", () => {
      const dom = loadApp();
      const card = dom.document.querySelector(".card");
      dom.startDrag(0, 0, card);
      dom.showSwipeOverlay(30, 0);
      const overlay = card.querySelector(".swipe-overlay");
      expect(overlay).toBeNull();
    });
  });

  describe("data generation partitions", () => {
    test("generateProfiles() defaults to 12 items", () => {
      const dom = loadApp();
      const profiles = dom.generateProfiles();
      expect(profiles).toHaveLength(12);
    });

    test("generateProfiles(0) returns empty array", () => {
      const dom = loadApp();
      const profiles = dom.generateProfiles(0);
      expect(profiles).toHaveLength(0);
    });

    test("generated ages always fall in [18, 39]", () => {
      const dom = loadApp();
      const profiles = dom.generateProfiles(100);
      for (const p of profiles) {
        expect(p.age).toBeGreaterThanOrEqual(18);
        expect(p.age).toBeLessThanOrEqual(39);
      }
    });

    test("pickTags returns unique set with length 1..4", () => {
      const dom = loadApp();
      for (let i = 0; i < 25; i++) {
        const tags = dom.pickTags();
        const unique = new Set(tags);
        expect(tags.length).toBeGreaterThanOrEqual(1);
        expect(tags.length).toBeLessThanOrEqual(4);
        expect(unique.size).toBe(tags.length);
      }
    });
  });

  describe("action/deck/photo viewer partitions", () => {
    test("unsupported swipe direction 'down' does not remove card", () => {
      jest.useFakeTimers();
      const dom = loadApp();
      const before = dom.document.querySelectorAll(".card").length;
      const card = dom.document.querySelector(".card");
      dom.startDrag(0, 0, card);
      dom.handleSwipeAction("down");
      jest.runAllTimers();
      const after = dom.document.querySelectorAll(".card").length;
      expect(after).toBe(before);
      jest.useRealTimers();
    });

    test("button like action removes one card after animation", () => {
      jest.useFakeTimers();
      const dom = loadApp();
      const before = dom.document.querySelectorAll(".card").length;
      dom.handleCardAction("like");
      jest.advanceTimersByTime(350);
      const after = dom.document.querySelectorAll(".card").length;
      expect(after).toBe(before - 1);
      jest.useRealTimers();
    });

    test("showDeckEmpty renders restart UI and restart repopulates deck", () => {
      const dom = loadApp();
      dom.showDeckEmpty();
      const restart = dom.document.querySelector(".deck-empty__btn");
      expect(restart).not.toBeNull();
      restart.click();
      const cards = dom.document.querySelectorAll(".card");
      expect(cards.length).toBe(12);
    });

    test("double tap with valid card opens photo viewer; ESC closes", () => {
      const dom = loadApp();
      const card = dom.document.querySelector(".card");
      expect(card).not.toBeNull();
      dom.handleDoubleTap(card);
      expect(dom.document.querySelector(".photo-viewer")).not.toBeNull();

      const esc = new dom.KeyboardEvent("keydown", { key: "Escape" });
      dom.document.dispatchEvent(esc);
      expect(dom.document.querySelector(".photo-viewer")).toBeNull();
    });
  });
});
