import 'dotenv/config';
import Groq from 'groq-sdk';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPOTS_DIR = join(__dirname, '../../src/content/spots');
const REFINED_FILE = join(__dirname, '../refined-spots.json');

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Rate limit: 1 request per minute
const RATE_LIMIT_MS = 600 * 1000;

// Load refined spots list (for deduplication)
function loadRefinedSpots() {
  if (existsSync(REFINED_FILE)) {
    try {
      return JSON.parse(readFileSync(REFINED_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

// Save refined spots list
function saveRefinedSpots(spots) {
  writeFileSync(REFINED_FILE, JSON.stringify(spots, null, 2), 'utf-8');
}

// Parse MDX file into frontmatter and content
function parseMdx(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error('Invalid MDX format - no frontmatter found');
  }
  return {
    frontmatter: match[1],
    body: match[2].trim(),
  };
}

// Reconstruct MDX file
// Reconstruct MDX file
function buildMdx(frontmatter, body, author) {
  // If author is passed, ensure it's in the frontmatter
  let newFrontmatter = frontmatter;
  if (author) {
    if (newFrontmatter.includes('author:')) {
      newFrontmatter = newFrontmatter.replace(/author:\s*"[^"]*"/, `author: "${author}"`);
    } else {
      // Add author after title
      newFrontmatter = newFrontmatter.replace(/(title:\s*"[^"]*")/, `$1\nauthor: "${author}"`);
    }
  }
  return `---\n${newFrontmatter}\n---\n\n${body}\n`;
}

const AUTHORS = [
  'murad',
  'isabella',
  'mikelia',
  'sara',
  'robert'
];

function selectRandomAuthor() {
  const rand = Math.random();
  // Murad gets 40%, others split the remaining 60% (15% each)
  if (rand < 0.40) return 'murad';
  if (rand < 0.55) return 'isabella';
  if (rand < 0.70) return 'mikelia';
  if (rand < 0.85) return 'sara';
  return 'robert';
}

async function refineReview(spotName, neighborhood, currentReview) {
  const prompt = `You are writing for CasiLocal, a Madrid-based guide for remote workers and digital nomads. You know the city inside out - from the vermut bars of La Latina to the hipster cafes of Malasaña, from the quiet corners of Chamberí to the chaos of Sol.

**First**: Search the web for "${spotName}" cafe in ${neighborhood}, Madrid to find real details - their Instagram, Google reviews, specialty coffee forums, anything that gives you authentic details about this specific place.

**The cafe**: "${spotName}" in ${neighborhood}

**Current draft** (too generic, rewrite completely):
---
${currentReview}
---

**Your task:** Write a compelling review that sounds like a local Madrileño wrote it:

1. **Voice**: You've lived in Madrid for years. You compare this cafe to others in the neighborhood. You know the barrio's character - mention nearby landmarks, streets, the vibe of the area. Throw in a Spanish word or two naturally ("caña", "terraza", "de toda la vida").

2. **Structure**: 3-4 paragraphs with headings:
   - "## First Impressions"
   - "## The Setup" (workspace, plugs, seating)
   - "## The Coffee"
   - "## The Verdict"

3. **Madrid context**:
   - Compare to other spots: "Unlike the tourist traps near Sol..." or "Better than the usual Malasaña hipster nonsense..."
   - Reference local habits: "The 11am café con leche crowd", "post-siesta rush"
   - Neighborhood character: What makes ${neighborhood} special?

4. **Practical details for remote workers**:
   - Specific outlet locations
   - Best times to come (avoid "la hora del vermut")
   - What to order, what to skip

5. **Tone**: Dense, opinionated, occasionally sarcastic but ultimately fair. Every sentence earns its place. No fluff.

6. **Length**: 300-450 words.

Respond with ONLY the markdown content (starting with ## heading). No intro, no "Here's the review".`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.85,
    max_tokens: 1500,
  });

  const refined = completion.choices[0]?.message?.content?.trim() || '';
  
  // Ensure it starts with a heading
  if (!refined.startsWith('##')) {
    return `## The Vibe\n\n${refined}`;
  }
  
  return refined;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('📝 Review Refiner - Making reviews sound human\n');

  // Check for single file argument
  const singleFile = process.argv[2];
  
  let filesToProcess;
  
  if (singleFile) {
    // Single file mode - skip deduplication check
    const filename = singleFile.endsWith('.mdx') ? singleFile : `${singleFile}.mdx`;
    const filePath = join(SPOTS_DIR, filename);
    
    if (!existsSync(filePath)) {
      console.error(`❌ File not found: ${filename}`);
      console.log(`   Available files in ${SPOTS_DIR}`);
      process.exit(1);
    }
    
    console.log(`🎯 Single file mode: ${filename}\n`);
    filesToProcess = [filename];
  } else {
    // Get all MDX files
    const files = readdirSync(SPOTS_DIR)
      .filter(f => f.endsWith('.mdx'))
      .filter(f => f !== 'example-spot.mdx');

    console.log(`📂 Found ${files.length} spot files`);

    // Load already refined spots
    const refinedSpots = loadRefinedSpots();
    const refinedSet = new Set(refinedSpots.map(s => s.filename));

    filesToProcess = files.filter(f => !refinedSet.has(f));
    console.log(`🔄 ${filesToProcess.length} files need refining, ${files.length - filesToProcess.length} already done\n`);
  }

  if (filesToProcess.length === 0) {
    console.log('✅ All files already refined!');
    return;
  }

  // Load refined spots for tracking (even in single file mode)
  const refinedSpots = singleFile ? [] : loadRefinedSpots();
  
  let processed = 0;

  for (const filename of filesToProcess) {
    const filePath = join(SPOTS_DIR, filename);
    
    try {
      console.log(`\n☕ [${processed + 1}/${filesToProcess.length}] Refining: ${filename}`);
      
      // Read and parse file
      const content = readFileSync(filePath, 'utf-8');
      const { frontmatter, body } = parseMdx(content);
      
      // Extract spot name and neighborhood from frontmatter
      const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
      const neighborhoodMatch = frontmatter.match(/neighborhood:\s*"([^"]+)"/);
      
      const spotName = titleMatch ? titleMatch[1] : filename.replace('.mdx', '');
      const neighborhood = neighborhoodMatch ? neighborhoodMatch[1] : 'Madrid';
      
      console.log(`   📍 ${spotName} in ${neighborhood}`);
      
      // Select author
      const author = selectRandomAuthor();
      console.log(`   ✍️  Author: ${author}`);

      console.log('   🤖 Sending to Groq for refinement...');
      
      // Refine the review
      const refinedBody = await refineReview(spotName, neighborhood, body);
      
      // Rebuild and save
      const newContent = buildMdx(frontmatter, refinedBody, author);
      writeFileSync(filePath, newContent, 'utf-8');
      
      console.log('   ✅ Refined and saved');
      
      // Mark as refined (skip for single file mode)
      if (!singleFile) {
        refinedSpots.push({
          filename,
          spotName,
          refinedAt: new Date().toISOString(),
        });
        saveRefinedSpots(refinedSpots);
      }
      
      processed++;
      
      // Rate limit: wait until 1 minute has passed (if more files to process)
      if (processed < filesToProcess.length) {
        console.log(`   ⏳ Waiting ${RATE_LIMIT_MS / 1000}s before next file (rate limit)...`);
        await sleep(RATE_LIMIT_MS);
      }
      
    } catch (err) {
      console.error(`   ❌ Error processing ${filename}:`, err.message);
    }
  }

  console.log(`\n🎉 Done! Refined ${processed} reviews.`);
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
