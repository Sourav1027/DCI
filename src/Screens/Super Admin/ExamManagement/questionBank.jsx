import React, { useState } from 'react';
import { Plus, Search, Check } from 'lucide-react';
import './exam.css';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    subject: '',
    topic: ''
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      subject: '',
      topic: ''
    });
  };

  return (
    <div className="container">
      <div className="question-form-container">
        <h2>Add New Question</h2>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Enter subject"
                value={newQuestion.subject}
                onChange={(e) => setNewQuestion({...newQuestion, subject: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Topic</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Enter topic"
                value={newQuestion.topic}
                onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Question</label>
            <textarea
              className="form-input"
              rows="3"
              placeholder="Enter question"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
            />
          </div>

          <div className="options-grid">
            {newQuestion.options.map((option, index) => (
              <div key={index} className="form-group">
                <label>Option {index + 1}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={`Enter option ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...newQuestion.options];
                    newOptions[index] = e.target.value;
                    setNewQuestion({...newQuestion, options: newOptions});
                  }}
                />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label>Correct Answer</label>
            <select 
              className="form-input"
              value={newQuestion.correctAnswer}
              onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
            >
              <option value="">Select correct option</option>
              {newQuestion.options.map((_, index) => (
                <option key={index} value={index}>Option {index + 1}</option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleAddQuestion}>
            <Plus size={20} /> Add Question
          </button>
        </div>
      </div>

      <div className="questions-list-container">
        <div className="list-header">
          <h2>Question Bank</h2>
          <div className="search-box">
            <Search size={20} />
            <input type="text" placeholder="Search questions..." />
          </div>
        </div>

        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={index} className="question-item">
              <div className="question-meta">
                <span className="badge">{question.subject}</span>
                <span className="badge">{question.topic}</span>
              </div>
              <p className="question-text">{question.question}</p>
              <div className="options-list">
                {question.options.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className={`option ${optIndex === parseInt(question.correctAnswer) ? 'correct' : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;