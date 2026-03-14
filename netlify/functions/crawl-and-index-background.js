// netlify/functions/crawl-and-index-background.js
//
// ✅ Netlify Background Function — runs up to 15 minutes for free
// ✅ Uses openai SDK directly — no langchain, no zod dependency issues

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MAX_PAGES_PER_SITE = 10;
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return;

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON body:', err.message);
    return;
  }

  const { user_request_id, company_site, company_name, email } = body;

  if (!user_request_id || !company_site || !email) {
    console.error('Missing required fields');
    return;
  }

  await crawlAndIndex({ user_request_id, company_site, company_name, email });
};


// Simple text splitter — no langchain needed
function splitTextIntoChunks(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text.slice(0, 8000), // Max tokens safety limit
  });
  return response.data[0].embedding;
}


async function crawlAndIndex({ user_request_id, company_site, company_name, email }) {
  try {
    await supabase.from('agent_requests').update({
      status: 'crawling',
      progress: 0.1,
    }).eq('id', user_request_id);

    console.log(`🕷️ Starting Firecrawl for ${company_site} (max ${MAX_PAGES_PER_SITE} pages)`);

    // Step 1 — Start crawl with Firecrawl
    const crawlResponse = await fetch('https://api.firecrawl.dev/v1/crawl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url: company_site,
        limit: MAX_PAGES_PER_SITE,
        scrapeOptions: { formats: ['markdown'] },
      }),
    });

    if (!crawlResponse.ok) {
      const errText = await crawlResponse.text();
      throw new Error(`Firecrawl API error: ${crawlResponse.status} - ${errText}`);
    }

    const crawlData = await crawlResponse.json();
    const crawlId = crawlData.id;
    if (!crawlId) throw new Error('Firecrawl did not return a crawl ID');

    console.log(`✅ Firecrawl job started: ${crawlId}`);

    // Step 2 — Poll for completion (max 12 minutes)
    let pages = [];
    const maxWaitMs = 720000;
    const pollIntervalMs = 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(res => setTimeout(res, pollIntervalMs));

      const statusResponse = await fetch(`https://api.firecrawl.dev/v1/crawl/${crawlId}`, {
        headers: { 'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}` },
      });

      if (!statusResponse.ok) {
        console.error('Failed to check crawl status:', statusResponse.status);
        continue;
      }

      const statusData = await statusResponse.json();
      console.log(`Crawl status: ${statusData.status}, pages: ${statusData.completed || 0}`);

      const progress = statusData.total > 0
        ? Math.min(0.5, (statusData.completed / statusData.total) * 0.5)
        : 0.1;

      await supabase.from('agent_requests')
        .update({ progress })
        .eq('id', user_request_id);

      if (statusData.status === 'completed') {
        pages = statusData.data || [];
        break;
      }

      if (statusData.status === 'failed') {
        throw new Error('Firecrawl job failed');
      }
    }

    if (pages.length === 0) {
      throw new Error('No pages returned from Firecrawl');
    }

    console.log(`📄 Got ${pages.length} pages from Firecrawl`);

    // Step 3 — Split content into chunks
    await supabase.from('agent_requests')
      .update({ status: 'indexing', progress: 0.6 })
      .eq('id', user_request_id);

    const chunks = [];
    for (const page of pages) {
      const content = page.markdown || page.content || '';
      const sourceUrl = page.metadata?.sourceURL || company_site;
      if (!content || content.length < 50) continue;

      const textChunks = splitTextIntoChunks(content);
      for (const chunkText of textChunks) {
        chunks.push({
          id: crypto.randomUUID(),
          user_request_id,
          content: chunkText,
          source_url: sourceUrl,
        });
      }
    }

    if (chunks.length === 0) {
      await supabase.from('agent_requests').update({
        status: 'no_content',
        error_message: 'No indexable content found on site.',
      }).eq('id', user_request_id);
      return;
    }

    console.log(`🧩 Generated ${chunks.length} chunks, embedding...`);

    // Step 4 — Embed and store in batches
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await getEmbedding(chunk.content);
        await supabase.from('agent_knowledge_base').insert({
          id: chunk.id,
          user_request_id: chunk.user_request_id,
          content: chunk.content,
          embedding,
          source_url: chunk.source_url,
          created_at: new Date().toISOString(),
        });

        // Update progress every 5 chunks
        if (i % 5 === 0) {
          const progress = 0.6 + (i / chunks.length) * 0.4;
          await supabase.from('agent_requests')
            .update({ progress })
            .eq('id', user_request_id);
        }
      } catch (err) {
        console.error(`Failed to insert chunk ${chunk.id}:`, err.message);
      }
    }

    // Step 5 — Mark as ready
    await supabase.from('agent_requests').update({
      status: 'ready',
      progress: 1,
      error_message: null,
    }).eq('id', user_request_id);

    console.log(`✅ Complete for ${user_request_id}. ${chunks.length} chunks stored.`);

  } catch (error) {
    console.error('FATAL ERROR in crawlAndIndex:', error.message);
    await supabase.from('agent_requests').update({
      status: 'failed',
      error_message: error.message || 'An unexpected error occurred.',
      progress: 0,
    }).eq('id', user_request_id);
  }
}
