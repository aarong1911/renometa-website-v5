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

  // CORS headers reused across all responses
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: 'Method Not Allowed',
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (err) {
    console.error('❌ Failed to parse request body:', err);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Invalid JSON body provided',
    };
  }

  const { name, email, company, website, userRequestId } = parsedBody;

  if (!name || !email || !company || !website || !userRequestId) {
    console.warn('⚠️ Missing required fields:', { name, email, company, website, userRequestId });
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Missing required fields: name, email, company, website, or userRequestId',
    };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!makeWebhookUrl) {
    console.warn('⚠️ MAKE_WEBHOOK_URL is not configured. Crawling will not be triggered.');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: 'MAKE_WEBHOOK_URL is missing in environment.',
    };
  }

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
        console.warn(`Attempted to insert duplicate userRequestId: ${userRequestId}`);
        return {
          statusCode: 409,
          headers: corsHeaders,
          body: 'Agent request with this ID already exists. Please try again.',
        };
      }
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: `Failed to create agent request: ${error.message}`,
      };
    }

    console.log(`✅ New agent request created: ${userRequestId}`);

    // Asynchronously trigger the Make.com webhook for crawling
    setTimeout(async () => {
      try {
        const webhookResponse = await axios.post(makeWebhookUrl, {
          action: 'crawl_and_index',
          user_request_id: userRequestId,
          company_site: website,
          email: email,
          company_name: company,
        }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        });

        if (webhookResponse.status !== 200) {
          console.error(`Webhook call failed with status ${webhookResponse.status}: ${webhookResponse.data}`);
          await supabase.from('agent_requests')
            .update({
              status: 'crawling_initiation_failed',
              error_message: `Webhook error: ${webhookResponse.status} - ${JSON.stringify(webhookResponse.data)}`,
            })
            .eq('id', userRequestId);
        } else {
          console.log(`🚀 Crawling triggered for ${userRequestId}. Webhook status: ${webhookResponse.status}`);
        }
      } catch (webhookError) {
        console.error(`❌ Failed to trigger crawl for ${userRequestId}:`, webhookError.message);
        await supabase.from('agent_requests')
          .update({
            status: 'crawling_initiation_failed',
            error_message: `Webhook trigger error: ${webhookError.message}`,
          })
          .eq('id', userRequestId);
      }
    }, 0);

    // Return successful response immediately
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'Agent setup initiated. Background crawl started.',
        requestId: userRequestId,
      }),
    };

  } catch (err) {
    console.error('❌ setup-agent failed due to unhandled error:', err);
    try {
      await supabase.from('agent_requests')
        .update({
          status: 'failed',
          error_message: `Setup failed: ${err.message}`,
        })
        .eq('id', userRequestId);
      console.log(`Updated request ${userRequestId} status to 'failed'.`);
    } catch (updateErr) {
      console.error(`❌ Failed to mark request ${userRequestId} as failed in DB:`, updateErr.message);
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
