# Portfolio Roadmap

## Completed

- [x] Fix gitignore, remove `node_modules/`, `dist/`, `.DS_Store` from tracking
- [x] Convert App.jsx from class to functional component
- [x] Fix ButtonLight/ButtonDark — use semantic `<button>`/`<a>` elements
- [x] Mobile responsiveness overhaul (all sections)
- [x] Sticky navbar with active section highlight
- [x] Smooth scrolling
- [x] Lazy load images
- [x] SEO meta tags (Open Graph, Twitter Card)
- [x] 404 page
- [x] FontAwesome 4.7 → 6.5 upgrade
- [x] Remove unused dependencies (framer-motion, react-anchor-link-smooth-scroll)
- [x] Neural network canvas background
- [x] Matrix data flow effect in hero section
- [x] Data visualization section dividers (scatter plot, loss curve, confusion matrix)
- [x] Auto-close mobile nav on link click
- [x] Google Scholar link in footer
- [x] Fix hardcoded colors for dark mode compatibility
- [x] Reduce particle/node count on mobile for performance
- [x] Clean up duplicate CSS resets and commented-out code
- [x] Intersection Observer animations — sections animate on scroll instead of on load
- [x] Tech stack tags on project cards (Python, PyTorch, React, etc.)
- [x] Convert images to WebP — 44.5MB → ~3.2MB (93% reduction)
- [x] Contact form via Formspree with email fallback

## High Priority

- [ ] **Accessibility pass** — keyboard navigation for expandable sections, `focus-visible` styles, skip-to-content link
- [ ] **Reduced motion support** — respect `prefers-reduced-motion` to disable animations for users who need it
- [ ] **Contact form labels** — add proper `<label>` elements for screen readers, `aria-live` for status messages
- [ ] **Semantic HTML upgrade** — replace remaining `<div>` section wrappers with `<section>` and `<main>` elements
- [ ] **Formspree endpoint** — replace `arunbh.y@gmail.com` in URL with actual Formspree form ID (`f/xabcdefg`)

## Medium Priority

- [ ] **Loading skeleton** — branded loading state to prevent flash of unstyled content
- [ ] **Upgrade Vite** — v4 → v6
- [ ] **Upgrade React** — v18 → v19
- [ ] **`theme-color` meta tag** — set browser chrome color matching theme (light/dark)
- [ ] **Font loading optimization** — add `font-display: swap` to prevent invisible text during font load
- [ ] **Responsive images** — add `srcset` and `<picture>` elements for different screen sizes
- [ ] **Error boundary** — React error boundary component to catch rendering crashes gracefully
- [ ] **CSS `!important` cleanup** — remove `!important` flags and fix specificity properly

## Nice to Have

- [ ] **Analytics** — add Plausible or Google Analytics to track visitors
- [ ] **PWA support** — manifest + service worker for offline support and installability
- [ ] **Blog/writing section** — for publishing research notes or tutorials
- [ ] **Interactive skills visualization** — radar chart or force-directed graph instead of expandable cards
- [ ] **Performance audit** — run Lighthouse and fix flagged issues
- [ ] **Favicon fallback** — add `.ico` fallback for browsers that don't support WebP favicons
- [ ] **Scrollbar styling** — match scrollbar colors for both light and dark themes
- [ ] **`useCallback` optimization** — memoize toggle handlers in Skills, Education, Achievements
