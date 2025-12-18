# CasiLocal

**A Student Guide to Madrid** — A static website built with vanilla HTML, CSS, and JavaScript.

Live site: [https://casilocal.es](https://casilocal.es)

---

## Project Summary

CasiLocal is a comprehensive city guide designed for international students in Madrid. It helps users discover affordable restaurants, study spots, nightlife, cultural events, and practical survival tips — all curated with a student budget in mind.

### Key Features

- **Interactive Map** — Browse all recommended locations on an interactive map
- **Three Main Collections** — Eat & Drink, Survival, City Life
- **Responsive Design** — Mobile-first approach with desktop enhancements
- **PWA Ready** — Installable as a Progressive Web App
- **SEO Optimized** — Complete with sitemap, Open Graph, and Twitter Cards

---

## Tech Stack

This project intentionally uses **no frameworks or build tools** to demonstrate proficiency in core web technologies:

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup and document structure |
| CSS3 | Styling with CSS Grid, Flexbox, Custom Properties |
| Vanilla JavaScript | DOM manipulation, interactivity |
| Google Fonts | Typography (Open Sans) |

**No dependencies:** No React, Vue, Tailwind, Bootstrap, npm, or bundlers.

---

## Project Structure

```
casilocal.es/
├── public/                     # Deployable site content
│   ├── index.html              # Homepage
│   ├── map.html                # Interactive map page
│   ├── 404.html                # Custom error page
│   ├── privacy-policy.html     # Legal page
│   ├── terms-of-use.html       # Legal page
│   │
│   ├── eat-drink/              # Collection: Restaurants & Bars
│   │   ├── index.html
│   │   ├── restaurants/
│   │   └── bars/
│   │
│   ├── survival/               # Collection: Student Essentials
│   │   ├── index.html
│   │   ├── study-spots/
│   │   ├── transportation/
│   │   └── budget-tips/
│   │
│   ├── city-life/              # Collection: Culture & Events
│   │   ├── index.html
│   │   ├── neighborhoods/
│   │   ├── events/
│   │   └── culture/
│   │
│   ├── css/                    # Modular stylesheets
│   │   ├── reset.css           # Browser normalization
│   │   ├── variables.css       # Design tokens (colors, spacing)
│   │   ├── typography.css      # Font styles
│   │   ├── layout.css          # Grid system, containers
│   │   ├── components.css      # UI components
│   │   └── collections.css     # Page-specific styles
│   │
│   ├── js/                     # JavaScript modules
│   │   ├── menu.js             # Navigation & mobile menu
│   │   ├── map.js              # Map functionality
│   │   └── collections.js      # Filtering & interactions
│   │
│   ├── assets/images/          # Image assets
│   │
│   ├── sitemap.xml             # SEO sitemap (30 URLs)
│   ├── robots.txt              # Crawler directives
│   ├── site.webmanifest        # PWA manifest
│   └── favicon.svg/ico/png     # Favicon variants
│
├── README.md                   # This file
```

---

## Design System

### Visual Identity

The design follows a **Swiss Utility** aesthetic — high contrast, bold typography, and a utilitarian "modern tech" feel.

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Paper White | `#fff9e9` | Background |
| Ink Black | `#202624` | Text, dark elements |
| Action Red | `#731702` | Primary actions, accents |
| Highlight Yellow | `#f29f05` | Highlights, shadows |
| Deep Blue | `#0f2f59` | Theme color |

### Typography

- **Headings:** Open Sans (bold, uppercase)
- **Body:** Georgia (serif)

### Layout

- **Max Width:** 1200px
- **Grid:** CSS Grid with `auto-fit`
- **Breakpoint:** 900px (mobile/desktop)

---

## Running Locally

Since this is a static site with no build step, simply serve the `public/` folder:

```bash
# Python 3
cd public
python -m http.server 8000

# Or with Node.js
npx serve public

# Or with PHP
cd public
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000)

---

## Deployment

Point your hosting provider's document root to the `public/` folder.

**Supported platforms:**
- Netlify (set publish directory to `public`)
- Vercel (set output directory to `public`)
- GitHub Pages (deploy from `public` folder)
- Any static file host

---

## Accessibility

- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, etc.)
- ARIA labels and roles for interactive elements
- Skip-to-content link
- Keyboard navigation support
- Visible focus states
- Proper heading hierarchy (h1 → h2 → h3)

---

## SEO Implementation

- `<meta>` tags: description, keywords, author
- Open Graph tags for Facebook/LinkedIn sharing
- Twitter Card tags
- Canonical URLs on all pages
- XML sitemap with 30 indexed pages
- robots.txt allowing all crawlers
- Semantic HTML structure

---

## Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)
- iOS Safari, Chrome Mobile
- Graceful degradation for older browsers

---

## Author

Created as a web development project demonstrating modern HTML/CSS/JS without frameworks.

**Contact:** hello@casilocal.es (Not a working email yet)
