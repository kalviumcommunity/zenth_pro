const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const prompt = `Generate 5 quiz questions from the following text:\n\n${text}`;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ result: out.text });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

app.listen(3001, () => console.log('Zero-shot server on :3001'));
