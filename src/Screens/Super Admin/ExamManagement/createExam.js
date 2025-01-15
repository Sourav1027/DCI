import React, { useState } from 'react';
import './exam.css';
import { Search, Check } from 'lucide-react';

const CreateExam = () => {
  const [examDetails, setExamDetails] = useState({
    title: '',
    duration: '',
    center: '',
    course: '',
    batch: '',
    selectedQuestions: []
  });

  // Sample questions from question bank
  const [questionBank] = useState([
    {
      id: 1,
      question: "Sample question 1?",
      subject: "Mathematics",
      topic: "Algebra"
    },
    // Add more sample questions...
  ]);

  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  return (
    <div className="container">
      <div className="exam-details-form">
        <h2>Create New Exam</h2>
        <div className="form-section">
          <div className="form-row">
            <div className="form-group">
              <label>Exam Title</label>
              <input type="text" className="form-input" placeholder="Enter exam title" />
            </div>
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" className="form-input" placeholder="Enter duration" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Center</label>
              <select className="form-input">
                <option value="">Select Center</option>
                <option value="center1">Center 1</option>
                <option value="center2">Center 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Course</label>
              <select className="form-input">
                <option value="">Select Course</option>
                <option value="course1">Course 1</option>
                <option value="course2">Course 2</option>
              </select>
            </div>
            <div className="form-group">
              <label>Batch</label>
              <select className="form-input">
                <option value="">Select Batch</option>
                <option value="batch1">Batch 1</option>
                <option value="batch2">Batch 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="question-selection-container">
        <div className="list-header">
          <h2>Select Questions</h2>
          <div className="search-filters">
            <select className="form-input">
              <option value="">All Subjects</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
            <select className="form-input">
              <option value="">All Topics</option>
              <option value="algebra">Algebra</option>
              <option value="geometry">Geometry</option>
            </select>
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="Search questions..." />
            </div>
          </div>
        </div>

        <div className="questions-selection-list">
          {questionBank.map((question) => (
            <div 
              key={question.id} 
              className={`question-select-item ${selectedQuestions.includes(question.id) ? 'selected' : ''}`}
              onClick={() => toggleQuestionSelection(question.id)}
            >
              <div className="question-meta">
                <span className="badge">{question.subject}</span>
                <span className="badge">{question.topic}</span>
              </div>
              <p className="question-text">{question.question}</p>
              {selectedQuestions.includes(question.id) && (
                <div className="selected-check">
                  <Check size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button className="btn-primary">
            Create Exam ({selectedQuestions.length} questions)
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateExam;