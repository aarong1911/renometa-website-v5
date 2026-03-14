// netlify/functions/setup-agent.cjs

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

exports.handler = async function(event, context) {
  console.log('--- setup-agent function invoked ---');
  console.log('HTTP Method:', event.httpMethod);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: 'Method Not Allowed' };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (err) {
    console.error('❌ Failed to parse request body:', err);
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON body provided' };
  }

  const { name, email, company, website, userRequestId } = parsedBody;

  if (!name || !email || !company || !website || !userRequestId) {
    console.warn('⚠️ Missing required fields:', { name, email, company, website, userRequestId });
    return { statusCode: 400, headers: corsHeaders, body: 'Missing required fields: name, email, company, website, or userRequestId' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Insert new agent request into Supabase
    const { data, error } = await supabase
      .from('agent_requests')
      .insert({
        id: userRequestId,
        name,
        email,
        company_name: company,
        company_site: website,
        status: 'pending',
        progress: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert failed:', error);
      if (error.code === '23505') {
        return { statusCode: 409, headers: corsHeaders, body: 'Agent request with this ID already exists. Please try again.' };
      }
      return { statusCode: 500, headers: corsHeaders, body: `Failed to create agent request: ${error.message}` };
    }

    console.log(`✅ New agent request created: ${userRequestId}`);

    // ✅ Call our own crawl-and-index Netlify function directly
    // Determine the base URL depending on environment
    const isLocal = process.env.NETLIFY_DEV === 'true';
    const baseUrl = isLocal
      ? 'http://localhost:8888'
      : `https://${process.env.URL || event.headers.host}`;

    const crawlUrl = `${baseUrl}/.netlify/functions/crawl-and-index`;

    console.log(`🚀 Triggering crawl at: ${crawlUrl}`);

    // Fire and forget — don't await so we return quickly to the frontend
    setTimeout(async () => {
      try {
        const crawlResponse = await axios.post(crawlUrl, {
          user_request_id: userRequestId,
          company_site: website,
          company_name: company,
          email: email,
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        });
        console.log(`✅ crawl-and-index triggered. Status: ${crawlResponse.status}`);
      } catch (crawlError) {
        console.error(`❌ Failed to trigger crawl-and-index:`, crawlError.message);
        await supabase.from('agent_requests')
          .update({
            status: 'crawling_initiation_failed',
            error_message: `Failed to start crawl: ${crawlError.message}`,
          })
          .eq('id', userRequestId);
      }
    }, 0);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Agent setup initiated. Crawling started.',
        requestId: userRequestId,
      }),
    };

  } catch (err) {
    console.error('❌ setup-agent failed due to unhandled error:', err);
    try {
      await supabase.from('agent_requests')
        .update({ status: 'failed', error_message: `Setup failed: ${err.message}` })
        .eq('id', userRequestId);
    } catch (updateErr) {
      console.error(`❌ Failed to mark request as failed:`, updateErr.message);
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: `Internal error during setup: ${err.message}`,
    };
  }
};

exports.config = {
  timeout: 26,
};
