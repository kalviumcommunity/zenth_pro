const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Count input tokens only—no temperature/topP/topK used here.
app.post('/count-tokens', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const count = await ai.models.countTokens({
      model: 'gemini-2.5-flash',
      contents: text
    });
    res.json({ inputTokens: count.totalTokens });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Token count failed' });
  }
});

// Demonstrate output-length control via maxOutputTokens.
app.post('/generate-limited', async (req, res) => {
  const { text, maxOutputTokens = 150 } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const out = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize:\n${text}`,
      generationConfig: {
        maxOutputTokens: Number(maxOutputTokens)
      }
    });
    res.json({ result: out.text, maxOutputTokens: Number(maxOutputTokens) });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

app.listen(3003, () => console.log('Tokens & Tokenization server on :3003'));
