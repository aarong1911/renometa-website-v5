// functions/query-agent.js

const { createClient } = require('@supabase/supabase-js');
const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, AIMessage, SystemMessage } = require('@langchain/core/messages');
const { PromptTemplate } = require('@langchain/core/prompts');

if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

const systemPrompt = `You are an AI assistant trained specifically on the content of a remodeling or home repair company's website. Your job is to help website visitors by answering their questions, explaining services clearly, and encouraging them to take action — like requesting a quote, booking an appointment, or contacting the team.

Use only the information from the website content you were provided. If the answer is not on the site, do not guess. Instead, offer to connect the visitor with someone from the company.

Always speak in a tone that matches the business: professional, friendly, and solution-oriented. Avoid jargon. Be concise but informative. When possible, include helpful context (e.g., timelines, what’s included, what to expect) if it's mentioned on the site.

Your top priorities:

- Explain services clearly (e.g., kitchen remodeling, roofing, HVAC repair)
- Guide visitors to the right next step (e.g., “You can book a free consultation here…”)
- Handle common customer questions (pricing, process, service areas) based on the site
- Encourage trust by staying aligned with the company’s brand and tone

If a visitor says something like “Try now” or submits a business URL, assume they are evaluating this AI assistant for their own company, and explain how it works: "I’m powered by your website content, ready to help your customers 24/7 with questions, quotes, and bookings."

Do not answer questions unrelated to the company’s website. Stay focused on what’s relevant to remodeling and home repair services.`;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

let embeddings;
try {
    embeddings = new OpenAIEmbeddings({
        apiKey: openaiApiKey,
        modelName: 'text-embedding-ada-002', // Ensure this matches crawl-and-index.js
    });
    console.log('INFO: OpenAIEmbeddings initialized');
} catch (e) {
    console.error('ERROR: Failed to initialize OpenAI Embeddings in query-agent:', e.message);
    // It's critical to return a response with CORS headers if an error occurs here too.
    throw new Error(`Failed to initialize embeddings: ${e.message}`); // This will be caught by the outer handler
}

let chatModel;
try {
    chatModel = new ChatOpenAI({
        apiKey: openaiApiKey,
        modelName: 'gpt-4o',
        temperature: 0.2,
        timeout: 60000,
    });
    console.log('INFO: ChatOpenAI initialized with gpt-4o');
} catch (e) {
    console.error('ERROR: Failed to initialize ChatOpenAI:', e.message);
    // It's critical to return a response with CORS headers if an error occurs here too.
    throw new Error(`Failed to initialize ChatOpenAI: ${e.message}`); // This will be caught by the outer handler
}

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

exports.handler = async (event) => {
  console.log('--- query-agent function invoked ---');
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

  const { user_request_id, question, chat_history = [] } = parsedBody;

  if (!user_request_id || !question) {
    console.warn('⚠️ Missing required fields:', { user_request_id, question });
    return { 
      statusCode: 400, 
      headers: { // Add headers to error responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: 'Missing user_request_id or question' 
    };
  }

  console.log(`INFO: Received query for request ID: ${user_request_id}, Original Question: "${question}"`);

  try {
    let searchQuestion = question;
    // Query Expansion Logic
    if (question.split(' ').length <= 3 && !question.includes('?')) {
        try {
            const expansionPrompt = `The user asked a very short or single-word query. Expand it into a more detailed and natural language search query that covers potential user intent, without adding extra conversational text. This query will be used to search a knowledge base.

            Examples:
            User: "services"
            Expanded: "What services does this company provide?"

            User: "pricing"
            Expanded: "What is the pricing information for the products or services offered?"

            User: "contact"
            Expanded: "How can I contact the company or find their contact information?"

            User: "solutions"
            Expanded: "What solutions does this company offer for customers?"

            User: "${question}"
            Expanded:`;

            console.log(`INFO: Attempting to expand short query: "${question}"`);
            const expansionMessage = new HumanMessage(expansionPrompt);
            const expansionResponse = await chatModel.invoke([expansionMessage]);
            const expandedQuery = expansionResponse.content.trim();

            if (expandedQuery && expandedQuery.length > question.length && expandedQuery.length < 200) {
                searchQuestion = expandedQuery;
                console.log(`INFO: Query expanded to: "${searchQuestion}"`);
            } else {
                console.log(`INFO: Query expansion resulted in unhelpful output or no change. Using original query.`);
            }
        } catch (expansionError) {
            console.error('ERROR: Failed to expand query:', expansionError.message);
        }
    }

    console.log('INFO: Performing direct RPC similarity search in Supabase...');
    const queryEmbedding = await embeddings.embedQuery(searchQuestion);

    const { data: retrievedDocs, error: matchError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.01,
        match_count: 5,
    });

    if (matchError) {
        console.error('ERROR: Supabase vector search failed:', matchError.message);
        return { // Add headers to error responses
          statusCode: 500,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          },
          body: JSON.stringify({ error: `Vector search failed: ${matchError.message}` })
        };
    }

    // --- START DEBUGGING LOGS ---
    console.log('DEBUG: --- Raw Retrieved Documents (before filter) ---');
    console.log(JSON.stringify(retrievedDocs, null, 2));
    console.log('DEBUG: --- User Request ID (from frontend) ---');
    console.log(`ID: ${user_request_id}, Type: ${typeof user_request_id}`);
    if (retrievedDocs && retrievedDocs.length > 0) {
        console.log('DEBUG: --- First Document Details ---');
        console.log(`First doc ID: ${retrievedDocs[0].id}`);
        console.log(`First doc content (partial): ${retrievedDocs[0].content.substring(0, Math.min(retrievedDocs[0].content.length, 100))}...`); // Ensure substring doesn't error on short content
        console.log(`First doc user_request_id: ${retrievedDocs[0].user_request_id}, Type: ${typeof retrievedDocs[0].user_request_id}`);
        console.log(`First doc metadata: ${JSON.stringify(retrievedDocs[0].metadata)}`);
    } else {
        console.log('DEBUG: No documents returned from RPC.');
    }
    console.log('DEBUG: --- End Debugging Logs ---');
    // --- END DEBUGGING LOGS ---

    // Filter by the top-level user_request_id column, which match_documents now returns
    const relevantDocs = retrievedDocs.filter(doc => doc.user_request_id === user_request_id);

    if (!relevantDocs || relevantDocs.length === 0) {
      console.log('INFO: No relevant documents found in knowledge base after filtering.');
      return {
        statusCode: 200,
        headers: { // Add headers to successful responses
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ answer: "I couldn't find relevant information in my knowledge base for that question. Would you like me to connect you with someone from the company?" }),
      };
    }

    if (relevantDocs[0].similarity < 0.85) {
      console.warn(`WARN: Top result similarity was only ${relevantDocs[0].similarity.toFixed(4)}. Context might be weak.`);
    }

    console.log(`INFO: Found ${relevantDocs.length} relevant documents. Preparing context.`);

    const context = relevantDocs.map(doc => doc.content).join("\n\n---\n\n");

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Context:\n${context}\n\nOriginal User Question: ${question}\n\nAnswer the original user question based ONLY on the provided context.` },
    ];

    const chatResponse = await chatModel.invoke(messages);
    const answer = chatResponse.content;

    console.log(`INFO: AI generated answer for request ID: ${user_request_id}`);
    console.log('Raw GPT output:', answer);

    const { error: insertQAError } = await supabase.from('agent_conversations').insert({
      user_request_id,
      question: question,
      answer,
      created_at: new Date().toISOString(),
    });

    if (insertQAError) {
      console.error('WARN: Failed to store Q&A in agent_conversations:', insertQAError.message);
    }

    const cleanAnswer = formatResponseToHTML(answer);

    return {
      statusCode: 200,
      headers: { // Add headers to successful responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ answer: cleanAnswer }),
    };

  } catch (error) {
    console.error('FATAL ERROR in query-agent handler:', error.message);
    return {
      statusCode: 500,
      headers: { // Add headers to all error responses
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ error: error.message || 'Internal server error during query' })
    };
  }
};

exports.config = {
  timeout: 26,
};