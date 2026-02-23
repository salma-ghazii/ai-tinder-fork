# AI Tinder Fork - Frontend UI Implementation Plan

## Overview

This plan details the implementation of core Tinder-like swipe gestures and UI behaviors for the AI Tinder Fork frontend. All implementations will be frontend-only using vanilla JavaScript and CSS.

## Features to Implement

### 1. Swipe Gestures
- **Swipe Left**: Reject profile
- **Swipe Right**: Like profile  
- **Swipe Up**: Super Like profile
- **Double-Tap**: View additional photos in profile

### 2. Action Button Functionality
- Power the existing Like, Nope, and Super Like buttons
- Synchronize button actions with swipe gestures

## Implementation Strategy

## Phase 1: Touch/Mouse Event System

### 1.1 Event Listener Setup
```javascript
// Add to top card only
const topCard = document.querySelector('.card:nth-child(1)');
topCard.addEventListener('touchstart', handleTouchStart, {passive: true});
topCard.addEventListener('touchmove', handleTouchMove, {passive: true});
topCard.addEventListener('touchend', handleTouchEnd);
topCard.addEventListener('mousedown', handleMouseDown);
topCard.addEventListener('mousemove', handleMouseMove);
topCard.addEventListener('mouseup', handleMouseUp);
topCard.addEventListener('mouseleave', handleMouseUp);
```

### 1.2 Gesture Tracking Variables
```javascript
let isDragging = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let cardBeingDragged = null;
```

### 1.3 Touch/Mouse Event Handlers
- **handleTouchStart/handleMouseDown**: Record initial position
- **handleTouchMove/handleMouseMove**: Track movement and update card position
- **handleTouchEnd/handleMouseUp**: Determine swipe direction and trigger action

## Phase 2: Swipe Direction Detection

### 2.1 Direction Calculation Logic
```javascript
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
```

### 2.2 Swipe Action Mapping
- **Left**: Trigger reject action
- **Right**: Trigger like action
- **Up**: Trigger super like action
- **Down**: No action (or could trigger "back" functionality)

## Phase 3: Card Animation System

### 3.1 Real-time Card Transform
```javascript
function updateCardPosition(card, x, y) {
  const rotation = x * 0.1; // Subtle rotation based on horizontal movement
  const opacity = 1 - (Math.abs(x) / 500); // Fade as card moves off-screen
  
  card.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg)`;
  card.style.opacity = opacity;
}
```

### 3.2 Action-specific Animations
```css
.card.swipe-left {
  transform: translateX(-150%) rotate(-30deg);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.card.swipe-right {
  transform: translateX(150%) rotate(30deg);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.card.swipe-up {
  transform: translateY(-150%) scale(0.8);
  opacity: 0;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}
```

### 3.3 Visual Feedback During Swipe
- **Left swipe**: Show "NOPE" overlay with red background
- **Right swipe**: Show "LIKE" overlay with green background
- **Up swipe**: Show "SUPER LIKE" overlay with blue background

## Phase 4: Card Management System

### 4.1 Card Stack Management
```javascript
let cards = [];
let currentCardIndex = 0;

function initializeCardStack() {
  cards = Array.from(document.querySelectorAll('.card'));
  currentCardIndex = 0;
  updateCardPositions();
}

function updateCardPositions() {
  cards.forEach((card, index) => {
    const offset = index - currentCardIndex;
    if (offset === 0) {
      // Top card - fully interactive
      card.style.zIndex = 10;
      card.style.transform = 'translateY(0) scale(1)';
      card.style.pointerEvents = 'auto';
    } else if (offset === 1) {
      // Second card - partially visible
      card.style.zIndex = 9;
      card.style.transform = 'translateY(10px) scale(0.985)';
      card.style.pointerEvents = 'none';
    } else if (offset === 2) {
      // Third card - barely visible
      card.style.zIndex = 8;
      card.style.transform = 'translateY(20px) scale(0.97)';
      card.style.pointerEvents = 'none';
    } else {
      // Hidden cards
      card.style.display = 'none';
    }
  });
}
```

### 4.2 Card Removal Logic
```javascript
function removeCard(action) {
  const currentCard = cards[currentCardIndex];
  
  // Add animation class
  currentCard.classList.add(`swipe-${action}`);
  
  // Wait for animation to complete, then remove
  setTimeout(() => {
    currentCard.remove();
    currentCardIndex++;
    updateCardPositions();
    
    // Check if deck is empty
    if (currentCardIndex >= cards.length) {
      showDeckEmpty();
    }
  }, 300);
}
```

## Phase 5: Double-Tap Photo Viewing

### 5.1 Double-Tap Detection
```javascript
let lastTap = 0;

function handleDoubleTap(event) {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 500 && tapLength > 0) {
    // Double tap detected
    event.preventDefault();
    showPhotoViewer();
  }
  
  lastTap = currentTime;
}
```

### 5.2 Photo Viewer Modal
```javascript
function createPhotoViewer() {
  const modal = document.createElement('div');
  modal.className = 'photo-viewer';
  modal.innerHTML = `
    <div class="photo-viewer__content">
      <button class="photo-viewer__close">&times;</button>
      <div class="photo-viewer__main">
        <img src="${currentProfile.img}" alt="${currentProfile.name}">
      </div>
      <div class="photo-viewer__thumbnails">
        <!-- Additional photos would go here -->
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
```

### 5.3 Photo Viewer Styling
```css
.photo-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-viewer__content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.photo-viewer__main img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}
```

## Phase 6: Action Button Integration

### 6.1 Button Action Handlers
```javascript
likeBtn.addEventListener("click", () => handleCardAction('like'));
nopeBtn.addEventListener("click", () => handleCardAction('nope'));
superLikeBtn.addEventListener("click", () => handleCardAction('superlike'));

function handleCardAction(action) {
  if (currentCardIndex >= cards.length) return;
  
  const currentCard = cards[currentCardIndex];
  
  // Add visual feedback
  currentCard.classList.add(`swipe-${action}`);
  
  // Remove card after animation
  setTimeout(() => {
    removeCard(action);
  }, 100);
}
```

### 6.2 Button Animation Feedback
```css
.ctrl:active {
  transform: scale(0.95);
}

.ctrl--like:active {
  background: #25a045;
}

.ctrl--nope:active {
  background: #e03d2e;
}

.ctrl--superlike:active {
  background: #4fb3e6;
}
```

## Phase 7: Visual Feedback System

### 7.1 Swipe Overlay Indicators
```javascript
function createSwipeOverlay(type) {
  const overlay = document.createElement('div');
  overlay.className = `swipe-overlay swipe-overlay--${type}`;
  
  let content = '';
  switch(type) {
    case 'like':
      content = '<span class="swipe-overlay__text">LIKE</span>';
      overlay.style.background = 'rgba(48, 209, 88, 0.8)';
      break;
    case 'nope':
      content = '<span class="swipe-overlay__text">NOPE</span>';
      overlay.style.background = 'rgba(255, 69, 58, 0.8)';
      break;
    case 'superlike':
      content = '<span class="swipe-overlay__text">SUPER LIKE</span>';
      overlay.style.background = 'rgba(100, 210, 255, 0.8)';
      break;
  }
  
  overlay.innerHTML = content;
  return overlay;
}
```

### 7.2 Overlay Styling
```css
.swipe-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 40px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 24px;
  color: white;
  z-index: 15;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.swipe-overlay--visible {
  opacity: 1;
}
```

## Implementation Order

1. **Week 1**: Touch/Mouse event system + Direction detection
2. **Week 2**: Card animations + Visual feedback overlays
3. **Week 3**: Card management + Removal logic
4. **Week 4**: Action button integration
5. **Week 5**: Double-tap photo viewing
6. **Week 6**: Polish, testing, and optimization

## Technical Considerations

### Performance
- Use `transform` and `opacity` for smooth 60fps animations
- Implement passive event listeners where possible
- Throttle mouse move events to prevent performance issues

### Accessibility
- Maintain keyboard navigation support
- Add ARIA labels for dynamic content
- Ensure sufficient color contrast for overlays

### Browser Compatibility
- Test on both mobile and desktop browsers
- Ensure touch events work on iOS and Android
- Provide fallback for older browsers if needed

### Edge Cases
- Handle rapid swipes
- Prevent multiple simultaneous actions
- Deal with empty deck state
- Handle image loading errors

---

*This plan focuses purely on frontend UI behaviors without any backend integration.*
