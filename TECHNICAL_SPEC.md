# AI Tinder Fork - Technical Development Specification

## Overview

This repository contains a frontend-only Tinder clone application built with vanilla HTML, CSS, and JavaScript. The application generates mock user profiles and displays them in a swipeable card interface similar to the popular dating app Tinder.

## Architecture

### Technology Stack
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Images**: Unsplash API for placeholder profile photos
- **Build System**: None (static files served directly)

### File Structure
```
ai-tinder-fork/
├── index.html          # Main application HTML
├── styles.css          # Complete application styling
├── app.js             # Main application logic and UI rendering
├── data.js            # Profile data generation utilities (ES6 modules)
├── README.md          # Basic project description
└── LICENSE            # Project license
```

## Core Components

### 1. HTML Structure (`index.html`)
- **Semantic HTML5** structure with proper accessibility attributes
- **Responsive viewport** configuration for mobile devices
- **Main sections**:
  - Header with branding and shuffle button
  - Main deck area for profile cards
  - Control buttons (Like, Super Like, Nope)
  - Footer with attribution

### 2. Styling System (`styles.css`)
- **CSS Custom Properties** for consistent theming
- **Dark theme** with gradient background effects
- **Responsive design** using CSS Grid and Flexbox
- **Card stacking effect** with transform and scale animations
- **Mobile-first approach** with media queries

#### Key Design Tokens
```css
--bg: #0b0b12              # Main background
--panel: #13131c           # Panel backgrounds
--accent: #ff4458          # Primary accent color
--like: #30d158            # Like button color
--nope: #ff453a            # Nope button color
--super: #64d2ff           # Super like button color
```

### 3. Application Logic (`app.js`)

#### Profile Generation
- **Mock data arrays** for names, cities, jobs, bios, and interests
- **Random profile generation** with realistic demographics
- **Unsplash integration** for profile photos using seeded image URLs
- **Profile structure**:
  ```javascript
  {
    id: string,           // Unique identifier
    name: string,         // First name
    age: number,          // 18-40 years old
    city: string,         // NYC area locations
    title: string,        // Job title
    bio: string,          // Short bio
    tags: string[],       // Interest tags (4 per profile)
    img: string           // Unsplash photo URL
  }
  ```

#### UI Rendering
- **Dynamic card creation** using DOM manipulation
- **Card stacking** with visual hierarchy (top 3 cards visible)
- **Accessibility features** with ARIA attributes
- **Responsive card sizing** maintaining mobile aspect ratio

#### Event Handling
- **Button click handlers** for Like, Nope, Super Like (currently console.log only)
- **Shuffle functionality** to regenerate profile deck
- **Note**: Swipe gestures and card animations are not implemented

### 4. Data Module (`data.js`)
- **ES6 module** with exported functions and constants
- **Profile generation utilities** reusable across the application
- **Seeded random generation** for consistent testing
- **Unsplash photo integration** with specific seed values

## Current Implementation Status

### ✅ Implemented Features
- Profile data generation with realistic mock data
- Card UI rendering with proper styling
- Responsive design for mobile and desktop
- Shuffle functionality to regenerate profiles
- Basic button click handling
- Accessibility attributes and semantic HTML
- Modern CSS with custom properties and grid layout

### ❌ Missing Features
- **Swipe gestures** (touch/mouse drag functionality)
- **Card animations** for swipe actions
- **Card removal** after swipe/action
- **Match detection** and notification system
- **Profile persistence** (no backend integration)
- **User authentication** system
- **Chat functionality** after matching
- **Profile editing** capabilities
- **Location-based** matching
- **Preference settings**

## Development Notes

### Code Quality
- **No build process** - direct file serving
- **Vanilla JavaScript** - no frameworks or libraries
- **ES6+ features** used in data module (exports/imports)
- **Global scope** usage in main app file
- **No error handling** for image loading failures
- **No validation** for generated data

### Performance Considerations
- **Image loading** from Unsplash may impact performance
- **No lazy loading** implemented for profile images
- **DOM manipulation** occurs on every shuffle
- **No debouncing** for rapid button clicks

### Browser Compatibility
- **Modern browser features** used (CSS Grid, Custom Properties)
- **No polyfills** included
- **Mobile responsive** design implemented
- **Touch events** not yet implemented

## Setup and Deployment

### Local Development
1. Clone the repository
2. Serve files using any static server (e.g., `python -m http.server`)
3. Open `index.html` in a modern browser

### Production Deployment
- **Static hosting** compatible (Netlify, Vercel, GitHub Pages)
- **No build step** required
- **HTTPS recommended** for Unsplash image loading
- **CORS considerations** for external image requests

## Future Development Recommendations

### Immediate Priorities
1. **Implement swipe gestures** using touch/mouse events
2. **Add card animations** for like/nope actions
3. **Create card removal** logic after actions
4. **Add error handling** for image loading

### Medium-term Enhancements
1. **Backend integration** for real user data
2. **Authentication system** implementation
3. **Match algorithm** development
4. **Chat functionality** after matching

### Long-term Features
1. **Real-time messaging** with WebSockets
2. **Geolocation-based** matching
3. **Premium features** and subscription model
4. **Advanced filtering** and preference settings

## Technical Debt

### Code Structure
- **Separation of concerns** could be improved
- **Module system** inconsistency (mix of global and ES6 modules)
- **No state management** system
- **No testing framework** implemented

### Dependencies
- **External image dependency** on Unsplash
- **No package management** (package.json)
- **No dependency updates** automation

---

*Last Updated: February 2026*
*Repository: https://github.com/salma-ghazii/ai-tinder-fork*
