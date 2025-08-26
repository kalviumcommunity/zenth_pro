import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function App() {
  const [file, setFile] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setFileName(selectedFile.name)
    }
  }

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('pdf', file)

    try {
      setLoading(true)
      const response = await axios.post('https://zenth-igjk.onrender.com/upload', formData)
      setExtractedText(response.data.text)
    } catch (error) {
      console.error('Error uploading PDF:', error)
      alert('Failed to process PDF.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const files = e.dataTransfer.files
    if (files && files[0] && files[0].type === 'application/pdf') {
      setFile(files[0])
      setFileName(files[0].name)
      fileInputRef.current.files = files
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <img className="ima" src="/landing.png" alt="" />
          <h1 className="logo">Zenth Pro</h1>
          <p className="subtitle">Upload your PDF, unlock smart quizzes and learn faster with Zenth!</p>
        </div>

        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <div
            className={`file-drop-zone ${fileName ? 'file-selected' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()} 
          > 
            <div className="file-icon">📄</div>
            <div className="file-text">
              {fileName ? `Selected: ${fileName}` : 'Drop PDF here or click to upload'}
            </div>
          </div>

          <button className="upload-btn" onClick={handleUpload} disabled={!file || loading}>
            {loading ? 'Processing PDF...' : 'Process PDF'}
          </button>

          {loading && (
            <div className="loading">
              <div className="loading-text">⏳ Processing PDF...</div>
            </div>
          )}

          {extractedText && !loading && (
            <div className="actions">
              <button 
                className="upload-btn" 
                onClick={() => navigate('/questions', { state: { text: extractedText } })}
              >
                Generate Questions
              </button>

              <button 
                className="upload-btn" 
                onClick={() => navigate('/quiz', { state: { text: extractedText } })}
                style={{ marginLeft: '15px' }}
              >
                Take Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
