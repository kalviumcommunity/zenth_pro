const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express(); app.use(cors()); app.use(express.json());

app.post('/generate', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  // Multi-shot: provide multiple example pairs before the task.
  const examples = `
Example 1
Text: "The water cycle includes evaporation, condensation, and precipitation."
Output:
- What are the three main stages of the water cycle?
- Which stage involves water vapor forming clouds?

Example 2
Text: "DNA carries genetic information using sequences of nucleotides."
Output:
- What molecule carries genetic information?
- What are the building blocks of DNA called?
`;

  const prompt = `${examples}

Now, using the same style, write 4 questions from this text:
"${text}"`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const out = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    res.json({ result: out.text });
  } catch (e) { res.status(500).json({ error: e.message || 'Generation failed' }); }
});

app.listen(3102, () => console.log('Multi-shot server :3102'));
