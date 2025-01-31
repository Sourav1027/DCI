import React, { useState } from "react";
import { Search, Calendar, Briefcase, GraduationCap, Filter, Download } from "lucide-react";
import "./completedcourse.css";

const StudentCompletion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const itemsPerPage = 5;

  const completionData = [
    {
      id: 1,
      studentName: "Rahul Kumar",
      courseName: "MERN Stack Development",
      batch: "Morning Batch 2024",
      completionDate: "2025-01-15",
      placementStatus: "Placed",
      company: "TechCorp Solutions",
      package: "8.5",
      certificateStatus: "Issued"
    },
    {
      id: 2,
      studentName: "Priya Singh",
      courseName: "UI/UX Design",
      batch: "Evening Batch 2024",
      completionDate: "2025-01-20",
      placementStatus: "Interview Process",
      company: "Pending",
      package: "-",
      certificateStatus: "Pending"
    },
    {
      id: 3,
      studentName: "Amit Sharma",
      courseName: "Python Full Stack",
      batch: "Weekend Batch 2024",
      completionDate: "2025-01-10",
      placementStatus: "Placed",
      company: "Digital Innovators",
      package: "7.2",
      certificateStatus: "Issued"
    }
  ];

  const filteredData = completionData.filter((item) => {
    const matchesSearch = 
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !selectedStatus || item.placementStatus === selectedStatus;
    const matchesCourse = !selectedCourse || item.courseName === selectedCourse;
    const matchesBatch = !selectedBatch || item.batch === selectedBatch;

    return matchesSearch && matchesStatus && matchesCourse && matchesBatch;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="completion-container">
      <div className="completion-header">
        <h1>Course Completion & Placement Tracker</h1>
        
        <div className="stats-container">
          <div className="course-stat-card">
            <GraduationCap size={24} />
            <div>
              <h3>Total Completed</h3>
              <p>125 Students</p>
            </div>
          </div>
          <div className="course-stat-card">
            <Briefcase size={24} />
            <div>
              <h3>Placed</h3>
              <p>98 Students</p>
            </div>
          </div>
          <div className="course-stat-card">
            <Calendar size={24} />
            <div>
              <h3>In Process</h3>
              <p>27 Students</p>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name, course, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-options">
            <select 
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              <option>MERN Stack Development</option>
              <option>UI/UX Design</option>
              <option>Python Full Stack</option>
            </select>

            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Select Batch</option>
              <option>Morning Batch 2024</option>
              <option>Evening Batch 2024</option>
              <option>Weekend Batch 2024</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Placement Status</option>
              <option>Placed</option>
              <option>Interview Process</option>
              <option>Not Started</option>
            </select>

            <button className="filter-btn">
              <Filter size={18} />
              Filter
            </button>

            <button className="export-btn">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Completion Date</th>
              <th>Placement Status</th>
              <th>Company</th>
              <th>Package (LPA)</th>
              <th>Certificate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((student) => (
              <tr key={student.id}>
                <td>{student.studentName}</td>
                <td>{student.courseName}</td>
                <td>{student.batch}</td>
                <td>{student.completionDate}</td>
                <td>
                  <span className={`status-badge ${student.placementStatus.toLowerCase().replace(" ", "-")}`}>
                    {student.placementStatus}
                  </span>
                </td>
                <td>{student.company}</td>
                <td>{student.package}</td>
                <td>
                  <span className={`certificate-badge ${student.certificateStatus.toLowerCase()}`}>
                    {student.certificateStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="view-btn">View</button>
                    <button className="edit-btn">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StudentCompletion;