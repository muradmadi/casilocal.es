# Image Assets

This directory contains image assets for the CasiLocal website.

## Required Images

### Logo (`logo.png`)

**Purpose:** Main site logo displayed in the desktop navigation header.

**Specifications:**
- **Dimensions:** Recommended 360x100px (or proportional)
- **Format:** PNG with transparency (preferred) or JPG
- **Aspect Ratio:** Approximately 3.6:1 (width:height)
- **File Size:** Optimize for web (< 100KB recommended)
- **Background:** Transparent or matches site background (#fff9e9)

**Usage:** 
- Displayed in desktop navigation (`.logo-desktop`)
- Should be visible on dark background (#202624)
- Consider light/white version for dark header

### PWA Icon (`web-app-manifest-192x192.png`)

**Purpose:** Progressive Web App icon and mobile navigation logo.

**Specifications:**
- **Dimensions:** Exactly 192x192px (square)
- **Format:** PNG
- **File Size:** Optimize for web (< 50KB recommended)
- **Background:** Can be transparent or solid color
- **Location:** Root directory (not in assets/images/)

**Usage:**
- Mobile navigation logo (`.logo-mobile`)
- PWA manifest icon
- Apple touch icon

### Favicon (`favicon.ico`)

**Purpose:** Browser tab icon.

**Specifications:**
- **Dimensions:** Multi-size ICO file (16x16, 32x32, 48x48)
- **Format:** ICO
- **File Size:** < 50KB
- **Location:** Root directory

**Alternative Formats:**
- Can also provide PNG versions (favicon-16x16.png, favicon-32x32.png)
- SVG favicon (favicon.svg) for modern browsers

## Optional Images

### Hero Images

**Purpose:** Background or featured images for hero sections.

**Specifications:**
- **Dimensions:** Flexible, but recommend 1200x600px or larger
- **Format:** JPG (for photos) or PNG (for graphics)
- **File Size:** Optimize for web (< 200KB recommended)
- **Aspect Ratio:** 2:1 (width:height) recommended

### Card Images

**Purpose:** Featured images for content cards.

**Specifications:**
- **Dimensions:** 600x400px or proportional
- **Format:** JPG (for photos) or PNG (for graphics)
- **File Size:** Optimize for web (< 100KB recommended)
- **Aspect Ratio:** 3:2 (width:height) recommended

## Image Optimization Tips

1. **Use appropriate formats:**
   - PNG for graphics with transparency
   - JPG for photographs
   - WebP for modern browsers (if supported)

2. **Optimize file sizes:**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Compress without visible quality loss

3. **Provide multiple sizes:**
   - Consider @2x versions for retina displays
   - Use srcset for responsive images

4. **Naming conventions:**
   - Use lowercase with hyphens: `logo.png`, `hero-image.jpg`
   - Be descriptive: `restaurant-card-1.jpg` not `img1.jpg`

## Current Status

- ❌ `logo.png` - **Required** - Not yet added
- ❌ `web-app-manifest-192x192.png` - **Required** - Not yet added (root directory)
- ❌ `favicon.ico` - **Required** - Not yet added (root directory)

## Design Guidelines

When creating or selecting images:

1. **Match the design system:**
   - High contrast aesthetic
   - Bold, utilitarian feel
   - Swiss newspaper-inspired style

2. **Color considerations:**
   - Images should work with the color palette
   - Consider how images look on Paper White (#fff9e9) background
   - Ensure text overlays are readable

3. **Style consistency:**
   - Maintain consistent visual style across all images
   - Consider using filters or adjustments to match site aesthetic

