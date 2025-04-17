import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Feedback.css';

const Feedback = () => {
  const { state: feedback } = useLocation();
  const navigate = useNavigate();

  if (!feedback) {
    return <div>No feedback available. Please complete an interview first.</div>;
  }

  return (
    <div className="feedback-container">
      <h2>Interview Feedback</h2>
      <div className="summary">
        <p><strong>Total Score:</strong> {feedback.totalScore} / {feedback.maxScore} ({feedback.percentage.toFixed(2)}%)</p>
      </div>
      <div className="feedback-list">
        {feedback.feedback.map((item, index) => (
          <div key={index} className="feedback-item">
            <h3>Question {index + 1}</h3>
            <p><strong>Question:</strong> {item.question}</p>
            <p><strong>Your Answer:</strong> {item.response}</p>
            <p><strong>Score:</strong> {item.score}/10</p>
            <p><strong>Feedback:</strong> {item.feedback}</p>
            <p><strong>Suggestion:</strong> {item.suggestion}</p>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')}>Start New Interview</button>
    </div>
  );
};

export default Feedback;