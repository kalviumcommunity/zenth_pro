const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// The prompt changes based on a user-provided "mode" -> dynamic prompting.
app.post('/generate', async (req, res) => {
  const { text, mode } = req.body; // mode: 'mcq' | 'truefalse' | 'subjective'
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Only vary the instruction; no formatting schema or examples included.
  let instruction = 'Create 5 open-ended study questions.';
  if (mode === 'mcq') instruction = 'Create 5 multiple-choice study questions.';
  else if (mode === 'truefalse') instruction = 'Create 5 true-or-false style study statements.';

  try {
    const prompt = `${instruction}\n\nSource text:\n${text}`;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.json({ result: out.text, mode: mode || 'subjective' });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

app.listen(3002, () => console.log('Dynamic Prompting server on :3002'));
