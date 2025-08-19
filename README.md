# Zenth Pro

## Overview  
This project is a web application that allows users to upload a PDF file and automatically generate questions based on its content.  
After uploading a PDF, the system provides two options:

1. **Generate Questions** – Displays different types of questions such as:  
   - Subjective Questions  
   - Multiple Choice Questions (MCQs)  
   - True/False Questions  

2. **Take Quiz** – Starts a quiz session where MCQs are shown one by one.  
   Users can:  
   - Select answers  
   - Move to the next question  
   - View their final score with correct answers  

This makes the application useful for **students, teachers, and self-learners** who want to quickly test knowledge from study material, research papers, or documents.

---

## Features  
- Upload PDF and automatically extract text  
- Generate a mix of **Subjective, MCQ, and True/False** questions  
- Interactive **quiz mode** with scoring system  
- AI **prompting techniques** (Zero-shot, One-shot, Multi-shot, Dynamic, Chain of Thought)  
- Simple and clean **user interface**  

---

## Tech Stack  
**Frontend:** React.js (Vite)  
**Backend:** Node.js, Express.js  
**AI/LLM:** OpenAI API (or compatible LLM)  

**Libraries & Tools:**  
- `pdf-parse` → PDF text extraction  
- `axios` → API requests  
- `dotenv` → Environment variables  

---

## Use Cases  
- **Students** – Practice quizzes from textbooks or notes  
- **Teachers** – Auto-generate test questions from study material  
- **Researchers** – Quickly create Q&A from research papers  
- **General Users** – Learn and revise efficiently  

---

