import React, { useEffect, useState } from "react";
import { LibraryBig, Clock, ScrollText } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./addsyllabus.css";

const AddSyllabus = ({ onSubmit, onClose,initialValues }) => {
  const initialFormData = {
    batch: "",
    course: "",
    topics: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        batch: initialValues.batch || "",
        course: initialValues.course || "",
        topics: Array.isArray(initialValues.topics) 
        ? initialValues.topics.join(', ')
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
        topics: formData.topics.trim()
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
            <input
              type="text"
              className={`form-input ${errors.batch ? "is-invalid" : ""}`}
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              placeholder="Enter Batch"
            />
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
            <input
              type="text"
              className={`form-input ${errors.course ? "is-invalid" : ""}`}
              id="course"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              placeholder="Enter course"
            />
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
