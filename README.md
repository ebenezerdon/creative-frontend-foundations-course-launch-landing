## Creative Frontend Foundations - Course Launch Landing

This project is a production-quality landing page for a cohort-based digital course. It features an instructor bio, expandable curriculum outline, an interactive cohort timeline with calendar export, a testimonial carousel, and tiered pricing with a checkout intent modal. Built by [Teda.dev](https://teda.dev), the AI app builder for everyday problems.

### Tech stack
- HTML5 + Tailwind CSS (CDN)
- jQuery 3.7.x
- Modular JavaScript with a single global namespace `window.App`
- LocalStorage persistence for waitlist and checkout intent

### Features
- Immersive vertical-hero landing with generous whitespace and strong typography
- Instructor section with social proof
- Curriculum accordions with expand/collapse all and persisted open states
- Cohort selector that updates a milestone timeline and offers an ICS file to add the kickoff to your calendar
- Accessible testimonial carousel with keyboard-friendly controls
- Tiered pricing with monthly toggle and modal checkout intent
- Smooth scrolling, micro-interactions, and respects prefers-reduced-motion

### Project structure
- index.html: The complete landing experience
- styles/main.css: Custom CSS for animations and layout polish
- scripts/helpers.js: Utilities for storage, validation, formatting, and ICS generation
- scripts/ui.js: Renders sections, binds events, orchestrates UI logic under `window.App`
- scripts/main.js: Entry point that initializes and renders the app

### Getting started
1. Open `index.html` in a modern browser.
2. Interact with curriculum, choose a cohort, add the kickoff to your calendar, browse testimonials, and pick a pricing plan.
3. Your selections and forms persist in localStorage.

### Notes
- No server required. All data is client-side mocked.
- Tested for responsive behavior and keyboard navigation.
- Colors and spacing are tuned for readability and a modern aesthetic.
