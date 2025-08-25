const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express(); app.use(cors()); app.use(express.json());

app.post('/generate', async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question provided' });

  // Request a concise explanation (not full chain-of-thought).
  const prompt = `Answer the question and include a brief 2-3 sentence rationale (no step-by-step reasoning).
Question: ${question}`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    res.json({ result: out.text });
  } catch (e) { res.status(500).json({ error: e.message || 'Generation failed' }); }
});

app.listen(3103, () => console.log('Brief-rationale server :3103'));
