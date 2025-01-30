import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faPlus,
  faFileExport,
  faSearch,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import {
  Snackbar,
  Alert,
  DialogActions,
  DialogTitle,
  DialogContent,
  Dialog,
} from "@mui/material";
import AddSyllabus from "./addSyllabus/addSyllabus";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./syllabus.css";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const Syllabus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [deleteAlert, setDeleteAlert] = useState({
    show: false,
    syllabusId: null,
  });
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const itemsPerPage = 5;

  // Sample data
  const [syllabus, setSyllabus] = useState([]);
  const [viewData, setViewData] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch syllabus data
  const fetchSyllabus = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/syllabuses?page=${page}&limit=${itemsPerPage}&search=${search}`
      );
      const data = await response.json();
      setSyllabus(data.data);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching syllabus:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and search handling
  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      fetchSyllabus(currentPage, searchTerm);
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [currentPage, searchTerm]);

  // Handle delete
  const handleDelete = async (syllabusId) => {
    const deleteSyllabusAPI = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/syllabuses/${syllabusId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchSyllabus(currentPage, searchTerm);
          setShowToast(true);
        }
      } catch (error) {
        console.error("Error deleting syllabus:", error);
      }
    };

    await deleteConfirmation(deleteSyllabusAPI);
  };

  // Handle form submission (Add/Edit)
  const handleSubmit = async (formData) => {
    try {
      const url = selectedSyllabus
        ? `${API_BASE_URL}/syllabuses/${selectedSyllabus.id}`
        : `${API_BASE_URL}/syllabuses`;
      const method = selectedSyllabus ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(false);
        setSelectedSyllabus(null);
        fetchSyllabus(currentPage, searchTerm);
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error submitting syllabus:", error);
    }
  };

  const handleView = (syllabus) => {
    setViewData(syllabus);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setViewData(null);
    setShowDialog(false);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(Syllabus);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "syllabus");
    XLSX.writeFile(wb, "syllabusList.xlsx");
  };

  const handleEdit = (syllabus) => {
    setSelectedSyllabus(syllabus);
    setShowModal(true);
  };

  const filteredSyllabus = syllabus.filter(
    (item) =>
      item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSyllabus.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSyllabus.length / itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
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
  
  const formatTopics = (topics) => {
    if (!topics) return '';
    if (Array.isArray(topics)) return topics.join(', ');
    if (typeof topics === 'string') return topics;
    return '';
  };
  return (
    <div className="syllabus-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Syllabus Management</h1>
        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Syllabus
          </button>
          <button
            className="btn btn-outline-primary export-btn"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
        </div>
        <div className="syllabus-search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search syllabus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="table-box">
          <table className="syllabus-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Batch</th>
                <th>Course</th>
                <th>Topics</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td>{item.batch}</td>
                  <td>{item.course}</td>
                  <td className="topics-column">{formatTopics(item.topics)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-icon btn-view"
                        onClick={() => handleView(item)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renderPagination()}
        </div>

        <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setShowToast(false)}>
          </Alert>
        </Snackbar>

        <Dialog
          open={showDialog}
          onClose={closeDialog}
          fullWidth
          maxWidth="sm"
          aria-labelledby="view-dialog-title"
          PaperProps={{
            style: {
              position: "absolute",
              top: 0,
              borderRadius: "12px",
              padding: "20px",
              background: "linear-gradient(135deg, #eceff1, #ffffff)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <DialogTitle
            style={{
              textAlign: "center",
              color: "#4A4E69",
              fontWeight: "700",
              fontSize: "1.8rem",
              letterSpacing: "1px",
              borderBottom: "2px solid #c9d6df",
              paddingBottom: "10px",
              marginBottom: "20px",
            }}
          >
            {" "}
            📘 Syllabus Details
          </DialogTitle>
          <DialogContent>
            {viewData && (
              <div className="view-data-modern">
                <p>
                  <strong>📌 Batch :- </strong>{" "}
                  <span className="highlight-modern">{viewData.batch}</span>
                </p>
                <p>
                  <strong>📚 Course :- </strong>{" "}
                  <span className="highlight-modern">{viewData.course}</span>
                </p>
             
                <p>
                  <strong>📋 Topics :- </strong>
                  <ul className="topic-list-modern">
            {viewData.topics && 
              viewData.topics.split(',').map((topic, index) => (
                <li key={index} className="topic-item-modern">
                  {topic.trim()}
                </li>
              ))
            }
          </ul>
                </p>
              </div>
            )}
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", marginTop: "20px" }}
          >
            <button className="modern-btn" onClick={closeDialog}>
              Close
            </button>
          </DialogActions>
        </Dialog>

        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedSyllabus ? "Edit Syllabus" : "Add New Syllabus"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AddSyllabus
                  onSubmit={handleSubmit}
                  onClose={() => setShowModal(false)}
                  initialValues={selectedSyllabus} // Pass the selected center data
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Syllabus;
