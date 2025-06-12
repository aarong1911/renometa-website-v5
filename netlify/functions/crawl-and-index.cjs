// functions/crawl-and-index.js

const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const chromium = require('@sparticuz/chromium');
const createRobotsParser = require('robots-parser');
const crypto = require('crypto');

if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

// --- UPDATED LOGIC FOR LOCAL DEVELOPMENT ---
// Use NETLIFY_DEV to reliably detect the local Netlify Dev environment
const isNetlifyDev = process.env.NETLIFY_DEV === 'true';
const puppeteer = isNetlifyDev ? require('puppeteer') : require('puppeteer-core');
// --- END UPDATED LOGIC ---

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openaiApiKey = process.env.OPENAI_API_KEY;
let embeddings = new OpenAIEmbeddings({ apiKey: openaiApiKey, modelName: 'text-embedding-ada-002' });

const MAX_DEPTH = 4;
const MAX_PAGES = 50;
const DELAY_BETWEEN_REQUESTS_MS = 500;
const PAGE_FETCH_TIMEOUT_MS = 25000;

const PRIORITY_PATHS = ['home', 'faq', 'pricing', 'services', 'contact', 'about'];
let robotsParsers = {};

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);
    let href = parsed.href.split('#')[0];
    if (parsed.pathname === '/' && href.endsWith('/')) {
      href = href.slice(0, -1);
    }
    return href;
  } catch {
    return null;
  }
}

function scoreContent(text) {
  const keywords = ['home', 'faq', 'frequently asked questions', 'pricing', 'price', 'quote', 'cost', 'contact', 'get in touch', 'email us', 'services', 'what we offer', 'solutions'];
  const lowered = text.toLowerCase();
  return keywords.reduce((score, kw) => score + (lowered.includes(kw) ? 1 : 0), 0);
}

function prioritizeLinks(links) {
  const priorityMap = PRIORITY_PATHS.reduce((acc, path, i) => { acc[path] = i; return acc; }, {});
  return links.sort((a, b) => {
    const getScore = (url) => {
      for (const path in priorityMap) {
        if (url.includes(path)) return priorityMap[path];
      }
      return 999;
    };
    return getScore(a) - getScore(b);
  });
}

async function getRobotsParser(url) {
  const parsedUrl = new URL(url);
  const robotsTxtUrl = `${parsedUrl.origin}/robots.txt`;

  if (!robotsParsers[parsedUrl.origin]) {
    try {
      const response = await fetch(robotsTxtUrl);
      const text = await response.text();
      robotsParsers[parsedUrl.origin] = createRobotsParser(robotsTxtUrl, text);
    } catch (error) {
      robotsParsers[parsedUrl.origin] = createRobotsParser(robotsTxtUrl, '');
    }
  }

  return robotsParsers[parsedUrl.origin];
}

exports.handler = async (event) => {
  // Add CORS headers for local development. Netlify handles this in production for actual deployments.
  const headers = {
    'Access-Control-Allow-Origin': '*', // Or your specific frontend URL, e.g., 'http://localhost:8888'
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight request (crucial for CORS)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '' // No body for preflight
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { user_request_id, company_site, company_name, email } = body;

  if (!user_request_id || !company_site || !email) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  // Use a timeout to respond to the client immediately and continue crawling asynchronously
  // This is important because Netlify Functions have a timeout limit for synchronous responses.
  setTimeout(() => {
    crawlAndIndex({ user_request_id, company_site, company_name, email })
      .catch(err => console.error('Unhandled crawl error:', err.message));
  }, 0); // Execute immediately but in a non-blocking way

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ message: 'Crawl initiated successfully.', requestId: user_request_id }),
  };
};


async function crawlAndIndex({ user_request_id, company_site, company_name, email }) {
  let browser = null;
  try {
    const normalizedSite = normalizeUrl(company_site);
    if (!normalizedSite) {
        throw new Error('Invalid company site URL provided.');
    }
    const agentCompanyName = company_name || `Crawl Request for ${new URL(normalizedSite).hostname}`;

    // Update agent_requests status to 'crawling'
    await supabase.from('agent_requests').upsert({
      id: user_request_id,
      company_site: normalizedSite,
      company_name: agentCompanyName,
      name: agentCompanyName, // Assuming name for agent is company name
      email,
      status: 'crawling',
      progress: 0,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' });

    const visited = new Set();
    const queue = [{ url: normalizedSite, depth: 0 }];
    const chunks = [];
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

    // --- UPDATED LOGIC FOR PUPPETEER LAUNCH ---
    // Use isNetlifyDev to decide between local puppeteer and serverless chromium
    browser = isNetlifyDev
      ? await puppeteer.launch({ headless: true }) // For local development with full puppeteer
      : await puppeteer.launch({ // For deployed Netlify Function with @sparticuz/chromium
          args: [...chromium.args, '--hide-scrollbars', '--disable-web-security', '--disable-setuid-sandbox', '--no-sandbox'],
          executablePath: await chromium.executablePath(),
          headless: chromium.headless,
          ignoreDefaultArgs: ['--disable-extensions'],
        });
    // --- END UPDATED LOGIC ---

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(PAGE_FETCH_TIMEOUT_MS);

    let crawledPagesCount = 0;
    while (queue.length > 0 && crawledPagesCount < MAX_PAGES) {
      const { url, depth } = queue.shift();
      if (!url || visited.has(url) || depth > MAX_DEPTH) continue;

      const robotsParser = await getRobotsParser(url);
      if (!robotsParser.isAllowed(url, 'User-Agent: *')) {
        visited.add(url); // Mark as visited even if disallowed to prevent re-queuing
        continue;
      }

      visited.add(url);
      crawledPagesCount++;

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_FETCH_TIMEOUT_MS });
        const { pageContent, links } = await page.evaluate(() => {
          // Remove irrelevant elements before extracting text
          document.querySelectorAll('script, style, noscript, iframe, img, svg, audio, video, header, footer, nav, aside, form, input, button, select, textarea, [role="dialog"], [aria-modal="true"]').forEach(el => el.remove());
          return {
            pageContent: document.body.innerText,
            links: Array.from(document.querySelectorAll('a[href]')).map(a => a.href),
          };
        });

        const cleaned = pageContent.replace(/\s+/g, ' ').trim();
        // Only process content if it's substantial and potentially relevant
        if (scoreContent(cleaned) > 0 && cleaned.length > 100) {
          const docs = await splitter.createDocuments([cleaned]);
          for (const doc of docs) {
            chunks.push({ id: crypto.randomUUID(), user_request_id, content: doc.pageContent, source_url: url });
          }
        }

        // Add new, relevant links to the queue
        prioritizeLinks(links)
          .map(normalizeUrl)
          .filter(Boolean) // Remove nulls from normalizeUrl
          .forEach(link => {
            if (!visited.has(link) && new URL(link).origin === new URL(normalizedSite).origin && depth + 1 <= MAX_DEPTH) {
              queue.push({ url: link, depth: depth + 1 });
            }
          });
      } catch (err) {
        console.error(`ERROR: Crawling failed for ${url}:`, err.message);
        // Do not re-queue if an error occurred for this URL
      }

      // Introduce a delay to avoid overwhelming the server
      await new Promise(res => setTimeout(res, DELAY_BETWEEN_REQUESTS_MS));
    }

    // Handle cases where no content was found or extracted
    if (chunks.length === 0) {
      await supabase.from('agent_requests').update({
        status: 'no_content',
        error_message: 'No indexable content found on site or crawling failed to extract content.'
      }).eq('id', user_request_id);
      return; // Exit if no content
    }

    // Update status to 'indexing' before processing chunks
    await supabase.from('agent_requests').update({ status: 'indexing', progress: 0.5 }).eq('id', user_request_id);

    // Process and store chunks with embeddings
    for (const chunk of chunks) {
      try {
        const embedding = await embeddings.embedQuery(chunk.content);
        await supabase.from('agent_knowledge_base').insert({
          id: chunk.id,
          user_request_id: chunk.user_request_id,
          content: chunk.content,
          embedding,
          source_url: chunk.source_url,
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error(`ERROR: Failed to insert chunk ${chunk.id} for request ${user_request_id}:`, err.message);
        // Continue to next chunk even if one fails
      }
    }

    // Final update for agent_requests status
    await supabase.from('agent_requests').update({ status: 'ready', error_message: null, progress: 1 }).eq('id', user_request_id);
    console.log(`Crawl and indexing complete for request ${user_request_id}. Total chunks: ${chunks.length}`);

  } catch (error) {
    console.error('FATAL ERROR in crawlAndIndex:', error.message);
    if (user_request_id) {
      await supabase.from('agent_requests').update({
        status: 'failed',
        error_message: error.message || 'An unexpected error occurred during crawling.',
        progress: 0
      }).eq('id', user_request_id);
    }
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

exports.config = {
  timeout: 600, // Increased timeout to 10 minutes (600 seconds) for potentially long crawls
};