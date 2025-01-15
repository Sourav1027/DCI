import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, } from "@fortawesome/free-solid-svg-icons";
import "./style.css";
import { Book, Play, Plus, Save, X,Search } from "lucide-react";
import { Modal, Button } from "react-bootstrap";
import { deleteConfirmation } from "../../Providers/sweetalert";
import "animate.css";
import { Trello, Watch } from "react-bootstrap-icons";


const initialFormData = {
  batchName: "",
  timing: "",
  course: "",
  startsAt: "",
};

const Batch = () => {
  const [batches, setBatches] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const errors = {};

    if (!data.batchName.trim()) {
      errors.batchName = "Batch Name is required";
    }

    if (!data.timing) {
      errors.timing = "Batch Timing is required";
    }

    if (!data.course.trim()) {
      errors.course = "Course Name is required";
    }

    if (!data.startsAt.trim()) {
      errors.startsAt = "Start Time is required";
    } 

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const currentDate = new Date().toLocaleDateString();

    if (editIndex !== null) {
      const updatedBatches = [...batches];
      updatedBatches[editIndex] = {
        name: formData.batchName.trim(),
        timing: formData.timing,
        course: formData.course.trim(),
        startsAt: formData.startsAt,
        date: currentDate,
      };
      setBatches(updatedBatches);
      setEditIndex(null);
    } else {
      setBatches([
        ...batches,
        {
          name: formData.batchName.trim(),
          timing: formData.timing,
          course: formData.course.trim(),
          startsAt: formData.startsAt,
          date: currentDate,
        },
      ]);
    }

    setFormData(initialFormData);
    setShowModal(false);
  };

  const handleEdit = (index) => {
    const batch = batches[index];
    setFormData({
      batchName: batch.name,
      timing: batch.timing,
      course: batch.course,
      startsAt: batch.startsAt,
    });
    setEditIndex(index);
    setShowModal(true);
    setErrors({});
  };

  const handleDelete = async (index) => {
    const deleteBatch = () => {
      const updatedBatches = batches.filter((_, i) => i !== index);
      setBatches(updatedBatches);
    };

    await deleteConfirmation(deleteBatch);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData(initialFormData);
    setEditIndex(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
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
              setEditIndex(null);
              setErrors({});
            }}
          >
            <Plus size={18} />
            <span>Add New Batch</span>
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

        <Modal show={showModal} onHide={handleCloseModal} size="lg" backdrop="static" keyboard={false}>
          
          <Modal.Header closeButton>
            <Modal.Title>
              {editIndex !== null ? "Edit Batch" : "Add New Batch"}
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
                          <div className="error-message">{errors.batchName}</div>
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
                          <input
                            type="text"
                            className={`form-input ${errors.course ? "is-invalid" : ""}`}
                            id="course"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="Enter Course Name"
                          />
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
                <Button type="submit" variant="primary" >
                    <Save size={16} className="me-2" />
                    {editIndex !== null ? "Update Batch" : "Add Batch"}
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

        <div className="table-box">
          <table className="course-table">
            <thead>
              <tr>
                <th>Sr. No.</th>
                <th>Batch Name</th>
                <th>Batch Timing</th>
                <th>Course Name</th>
                <th>Starts At</th>
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
                    <td>{batch.name}</td>
                    <td>{batch.timing}</td>
                    <td>{batch.course}</td>
                    <td>{batch.startsAt}</td>
                    <td>
                    <div className="action-buttons">
                    <button className="btn btn-icon btn-edit" onClick={() => handleEdit(index)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                       <button className="btn btn-icon btn-delete"onClick={() => handleDelete(index)} >
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
        </div>
      </div>
    </div>
  );
};

export default Batch;
