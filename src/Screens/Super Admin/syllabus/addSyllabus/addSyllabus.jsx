import React, { useEffect, useState } from "react";
import { LibraryBig, Clock, ScrollText } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./addsyllabus.css";
import { Alert, Snackbar } from "@mui/material";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const AddSyllabus = ({ onSubmit, onClose, initialValues }) => {
  const initialFormData = {
    batch: "",
    course: "",
    topics: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

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

  useEffect(() => {
    if (initialValues) {
      setFormData({
        batch: initialValues.batch || "",
        course: initialValues.course || "",
        topics: Array.isArray(initialValues.topics)
          ? initialValues.topics.join(", ")
          : initialValues.topics || "",
      });
    }
  }, [initialValues]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.batch.trim()) {
      newErrors.batch = "Batch is required";
    }
    if (!formData.course.trim()) {
      newErrors.course = "Course is required";
    }
    if (!formData.topics.trim()) {
      newErrors.topics = "Topics is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert topics string to array before submitting
      const processedFormData = {
        ...formData,
        topics: formData.topics.trim(),
      };
      onSubmit(processedFormData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onClose) {
      onClose();
    }
  };

  //fetch course
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

  //fetch Batches
  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/batches`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setBatches(responseData.data || []);
    } catch (error) {
      console.error("Error fetching batches:", error);
      showToast("Failed to load batches", "error");
    }
  };

  // Fetch courses when component mounts
  useEffect(() => {
    fetchBatches();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="add-syllabus-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="batch" className="form-label">
            Batch
          </label>
          <div className="input-group">
            <span className="input-icon">
              <Clock size={18} />
            </span>
            <select
              className={`form-input ${errors.batch ? "is-invalid" : ""}`}
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
            >
              <option value="">Select Batch</option>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.batchName}>
                  {batch.batchName}
                </option>
              ))}
            </select>
          </div>
          {errors.batch && <div className="error-message">{errors.batch}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="course" className="form-label">
            Course
          </label>
          <div className="input-group">
            <span className="input-icon">
              <LibraryBig size={18} />
            </span>
            <select
              className={`form-input ${errors.course ? "is-invalid" : ""}`}
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
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

        <div className="form-group">
          <label htmlFor="topics" className="form-label">
            Topics
          </label>
          <div className="input-group">
            <span className="input-icon">
              <ScrollText size={18} />
            </span>
            <textarea
              className="form-control"
              name="topics"
              value={formData.topics}
              onChange={handleInputChange}
              placeholder="Enter topics separated by commas"
              rows="4"
            />
          </div>
          {errors.topics && (
            <div className="error-message">{errors.topics}</div>
          )}
        </div>
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

      <div className="button-group">
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Syllabus
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancel}
        >
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Cancel
        </button>
      </div>
    </form>
    
  );
};

export default AddSyllabus;
