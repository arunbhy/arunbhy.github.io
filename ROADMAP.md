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
- [x] Interactive career timeline — expandable cards pulling from work + education data
- [x] Accessibility pass — keyboard nav, `focus-visible` styles, skip-to-content link
- [x] Reduced motion support — `prefers-reduced-motion` disables all animations
- [x] Contact form labels — proper `<label>` elements (visually hidden), `aria-live` status
- [x] Semantic HTML — `<section>`, `<main>`, `<footer>` throughout
- [x] Loading skeleton — branded pulse animation in `index.html`
- [x] Upgrade Vite — v4 → v8
- [x] Upgrade React — v18 → v19
- [x] `theme-color` meta tag — updates dynamically with theme toggle
- [x] Font loading optimization — `font-display=swap` on Google Fonts
- [x] Error boundary — catches rendering crashes with refresh button
- [x] CSS `!important` cleanup — removed flags, fixed specificity properly
- [x] Scrollbar styling — consistent for both light and dark themes
- [x] Blog/writing section — separate pages, markdown rendering, Medium-inspired design
- [x] Client-side routing — HashRouter with `react-router-dom`
- [x] Hyperlink sanity check — fixed nav from blog pages, footer links, asset paths

## Needs User Action

- [ ] **Formspree endpoint** — replace `arunbh.y@gmail.com` in `Contact.jsx` with actual Formspree form ID (e.g. `https://formspree.io/f/xabcdefg`). Create a free account at [formspree.io](https://formspree.io).
- [ ] **Blog content** — replace sample posts in `public/blog/` with your own writing. Edit `posts.json` for metadata and add `.md` files.

## Nice to Have

- [ ] **Analytics** — add Plausible or Google Analytics to track visitors
- [ ] **PWA support** — manifest + service worker for offline support and installability
- [ ] **Interactive skills visualization** — radar chart or force-directed graph instead of expandable cards
- [ ] **Performance audit** — run Lighthouse and fix flagged issues
- [ ] **Responsive images** — add `srcset` and `<picture>` elements for different screen sizes
- [ ] **Favicon fallback** — add `.ico` fallback for browsers that don't support WebP favicons
- [ ] **Blog syntax highlighting** — add `rehype-highlight` for colored code blocks in posts
- [ ] **Blog search/filter** — filter posts by tag on the blog listing page
