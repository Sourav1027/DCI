import React, { useState } from "react";
import {Search, ChevronLeft, ChevronRight, Plus, GraduationCap,} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil,faTrash,faFileExport,} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";
import '../../Students/student.css';    

const StudentList = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "John Doe",
      mobileNo: "9910140856",
      email: "john@example.com",
      course: "Web Development",
      batch: "Morning Batch",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      mobileNo: "9910140856",
      email: "jane@example.com",
      course: "Mobile Development",
      batch: "Evening Batch",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      mobileNo: "9910140856",
      email: "mike@example.com",
      course: "UI/UX Design",
      batch: "Morning Batch",
      status: "Inactive",
    },

  ]);

  const handleDelete = async (studentId) => {
    const deleteStudent = () => {
      const updatedStudents = students.filter(
        (student) => student.id !== studentId
      );
      setStudents(updatedStudents);
    };

    await deleteConfirmation(deleteStudent);
  };



  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentsList.xlsx");
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="title-section">
          <h1>Student Management</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
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
        <div className="student-table">
          <table className="student-data-table">
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {index + 1}
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.batch}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
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

export default StudentList;
