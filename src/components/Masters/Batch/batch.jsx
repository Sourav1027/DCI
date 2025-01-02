import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const Batch = () => {
  const [batchs, setBatchs] = useState([]);
  const [batchName, setbatchName] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (batchName.trim() === "") return;

    const currentDate = new Date().toLocaleDateString();

    if (editIndex !== null) {
      const updatedBatchs = [...batchs];
      updatedBatchs[editIndex] = { name: batchName, date: currentDate };
      setBatchs(updatedBatchs);
      setEditIndex(null);
    } else {
      setBatchs([...batchs, { name: batchName, date: currentDate }]);
    }

    setbatchName("");
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setbatchName(batchs[index].name);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updatedBatchs = batchs.filter((_, i) => i !== index);
    setBatchs(updatedBatchs);
  };

  return (
    <div className="course-container">
      <div className="header-section">
        <h1 className="course-title">Batch</h1>
        <button
          className="add-course-btn"
          onClick={() => {
            setShowForm(true);
            setbatchName("");
            setEditIndex(null);
          }}
        >
          <FontAwesomeIcon icon={faPlus} /> Add New Batch
        </button>
      </div>

      {showForm && (
        <div className="form-section">
          <form onSubmit={handleSubmit} className="course-form">
            <div className="form-group">
              <label htmlFor="batchName">Batch Name</label>
              <input
                type="text"
                className="form-control"
                id="batchName"
                placeholder="Enter course name"
                value={batchName}
                onChange={(e) => setbatchName(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="submitButton">
                {editIndex !== null ? "Update Batch" : "Add Batch"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setbatchName("");
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
              <th>Batch Name</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {batchs.map((batch, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td>{batch.name}</td>
                <td>{batch.date}</td>
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
            {batchs.length === 0 && (
              <tr>
                <td colSpan="4" className="no-data">
                  No batchs available. Please add a course.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Batch;
