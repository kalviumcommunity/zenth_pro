const express = require('express')
const { GoogleGenAI } = require("@google/genai")
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const pdfParse = require('pdf-parse')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const upload = multer({ dest: 'uploads/' })

// PDF Upload & Extraction
app.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const fileData = fs.readFileSync(req.file.path)
    const parsed = await pdfParse(fileData)
    fs.unlinkSync(req.file.path)
    res.json({ text: parsed.text })
  } catch (err) {
    res.status(500).json({ error: 'Failed to process PDF' })
  }
})

// Question + Answer Generation
app.post('/generate-questions', async (req, res) => {
  const { text, type } = req.body
  if (!text) return res.status(400).json({ error: 'No text provided' })

  try {
    let prompt = `You are a question generator. You MUST follow the exact format shown below. Do not add extra commentary, markdown, or symbols like **. Always provide BOTH questions AND answers.\n\nHere is the source text:\n---\n${text}\n---\n\n`

    if (type === 'MCQ') {
      prompt += `
Return EXACTLY in this format (5 questions):

1. <Question text>
   a) <Option A>
   b) <Option B>
   c) <Option C>
   d) <Option D>
Answer: <a/b/c/d>

2. <Question text>
   a) <Option A>
   b) <Option B>
   c) <Option C>
   d) <Option D>
Answer: <a/b/c/d>`
    } else if (type === 'True/False') {
      prompt += `
Return EXACTLY in this format (5 questions):

1. Statement: <statement here>
Answer: True

2. Statement: <statement here>
Answer: False

3. Statement: <statement here>
Answer: True`
    } else {
      // Subjective
      prompt += `
Return EXACTLY in this format (5 questions):

1. Question: <subjective question here>
Answer: <detailed answer here>

2. Question: <subjective question here>
Answer: <detailed answer here>

3. Question: <subjective question here>
Answer: <detailed answer here>

(⚠️ Do not omit the 'Answer:' line. It must follow every question.)`
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    const data = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
      generationConfig: { temperature: 0.4 } // lower temp = stricter adherence
    })

    let output = data.response.candidates[0].content.parts[0].text || ''
    output = output.replace(/\*\*/g, '').replace(/\*/g, '')

    res.json({ qa: output })
  } catch (err) {
    console.error('Gemini API Error:', err)
    res.status(500).json({ error: 'Failed to generate Q&A', details: err.message })
  }
})


app.get('/', (req, res) => {
  res.send('Welcome to the PDF Processing & Question Generator API')
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
