import React, { useState } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Download,
  Plus,
  GraduationCap,
} from "lucide-react";
import "./student.css";
import AddStudent from "./AddNewStudent/addnewStudent";

const Student = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const students = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      course: "Web Development",
      batch: "Morning Batch",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      course: "Mobile Development",
      batch: "Evening Batch",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      course: "UI/UX Design",
      batch: "Morning Batch",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      course: "Web Development",
      batch: "Evening Batch",
      status: "Active",
    },
    {
      id: 5,
      name: "Alex Brown",
      email: "alex@example.com",
      course: "Data Science",
      batch: "Morning Batch",
      status: "Active",
    },
  ];
  const handleAddStudent = (newStudent) => {
    console.log("New student:", newStudent);
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="title-section">
            <GraduationCap size={32} className="title-icon" />
            <h1>Student Management</h1>
          </div>
          <div className="header-actions">
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              <span>Add New Student</span>
            </button>
            {showAddForm && (
              <AddStudent
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddStudent}
              />
            )}
            <button className="export-btn">
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-container">
          <select className="select-input">
            <option value="">Select Course</option>
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>UI/UX Design</option>
            <option>Data Science</option>
          </select>

          <select className="select-input">
            <option value="">Select Batch</option>
            <option>Morning Batch</option>
            <option>Evening Batch</option>
          </select>

          <select className="select-input">
            <option value="">Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td>
                    <div className="student-info">
                      <div className="avatar">{student.name.charAt(0)}</div>
                      <span className="student-name">{student.name}</span>
                    </div>
                  </td>
                  <td>{student.email}</td>
                  <td>
                    <span className="course-badge">{student.course}</span>
                  </td>
                  <td>{student.batch}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="icon-btn edit">
                        <Edit size={16} />
                      </button>
                      <button className="icon-btn delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container">
            <span className="page-info">Showing 1 to 5 of 97 results</span>
            <div className="pagination">
              <button className="page-btn">
                <ChevronLeft size={16} />
              </button>
              <button className="page-btn">1</button>
              <button className="page-btn active">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Student;
