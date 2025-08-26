import React, { useEffect, useState } from "react";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/api/generate-questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleNext = () => {
    if (selectedOption === questions[currentIndex].answer) {
      setScore(score + 1);
    }
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  if (questions.length === 0) return <p>Loading questions...</p>;

  if (finished) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Quiz Finished!</h2>
        <p>Your Score: {score} / {questions.length}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h3>Question {currentIndex + 1} of {questions.length}</h3>
      <p>{currentQ.question}</p>
      {currentQ.options.map((opt, i) => (
        <div key={i}>
          <label>
            <input
              type="radio"
              name="option"
              value={opt}
              checked={selectedOption === opt}
              onChange={() => setSelectedOption(opt)}
            />
            {opt}
          </label>
        </div>
      ))}
      <button
        onClick={handleNext}
        disabled={!selectedOption}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        {currentIndex === questions.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default Quiz;
