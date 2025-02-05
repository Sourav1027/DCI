import React, { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(5);

  // Filter states
  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();
      setStudents(data.data);
      applyFilters(data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data = students) => {
    let filtered = [...data];

    if (selectedCenter) {
      filtered = filtered.filter(student => student.centerName === selectedCenter);
    }

    if (selectedCourse) {
      filtered = filtered.filter(student => student.course === selectedCourse);
    }

    if (selectedBatch) {
      filtered = filtered.filter(student => student.batch === selectedBatch);
    }

    if (selectedStatus !== "") {
      const statusBool = selectedStatus === "active";
      filtered = filtered.filter(student => student.status === statusBool);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.phone.includes(query)
      );
    }

    setFilteredStudents(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCenter, selectedCourse, selectedBatch, selectedStatus, searchQuery]);

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  };

  const getUniqueValues = (field) => {
    return [...new Set(students.map(student => student[field]))].filter(Boolean);
  };

  const exportToExcel = () => {
    const exportData = filteredStudents.map(student => ({
      "Student Name": `${student.firstName} ${student.lastName}`,
      "Email": student.email,
      "Phone": student.phone,
      "Center": student.centerName,
      "Course": student.course,
      "Batch": student.batch,
      "Status": student.status ? "Active" : "Inactive"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentsList.xlsx");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <h1>Student List</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary add-btn" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
        </div>

        <div className="student-filter-container">
          <select 
            className="select-input"
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
          >
            <option value="">Select Center</option>
            {getUniqueValues('centerName').map((center) => (
              <option key={center} value={center}>{center}</option>
            ))}
          </select>

          <select 
            className="select-input"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option value="">Select Course</option>
            {getUniqueValues('course').map((course) => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>

          <select 
            className="select-input"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            {getUniqueValues('batch').map((batch) => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>

          <select 
            className="select-input"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="student-table">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <table className="student-data-table">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Course</th>
                    <th>Batch</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageItems().map((student, index) => (
                    <tr key={student.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{`${student.firstName} ${student.lastName}`}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.course}</td>
                      <td>{student.batch}</td>
                      <td>
                        <span className={`status ${student.status ? 'active' : 'inactive'}`}>
                          {student.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-container">
                <span className="page-info">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of{' '}
                  {filteredStudents.length} results
                </span>
                <div className="pagination">
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button 
                    className="page-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;