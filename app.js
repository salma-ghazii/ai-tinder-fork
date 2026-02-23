// app.js
// Plain global JS, no modules.

// -------------------
// Data generator
// -------------------
const TAGS = [
  "Coffee","Hiking","Movies","Live Music","Board Games","Cats","Dogs","Traveler",
  "Foodie","Tech","Art","Runner","Climbing","Books","Yoga","Photography"
];
const FIRST_NAMES = [
  "Alex","Sam","Jordan","Taylor","Casey","Avery","Riley","Morgan","Quinn","Cameron",
  "Jamie","Drew","Parker","Reese","Emerson","Rowan","Shawn","Harper","Skyler","Devon"
];
const CITIES = [
  "Brooklyn","Manhattan","Queens","Jersey City","Hoboken","Astoria",
  "Williamsburg","Bushwick","Harlem","Lower East Side"
];
const JOBS = [
  "Product Designer","Software Engineer","Data Analyst","Barista","Teacher",
  "Photographer","Architect","Chef","Nurse","Marketing Manager","UX Researcher"
];
const BIOS = [
  "Weekend hikes and weekday lattes.",
  "Dog parent. Amateur chef. Karaoke enthusiast.",
  "Trying every taco in the city — for science.",
  "Bookstore browser and movie quote machine.",
  "Gym sometimes, Netflix always.",
  "Looking for the best slice in town.",
  "Will beat you at Mario Kart.",
  "Currently planning the next trip."
];

const UNSPLASH_SEEDS = [
  "1515462277126-2b47b9fa09e6",
  "1520975916090-3105956dac38",
  "1519340241574-2cec6aef0c01",
  "1554151228-14d9def656e4",
  "1548142813-c348350df52b",
  "1517841905240-472988babdf9",
  "1535713875002-d1d0cf377fde",
  "1545996124-0501ebae84d0",
  "1524504388940-b1c1722653e1",
  "1531123897727-8f129e1688ce",
];

function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pickTags() { return Array.from(new Set(Array.from({length:4}, ()=>sample(TAGS)))); }
function imgFor(seed) {
  return `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=80`;
}

function generateProfiles(count = 12) {
  const profiles = [];
  for (let i = 0; i < count; i++) {
    profiles.push({
      id: `p_${i}_${Date.now().toString(36)}`,
      name: sample(FIRST_NAMES),
      age: 18 + Math.floor(Math.random() * 22),
      city: sample(CITIES),
      title: sample(JOBS),
      bio: sample(BIOS),
      tags: pickTags(),
      img: imgFor(sample(UNSPLASH_SEEDS)),
    });
  }
  return profiles;
}

// -------------------
// UI rendering
// -------------------
const deckEl = document.getElementById("deck");
const shuffleBtn = document.getElementById("shuffleBtn");
const likeBtn = document.getElementById("likeBtn");
const nopeBtn = document.getElementById("nopeBtn");
const superLikeBtn = document.getElementById("superLikeBtn");

let profiles = [];
let cards = [];
let currentCardIndex = 0;

// Touch/Mouse gesture tracking
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let cardBeingDragged = null;

// Double-tap tracking
let lastTap = 0;
let tapTimeout = null;

function renderDeck() {
  deckEl.setAttribute("aria-busy", "true");
  deckEl.innerHTML = "";

  profiles.forEach((p, idx) => {
    const card = createCard(p, idx);
    deckEl.appendChild(card);
  });

  // Initialize card stack
  cards = Array.from(document.querySelectorAll('.card'));
  currentCardIndex = 0;
  
  // Add event listeners to top 3 cards only
  cards.forEach((card, idx) => {
    if (idx < 3) {
      addCardEventListeners(card);
    }
  });
  
  updateCardPositions();

  deckEl.removeAttribute("aria-busy");
}

function createCard(p, idx) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.profileId = p.id;

  const img = document.createElement("img");
  img.className = "card__media";
  img.src = p.img;
  img.alt = `${p.name} — profile photo`;

  const body = document.createElement("div");
  body.className = "card__body";

  const titleRow = document.createElement("div");
  titleRow.className = "title-row";
  titleRow.innerHTML = `
    <h2 class="card__title">${p.name}</h2>
    <span class="card__age">${p.age}</span>
  `;

  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = `${p.title} • ${p.city}`;

  const chips = document.createElement("div");
  chips.className = "card__chips";
  p.tags.forEach((t) => {
    const c = document.createElement("span");
    c.className = "chip";
    c.textContent = t;
    chips.appendChild(c);
  });

  body.appendChild(titleRow);
  body.appendChild(meta);
  body.appendChild(chips);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}

function resetDeck() {
  profiles = generateProfiles(12);
  renderDeck();
}

// -------------------
// Swipe gesture functions
// -------------------
function addCardEventListeners(card) {
  // Touch events
  card.addEventListener('touchstart', handleTouchStart);
  card.addEventListener('touchmove', handleTouchMove, {passive: true});
  card.addEventListener('touchend', handleTouchEnd);
  
  // Mouse events
  card.addEventListener('mousedown', handleMouseDown);
  card.addEventListener('mousemove', handleMouseMove);
  card.addEventListener('mouseup', handleMouseUp);
  card.addEventListener('mouseleave', handleMouseUp);
}

function handleTouchStart(e) {
  if (currentCardIndex >= cards.length) return;
  
  // Check for double-tap
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 500 && tapLength > 0) {
    // Double tap detected
    e.preventDefault();
    handleDoubleTap(cards[currentCardIndex]);
    lastTap = 0; // Reset to prevent triple taps
    return;
  }
  
  lastTap = currentTime;
  
  const touch = e.touches[0];
  startDrag(touch.clientX, touch.clientY, cards[currentCardIndex]);
}

function handleMouseDown(e) {
  if (currentCardIndex >= cards.length) return;
  
  // Check for double-tap (mouse double-click)
  if (e.detail === 2) {
    e.preventDefault();
    handleDoubleTap(cards[currentCardIndex]);
    return;
  }
  
  e.preventDefault();
  startDrag(e.clientX, e.clientY, cards[currentCardIndex]);
}

function handleTouchMove(e) {
  if (!isDragging) return;
  const touch = e.touches[0];
  updateDrag(touch.clientX, touch.clientY);
}

function handleMouseMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  updateDrag(e.clientX, e.clientY);
}

function handleTouchEnd(e) {
  if (!isDragging) return;
  endDrag();
}

function handleMouseUp(e) {
  if (!isDragging) return;
  endDrag();
}

function startDrag(x, y, card) {
  isDragging = true;
  startX = x;
  startY = y;
  currentX = x;
  currentY = y;
  cardBeingDragged = card;
  cardBeingDragged.style.transition = 'none';
}

function updateDrag(x, y) {
  if (!cardBeingDragged) return;
  
  const deltaX = x - startX;
  const deltaY = y - startY;
  
  // Update card position
  updateCardPosition(cardBeingDragged, deltaX, deltaY);
  
  // Show swipe overlay based on direction
  showSwipeOverlay(deltaX, deltaY);
  
  currentX = x;
  currentY = y;
}

function updateCardPosition(card, x, y) {
  const rotation = x * 0.1; // Subtle rotation based on horizontal movement
  const opacity = 1 - (Math.abs(x) / 500); // Fade as card moves off-screen
  
  card.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`;
  card.style.opacity = opacity;
}

function endDrag() {
  if (!cardBeingDragged) return;
  
  const deltaX = currentX - startX;
  const deltaY = currentY - startY;
  const direction = determineSwipeDirection(currentX, currentY, startX, startY);
  
  if (direction) {
    // Valid swipe - execute action
    handleSwipeAction(direction);
  } else {
    // Invalid swipe - reset card position
    resetCardPosition();
  }
  
  // Clean up
  isDragging = false;
  cardBeingDragged = null;
  hideSwipeOverlay();
}

function determineSwipeDirection(endX, endY, startX, startY) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  
  // Minimum swipe threshold: 50px
  const threshold = 50;
  
  if (absX > absY) {
    // Horizontal swipe
    if (absX > threshold) {
      return deltaX > 0 ? 'right' : 'left';
    }
  } else {
    // Vertical swipe
    if (absY > threshold) {
      return deltaY > 0 ? 'down' : 'up';
    }
  }
  return null; // No valid swipe
}

function handleSwipeAction(direction) {
  let action;
  switch(direction) {
    case 'left':
      action = 'nope';
      break;
    case 'right':
      action = 'like';
      break;
    case 'up':
      action = 'superlike';
      break;
    default:
      return;
  }
  
  // Use the card being dragged, not the indexed card
  const currentCard = cardBeingDragged;
  if (!currentCard) return;
  
  // Use shared removal function
  removeCardWithAnimation(currentCard, action);
}

function removeCardWithAnimation(card, action) {
  // Add animation based on action
  card.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
  
  switch(action) {
    case 'like':
      card.style.transform = 'translateX(150%) rotate(30deg)';
      break;
    case 'nope':
      card.style.transform = 'translateX(-150%) rotate(-30deg)';
      break;
    case 'superlike':
      card.style.transform = 'translateY(-150%) scale(0.8)';
      break;
  }
  card.style.opacity = '0';
  
  setTimeout(() => {
    if (card && card.parentNode) {
      card.remove();
    }
    cards = Array.from(document.querySelectorAll('.card'));
    currentCardIndex = 0;
    updateCardPositions();
    if (cards.length === 0) {
      showDeckEmpty();
    }
  }, 300);
}

function resetCardPosition() {
  if (!cardBeingDragged) return;
  cardBeingDragged.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  cardBeingDragged.style.transform = 'translateX(0) translateY(0) rotate(0)';
  cardBeingDragged.style.opacity = '1';
}

function updateCardPositions() {
  cards.forEach((card, index) => {
    // Reset display property first
    card.style.display = '';
    
    const offset = index - currentCardIndex;
    if (offset === 0) {
      // Top card - fully interactive
      card.style.zIndex = 10;
      card.style.transform = 'translateY(0) scale(1)';
      card.style.pointerEvents = 'auto';
      card.style.opacity = '1';
    } else if (offset === 1) {
      // Second card - partially visible
      card.style.zIndex = 9;
      card.style.transform = 'translateY(10px) scale(0.985)';
      card.style.pointerEvents = 'none';
      card.style.opacity = '0.95';
    } else if (offset === 2) {
      // Third card - barely visible
      card.style.zIndex = 8;
      card.style.transform = 'translateY(20px) scale(0.97)';
      card.style.pointerEvents = 'none';
      card.style.opacity = '0.9';
    } else {
      // Hidden cards
      card.style.display = 'none';
    }
  });
}

function showSwipeOverlay(deltaX, deltaY) {
  // Remove existing overlay
  hideSwipeOverlay();
  
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  const threshold = 30; // Lower threshold for earlier feedback
  
  let overlayType = null;
  
  if (absX > absY && absX > threshold) {
    overlayType = deltaX > 0 ? 'like' : 'nope';
  } else if (absY > absX && absY > threshold) {
    if (deltaY < -threshold) {
      overlayType = 'superlike';
    }
  }
  
  if (overlayType && cardBeingDragged) {
    const overlay = createSwipeOverlay(overlayType, deltaX, deltaY);
    cardBeingDragged.appendChild(overlay);
  }
}

function hideSwipeOverlay() {
  const existingOverlay = document.querySelector('.swipe-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
}

function createSwipeOverlay(type, deltaX, deltaY) {
  const overlay = document.createElement('div');
  overlay.className = `swipe-overlay swipe-overlay--${type}`;
  
  let content = '';
  let bgColor = '';
  
  switch(type) {
    case 'like':
      content = 'LIKE';
      bgColor = 'rgba(48, 209, 88, 0.8)';
      break;
    case 'nope':
      content = 'NOPE';
      bgColor = 'rgba(255, 69, 58, 0.8)';
      break;
    case 'superlike':
      content = 'SUPER LIKE';
      bgColor = 'rgba(100, 210, 255, 0.8)';
      break;
  }
  
  overlay.innerHTML = `<span class="swipe-overlay__text">${content}</span>`;
  overlay.style.background = bgColor;
  
  // Calculate opacity based on swipe distance
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const opacity = Math.min(distance / 100, 0.9); // Max opacity of 0.9
  overlay.style.opacity = opacity;
  
  return overlay;
}

function showDeckEmpty() {
  deckEl.innerHTML = `
    <div class="deck-empty">
      <div class="deck-empty__icon">🎉</div>
      <h2>You've seen all profiles!</h2>
      <p>You've gone through all the profiles in this deck.</p>
      <button class="deck-empty__btn">
        <span class="deck-empty__btn-icon">🔄</span>
        Start New Deck
      </button>
    </div>
  `;
  
  // Add event listener to restart button
  const restartBtn = document.querySelector('.deck-empty__btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', resetDeck);
  }
}

// -------------------
// Double-tap photo viewer
// -------------------
function handleDoubleTap(card) {
  const profileId = card.dataset.profileId;
  const profile = profiles.find(p => p.id === profileId);
  
  if (profile) {
    showPhotoViewer(profile);
  }
}

function showPhotoViewer(profile) {
  // Create modal overlay
  const modal = document.createElement('div');
  modal.className = 'photo-viewer';
  modal.innerHTML = `
    <div class="photo-viewer__content">
      <button class="photo-viewer__close" onclick="closePhotoViewer()">&times;</button>
      <div class="photo-viewer__main">
        <img src="${profile.img}" alt="${profile.name}" class="photo-viewer__main-img">
        <div class="photo-viewer__info">
          <h3>${profile.name}, ${profile.age}</h3>
          <p>${profile.title} • ${profile.city}</p>
          <p class="photo-viewer__bio">${profile.bio}</p>
          <div class="photo-viewer__tags">
            ${profile.tags.map(tag => `<span class="chip">${tag}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="photo-viewer__thumbnails">
        <div class="photo-viewer__thumbnail photo-viewer__thumbnail--active">
          <img src="${profile.img}" alt="Photo 1">
        </div>
        <div class="photo-viewer__thumbnail">
          <img src="https://picsum.photos/seed/${profile.id}2/200/200.jpg" alt="Photo 2">
        </div>
        <div class="photo-viewer__thumbnail">
          <img src="https://picsum.photos/seed/${profile.id}3/200/200.jpg" alt="Photo 3">
        </div>
        <div class="photo-viewer__thumbnail">
          <img src="https://picsum.photos/seed/${profile.id}4/200/200.jpg" alt="Photo 4">
        </div>
      </div>
    </div>
  `;
  
  // Add to body and prevent body scroll
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Add click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePhotoViewer();
    }
  });
  
  // Add ESC key to close
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closePhotoViewer();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
}

function closePhotoViewer() {
  const modal = document.querySelector('.photo-viewer');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

// Controls - now functional with swipe system
likeBtn.addEventListener("click", () => handleCardAction('like'));
nopeBtn.addEventListener("click", () => handleCardAction('nope'));
superLikeBtn.addEventListener("click", () => handleCardAction('superlike'));
shuffleBtn.addEventListener("click", resetDeck);

function handleCardAction(action) {
  if (currentCardIndex >= cards.length) return;
  
  const currentCard = cards[currentCardIndex];
  
  // Show overlay for button action
  const overlay = createSwipeOverlay(action, 0, 0);
  overlay.style.opacity = '0.9'; // Full opacity for button clicks
  currentCard.appendChild(overlay);
  
  // Use shared removal function
  removeCardWithAnimation(currentCard, action);
}

// Boot
resetDeck();
