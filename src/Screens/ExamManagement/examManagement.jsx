import React, { useState } from "react";
import {
  FileText,
  Users,
  Bell,
  BarChart2,
  Award,
  Clock,
  CheckCircle,
  X,
  Plus,
  Download,
} from "lucide-react";
import "./exam.css";

const ExamManagement = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [questions, setQuestions] = useState([]);

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h1>Exam Management System</h1>

        <div className="nav-menu">
          <button
            className={`nav-item ${activeTab === "create" ? "active" : ""}`}
            onClick={() => setActiveTab("create")}
          >
            <FileText className="nav-icon" />
            <span>Create Exam</span>
          </button>

          <button
            className={`nav-item ${activeTab === "attend" ? "active" : ""}`}
            onClick={() => setActiveTab("attend")}
          >
            <Users className="nav-icon" />
            <span>Attend Exam</span>
          </button>

          <button
            className={`nav-item ${activeTab === "review" ? "active" : ""}`}
            onClick={() => setActiveTab("review")}
          >
            <Bell className="nav-icon" />
            <span>Review & Alerts</span>
          </button>

          <button
            className={`nav-item ${activeTab === "performance" ? "active" : ""}`}
            onClick={() => setActiveTab("performance")}
          >
            <BarChart2 className="nav-icon" />
            <span>Performance</span>
          </button>

          <button
            className={`nav-item ${activeTab === "certificates" ? "active" : ""}`}
            onClick={() => setActiveTab("certificates")}
          >
            <Award className="nav-icon" />
            <span>Certificates</span>
          </button>
        </div>
      </div>

      <div className="exam-content">
        {activeTab === "create" && (
          <div className="create-exam-form">
            <h2>Create MCQ Exam</h2>
            <div className="form-row">
              <div className="form-grp flex-item">
                <label>Exam Title</label>
                <input
                  type="text"
                  placeholder="Enter exam title"
                  className="form-input"
                />
              </div>

              <div className="form-grp">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  placeholder="Enter duration"
                  className="form-input"
                />
              </div>
            </div>

            <div className="questions-list">
              {questions.map((q, index) => (
                <div key={index} className="question-card">
                  <h3>Question {index + 1}</h3>
                  <p>{q.question}</p>
                  <div className="options-list">
                    {q.options.map((opt, i) => (
                      <div
                        key={i}
                        className={`option ${q.correct === i ? "correct" : ""}`}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="add-question-form">
              <h3>Add New Question</h3>
              <div className="form-grp">
                <label>Question Text</label>
                <textarea
                  placeholder="Enter question"
                  className="form-input"
                  rows="4" // Sets the height of the textarea
                  style={{ width: "100%" }} // Inline style to set the width
                ></textarea>
              </div>

              <div className="options-grid">
                <div className="form-grp">
                  <label>Option 1</label>
                  <textarea
                    type="text"
                    placeholder="Enter option 1"
                    className="form-input"
                    row="2"
                  />
                </div>

                <div className="form-grp">
                  <label>Option 2</label>
                  <textarea
                    type="text"
                    placeholder="Enter option 2"
                    className="form-input"
                    row="2"
                  />
                </div>

                <div className="form-grp">
                  <label>Option 3</label>
                  <textarea
                    type="text"
                    placeholder="Enter option 3"
                    className="form-input"
                    row="2"
                  />
                </div>

                <div className="form-grp">
                  <label>Option 4</label>
                  <textarea
                    type="text"
                    placeholder="Enter option 4"                    className="form-input"
                    row="2"
                  />
                </div>
              </div>

              <div className="form-grp">
                <label>Correct Answer</label>
                <select className="form-input">
                  <option>Select correct option</option>
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>
              </div>

              <button className="btn btn-primary">
                <Plus size={16} /> Add Question
              </button>
            </div>

            <div className="form-buttons">
              <button className="btn btn-success">Create Exam</button>
            </div>
          </div>
        )}

        {activeTab === "attend" && (
          <div className="attend-exam">
            <h2>Available Exams</h2>
            <div className="exams-grid">
              <div className="exam-card">
                <div className="exam-info">
                  <h3>Mathematics MCQ</h3>
                  <div className="exam-details">
                    <span>
                      <Clock size={16} /> 60 minutes
                    </span>
                    <span>50 questions</span>
                  </div>
                </div>
                <button className="btn btn-primary">Start Exam</button>
              </div>

              <div className="exam-card">
                <div className="exam-info">
                  <h3>Physics Final</h3>
                  <div className="exam-details">
                    <span>
                      <Clock size={16} /> 45 minutes
                    </span>
                    <span>30 questions</span>
                  </div>
                </div>
                <button className="btn btn-primary">Start Exam</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "review" && (
          <div className="exam-review">
            <h2>Exam Reviews & Results</h2>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-header">
                  <h3>Mathematics MCQ</h3>
                  <span className="status success">
                    <CheckCircle size={16} /> Completed
                  </span>
                </div>
                <div className="result-details">
                  <div className="score">
                    <span className="label">Score</span>
                    <span className="value">85%</span>
                  </div>
                  <div className="stats">
                    <div>Correct: 42/50</div>
                    <div>Time: 55 minutes</div>
                  </div>
                </div>
                <button className="btn btn-outline">View Details</button>
              </div>

              <div className="result-card">
                <div className="result-header">
                  <h3>Physics Final</h3>
                  <span className="status pending">
                    <Clock size={16} /> Pending Review
                  </span>
                </div>
                <div className="result-details">
                  <div className="score">
                    <span className="label">Score</span>
                    <span className="value">--</span>
                  </div>
                  <div className="stats">
                    <div>Submitted: 2 hours ago</div>
                    <div>Time: 43 minutes</div>
                  </div>
                </div>
                <button className="btn btn-outline">View Details</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="performance-analysis">
            <h2>Performance Analytics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Average Score</h3>
                <div className="stat-value">85%</div>
                <div className="stat-trend positive">↑ 5% from last month</div>
              </div>

              <div className="stat-card">
                <h3>Exams Completed</h3>
                <div className="stat-value">15</div>
                <div className="stat-trend">This semester</div>
              </div>

              <div className="stat-card">
                <h3>Best Performance</h3>
                <div className="stat-value">95%</div>
                <div className="subject">Mathematics MCQ</div>
              </div>

              <div className="stat-card">
                <h3>Time Management</h3>
                <div className="stat-value">Good</div>
                <div className="stat-trend positive">
                  Average time per exam: 45 mins
                </div>
              </div>
            </div>

            <div className="performance-chart">
              <h3>Score Trends</h3>
              <div className="chart-placeholder">
                Performance chart will be displayed here
              </div>
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="certificates">
            <h2>Your Certificates</h2>
            <div className="certificates-grid">
              <div className="certificate-card">
                <div className="certificate-icon">
                  <Award size={32} />
                </div>
                <div className="certificate-info">
                  <h3>Mathematics Excellence</h3>
                  <p>Completed: December 15, 2024</p>
                  <p>Score: 85%</p>
                </div>
                <button className="btn btn-primary">
                  <Download size={16} />
                </button>
              </div>

              <div className="certificate-card">
                <div className="certificate-icon">
                  <Award size={32} />
                </div>
                <div className="certificate-info">
                  <h3>Physics Advanced</h3>
                  <p>Completed: December 10, 2024</p>
                  <p>Score: 78%</p>
                </div>
                <button className="btn btn-primary">
                  <Download size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;
