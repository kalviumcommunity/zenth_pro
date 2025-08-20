const express = require('express')
const { GoogleGenAI } = require("@google/genai")
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post('/generate-questions', async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'No text provided' })

  try {
    const systemPrompt = "You are a helpful quiz generator AI. Your job is to create study questions from text."

    const userPrompt = `Here is the text:\n${text}`

    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const data = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt
    })

    res.json({ questions: data.text })
  } catch (err) {
    console.error('Gemini API Error:', err)
    res.status(500).json({ error: 'Failed to generate questions', details: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
