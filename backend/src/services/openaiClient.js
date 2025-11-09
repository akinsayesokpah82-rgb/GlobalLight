const { Configuration, OpenAIApi } = require('openai');
const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const client = new OpenAIApi(cfg);

async function createChatCompletion(messages, maxTokens=800){
  const res = await client.createChatCompletion({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages,
    max_tokens: maxTokens,
  });
  return res.data;
}

module.exports = { createChatCompletion };
