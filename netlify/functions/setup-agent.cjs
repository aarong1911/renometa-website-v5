// netlify/functions/setup-agent.cjs

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

const MAX_WEBSITES_PER_USER = 2;    // Max websites per user per 24 hours
const RESET_HOURS = 24;             // Reset window in hours

exports.handler = async function(event, context) {
  console.log('--- setup-agent function invoked ---');

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
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON body provided' };
  }

  const { name, email, company, website, userRequestId } = parsedBody;

  if (!name || !email || !company || !website || !userRequestId) {
    return { statusCode: 400, headers: corsHeaders, body: 'Missing required fields' };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

  // ✅ LIMIT: Check how many websites this email has submitted in the last 24 hours
  const windowStart = new Date(Date.now() - RESET_HOURS * 60 * 60 * 1000).toISOString();

  const { data: recentRequests, error: limitCheckError } = await supabase
    .from('agent_requests')
    .select('id, company_site, created_at')
    .eq('email', email)
    .gte('created_at', windowStart);

  if (limitCheckError) {
    console.error('❌ Failed to check usage limits:', limitCheckError);
    return { statusCode: 500, headers: corsHeaders, body: 'Failed to verify usage limits' };
  }

  if (recentRequests && recentRequests.length >= MAX_WEBSITES_PER_USER) {
    // Find when the oldest one expires so we can tell the user
    const oldest = recentRequests.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
    const resetsAt = new Date(new Date(oldest.created_at).getTime() + RESET_HOURS * 60 * 60 * 1000);
    const resetsAtStr = resetsAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    console.warn(`⚠️ Rate limit hit for ${email}: ${recentRequests.length} sites in last 24h`);
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'limit_reached',
        message: `You've reached the limit of ${MAX_WEBSITES_PER_USER} websites per 24 hours. Your limit resets at ${resetsAtStr}.`,
        resetsAt: resetsAt.toISOString(),
      }),
    };
  }

  try {
    // Insert new agent request
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
        return { statusCode: 409, headers: corsHeaders, body: 'Agent request with this ID already exists.' };
      }
      return { statusCode: 500, headers: corsHeaders, body: `Failed to create agent request: ${error.message}` };
    }

    console.log(`✅ New agent request created: ${userRequestId}`);

    // Trigger the background crawl function
    const isLocal = process.env.NETLIFY_DEV === 'true';
    const baseUrl = isLocal
      ? 'http://localhost:8888'
      : `https://${process.env.URL || event.headers.host}`;

    // Background functions use the same URL path but Netlify routes them differently
    const crawlUrl = `${baseUrl}/.netlify/functions/crawl-and-index-background`;

    console.log(`🚀 Triggering background crawl at: ${crawlUrl}`);

    // Fire and forget
    axios.post(crawlUrl, {
      user_request_id: userRequestId,
      company_site: website,
      company_name: company,
      email,
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000, // Just enough to trigger it — background function takes over
    }).catch(err => {
      // Background functions return 202 Accepted, not 200 — don't treat as error
      if (err.response?.status !== 202) {
        console.error('Failed to trigger background crawl:', err.message);
      }
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Agent setup initiated. Crawling started.',
        requestId: userRequestId,
        remainingWebsites: MAX_WEBSITES_PER_USER - (recentRequests.length + 1),
      }),
    };

  } catch (err) {
    console.error('❌ setup-agent unhandled error:', err);
    try {
      await supabase.from('agent_requests')
        .update({ status: 'failed', error_message: `Setup failed: ${err.message}` })
        .eq('id', userRequestId);
    } catch (e) {
      console.error('Failed to mark request as failed:', e.message);
    }

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: `Internal error: ${err.message}`,
    };
  }
};

exports.config = {
  timeout: 26,
};
