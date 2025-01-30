import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Plus, ToggleRight, ToggleLeft } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faFileExport } from "@fortawesome/free-solid-svg-icons";
import AddStudent from "./AddNewStudent/addnewStudent";
import * as XLSX from "xlsx";
import { deleteConfirmation } from "../../components/Providers/sweetalert";
import { Alert, Snackbar } from "@mui/material";
import "./student.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const Student = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    course: "",
    batch: "",
    status: ""
  });

  const itemsPerPage = 5;

  const displayToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setShowToast(true);
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        ...filters
      }).toString();

      const response = await fetch(
        `${API_BASE_URL}/students?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch students");
      }

      setStudents(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error:", error);
      displayToast(error.message || "Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage, filters]);

  const handleDelete = async (studentId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      displayToast("No token found", "error");
      return;
    }

    const deleteStudent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete student");
        }

        displayToast("Student deleted successfully");
        await fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        displayToast(error.message || "Failed to delete student", "error");
      }
    };

    await deleteConfirmation(deleteStudent);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setShowAddForm(true);
  };


 // Check if all required fields are present before sending
const validateFields = (data) => {
  const requiredFields = [
    'centerName',
    'firstName',
    'lastName',
    'email',
    'phone',
    'dob',
    'address',
    'fatherName',
    'motherName',
    'course',
    'batch',
    'previousEducation',
    'emergencyContact',
    'gender',
    'admissionDate',
    'fee',
    'counsellorName',
    'reference',
    'paymentTerm',
    'collegeName'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

const handleSubmit = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found");
    }

    // Validate required fields
    validateFields(formData);

    // Format the data
    const formattedData = {
      centerName: formData.centerName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : null,
      address: formData.address,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      course: formData.course,
      batch: formData.batch,
      previousEducation: formData.previousEducation,
      emergencyContact: formData.emergencyContact,
      gender: formData.gender,
      admissionDate: formData.admissionDate ? new Date(formData.admissionDate).toISOString().split('T')[0] : null,
      fee: formData.fee,
      counsellorName: formData.counsellorName,
      reference: formData.reference,
      paymentTerm: formData.paymentTerm,
      collegeName: formData.collegeName,
      status: formData.status !== undefined ? formData.status : true
    };

    console.log('Formatted data being sent:', formattedData);

    const url = selectedStudent 
      ? `${API_BASE_URL}/students/${selectedStudent.id}` 
      : `${API_BASE_URL}/students`;
    
    const response = await fetch(url, {
      method: selectedStudent ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formattedData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Server error response:', data);
      throw new Error(data.message || "Operation failed");
    }

    setShowAddForm(false);
    displayToast(
      selectedStudent ? 'Student updated successfully' : 'Student added successfully'
    );
    fetchStudents();
    setSelectedStudent(null);
  } catch (error) {
    console.error('Submission error:', error);
    displayToast(error.message || 'An error occurred while saving the student', 'error');
  }
};


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); 
  };

  const exportToExcel = () => {
    const dataToExport = students.map(({ id, photo, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentsList.xlsx");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return (
      <div className="pagination-container">
        <span className="page-info">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
          results
        </span>
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
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
    );
  };

  const handleStatusChange = async (student) => {
    const token = localStorage.getItem("token");
    if (!token) {
        displayToast("No token found", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/students/${student.id}`, {
            method: "PUT",  // Changed to PUT since we're using the update endpoint
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
              centerName: student.centerName,
              firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                phone: student.phone,
                dob: student.dob,
                address: student.address,
                fatherName: student.fatherName,
                motherName: student.motherName,
                course: student.course,
                batch: student.batch,
                previousEducation: student.previousEducation,
                emergencyContact: student.emergencyContact,
                gender: student.gender,
                admissionDate:student.admissionDate ,
                fee: student.fee,
                counsellorName: student.counsellorName,
                reference: student.reference,
                paymentTerm: student.paymentTerm,
                collegeName: student.collegeName,
                status: !student.status
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to update status");
        }

        displayToast(
            `Student status ${!student.status ? 'activated' : 'deactivated'} successfully`
        );
        await fetchStudents();
    } catch (error) {
        console.error("Error toggling student status:", error);
        displayToast(error.message || "Failed to update student status", "error");
    }
};

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <h1>Student Management</h1>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            <span>Add New Student</span>
          </button>
          <button className="btn btn-outline-primary export-btn" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
        </div>

        <div className="student-filter-container">
          <select 
            className="select-input"
            name="course"
            value={filters.course}
            onChange={handleFilterChange}
          >
            <option value="">Select Course</option>
            <option value="web_development">Web Development</option>
            <option value="mobile_development">Mobile Development</option>
            <option value="ui_ux">UI/UX Design</option>
            <option value="data_science">Data Science</option>
          </select>

          <select 
            className="select-input"
            name="batch"
            value={filters.batch}
            onChange={handleFilterChange}
          >
            <option value="">Select Batch</option>
            <option value="morning">Morning Batch</option>
            <option value="evening">Evening Batch</option>
          </select>

          <select 
            className="select-input"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="student-table">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
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
              <tbody>
                {students?.map((student, index) => (
                  <tr key={student.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{`${student.firstName} ${student.lastName}`}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.batch}</td>
                    <td>
                    <span className={`status-badge ${student.status ? 'active' : 'inactive'}`}>
                        {student.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="icon-btn edit"
                          onClick={() => handleEdit(student)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button
                          className={`btn btn-icon ${student.status ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() => handleStatusChange(student)}
                          title={student.status ? 'Deactivate student' : 'Activate student'}
                        >
                          {student.status ? 
                            <ToggleRight className="text-success" size={18} /> : 
                            <ToggleLeft className="text-danger" size={18} />
                          }
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
          )}
          {renderPagination()}
        </div>
      </div>

      {showAddForm && (
        <AddStudent
          onClose={() => {
            setShowAddForm(false);
            setSelectedStudent(null);
          }}
          onSubmit={handleSubmit}
          initialValues={selectedStudent}
        />
      )}

      <Snackbar 
        open={showToast} 
        autoHideDuration={3000} 
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={toastSeverity} onClose={() => setShowToast(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Student;