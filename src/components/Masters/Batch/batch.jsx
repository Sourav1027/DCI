import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import {
  Book,
  Play,
  Plus,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import { Alert, Snackbar } from "@mui/material";
import { deleteConfirmation } from "../../Providers/sweetalert";
import "animate.css";
import { Trello, Watch } from "react-bootstrap-icons";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const initialFormData = {
  batchName: "",
  timing: "",
  course: "",
  startsAt: "",
  status: true,
};

const Batch = () => {
  const [batches, setBatches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;
  const [courses, setCourses] = useState([]);

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

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/batches?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
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
      setBatches(responseData.data || []);
      setTotalCount(responseData.totalCount || 0);
    } catch (error) {
      console.error("Error fetching batches:", error);
      showToast("Failed to load batches", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBatches();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.batchName?.trim()) {
      newErrors.batchName = "Batch Name is required";
    }
    if (!formData.timing?.trim()) {
      newErrors.timing = "Timing is required";
    }
    if (!formData.course?.trim()) {
      newErrors.course = "course is required";
    }
    if (!formData.startsAt?.trim()) {
      newErrors.startsAt = "startsAt is required";
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

    const batchData = {
      batchName: formData.batchName.trim(),
      timing: formData.timing.trim(),
      course: formData.course.trim(),
      startsAt: formData.startsAt.trim(),
      status: formData.status,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };

    try {
      const url = selectedBatch
        ? `${API_BASE_URL}/batches/${selectedBatch.id}`
        : `${API_BASE_URL}/batches`;

      const response = await fetch(url, {
        method: selectedBatch ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      showToast(
        selectedBatch
          ? "Batch updated successfully"
          : "Batch added successfully"
      );
      await fetchBatches();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving batch:", error);
      showToast(error.message || "Failed to save batch", "error");
    }
  };

  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      batchName: batch.batchName || "",
      timing: batch.timing || "",
      course: batch.course || "",
      startsAt: batch.startsAt || "",
      status: batch.status !== undefined ? batch.status : true,
    });
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = async (batch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    const deleteBatch = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/batches/${batch.id}`, {
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
        await fetchBatches();
      } catch (error) {
        console.error("Error deleting batch:", error);
        showToast("Failed to delete batch", "error");
      }
    };

    await deleteConfirmation(deleteBatch);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setSelectedBatch(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
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

  //fetch course

  // New function to fetch courses
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setCourses(responseData.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      showToast("Failed to load courses", "error");
    }
  };

  // Fetch courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);


    const handleStatusChange = async (batch) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }
  
      try {
        const response = await fetch(`${API_BASE_URL}/batches/${batch.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...batch,
            status: !batch.status
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        showToast(
          `Batch status ${!batch.status ? 'activated' : 'deactivated'} successfully`
        );
        await fetchBatches();
      } catch (error) {
        console.error("Error toggling batch status:", error);
        showToast("Failed to update batch status", "error");
      }
    };
  

  return (
    <div className="batch-container">
      <div className="header-batch">
        <h1 className="batch-title">Batch Management</h1>

        <div className="header-button">
          <button
            className="btn btn-primary add-btn"
            onClick={() => {
              setShowModal(true);
              setFormData(initialFormData);
              setErrors({});
              setSelectedBatch(null);
            }}
          >
            <Plus size={18} />
            <span>Add New Batch</span>
          </button>
        </div>

        <div className="batch-search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search batches..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-box">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="course-table">
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Batch Name</th>
                  <th>Batch Timing</th>
                  <th>Course Name</th>
                  <th>Starts At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length > 0 ? (
                  batches.map((batch, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {index + 1}
                      </td>
                      <td>{batch.batchName}</td>
                      <td>{batch.timing}</td>
                      <td>{batch.course}</td>
                      <td>{batch.startsAt}</td>
                      <td>
                      <span className={`status-badge ${batch.status ? 'active' : 'inactive'}`}>
                        {batch.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-icon btn-edit"
                            onClick={() => handleEdit(batch)}
                          >
                            <FontAwesomeIcon icon={faPencil} />
                          </button>
                          <button
                          className={`btn btn-icon ${batch.status ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() => handleStatusChange(batch)}
                          title={batch.status ? 'Deactivate Batch' : 'Activate Batch'}
                        >
                          {batch.status ? 
                            <ToggleRight className="text-success" size={18} /> : 
                            <ToggleLeft className="text-danger" size={18} />
                          }
                        </button>
                          <button
                            className="btn btn-icon btn-delete"
                            onClick={() => handleDelete(batch)}
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
                      No batches available. Please add a batch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          {renderPagination()}
        </div>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          size="lg"
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedBatch ? "Edit Batch" : "Add New Batch"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <div className="batch-form">
                <div className="input-grid">
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group">
                        <label htmlFor="batchName" className="form-label">
                          Batch Name
                        </label>
                        <div className="input-group">
                          <span className="input-icon">
                            <Trello size={18} />
                          </span>
                          <input
                            type="text"
                            className={`form-input ${errors.batchName ? "is-invalid" : ""}`}
                            id="batchName"
                            name="batchName"
                            value={formData.batchName}
                            onChange={handleChange}
                            placeholder="Enter Batch Name"
                          />
                        </div>
                        {errors.batchName && (
                          <div className="error-message">
                            {errors.batchName}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group">
                        <label htmlFor="timing" className="form-label">
                          Batch Timing
                        </label>
                        <div className="input-group">
                          <span className="input-icon">
                            <Watch size={18} />
                          </span>
                          <input
                            type="time"
                            className={`form-input ${errors.timing ? "is-invalid" : ""}`}
                            id="timing"
                            name="timing"
                            value={formData.timing}
                            onChange={handleChange}
                            placeholder="Enter Timing"
                          />
                        </div>
                        {errors.timing && (
                          <div className="error-message">{errors.timing}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group">
                        <label htmlFor="course" className="form-label">
                          Course Name
                        </label>
                        <div className="input-group">
                          <span className="input-icon">
                            <Book size={18} />
                          </span>
                          <select
                            className={`form-input ${errors.course ? "is-invalid" : ""}`}
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                          >
                            <option value="">Select Course</option>
                            {courses.map((course) => (
                              <option key={course.id} value={course.courseName}>
                                {course.courseName}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors.course && (
                          <div className="error-message">{errors.course}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="form-group">
                        <label htmlFor="startsAt" className="form-label">
                          Start Date
                        </label>
                        <div className="input-group">
                          <span className="input-icon">
                            <Play size={18} />
                          </span>
                          <input
                            type="date"
                            className={`form-input ${errors.startsAt ? "is-invalid" : ""}`}
                            id="startsAt"
                            name="startsAt"
                            value={formData.startsAt}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.startsAt && (
                          <div className="error-message">{errors.startsAt}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="button-group mt-3">
                  <Button type="submit" variant="primary">
                    <Save size={16} className="me-2" />
                    {selectedBatch ? "Update Batch" : "Add Batch"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCloseModal}
                    className="ms-2"
                  >
                    <X size={16} className="me-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </Modal.Body>
        </Modal>

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

export default Batch;
