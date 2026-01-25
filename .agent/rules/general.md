---
trigger: always_on
---

# Project Rules & Standards

## 1. Design System & UI
1. **Source of Truth:** All design tokens (colors, spacing, radii) must be defined in `@theme` blocks within `src/styles/global.css`. **Never** use arbitrary values (e.g., `w-[34px]`) unless mathematically calculated for a specific animation.
2. **Border Protocol:**
    * All semantic containers (Cards, Sidebars, Modals) must use `border` or `border-2`.
    * **Prohibited:** White space separation for distinct sections.
    * **Divider Standard:** Use `border-b-2 border-dotted border-[var(--color-ink)]/20`.
3. **Interaction Physics:**
    * **Buttons:** Apply `rounded-xs`. On `:active`, translate `2px 2px` and remove shadow to simulate physical depression.
    * **Images:** Apply `grayscale` filter by default. Remove filter on `:hover`. Transition must be `duration-300`.
4. **Tailwind V4 Enforcement:** Use modern CSS variables for values. Do not use `@apply` in CSS files; use utility classes in markup.

## 2. Architecture & Logic
1. **Component Atomicity:**
    * Components must be strictly typed with `interface Props`.
    * **Prohibited:** `any` types.
    * **Feature Slicing:** Locate components near their route if not shared. Shared components go in `src/components/ui`.
2. **State Management:**
    * Default to `.astro` (server-only) components.
    * Use `client:*` directives *only* for interactive islands (Auth, Complex Forms).
    * **Mandate:** If state is complex, use Nano Stores or standard React hooks within the island.
3. **Drafting Protocol:**
    * UI prototyping is permitted without a schema. However, before merging to `main` or `production`, the content model must be defined in Keystatic.

## 3. SEO & Metadata
1. **Canonical Strategy:**
    * Implement trailing slashes (`trailingSlash: 'always'`) where platform-compatible.
    * **Exception:** If deployment target (e.g., Vercel) forces a specific behavior that causes redirects, align with the platform default to ensure stability.
    * Every page must have a `<link rel="canonical">` pointing to the definitive URL.
2. **Meta Tags:**
    * Title format: `{{Page Title}} | {{Site Name}}`.
    * Description: Hard limit 160 characters. Warn if exceeded.
    * Open Graph: All distinct content pages must generate a dynamic OG image using the page title.
3. **Structured Data:**
    * JSON-LD is mandatory for all "Entity" pages (Blog Posts, Products, Authors).
4. **Sitemap:** Auto-generate `sitemap-index.xml`. Exclude utility pages (404, legal-modals).

## 4. Performance & Images
1. **CLS Zero Tolerance:**
    * All `img` tags or Astro `<Image />` components **MUST** have explicit `width` and `height` attributes (or aspect-ratio classes) to prevent layout shifts.
2. **Format Strategy:**
    * Use `.avif` as primary format, `.webp` fallback.
    * **Lazy Loading:** `loading="lazy"` on all images below the fold. `loading="eager"` for LCP (Largest Contentful Paint) candidate.
3. **Animation Hygiene:**
    * Prioritize CSS Transitions/Keyframes for simple UI states (hover, toggle).
    * Use JavaScript (Motion/GSAP) only for complex orchestration or physics-based interactions that CSS cannot handle.

## 5. Accessibility (A11y)
1. **Interactive Elements:** All `button` and `a` tags without visible text (icon-only) **MUST** have an `aria-label`.
2. **Focus States:** Never set `outline: none` without providing an alternative high-contrast `:focus-visible` ring.
3. **Heading Hierarchy:** `h1` is unique per page. H-levels must not be skipped (e.g., `h2` to `h4` is prohibited).

## 6. Security & Safety
1. **Input Hygiene:** All external inputs (forms, query params) must be validated via **Zod** schemas before processing.
2. **XSS Prevention:** Use Astro's `set:html` only when explicitly sanitizing content via a library like `sanitize-html`.
3. **Code Review Note:** Append a comment `// SECURITY NOTE: ...` near any Auth logic or API route handler.

## 7. Build & Git (The "Never" List)
1. **Never** use `npm run build` as a verification step in the loop; trust the dev server and TypeScript compiler.
2. **Never** commit hardcoded secrets.
3. **Never** use "lorem ipsum". Use realistic content stubs or draft data from Keystatic.
4. **Never** leave `console.log` in production code. Use a dedicated logger or strip them at build time.
5. **Never** use the browser subagent, it is not needed, do not attempt, i will manually stop you from ever accessing it.
6. **Never** use grep in the terminal, powershell does not recognize this command, do not be an idiot. 