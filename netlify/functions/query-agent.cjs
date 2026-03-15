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

// Company name is injected dynamically at runtime
function buildSystemPrompt(companyName) {
  return `You are a friendly, professional AI customer service agent for ${companyName}. You have been trained on the company's website content and your job is to help potential customers.

CRITICAL RULES — follow these exactly:
1. NEVER mention "links", "context", "the website", "my knowledge base", or any technical terms. You are a human-like agent.
2. NEVER say things like "follow the links" or "as mentioned on the site". Just answer naturally.
3. NEVER make up information not in the provided context. If you don't know, offer to connect them with the ${companyName} team.
4. Always refer to the company as "${companyName}" — never use a generic name.
5. Always end EVERY response with either a follow-up question OR a prompt to book/get a quote.
6. Keep answers concise — 2-4 sentences max before the follow-up.
7. Be warm, helpful, and solution-focused. Talk like a knowledgeable human, not a chatbot.
8. Use "we" and "our team" naturally when referring to ${companyName}.
9. After answering 2+ questions, always suggest a free consultation or estimate.

QUICK REPLY BUTTONS:
At the end of your response, suggest quick reply options in this exact format:

<quick_replies>
Option 1 | Option 2 | Option 3
</quick_replies>

Use quick replies when:
- User asks a broad question → offer 2-3 specific follow-ups
- After explaining services → offer "Get a free quote" | "Tell me more" | "Schedule a call"
- When you need more info → offer multiple choice answers

APPOINTMENT BOOKING:
When the user wants a quote, estimate, booking, or consultation — respond enthusiastically and include:
<book_appointment>true</book_appointment>

Example response:
"We specialize in kitchen and bathroom remodeling. Our projects typically take 2-6 weeks depending on scope.

What type of project are you thinking about?

<quick_replies>
Kitchen remodel | Bathroom remodel | Full renovation | Something else
</quick_replies>"`;
}

function formatResponseToHTML(rawAnswer) {
  const quickRepliesMatch = rawAnswer.match(/<quick_replies>([\s\S]*?)<\/quick_replies>/);
  const bookAppointment = rawAnswer.includes('<book_appointment>true</book_appointment>');

  let answer = rawAnswer
    .replace(/<quick_replies>[\s\S]*?<\/quick_replies>/g, '')
    .replace(/<book_appointment>[\s\S]*?<\/book_appointment>/g, '')
    .trim();

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

  // ✅ Fetch real company name from Supabase
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
Query: "${question}"
Expanded:`
          }],
        });
        const expandedQuery = expansionResponse.choices[0]?.message?.content?.trim();
        if (expandedQuery && expandedQuery.length > question.length && expandedQuery.length < 200) {
          searchQuestion = expandedQuery;
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

    if (relevantDocs.length === 0) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          answer: `<div class='ai-reply'><p>That's a great question! I want to make sure I give you the most accurate answer. Let me connect you with someone from the ${companyName} team who can help.</p><p>Would you like to schedule a quick call or get a free estimate?</p></div>`,
          quickReplies: ["Schedule a call", "Get a free estimate", "Ask another question"],
          bookAppointment: false,
          queriesRemaining: MAX_QUERIES_PER_WEBSITE - (recentQueries?.length || 0) - 1,
        }),
      };
    }

    const context = relevantDocs.map(doc => doc.content).join("\n\n---\n\n");

    const historyMessages = (chat_history || []).slice(-6).map(msg => ({
      role: msg.role === 'agent' ? 'assistant' : 'user',
      content: typeof msg.content === 'string' ? msg.content.replace(/<[^>]*>/g, '') : msg.content,
    }));

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        {
          role: 'user',
          content: `Company website context (use this to answer, but never reference it directly):
---
${context}
---

Customer message: ${question}

Respond as a helpful ${companyName} customer service agent. Be conversational and concise. Always end with a follow-up question or appointment prompt. Use <quick_replies> and <book_appointment> tags as instructed.`
        },
      ],
    });

    const rawAnswer = chatResponse.choices[0]?.message?.content || "I'm not sure how to respond to that.";
    const { html, quickReplies, bookAppointment } = formatResponseToHTML(rawAnswer);

    await supabase.from('agent_conversations').insert({
      user_request_id,
      question,
      answer: rawAnswer,
      created_at: new Date().toISOString(),
    }).catch(err => console.error('Failed to store Q&A:', err.message));

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
