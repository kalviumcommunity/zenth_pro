const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ask the model to return strict JSON and parse it server-side.
app.post('/generate-json', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  try {
    const schemaHint = `
Return ONLY valid JSON (no prose) in this exact shape:
{
  "questions": [
    { "question": "string", "options": ["string","string","string","string"], "answer": "string" }
  ]
}`;
    const prompt = `${schemaHint}\n\nCreate exactly 3 MCQs from the text below.\nText:\n${text}`;

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    // Try to parse the model's response as JSON.
    let parsed;
    try {
      parsed = JSON.parse(out.text);
    } catch {
      return res.status(502).json({
        error: 'Model did not return valid JSON',
        raw: out.text
      });
    }

    // Basic validation of structure
    const ok =
      parsed &&
      Array.isArray(parsed.questions) &&
      parsed.questions.every(
        q =>
          typeof q.question === 'string' &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.answer === 'string'
      );

    if (!ok) {
      return res.status(422).json({ error: 'JSON shape mismatch', parsed });
    }

    res.json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message || 'Generation failed' });
  }
});

app.listen(3004, () => console.log('Structured Output server on :3004'));
