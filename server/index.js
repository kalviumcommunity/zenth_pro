const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express(); app.use(cors()); app.use(express.json());

app.post('/generate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // One-shot: give exactly ONE example before asking for new output.
  const example = `Example:
Text: "Photosynthesis converts light energy into chemical energy in plants."
Output: 
1) What is photosynthesis?
2) Which type of energy is converted during photosynthesis?
3) In which organisms does photosynthesis occur?`;

  const prompt = `${example}

Now generate 3 similar study questions from the following text:
Text: "${text}"`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    res.json({ result: out.text });
  } catch (e) { res.status(500).json({ error: e.message || 'Generation failed' }); }
});

app.listen(3101, () => console.log('One-shot server :3101'));
