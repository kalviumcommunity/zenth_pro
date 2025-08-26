import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

function QuestionsPage() {
  const location = useLocation()
  const { text } = location.state || {}
  const [subjective, setSubjective] = useState('')
  const [mcq, setMcq] = useState('')
  const [trueFalse, setTrueFalse] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!text) return

    const fetchQuestions = async () => {
      try {
        setLoading(true)

        const [subjRes, mcqRes, tfRes] = await Promise.all([
          axios.post('https://zenth-igjk.onrender.com/generate-questions', { text, type: 'Subjective' }),
          axios.post('https://zenth-igjk.onrender.com/generate-questions', { text, type: 'MCQ' }),
          axios.post('https://zenth-igjk.onrender.com/generate-questions', { text, type: 'True/False' }),
        ])
        const cleanText = (text) => {
          if (!text) return ''
          return text.replace(/\*\*/g, '').replace(/\*/g, '')
        }

        setSubjective(cleanText(subjRes.data.questions))
        setMcq(cleanText(mcqRes.data.questions))
        setTrueFalse(cleanText(tfRes.data.questions))

      } catch (error) {
        console.error('Error generating questions:', error)
        alert('Failed to generate questions.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [text])

  if (!text) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>⚠️ No PDF content found. Please upload again.</div>
  }

  return (
    <div className="questions-page" style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>AI-Generated Questions</h1>

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '18px' }}>⏳ Generating questions...</div>
      ) : (
        <div className="questions-container" style={{ display: 'grid', gap: '20px' }}>
          
          {/* Subjective Questions */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>📝 Subjective Questions</h2>
            <textarea readOnly value={subjective} style={{ width: '100%', height: '150px' }} />
          </div>

          {/* MCQ Questions */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>✅ Multiple Choice Questions</h2>
            <textarea readOnly value={mcq} style={{ width: '100%', height: '150px' }} />
          </div>

          {/* True/False Questions */}
          <div className="card" style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
            <h2>🔀 True/False Questions</h2>
            <textarea readOnly value={trueFalse} style={{ width: '100%', height: '150px' }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionsPage
