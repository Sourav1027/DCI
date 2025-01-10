import React, { useState } from "react";
import {Search,ChevronLeft,ChevronRight,Plus,} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil, faTrash,faFileExport} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "./enquiry.css";
import AddEnquiry from "./AddEnquiry/addEnquiry";
import { deleteConfirmation } from '../../../components/Providers/sweetalert'; 
import "animate.css";

const EnquiryManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Convert static array to state
  const [students, setStudents] = useState([
    {
      id: 1,
      studentName: "John Doe",
      email: "john@example.com",
      course: "Web Development",
      batch: "Morning Batch",
      status: "Active",
      date: "20-12-2024",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      email: "jane@example.com",
      course: "Mobile Development",
      batch: "Evening Batch",
      status: "Active",
      date: "20-12-2024",

    },
    {
      id: 3,
      studentName: "Mike Johnson",
      email: "mike@example.com",
      course: "UI/UX Design",
      batch: "Morning Batch",
      status: "Inactive",
      date: "20-12-2024",
    },
    {
      id: 4,
      studentName: "Sarah Wilson",
      email: "sarah@example.com",
      course: "Web Development",
      batch: "Evening Batch",
      status: "Active",
      date: "20-12-2024",
    },
    {
      id: 5,
      studentName: "Alex Brown",
      email: "alex@example.com",
      course: "Data Science",
      batch: "Morning Batch",
      status: "Active",
      date: "20-12-2024",
    },
  ]);

  const handleDelete = async (studentId) => {
    const deleteStudent = () => {
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
    };

    await deleteConfirmation(deleteStudent);
  };

  const handleAddStudent = (newStudent) => {
    console.log("New student:", newStudent);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentsList.xlsx");
  };

  return (
    <div className="student-dashboard">
        <div className="dashboard-header">
          <div className="title-section">
            <h1>Student Enquiry Management</h1>
          </div>
          <div className="header-actions">
            <button className="add-btn" onClick={() => setShowAddForm(true)}>
              <Plus size={18} />
              <span>New Enquiry</span>
            </button>
            {showAddForm && (
              <AddEnquiry
                onClose={() => setShowAddForm(false)}
                onSubmit={handleAddStudent}
              />
            )}
            <button
              className="btn btn-outline-primary export-btn"
              onClick={exportToExcel}
            >
              <FontAwesomeIcon icon={faFileExport} className="me-2" />
              Export
            </button>
          </div>

          <div className="filter-container">
            <div className="search-container">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                placeholder="Search students..."
                className="search-input"
              />
            </div>
          </div>

          <div className="table-box">
            <table className="table-full">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Status</th>
                  <th>Date</th>
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
                        <span className="student-name">{student.studentName}</span>
                      </div>
                    </td>
                    <td>{student.email}</td>
                    <td>
                      <span className="course-badge">{student.course}</span>
                    </td>
                    <td>{student.batch}</td>
                    <td>{student.status}</td>
                    <td>{student.date}</td>
                   
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn edit">
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button 
                          className="icon-btn delete"
                          onClick={() => handleDelete(student.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

export default EnquiryManagement;