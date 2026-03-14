// netlify/functions/query-agent.cjs
//
// ✅ Uses openai SDK directly — no langchain, no zod dependency issues

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const MAX_QUERIES_PER_WEBSITE = 10;
const RESET_HOURS = 24;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const systemPrompt = `You are an AI assistant trained specifically on the content of a remodeling or home repair company's website. Your job is to help website visitors by answering their questions, explaining services clearly, and encouraging them to take action — like requesting a quote, booking an appointment, or contacting the team.

Use only the information from the website content you were provided. If the answer is not on the site, do not guess. Instead, offer to connect the visitor with someone from the company.

Always speak in a tone that matches the business: professional, friendly, and solution-oriented. Avoid jargon. Be concise but informative. When possible, include helpful context (e.g., timelines, what's included, what to expect) if it's mentioned on the site.

Your top priorities:
- Explain services clearly (e.g., kitchen remodeling, roofing, HVAC repair)
- Guide visitors to the right next step (e.g., "You can book a free consultation here…")
- Handle common customer questions (pricing, process, service areas) based on the site
- Encourage trust by staying aligned with the company's brand and tone

If a visitor says something like "Try now" or submits a business URL, assume they are evaluating this AI assistant for their own company, and explain how it works: "I'm powered by your website content, ready to help your customers 24/7 with questions, quotes, and bookings."

Do not answer questions unrelated to the company's website. Stay focused on what's relevant to remodeling and home repair services.`;

function formatResponseToHTML(answer) {
  let formatted = answer.trim().replace(/\n{2,}/g, '\n').replace(/\s{2,}/g, ' ');

  formatted = formatted.replace(
    /(?:The services mentioned in the context include:|Services mentioned include:|These services are designed to)/i,
    'Here are some of our services:'
  );

  if (formatted.match(/\d+\.\s/)) {
    formatted = formatted.replace(/(\d+)\.\s(.+?)(?=(?:\d+\.\s)|$)/gs, '<li>$2</li>');
    formatted = `<ol>${formatted}</ol>`;
  } else if (formatted.match(/[-*•]\s/)) {
    formatted = formatted.replace(/[-*•]\s(.+)/g, '<li>$1</li>');
    formatted = `<ul>${formatted}</ul>`;
  } else {
    formatted = `<p>${formatted.replace(/\n+/g, '</p><p>')}</p>`;
  }

  return `<div class="ai-reply">${formatted}</div>`;
}

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}

exports.handler = async (event) => {
  console.log('--- query-agent function invoked ---');

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

  const { user_request_id, question } = parsedBody;

  if (!user_request_id || !question) {
    return { statusCode: 400, headers: corsHeaders, body: 'Missing user_request_id or question' };
  }

  // ✅ Check query limit for this website in last 24 hours
  const windowStart = new Date(Date.now() - RESET_HOURS * 60 * 60 * 1000).toISOString();

  const { data: recentQueries, error: limitCheckError } = await supabase
    .from('agent_conversations')
    .select('id, created_at')
    .eq('user_request_id', user_request_id)
    .gte('created_at', windowStart);

  if (limitCheckError) {
    console.error('❌ Failed to check query limits:', limitCheckError);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Failed to verify usage limits' }) };
  }

  if (recentQueries && recentQueries.length >= MAX_QUERIES_PER_WEBSITE) {
    const oldest = recentQueries.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))[0];
    const resetsAt = new Date(new Date(oldest.created_at).getTime() + RESET_HOURS * 60 * 60 * 1000);
    const resetsAtStr = resetsAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });

    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'limit_reached',
        answer: `You've reached the limit of ${MAX_QUERIES_PER_WEBSITE} questions for this website in a 24-hour period. Your limit resets at ${resetsAtStr}.`,
        resetsAt: resetsAt.toISOString(),
      }),
    };
  }

  try {
    // Query expansion for short queries
    let searchQuestion = question;
    if (question.split(' ').length <= 3 && !question.includes('?')) {
      try {
        const expansionResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0,
          messages: [{
            role: 'user',
            content: `Expand this short query into a detailed natural language search query. Return only the expanded query, nothing else.

Examples:
"services" → "What services does this company provide?"
"pricing" → "What is the pricing information for the products or services offered?"
"contact" → "How can I contact the company or find their contact information?"

Query: "${question}"
Expanded:`
          }],
        });

        const expandedQuery = expansionResponse.choices[0]?.message?.content?.trim();
        if (expandedQuery && expandedQuery.length > question.length && expandedQuery.length < 200) {
          searchQuestion = expandedQuery;
          console.log(`INFO: Query expanded to: "${searchQuestion}"`);
        }
      } catch (expansionError) {
        console.error('Query expansion failed:', expansionError.message);
      }
    }

    // Generate embedding for search
    const queryEmbedding = await getEmbedding(searchQuestion);

    // Vector similarity search in Supabase
    const { data: retrievedDocs, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.01,
      match_count: 5,
    });

    if (matchError) {
      console.error('Vector search failed:', matchError.message);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: `Vector search failed: ${matchError.message}` }),
      };
    }

    // Filter to only docs for this request
    const relevantDocs = (retrievedDocs || []).filter(doc => doc.user_request_id === user_request_id);

    if (relevantDocs.length === 0) {
      console.log('No relevant documents found after filtering.');
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          answer: "I couldn't find relevant information in my knowledge base for that question. Would you like me to connect you with someone from the company?",
          queriesRemaining: MAX_QUERIES_PER_WEBSITE - (recentQueries?.length || 0) - 1,
        }),
      };
    }

    const context = relevantDocs.map(doc => doc.content).join("\n\n---\n\n");

    // Generate answer with GPT-4o
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Context:\n${context}\n\nUser Question: ${question}\n\nAnswer based ONLY on the provided context.` },
      ],
    });

    const answer = chatResponse.choices[0]?.message?.content || "I'm not sure how to respond to that.";

    // Store the Q&A
    const { error: insertError } = await supabase.from('agent_conversations').insert({
      user_request_id,
      question,
      answer,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error('Failed to store Q&A:', insertError.message);
    }

    const queriesRemaining = MAX_QUERIES_PER_WEBSITE - (recentQueries?.length || 0) - 1;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        answer: formatResponseToHTML(answer),
        queriesRemaining,
      }),
    };

  } catch (error) {
    console.error('FATAL ERROR in query-agent:', error.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message || 'Internal server error' }),
    };
  }
};

exports.config = {
  timeout: 26,
};
