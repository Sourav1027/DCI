import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName.trim() === "") return;

    const currentDate = new Date().toLocaleDateString();

    if (editIndex !== null) {
      const updatedCourses = [...courses];
      updatedCourses[editIndex] = { name: courseName, date: currentDate };
      setCourses(updatedCourses);
      setEditIndex(null);
    } else {
      setCourses([...courses, { name: courseName, date: currentDate }]);
    }

    setCourseName("");
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setCourseName(courses[index].name);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  return (
    <div className="course-container">
      <div className="header-section">
        <h1 className="course-title">Course Management</h1>
        <button
          className="add-course-btn"
          onClick={() => {
            setShowForm(true);
            setCourseName("");
            setEditIndex(null);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Course
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <form onSubmit={handleSubmit} className="course-form">
            <div className="form-group">
              <label htmlFor="courseName">Course Name</label>
              <input
                type="text"
                className="form-control"
                id="courseName"
                placeholder="Enter course name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submitButton">
                {editIndex !== null ? "Update Course" : "Add Course"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setCourseName("");
                  setEditIndex(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

<div className="table-container">
<table className="data-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Course Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>

                <td>{course.name}</td>
                <td>{course.date}</td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => handleEdit(index)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No courses available. Please add a course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Course;
