// functions/setup-agent.cjs

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

// Validate required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing Supabase credentials in environment variables.");
}

exports.handler = async function(event, context) {
  console.log('--- setup-agent function invoked ---');
  console.log('HTTP Method:', event.httpMethod);

  // Add CORS preflight response for OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No Content for successful preflight
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins for OPTIONS (or specify your frontend URL)
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Allow POST and OPTIONS methods
        "Access-Control-Allow-Headers": "Content-Type", // Allow Content-Type header
      },
      body: "" // Empty body for 204 response
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { // Add headers for non-POST methods too, for consistency
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: 'Method Not Allowed' 
    };
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body);
  } catch (err) {
    console.error('❌ Failed to parse request body:', err);
    return { 
      statusCode: 400, 
      headers: { // Add headers to error responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: 'Invalid JSON body provided' 
    };
  }

  // Destructure variables from the parsed body
  const { name, email, company, website, userRequestId } = parsedBody;

  // Validate presence of all required fields
  if (!name || !email || !company || !website || !userRequestId) {
    console.warn('⚠️ Missing required fields:', { name, email, company, website, userRequestId });
    return { 
      statusCode: 400, 
      headers: { // Add headers to error responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: 'Missing required fields: name, email, company, website, or userRequestId' 
    };
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const makeWebhookUrl = process.env.MAKE_WEBHOOK_URL;

  // Validate Make.com webhook URL
  if (!makeWebhookUrl) {
    console.warn('⚠️ MAKE_WEBHOOK_URL is not configured. Crawling will not be triggered.');
    return { 
      statusCode: 500, 
      headers: { // Add headers to error responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: 'MAKE_WEBHOOK_URL is missing in environment.' 
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
        company_name: company,   // Map 'company' from frontend to 'company_name' in DB
        company_site: website,   // Map 'website' from frontend to 'company_site' in DB
        status: 'pending',
        progress: 0,             // Initialize progress to 0
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert failed:', error);
      // Handle duplicate ID error specifically
      if (error.code === '23505') { // PostgreSQL unique violation error code
          console.warn(`Attempted to insert duplicate userRequestId: ${userRequestId}`);
          return { 
            statusCode: 409, // Conflict status code
            headers: { // Add headers to error responses
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type",
            },
            body: 'Agent request with this ID already exists. Please try again.' 
          };
      }
      return { 
        statusCode: 500, 
        headers: { // Add headers to error responses
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: `Failed to create agent request: ${error.message}` 
      };
    }

    console.log(`✅ New agent request created: ${userRequestId}`);

    // Asynchronously trigger the Make.com webhook for crawling
    // Use setTimeout to ensure the HTTP response is sent quickly
    setTimeout(async () => {
        try {
            const webhookResponse = await axios.post(makeWebhookUrl, {
                action: 'crawl_and_index',
                user_request_id: userRequestId, // Match Make.com's expected field
                company_site: website,          // Match Make.com's expected field
                email: email,
                company_name: company,          // Match Make.com's expected field
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000, // 30 seconds timeout for the webhook call
            });

            if (webhookResponse.status !== 200) {
                console.error(`Webhook call failed with status ${webhookResponse.status}: ${webhookResponse.data}`);
                // Update Supabase status if webhook fails
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
            // Update Supabase status if webhook fails (e.g., network error)
            await supabase.from('agent_requests')
                .update({
                    status: 'crawling_initiation_failed',
                    error_message: `Webhook trigger error: ${webhookError.message}`,
                })
                .eq('id', userRequestId);
        }
    }, 0); // Execute immediately but in a non-blocking way

    // Return successful response to the frontend immediately
    return {
      statusCode: 200,
      headers: { // Add headers for success response
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({
        message: 'Agent setup initiated. Background crawl started.',
        requestId: userRequestId,
      }),
    };

  } catch (err) {
    console.error('❌ setup-agent failed due to unhandled error:', err);
    // Attempt to update request status to 'failed' if possible
    const idToUpdate = userRequestId || 'unknown_id_before_parsing'; // Fallback ID
    try {
      await supabase.from('agent_requests')
        .update({
          status: 'failed',
          error_message: `Setup failed: ${err.message}`,
        })
        .eq('id', idToUpdate);
      console.log(`Updated request ${idToUpdate} status to 'failed'.`);
    } catch (updateErr) {
      console.error(`❌ Failed to mark request ${idToUpdate} as failed in DB:`, updateErr.message);
    }

    return {
      statusCode: 500,
      headers: { // Add headers for general catch error
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
      },
      body: `Internal error during setup: ${err.message}`,
    };
  }
};

exports.config = {
  timeout: 26, // Function timeout in seconds
};