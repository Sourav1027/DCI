import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil,faTrash,faPlus,faFileExport,faSearch,} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "./trainer.css";
import {ChevronLeft,ChevronRight,ToggleLeft,ToggleRight,} from "lucide-react";
import { Alert, Snackbar } from "@mui/material";
import AddTrainer from "./addTrainer/addTrainer";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const Trainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const itemsPerPage = 5;

  const displayToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setShowToast(true);
  };

  const fetchTrainers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/trainers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch trainers");
      }

      setTrainers(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error:", error);
      displayToast(error.message || "Failed to load trainers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTrainers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const handleDelete = async (trainer) => {
    const token = localStorage.getItem("token");
    if (!token) {
      displayToast("No token found", "error");
      return;
    }

    const deleteTrainer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/trainers/${trainer.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        displayToast("Trainer deleted successfully");
        await fetchTrainers();
      } catch (error) {
        console.error("Error deleting trainer:", error);
        displayToast("Failed to delete trainer", "error");
      }
    };

    await deleteConfirmation(deleteTrainer);
  };

  const exportToExcel = () => {
    const exportData = trainers.map(({ id, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "trainers");
    XLSX.writeFile(wb, "trainersList.xlsx");
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const url = selectedTrainer 
        ? `${API_BASE_URL}/trainers/${selectedTrainer.id}`
        : `${API_BASE_URL}/trainers`;
      
      const response = await fetch(url, {
        method: selectedTrainer ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setShowModal(false);
      displayToast(
        selectedTrainer ? 'Trainer updated successfully' : 'Trainer added successfully'
      );
      fetchTrainers();
      setSelectedTrainer(null);
    } catch (error) {
      console.error('Error:', error);
      displayToast(error.message, 'error');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(totalCount / itemsPerPage)) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusChange = async (trainer) => {
    const token = localStorage.getItem("token");
    if (!token) {
        displayToast("No token found", "error");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/trainers/${trainer.id}`, {
            method: "PUT",  // Changed to PUT since we're using the update endpoint
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                trainerName: trainer.trainerName,
                dob: trainer.dob,
                gender: trainer.gender,
                email: trainer.email,
                phoneNo: trainer.phoneNo,
                address: trainer.address,
                subject: trainer.subject,
                experience: trainer.experience,
                salary: trainer.salary,
                status: !trainer.status
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "Failed to update status");
        }

        displayToast(
            `Trainer status ${!trainer.status ? 'activated' : 'deactivated'} successfully`
        );
        await fetchTrainers();
    } catch (error) {
        console.error("Error toggling trainer status:", error);
        displayToast(error.message || "Failed to update trainer status", "error");
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

  return (
    <div className="trainer-management-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Trainer Management</h1>
        </div>
        
        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={() => {
              setSelectedTrainer(null);
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Trainer
          </button>
          <button
            className="btn btn-outline-primary export-btn"
            onClick={exportToExcel}
            disabled={trainers.length === 0}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="trainer-table-container">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : trainers.length === 0 ? (
            <div className="no-data">No trainers found</div>
          ) : (
            <table className="trainer-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Subject</th>
                  <th>Experience</th>
                  <th>Salary</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer, index) => (
                  <tr key={trainer.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{trainer.trainerName}</td>
                    <td>{trainer.phoneNo}</td>
                    <td>{trainer.email}</td>
                    <td>{trainer.address}</td>
                    <td>{trainer.subject}</td>
                    <td>{trainer.experience}</td>
                    <td>{trainer.salary}</td>
                    <td>
                      <span
                        className={`status-badge ${trainer.status ? "active" : "inactive"}`}
                      >
                        {trainer.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-icon btn-edit"
                          onClick={() => {
                            setSelectedTrainer(trainer);
                            setShowModal(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                        <button
                          className={`btn btn-icon ${trainer.status ? "btn-deactivate" : "btn-activate"}`}
                          onClick={() => handleStatusChange(trainer)}
                          title={trainer.status ? "Deactivate trainer" : "Activate trainer"}
                        >
                          {trainer.status ? (
                            <ToggleRight className="text-success" size={18} />
                          ) : (
                            <ToggleLeft className="text-danger" size={18} />
                          )}
                        </button>
                        <button
                          className="btn btn-icon btn-delete"
                          onClick={() => handleDelete(trainer)}
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

        {showModal && (
          <div className="modal show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedTrainer ? "Edit Trainer" : "Add New Trainer"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedTrainer(null);
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <AddTrainer
                    onSubmit={handleSubmit}
                    onCancel={() => {
                      setShowModal(false);
                      setSelectedTrainer(null);
                    }}
                    initialValues={selectedTrainer}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trainer;