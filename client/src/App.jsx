import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Quetions from './questions'
import Quiz from './quiz'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questions" element={<Quetions/>} />
      <Route path='/quiz' element={<Quiz/>}/>
    </Routes>
  )
}

export default App
