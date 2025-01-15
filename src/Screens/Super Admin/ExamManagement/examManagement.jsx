import React, { useState } from 'react';
import { FileText, Bell, } from 'lucide-react';
import QuestionBank from './questionBank';
import CreateExam from './createExam';
import './exam.css';

const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h1>Exam Management System</h1>

        <div className="nav-menu">
          <button
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            <FileText className="nav-icon" />
            <span>Create Exam</span>
          </button>

          <button
            className={activeTab === 'questions' ? 'active' : ''}
            onClick={() => setActiveTab('questions')}
          >
            <FileText className="nav-icon" />
            <span>Question Bank</span>
          </button>

        
        </div>

        <div className="exam-content">
          {activeTab === 'create' && <CreateExam />}
          {activeTab === 'questions' && <QuestionBank />}
        </div>
      </div>
    </div>
  );
};

export default ExamManagement;