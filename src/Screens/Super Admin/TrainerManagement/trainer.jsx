import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash,faPlus, faFileExport, faSearch } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import './trainer.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import AddTrainer from './addTrainer/addTrainer';
import { deleteConfirmation } from '../../../components/Providers/sweetalert';
import "animate.css";

const Trainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainer, setselectedTrainer] = useState(null);
  const itemsPerPage = 5;

  // Sample data
  const [trainers, setTrainers] = useState([
    {
        id: 1,
        name: 'John Doe',
        mobile: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        subject: 'React',
        experience: '5 years',
        salary: '50000',
        status: 'Active'
    },
    {
        id: 2,
        name: 'John disuza',
        mobile: '1234567990',
        email: 'john12@example.com',
        address: '1234 Main St',
        subject: 'React native',
        experience: '7 years',
        salary: '70000',
        status: 'Active'
    },
  ]);

  // Fixed delete handler
  const handleDelete = async (trainerId) => {
    const deleteTrainer = () => {
      const updatedTrainers = trainers.filter(trainer => trainer.id !== trainerId);
      setTrainers(updatedTrainers);
      setShowToast(true);
    };

    await deleteConfirmation(deleteTrainer);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(trainers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "trainers");
    XLSX.writeFile(wb, "trainersList.xlsx");
  };

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setShowModal(false);
    setShowToast(true);
  };

  const handleEdit = (trainer) => {
    setselectedTrainer(trainer);
    setShowModal(true);
  };

  // Filter trainers based on search term
  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrainers = filteredTrainers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="trainer-management-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Trainer Management</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline-primary export-btn" onClick={exportToExcel}>
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
          <button className="btn btn-primary add-btn" onClick={() => setShowModal(true)}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add New Trainer
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

        <div className="data-card">
          <table className="data-table">
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
              {currentTrainers.map((trainer, index) => (
                <tr key={trainer.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{trainer.name}</td>
                  <td>{trainer.mobile}</td>
                  <td>{trainer.email}</td>
                  <td>{trainer.address}</td>
                  <td>{trainer.subject}</td>
                  <td>{trainer.experience}</td>
                  <td>{trainer.salary}</td>
                  <td>
                    <span className={`status-${trainer.status.toLowerCase()}`}>
                      {trainer.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-icon btn-edit" onClick={() => handleEdit(trainer)}>
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button className="btn btn-icon btn-delete" onClick={() => handleDelete(trainer.id)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <span className="page-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredTrainers.length)} of {filteredTrainers.length} results
            </span>
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

        {/* <Snackbar 
          open={showToast} 
          autoHideDuration={3000} 
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success" onClose={() => setShowToast(false)}>
            Operation completed successfully!
          </Alert>
        </Snackbar> */}

        <div className={`modal fade ${showModal ? 'show' : ''}`} 
             style={{ display: showModal ? 'block' : 'none' }}
             tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedTrainer ? 'Edit Trainer' : 'Add New Trainer'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <AddTrainer 
                  onSubmit={handleSubmit} 
                  onCancel={() => setShowModal(false)} 
                  initialValues={selectedTrainer}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trainer;