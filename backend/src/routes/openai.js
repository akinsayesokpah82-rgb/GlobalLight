const express = require('express');
const router = express.Router();
const { createChatCompletion } = require('../services/openaiClient');

router.post('/chat', async (req, res) => {
  const { messages, maxTokens } = req.body;
  try {
    const response = await createChatCompletion(messages, maxTokens || 800);
    res.json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
