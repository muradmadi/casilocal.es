
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist/client');
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap-0.xml');

// Regular expression to extract URLs from <loc> tags
const locRegex = /<loc>(.*?)<\/loc>/g;

async function filterSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.warn(`Sitemap not found at ${SITEMAP_PATH}, skipping filter.`);
    return;
  }

  console.log('Filtering sitemap for pages with images...');
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  
  // Extract all URLs
  const urls = [];
  let match;
  while ((match = locRegex.exec(sitemapContent)) !== null) {
    urls.push(match[1]);
  }

  console.log(`Found ${urls.length} URLs in sitemap.`);

  const validUrls = [];

  for (const url of urls) {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname;
      
      // Remove leading slash for path matching
      if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
      }

      // Handle root
      if (pathname === '') {
        pathname = 'index.html';
      } else if (pathname.endsWith('/')) {
        pathname += 'index.html';
      } else {
        // Try both directory/index.html and file.html
        if (!process.env.SKIP_HTML_EXT_CHECK) {
           // Standard Astro build usually creates directories for routes
           // but let's check both
           if (fs.existsSync(path.join(DIST_DIR, pathname, 'index.html'))) {
             pathname = path.join(pathname, 'index.html');
           } else if (fs.existsSync(path.join(DIST_DIR, pathname + '.html'))) {
             pathname = pathname + '.html';
           } 
        }
      }

      const filePath = path.join(DIST_DIR, pathname);
      
      if (fs.existsSync(filePath)) {
        // Read file content and check for <img>
        const content = fs.readFileSync(filePath, 'utf-8');
        // Check for <img tag. 
        if (content.includes('<img ')) {
          validUrls.push(url);
        } else {
             // console.log(`Skipping ${url} - no images found.`);
        }
      } else {
        console.warn(`File not found for URL: ${url} (path: ${filePath})`);
        // If we can't find the file, we can't check for images. Safe to exclude or include?
        // User asked to "only list the pages that have images". So exclude.
      }
    } catch (e) {
      console.warn(`Error processing URL ${url}: ${e.message}`);
    }
  }

  console.log(`Filtered sitemap: ${validUrls.length} pages retained.`);

  // Reconstruct XML preserving the header
  const firstUrlIndex = sitemapContent.indexOf('<url>');
  // If no URLs found originally, we might have <urlset ...></urlset> or <urlset ... />
  
  let header;
  let footer = '</urlset>';

  if (firstUrlIndex !== -1) {
    header = sitemapContent.substring(0, firstUrlIndex);
  } else {
    // If no URLs, try to find where urlset closes
    const closeIndex = sitemapContent.indexOf('</urlset>');
    if (closeIndex !== -1) {
        header = sitemapContent.substring(0, closeIndex);
    } else {
        // Fallback
        header = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    }
  }

  const newBody = validUrls.map(url => `<url><loc>${url}</loc></url>`).join('');
  
  const newSitemapContent = header + newBody + footer;
  
  fs.writeFileSync(SITEMAP_PATH, newSitemapContent);
  console.log('Sitemap updated successfully.');
}

filterSitemap();
