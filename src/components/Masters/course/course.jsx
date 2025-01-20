import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./Coursestyle.css";
import { Book, Plus, Save, WatchIcon, X, Search, IndianRupee } from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import { deleteConfirmation } from "../../Providers/sweetalert";
import 'animate.css';

const initialFormData = {
  courseName: "",
  duration: "",
  courseFee: "",
};

const Course = () => {
  const [courses, setcourses] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Validation function to check form inputs
  const validateForm = () => {
    const newErrors = {};

    if (!formData.courseName) {
      newErrors.courseName = "Course Name is required";
    }
    if (!formData.courseFee) {
      newErrors.courseFee = "Course Fee is required";
    }
    if (!formData.duration || isNaN(formData.duration) || formData.duration <= 0) {
      newErrors.duration = "Duration must be a positive number";
    }
   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission for adding/updating courses
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentDate = new Date().toLocaleDateString();

    if (editIndex !== null) {
      // Update existing course
      const updatedcourses = [...courses];
      updatedcourses[editIndex] = {
        name: formData.courseName.trim(),
        duration: formData.duration.trim(),
        date: currentDate,
      };
      setcourses(updatedcourses);
      setEditIndex(null);
    } else {
      // Add new course
      setcourses([
        ...courses,
        { name: formData.courseName.trim(), duration:formData.duration, date: currentDate },
      ]);
    }

    // Reset form and close modal
    setFormData(initialFormData);
    setShowModal(false);
  };

  // Populate form for editing a course
  const handleEdit = (index) => {
    setFormData({ courseName: courses[index].name });
    setEditIndex(index);
    setShowModal(true);
    setErrors({});
  };

  // Confirm before deleting a course
  const handleDelete = async (index) => {
    const deleteCourse = () => {
      const updatedcourses = courses.filter((_, i) => i !== index);
      setcourses(updatedcourses);
    };

    await deleteConfirmation(deleteCourse);
  };
  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditIndex(null);
    setErrors({});
  };

  // Handle input changes and clear specific field errors
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Remove error message as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
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
              setEditIndex(null);
              setErrors({});
            }}
          >
            <Plus size={18} />
            <span>Add New Course</span>
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


        {/* Modal for Adding/Editing Batch */}
        <Modal show={showModal} onHide={handleCloseModal}  backdrop="static" keyboard={false} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editIndex !== null ? "Edit Course" : "Add New Course"}
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
                <Button 
                  type="submit" 
                  variant="primary"
                  
                >
                  <Save className="mr-2" size={16} />
                  {editIndex !== null ? "Update Course" : "Add Course"}
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

        {/* Table Displaying courses */}
        <div className="table-box">
          <table className="course-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Course Name</th>
                <th>Duration Time</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td>{course.name}</td>
                    <td>{course.duration} month{course.duration > 1 ? 's' : ''}</td>
                    <td>{course.date}</td>
                    <td>
                    <div className="action-buttons">
                       <button className="btn btn-icon btn-edit"onClick={() => handleEdit(index)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button className="btn btn-icon btn-delete"onClick={() => handleDelete(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data text-center">
                    No courses available. Please add a course.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Course;
