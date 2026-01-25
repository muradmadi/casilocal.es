import 'dotenv/config';
import Groq from 'groq-sdk';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SPOTS_DIR = join(__dirname, '../../src/content/spots');
const PROCESSED_FILE = join(__dirname, '../processed-spots.json');

// Ensure spots directory exists
mkdirSync(SPOTS_DIR, { recursive: true });

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Load processed spots list (for deduplication)
function loadProcessedSpots() {
  if (existsSync(PROCESSED_FILE)) {
    try {
      return JSON.parse(readFileSync(PROCESSED_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

// Save processed spots list
function saveProcessedSpots(spots) {
  writeFileSync(PROCESSED_FILE, JSON.stringify(spots, null, 2), 'utf-8');
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function fetchPlaces(query) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_PLACES_API_KEY not set');

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.googleMapsUri,places.reviews,places.location,places.priceLevel',
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'en',
      maxResultCount: 20,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Places API error: ${error}`);
  }

  const data = await response.json();
  return data.places || [];
}

async function inferNeighborhoodWithGroq(placeName, address) {
  const prompt = `Given this Madrid cafe address, identify the neighborhood (barrio) name.

Cafe: "${placeName}"
Address: "${address}"

Common Madrid neighborhoods include: Malasaña, Lavapiés, Chamberí, Salamanca, La Latina, Chueca, Huertas, Sol, Retiro, Moncloa, Argüelles, Conde Duque, Embajadores, Tribunal, and many others.

Respond with ONLY the neighborhood name in Spanish (e.g., "Malasaña", "Lavapiés", "Chamberí"). No explanation, just the name.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 50,
    });

    const neighborhood = completion.choices[0]?.message?.content?.trim() || 'Centro';
    // Clean up any quotes or extra text
    return neighborhood.replace(/["""]/g, '').split('\n')[0].trim();
  } catch {
    return 'Centro';
  }
}

async function cleanCafeNameWithGroq(rawName) {
  const prompt = `Clean up this cafe name by removing generic descriptors.

Raw name: "${rawName}"

Remove things like:
- "Specialty Coffee", "Coffee Shop", "Café"
- "& Brunch", "& Bottle Shop", "| Brunch"
- Location suffixes like "Madrid", "Letras"
- Pipe separators and everything after them

Keep the distinctive brand name only. Examples:
- "Ambu Coffee Letras | Specialty Coffee Shop" → "Ambu"
- "PASTORA – Café & Bottle Shop" → "Pastora"
- "Pascal Specialty Coffee & Brunch" → "Pascal"
- "DABOV Specialty Coffee Spain" → "Dabov"

Respond with ONLY the cleaned name, properly capitalized (Title Case). No explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 50,
    });

    const cleaned = completion.choices[0]?.message?.content?.trim() || rawName;
    return cleaned.replace(/["""]/g, '').split('\n')[0].trim();
  } catch {
    return rawName;
  }
}

async function synthesizeReview(placeName, reviews, rating) {
  const reviewsText = reviews
    ?.slice(0, 5)
    .map((r) => r.text?.text || '')
    .filter(Boolean)
    .join('\n---\n');

  if (!reviewsText) {
    return {
      wifi_speed: 'reliable',
      noise_level: 'hum',
      plug_access: true,
      casi_score: Math.round(rating || 7),
      review: `## The Vibe\n\n${placeName} is a Madrid cafe that does the basics right. Expect decent coffee, reasonable seating, and the kind of atmosphere that won't distract you from your work.\n\n## The Verdict\n\nA solid choice for the discerning remote worker. Not flashy, but functional.`,
    };
  }

  const prompt = `You are analyzing Google reviews for a cafe called "${placeName}" in Madrid. The cafe has a ${rating}/5 rating.

Here are the reviews:
${reviewsText}

Based on these reviews, provide a JSON response with:
1. "wifi_speed": One of "flynet" (50mb+, fast), "reliable" (good enough), "spotty" (unreliable), "detox" (no wifi)
2. "noise_level": One of "silence" (library quiet), "hum" (pleasant cafe buzz), "chaos" (loud/busy)
3. "plug_access": true or false (are power outlets mentioned/available?)
4. "casi_score": A number 1-10 based on how good this place is for laptop work
5. "review": A 2-paragraph markdown review (with ## headings "The Vibe" and "The Verdict"). The tone should be analytical, slightly cynical but fair, dense with useful information. Focus on what remote workers need to know.

Respond ONLY with valid JSON, no markdown code blocks.`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || '';
  
  try {
    // Try to parse JSON, handling potential markdown code blocks
    const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.warn(`Failed to parse Groq response for ${placeName}, using defaults`);
    return {
      wifi_speed: 'reliable',
      noise_level: 'hum',
      plug_access: true,
      casi_score: Math.round(rating || 7),
      review: `## The Vibe\n\n${placeName} is a Madrid cafe that does the basics right. Expect decent coffee, reasonable seating, and the kind of atmosphere that won't distract you from your work.\n\n## The Verdict\n\nA solid choice for the discerning remote worker. Not flashy, but functional.`,
    };
  }
}

function priceLevelToEuros(priceLevel) {
  const mapping = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1.8,
    PRICE_LEVEL_MODERATE: 2.5,
    PRICE_LEVEL_EXPENSIVE: 3.5,
    PRICE_LEVEL_VERY_EXPENSIVE: 4.5,
  };
  return mapping[priceLevel] || 2.5;
}

function generateMdx(place, synthesis, neighborhood, cleanName) {
  const title = cleanName || place.displayName?.text || 'Unknown Cafe';
  const neighborhoodSlug = slugify(neighborhood);
  const cafeSlug = slugify(title);
  const slug = `${neighborhoodSlug}-${cafeSlug}`;
  const lat = place.location?.latitude || 40.416775;
  const long = place.location?.longitude || -3.70379;
  const coffeePrice = priceLevelToEuros(place.priceLevel);

  const frontmatter = `---
title: "${title}"
author: "murad-madi"
neighborhood: "${neighborhood}"
metrics:
  wifi_speed: "${synthesis.wifi_speed}"
  noise_level: "${synthesis.noise_level}"
  plug_access: ${synthesis.plug_access}
  coffee_price: ${coffeePrice}
  casi_score: ${synthesis.casi_score}
  coordinates:
    lat: ${lat}
    long: ${long}
---`;

  return {
    slug,
    content: `${frontmatter}\n\n${synthesis.review}\n`,
  };
}

async function suggestNewQuery(originalQuery, processedNames) {
  const prompt = `You are helping find NEW specialty coffee cafes in Madrid for remote workers.

Original search query: "${originalQuery}"

We already have these spots in our database:
${processedNames.slice(0, 15).join('\n')}

Suggest ONE new Google Maps search query that will find DIFFERENT cafes we don't have yet. Try:
- Different neighborhoods (Argüelles, Retiro, Tetuán, Vallecas, etc.)
- Different angles ("coworking cafes", "quiet cafes with wifi", "laptop friendly brunch spots")
- Specific areas ("cafes near Calle Fuencarral", "coffee shops in Chamartín")

Respond with ONLY the search query text, no explanation. Keep it under 10 words.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 50,
    });

    const newQuery = completion.choices[0]?.message?.content?.trim() || '';
    return newQuery.replace(/["""]/g, '').split('\n')[0].trim();
  } catch {
    return null;
  }
}

async function processPlaces(places, processedSpots, processedUris) {
  let newCount = 0;
  let skippedCount = 0;
  const skippedNames = [];

  for (const place of places) {
    const name = place.displayName?.text || 'Unknown';
    const uri = place.googleMapsUri || '';

    // Skip if already processed
    if (processedUris.has(uri)) {
      console.log(`\n⏭️  Skipping (already processed): ${name}`);
      skippedCount++;
      skippedNames.push(name);
      continue;
    }

    console.log(`\n☕ Processing: ${name}`);

    // Use Groq to infer neighborhood
    console.log('   🏘️  Inferring neighborhood...');
    const neighborhood = await inferNeighborhoodWithGroq(name, place.formattedAddress || '');
    console.log(`   📍 Neighborhood: ${neighborhood}`);

    // Clean up the cafe name
    console.log('   ✨ Cleaning name...');
    const cleanName = await cleanCafeNameWithGroq(name);
    console.log(`   📛 Clean name: ${cleanName}`);

    console.log('   🤖 Synthesizing review with Groq...');
    const synthesis = await synthesizeReview(cleanName, place.reviews, place.rating);

    const { slug, content } = generateMdx(place, synthesis, neighborhood, cleanName);
    const filePath = join(SPOTS_DIR, `${slug}.mdx`);

    writeFileSync(filePath, content, 'utf-8');
    console.log(`   ✅ Written: ${slug}.mdx`);

    // Add to processed list
    processedSpots.push({
      uri,
      name,
      neighborhood,
      slug,
      processedAt: new Date().toISOString(),
    });
    processedUris.add(uri);

    newCount++;
  }

  return { newCount, skippedCount, skippedNames };
}

async function main() {
  const MAX_RETRIES = 3;
  let query = process.argv[2] || 'Laptop friendly specialty coffee madrid';
  let retryCount = 0;
  let totalNew = 0;
  let totalSkipped = 0;

  // Load already processed spots
  const processedSpots = loadProcessedSpots();
  const processedUris = new Set(processedSpots.map((s) => s.uri));
  const processedNames = processedSpots.map((s) => s.name);

  while (retryCount < MAX_RETRIES) {
    console.log(`\n🔍 Fetching places from Google Places API...`);
    console.log(`   Query: "${query}"`);
    
    const places = await fetchPlaces(query);
    console.log(`📍 Found ${places.length} places`);

    const { newCount, skippedCount, skippedNames } = await processPlaces(
      places,
      processedSpots,
      processedUris
    );

    totalNew += newCount;
    totalSkipped += skippedCount;

    // Check if we should try a new query
    const duplicateRatio = skippedCount / places.length;
    
    if (duplicateRatio > 0.5 && newCount < 5 && retryCount < MAX_RETRIES - 1) {
      console.log(`\n🔄 Too many duplicates (${Math.round(duplicateRatio * 100)}%). Asking Groq for a new query...`);
      
      const newQuery = await suggestNewQuery(query, [...processedNames, ...skippedNames]);
      
      if (newQuery && newQuery !== query) {
        console.log(`   💡 New query: "${newQuery}"`);
        query = newQuery;
        retryCount++;
        continue;
      }
    }

    break;
  }

  // Save updated processed list
  saveProcessedSpots(processedSpots);

  console.log(`\n🎉 Done! Added ${totalNew} new spots, skipped ${totalSkipped} already processed.`);
  console.log(`📋 Total in processed list: ${processedSpots.length}`);
  
  if (retryCount > 0) {
    console.log(`🔄 Used ${retryCount} query refinement(s)`);
  }
}

main().catch((err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

