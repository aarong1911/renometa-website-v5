// netlify/functions/crawl-and-index-background.js
//
// ✅ Netlify Background Function — runs up to 15 minutes for free
// Named with -background suffix so Netlify detects it automatically.
// Does NOT return HTTP responses to the caller.

const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
const crypto = require('crypto');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
});

const MAX_PAGES_PER_SITE = 10; // Max pages crawled per website

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


async function crawlAndIndex({ user_request_id, company_site, company_name, email }) {
  try {
    const agentCompanyName = company_name || `Crawl for ${new URL(company_site).hostname}`;

    await supabase.from('agent_requests').update({
      status: 'crawling',
      progress: 0.1,
    }).eq('id', user_request_id);

    console.log(`🕷️ Starting Firecrawl for ${company_site} (max ${MAX_PAGES_PER_SITE} pages)`);

    // Step 1 — Crawl with Firecrawl
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

    // Step 3 — Split into chunks
    await supabase.from('agent_requests')
      .update({ status: 'indexing', progress: 0.6 })
      .eq('id', user_request_id);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = [];
    for (const page of pages) {
      const content = page.markdown || page.content || '';
      const sourceUrl = page.metadata?.sourceURL || company_site;
      if (!content || content.length < 50) continue;

      const docs = await splitter.createDocuments([content]);
      for (const doc of docs) {
        chunks.push({
          id: crypto.randomUUID(),
          user_request_id,
          content: doc.pageContent,
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

    // Step 4 — Embed and store
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
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
