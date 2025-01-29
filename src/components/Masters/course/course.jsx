import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Coursestyle.css";
import {
  Book,
  Plus,
  Save,
  WatchIcon,
  X,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import { deleteConfirmation } from "../../Providers/sweetalert";
import "animate.css";
import { Trello, Watch } from "react-bootstrap-icons";
import { Alert, Snackbar } from "@mui/material";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const initialFormData = {
  courseName: "",
  duration: "",
  courseFee: "",
};

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  // Toast handling function
  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message: message,
      severity: severity,
    });
  };

  // Handle toast close
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/courses?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      // Access the nested data array from the response
      setCourses(responseData.data || []);
      setTotalCount(responseData.totalCount || 0);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to load batches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseName?.trim()) {
      newErrors.courseName = "Course Name is required";
    }
    if (!formData.courseFee?.trim()) {
      newErrors.courseFee = "Course Fee is required";
    }
    if (!formData.duration?.trim()) {
      newErrors.duration = "Duration is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    // Match the backend's expected field names
    const courseData = {
      courseName: formData.courseName.trim(),
      duration: formData.duration.trim(),
      courseFee: formData.courseFee.trim(),
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };

    try {
      const url = selectedCourse
        ? `${API_BASE_URL}/courses/${selectedCourse.id}`
        : `${API_BASE_URL}/courses`;

      const response = await fetch(url, {
        method: selectedCourse ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      showToast(
        selectedCourse
          ? "Course updated successfully"
          : "Course added successfully"
      );

      await fetchCourses();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving course:", error);
      showToast(error.message || "Failed to save batch", "error");
    }
  };

  const handleDelete = async (course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    const deleteCourse = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/courses/${course.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        showToast("Batch deleted successfully");
        await fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
        showToast("Failed to delete batch", "error");
      }
    };

    await deleteConfirmation(deleteCourse);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      courseName: course.courseName,
      duration: course.duration,
      courseFee: course.courseFee,
    });
    setShowModal(true);
    setErrors({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setSelectedCourse(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

  const handleStatusChange = async (course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/courses/${course.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...course,
          status: !course.status,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast(
        `Course status ${!course.status ? "activated" : "deactivated"} successfully`
      );
      await fetchCourses();
    } catch (error) {
      console.error("Error toggling course status:", error);
      showToast("Failed to update course status", "error");
    }
  };
  return (
    <div className="course-container">
      <div className="course-header">
        <h1 className="course-title">Course Management</h1>

        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={() => {
              setShowModal(true);
              setFormData(initialFormData);
              setSelectedCourse(null);
              setErrors({});
            }}
          >
            <Plus size={18} />
            <span>Add New Course</span>
          </button>
        </div>

        <div className="course-search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedCourse ? "Edit Course" : "Add New Course"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col">
                  <label htmlFor="courseName">Course Name</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <Book size={18} />
                    </span>
                    <input
                      type="text"
                      className={`form-input ${errors.courseName ? "is-invalid" : ""}`}
                      id="courseName"
                      name="courseName"
                      placeholder="Enter course name"
                      value={formData.courseName}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.courseName && (
                    <div className="error-message">{errors.courseName}</div>
                  )}
                </div>
                <div className="col">
                  <label htmlFor="duration">Duration Time</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <WatchIcon size={18} />
                    </span>
                    <input
                      type="text"
                      className={`form-input ${errors.duration ? "is-invalid" : ""}`}
                      id="duration"
                      name="duration"
                      placeholder="Enter Duration (in months)"
                      value={formData.duration}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.duration && (
                    <div className="error-message">{errors.duration}</div>
                  )}
                </div>
                <div className="col">
                  <label htmlFor="courseFee">Course Fee</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <IndianRupee size={18} />
                    </span>
                    <input
                      type="text"
                      className={`form-input ${errors.courseFee ? "is-invalid" : ""}`}
                      id="courseFee"
                      name="courseFee"
                      placeholder="Enter course Fee"
                      value={formData.courseFee}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.courseFee && (
                    <div className="error-message">{errors.courseFee}</div>
                  )}
                </div>
              </div>
              <div className="button-group mt-3">
                <Button type="submit" variant="primary">
                  <Save className="mr-2" size={16} />
                  {selectedCourse ? "Update Course" : "Add Course"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="ms-2"
                >
                  <X className="mr-2" size={16} />
                  Cancel
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>

        <div className="table-box">
          <table className="course-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Course Name</th>
                <th>Duration Time</th>
                <th>Course Fee</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={course.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td>{course.courseName}</td>
                    <td>
                      {course.duration} month
                      {course.duration !== "1" ? "s" : ""}
                    </td>
                    <td>₹{course.courseFee}</td>
                    <td>{course.createdAt}</td>
                    <td>
                      <span
                        className={`status-badge ${course.status ? "active" : "inactive"}`}
                      >
                        {course.status ? "Active" : "Inactive"}
                      </span>
                    </td>{" "}
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-icon btn-edit"
                          onClick={() => handleEdit(course)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button
                          className={`btn btn-icon ${course.status ? "btn-deactivate" : "btn-activate"}`}
                          onClick={() => handleStatusChange(course)}
                          title={
                            course.status
                              ? "Deactivate course"
                              : "Activate course"
                          }
                        >
                          {course.status ? (
                            <ToggleRight className="text-success" size={18} />
                          ) : (
                            <ToggleLeft className="text-danger" size={18} />
                          )}
                        </button>
                        <button
                          className="btn btn-icon btn-delete"
                          onClick={() => handleDelete(course)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data text-center">
                    No courses available. Please add a course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {renderPagination()}
        </div>

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseToast}
            severity={toast.severity}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Course;
