const express = require('express');
const router = express.Router();
const { createChatCompletion } = require('../services/openaiClient');

async function generateQuote(){
  // Use OpenAI to generate a short motivational quote
  const prompt = [{ role: 'system', content: 'You are a short-motivational-quote generator.' },
    { role: 'user', content: 'Give one short motivational quote (<= 30 words) and an author line.' }];
  const res = await createChatCompletion(prompt, 60);
  const quote = res.choices?.[0]?.message?.content || 'Stay positive.';
  return { text: quote };
}

router.get('/latest', async (req, res) => {
  const q = await generateQuote();
  res.json(q);
});

module.exports = router;
module.exports.generateQuote = generateQuote; // exported for scheduler
