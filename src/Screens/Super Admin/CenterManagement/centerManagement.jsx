import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faBan,
  faCheck,
  faPlus,
  faFileExport,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import AddCenter from "./addCenter";
import "./style.css";
import { ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { Alert, Snackbar } from "@mui/material";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const CenterManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const itemsPerPage = 10;

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1/";

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
    setToast(prev => ({ ...prev, open: false }));
  };

  // Fetch centers data with pagination and search
  const fetchCenters = async () => {
    try {
      const token = localStorage.getItem('token');
      
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}centers?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch centers");
      }

      setCenters(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to load centers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCenters();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = async (id) => {
     const token = localStorage.getItem("token");
     if (!token) {
       showToast("No token found", "error");
       return;
     }
 
     const deleteCenter = async () => {
       try {
         const response = await fetch(`${API_BASE_URL}centers/${id}`, {
           method: "DELETE",
           headers: {
             Authorization: `Bearer ${token}`,
             "Content-Type": "application/json",
           },
         });
 
         if (!response.ok) {
           const data = await response.json();
           throw new Error(data.message || "Failed to delete center");
         }
 
         showToast("center deleted successfully");
         await fetchCenters();
       } catch (error) {
         console.error("Error deleting center:", error);
         showToast(error.message || "Failed to delete center", "error");
       }
     };
 
     await deleteConfirmation(deleteCenter);
   };

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(centers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Centers");
      XLSX.writeFile(wb, "CentersList.xlsx");
      showToast("Export completed successfully");
    } catch (error) {
      showToast("Failed to export data", "error");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
  
      // Remove both createdAt and updatedAt fields from the data
      const { createdAt, updatedAt, ...dataToSend } = formData;
  
      const url = selectedCenter 
        ? `${API_BASE_URL}centers/${selectedCenter.id}` 
        : `${API_BASE_URL}centers`;
      
      const response = await fetch(url, {
        method: selectedCenter ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || "Operation failed");
      }
  
      const data = await response.json();
      setShowModal(false);
      showToast(
        selectedCenter ? 'Center updated successfully' : 'Center added successfully'
      );
      fetchCenters();
      setSelectedCenter(null);
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Failed to process request', 'error');
    }
  };
  const handleEdit = (center) => {
    setSelectedCenter(center);
    setShowModal(true);
  };

  const handleStatusChange = async (center) => {
    try {
      const newStatus = !center.status;
      const endpoint = newStatus ? 'unsuspend' : 'suspend';
      
      const response = await fetch(
        `${API_BASE_URL}centers/${center.centerId}/${endpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json',
          }
        }
      );
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to update status");
      }
  
      showToast(`Center ${newStatus ? 'activated' : 'suspended'} successfully`);
      fetchCenters();
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to update status", "error");
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
    <div className="center-management-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Center Management</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={() => {
              setSelectedCenter(null);
              setShowModal(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Center
          </button>
          <button
            className="btn btn-outline-primary export-btn"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export to Excel
          </button>
        </div>

        <div className="center-search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search centers..."
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
            <table className="center-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Center ID</th>
                  <th>Center Name</th>
                  <th>Owner Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {centers?.map((center, index) => (
                  <tr key={center.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                      {index + 1}
                    </td>
                    <td>{center.centerId}</td>
                    <td>{center.centerName}</td>
                    <td>{center.ownerName}</td>
                    <td>{center.emailId}</td>
                    <td>{center.mobileNo}</td>
                    <td>{center.createdAt}</td>
                    <td>
                    <span
                      className={`status-badge ${
                        center.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      } px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {center.status ? "Active" : "Inactive"}
                    </span>
                    </td>
                    <td>
                      <div className="action-buttons-three">
                        <button
                          className="btn btn-icon button-edit"
                          onClick={() => handleEdit(center)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>
                      
                        <button
                          className={`btn btn-icon ${center.status ? 'btn-deactivate' : 'btn-activate'}`}
                          onClick={() => handleStatusChange(center)}
                          title={center.status ? 'Deactivate center' : 'Activate center'}
                        >
                          {center.status ? 
                            <ToggleRight className="text-success" size={18} /> : 
                            <ToggleLeft className="text-danger" size={18} />
                          }
                        </button>
                        <button
                          className="btn btn-icon button-delete"
                          onClick={() => handleDelete(center.id)}
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

        {showModal && (
          <div className="modal fade show" style={{ display: "block" }}>
            <div className="modal-dialog modal-l">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedCenter ? "Edit Center" : "Add New Center"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <AddCenter
                    onSubmit={handleSubmit}
                    onCancel={() => setShowModal(false)}
                    initialValues={selectedCenter}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <Snackbar
          open={toast.open}
          autoHideDuration={3000}
          onClose={handleCloseToast}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseToast} 
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default CenterManagement;