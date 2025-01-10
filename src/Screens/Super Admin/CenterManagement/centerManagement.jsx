import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faBan, faCheck, faPlus, faFileExport, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import AddCenter from './addCenter';
import './style.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import { deleteConfirmation } from '../../../components/Providers/sweetalert';
import "animate.css";

const CenterManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const itemsPerPage = 5;

  // Sample data
  const [centers, setCenters] = useState([
    { id: 1, centerId: "CTR001", centerName: "Tech Training", ownerName: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", status: "active" },
    { id: 2, centerId: "CTR002", centerName: "Tech Training Center", ownerName: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", status: "active" },
    { id: 3, centerId: "CTR003", centerName: "Tech Training Center", ownerName: "Rahul Sharma", email: "rahul@example.com", phone: "9876543210", status: "active" },
  ]);

  // Updated delete handler to use SweetAlert
  const handleDelete = async (centerId) => {
    const deleteCenter = () => {
      // Filter out the center with the matching centerId
      const updatedCenters = centers.filter(center => center.centerId !== centerId);
      setCenters(updatedCenters);
    };

    await deleteConfirmation(deleteCenter);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(centers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Centers");
    XLSX.writeFile(wb, "CentersList.xlsx");
  };

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setShowModal(false);
    setShowToast(true);
  };

  const handleEdit = (center) => {
    setSelectedCenter(center);
    setShowModal(true);
  };

  const filteredCenters = centers.filter(center => 
    center.centerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    center.centerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCenters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCenters.length / itemsPerPage);

  return (
    <div className="center-management-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Center Management</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline-primary export-btn" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export to Excel
          </button>
          <button className="btn btn-primary add-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Center
          </button>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search centers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="data-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Center ID</th>
                <th>Center Name</th>
                <th>Owner Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((center, index) => (
                <tr key={center.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{center.centerId}</td>
                  <td>{center.centerName}</td>
                  <td>{center.ownerName}</td>
                  <td>{center.email}</td>
                  <td>{center.phone}</td>
                  <td>
                    <span className={`status-badge ${center.status}`}>
                      {center.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-icon btn-edit" onClick={() => handleEdit(center)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button className="btn btn-icon btn-status">
                        <FontAwesomeIcon icon={center.status === 'active' ? faBan : faCheck} />
                      </button>
                      <button className="btn btn-icon btn-delete" onClick={() => handleDelete(center.centerId)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <span className="page-info">Showing 1 to 5 of 97 results</span>
            <div className="pagination">
              <button className="page-btn">
                <ChevronLeft size={16} />
              </button>
              <button className="page-btn">1</button>
              <button className="page-btn active">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={`modal fade ${showModal ? 'show' : ''}`} 
             style={{ display: showModal ? 'block' : 'none' }}
             tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCenter ? 'Edit Center' : 'Add New Center'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
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

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
        >
          <Alert severity="success" onClose={() => setShowToast(false)}>
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default CenterManagement;