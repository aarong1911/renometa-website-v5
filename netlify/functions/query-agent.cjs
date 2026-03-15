// netlify/functions/query-agent.cjs

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

function buildSystemPrompt(companyName) {
  return `You are an expert customer service agent for ${companyName}. You are knowledgeable, warm, and proactive. Your goal is to understand the customer's needs and guide them toward the right solution or booking.

STRICT RULES:
1. NEVER say "links", "context", "website", "knowledge base", or any tech terms. Speak like a human.
2. NEVER repeat the same vague answer. Each response must move the conversation forward.
3. ALWAYS use "${companyName}" as the company name — never substitute a generic name.
4. Use "we", "our team", "I can help with that" naturally.
5. NEVER make up services or prices not in the context. If unsure, offer to connect them with the team.
6. If the context contains URLs or page links, you MAY include them as markdown links like [View our portfolio](https://example.com/portfolio). Only use URLs that actually appear in the context — never make them up.

CONVERSATION STYLE:
- Be specific and helpful. Don't give vague answers like "we offer many services".
- When a customer is unsure, help them figure out what they need by asking targeted questions.
- Offer 2-3 concrete options whenever possible so the customer can easily choose.
- After understanding their need, always guide them toward booking a free consultation or estimate.
- Maximum 3 sentences of explanation before asking a follow-up or offering options.

QUICK REPLIES — always include at the end of EVERY response in this exact format:
<quick_replies>
Option 1 | Option 2 | Option 3
</quick_replies>

Quick reply rules:
- For broad questions: offer specific service options from the context
- For "not sure" / "I don't know" responses: offer helpful options like "Show me examples" | "What's popular?" | "Book a free consult"
- After 2 exchanges: always include "Get a free estimate" or "Schedule a consultation" as one option
- Maximum 4 options, minimum 2

WHEN CUSTOMER IS UNSURE (e.g. "not sure", "don't know", "maybe"):
Do NOT repeat the same question. Instead:
1. Acknowledge them warmly
2. Suggest the most popular or common options
3. Offer to help them figure it out with a free consultation

APPOINTMENT BOOKING:
When customer mentions quote, estimate, book, schedule, consultation, or cost — include:
<book_appointment>true</book_appointment>

EXAMPLE of a good response to "services?":
"We help homeowners with kitchen remodels, bathroom renovations, full home makeovers, and custom projects. Most of our clients start with a free in-home consultation where we walk through options together.

What area of your home are you looking to improve?

<quick_replies>
Kitchen | Bathroom | Multiple rooms | Not sure yet
</quick_replies>"

EXAMPLE of a good response to "not sure":
"No worries at all — that's exactly what our free consultation is for! We'll walk through your home, understand your vision, and recommend the best approach together.

What's the main thing you'd like to improve?

<quick_replies>
More space | Better look & feel | Fix something broken | Book free consult
</quick_replies>"`;
}

function formatResponseToHTML(rawAnswer) {
  const quickRepliesMatch = rawAnswer.match(/<quick_replies>([\s\S]*?)<\/quick_replies>/);
  const bookAppointment = rawAnswer.includes('<book_appointment>true</book_appointment>');

  let answer = rawAnswer
    .replace(/<quick_replies>[\s\S]*?<\/quick_replies>/g, '')
    .replace(/<book_appointment>[\s\S]*?<\/book_appointment>/g, '')
    .trim();

  // Markdown links → clickable HTML
  answer = answer.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline hover:text-blue-800">$1</a>');

  // Markdown bold
  answer = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Numbered lists
  if (answer.match(/^\d+\.\s/m)) {
    answer = answer.replace(/\d+\.\s(.+)/g, '<li>$1</li>');
    answer = `<ol>${answer}</ol>`;
  } else if (answer.match(/^[-*•]\s/m)) {
    answer = answer.replace(/[-*•]\s(.+)/g, '<li>$1</li>');
    answer = `<ul>${answer}</ul>`;
  } else {
    answer = answer
      .split(/\n\n+/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`)
      .join('');
  }

  let quickReplies = [];
  if (quickRepliesMatch) {
    quickReplies = quickRepliesMatch[1].split('|').map(s => s.trim()).filter(Boolean);
  }

  return {
    html: `<div class="ai-reply">${answer}</div>`,
    quickReplies,
    bookAppointment,
  };
}

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text.slice(0, 8000),
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

  const { user_request_id, question, chat_history = [] } = parsedBody;

  if (!user_request_id || !question) {
    return { statusCode: 400, headers: corsHeaders, body: 'Missing user_request_id or question' };
  }

  // Check query limit
  const windowStart = new Date(Date.now() - RESET_HOURS * 60 * 60 * 1000).toISOString();
  const { data: recentQueries, error: limitCheckError } = await supabase
    .from('agent_conversations')
    .select('id, created_at')
    .eq('user_request_id', user_request_id)
    .gte('created_at', windowStart);

  if (limitCheckError) {
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

  // Fetch real company name from Supabase
  let companyName = 'our company';
  try {
    const { data: requestData } = await supabase
      .from('agent_requests')
      .select('company_name')
      .eq('id', user_request_id)
      .single();
    if (requestData?.company_name) companyName = requestData.company_name;
    console.log(`INFO: Using company name: ${companyName}`);
  } catch (e) {
    console.warn('Could not fetch company name:', e.message);
  }

  const systemPrompt = buildSystemPrompt(companyName);

  try {
    // Query expansion for short inputs
    let searchQuestion = question;
    if (question.split(' ').length <= 3 && !question.includes('?')) {
      try {
        const expansionResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          temperature: 0,
          messages: [{
            role: 'user',
            content: `Expand this short query into a detailed search query. Return only the expanded query, nothing else.
"services" → "What services does this company provide?"
"pricing" → "What is the pricing for services offered?"
"contact" → "How can I contact the company?"
"bathroom" → "What bathroom renovation services does this company offer?"
"not sure" → "I am not sure what I need help with, can you guide me?"
Query: "${question}"
Expanded:`
          }],
        });
        const expandedQuery = expansionResponse.choices[0]?.message?.content?.trim();
        if (expandedQuery && expandedQuery.length > question.length && expandedQuery.length < 200) {
          searchQuestion = expandedQuery;
          console.log(`INFO: Query expanded to: "${searchQuestion}"`);
        }
      } catch (e) {
        console.error('Query expansion failed:', e.message);
      }
    }

    // Vector search
    const queryEmbedding = await getEmbedding(searchQuestion);
    const { data: retrievedDocs, error: matchError } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.01,
      match_count: 8,
    });

    if (matchError) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: `Vector search failed: ${matchError.message}` }) };
    }

    const relevantDocs = (retrievedDocs || []).filter(doc => doc.user_request_id === user_request_id);

    // Even with no docs, give a helpful response using GPT
    const context = relevantDocs.length > 0
      ? relevantDocs.map(doc => doc.content).join("\n\n---\n\n")
      : null;

    const historyMessages = (chat_history || []).slice(-6).map(msg => ({
      role: msg.role === 'agent' ? 'assistant' : 'user',
      content: typeof msg.content === 'string' ? msg.content.replace(/<[^>]*>/g, '') : msg.content,
    }));

    const userContent = context
      ? `Company website context (use this to answer, but never reference it directly):\n---\n${context}\n---\n\nCustomer message: ${question}`
      : `Customer message: ${question}\n\n(No specific context found — guide them toward booking a consultation and ask what they need help with.)`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: userContent },
      ],
    });

    const rawAnswer = chatResponse.choices[0]?.message?.content || "I'm not sure how to respond to that.";
    const { html, quickReplies, bookAppointment } = formatResponseToHTML(rawAnswer);

    // Store Q&A
    const { error: insertError } = await supabase.from('agent_conversations').insert({
      user_request_id,
      question,
      answer: rawAnswer,
      created_at: new Date().toISOString(),
    });
    if (insertError) console.error('Failed to store Q&A:', insertError.message);

    const queriesRemaining = MAX_QUERIES_PER_WEBSITE - (recentQueries?.length || 0) - 1;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ answer: html, quickReplies, bookAppointment, queriesRemaining }),
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
