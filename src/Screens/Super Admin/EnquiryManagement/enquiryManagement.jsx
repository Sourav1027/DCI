import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faFileExport,
  faStickyNote,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "./enquiry.css";
import AddEnquiry from "./AddEnquiry/addEnquiry";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const EnquiryManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [students, setStudents] = useState([
    {
      id: 1,
      studentName: "John Doe",
      mobileNo: "9910140856",
      email: "john@example.com",
      course: "Web Development",
      batch: "Morning Batch",
      counsellor: "Amit Kumar",
      status: "Active",
      date: "20-12-2024",
      remarks: "Calling on tuesday",
    },
    {
      id: 2,
      studentName: "Jane Smith",
      mobileNo: "9910440856",
      email: "jane@example.com",
      course: "Mobile Development",
      batch: "Evening Batch",
      counsellor: "Amit Kumar",
      status: "Active",
      date: "20-12-2024",
      remarks: "meeting on next monday",
    },
    // Additional students...
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

  const handleAddStudent = (newStudent) => {
    console.log("New student:", newStudent);
  };

  const handleRemarksSubmit = () => {
    const updatedStudents = students.map((student) => {
      if (student.id === currentStudent.id) {
        return { ...student, remarks };
      }
      return student;
    });
    setStudents(updatedStudents);
    setShowRemarksModal(false);
    setRemarks("");
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
                <th>Phone</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Counsellor</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">{index + 1}</td>
                  <td>{student.studentName}</td>
                  <td>{student.mobileNo}</td>
                  <td>{student.course}</td>
                  <td>{student.batch}</td>
                  <td>{student.counsellor}</td>
                  <td>{student.remarks}</td>
                  <td>
                    <span className={`status ${student.status.toLowerCase()}`}>
                      {student.status}
                    </span>
                  </td>
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
                      <button
                        className="icon-btn remarks"
                        onClick={() => {
                          console.log("Opening modal for student:", student);
                          setCurrentStudent(student);
                          setShowRemarksModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faStickyNote} />
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

      {showRemarksModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "18px",
                textAlign: "left",
                color: "##6366f1",
              }}
            >
              Add Remarks for {currentStudent?.studentName}
            </h2>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks here..."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                gap: "10px",
              }}
            >
              <button
                onClick={handleRemarksSubmit}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setShowRemarksModal(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
