import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSearch, faEye } from "@fortawesome/free-solid-svg-icons";
import { Send } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, Snackbar } from "@mui/material";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";
import AddSMS from "./addSMS/addsms";
import "./sms.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const SMS = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const itemsPerPage = 5;
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [notifications, setnotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [showMessageModal, setShowMessageModal] = useState(false);

  const displayToast = (message, severity = "success") => {
    setToastMessage(message);
    setToastSeverity(severity);
    setShowToast(true);
  };

  const fetchSms = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/sms?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch sms");
      }

      setnotifications(data.data);
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
      fetchSms();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, currentPage]);

  // Updated delete handler to use SweetAlert
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      displayToast("No token found", "error");
      return;
    }

    const deleteSMS = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sms/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        displayToast("sms deleted successfully");
        await fetchSms();
      } catch (error) {
        console.error("Error deleting sms:", error);
        displayToast("Failed to delete sms", "error");
      }
    };

    await deleteConfirmation(deleteSMS);
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${API_BASE_URL}/sms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setShowModal(false);
      displayToast("SMS sent successfully");
      fetchSms();
    } catch (error) {
      console.error("Error:", error);
      displayToast(error.message, "error");
    }
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = notifications.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

  //======================================
  // Function to truncate text
  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Function to handle message view
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  // Message Modal Component
  const MessageModal = ({ message, onClose }) => {
    if (!message) return null;

    return (
      <div className="modal fade show" style={{ display: "block" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Message Details</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="message-details">
                <p className="message-text">{message}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Ensure we always show 5 pages if available
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <span className="page-info">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalRecords)} to{' '}
          {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} results
        </span>
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>
          {pageNumbers}
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
    <div className="notification-container">
      <div className="header-container">
        <h1 className="sms-title">Notification Management</h1>
        <div className="header-actions">
          <button
            className="btn btn-primary add-btn"
            onClick={() => setShowModal(true)}
          >
            <Send className="icon" />
            Send New SMS
          </button>
        </div>

        <div className="sms-search-section">
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
        <div className="table-box">
          <table className="sms-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Center Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((notification, index) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td>{notification.centerName}</td>
                  <td>{notification.course}</td>
                  <td>{notification.batch}</td>
                  <td className="message-cell">
                    <div className="message-content">
                      <span>{truncateText(notification.message)}</span>
                     
                    </div>
                  </td>{" "}
                  <td>{notification.createdAt}</td>
                  <td>
                    <div className="last-buttons">
                    <button
                        className="btn btn-icon btn-view"
                        onClick={() => handleViewMessage(notification.message)}
                        title="View full message"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMessageModal && (
            <MessageModal
              message={selectedMessage}
              onClose={() => setShowMessageModal(false)}
            />
          )}
                      {renderPagination()}

        </div>

        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send New SMS</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <AddSMS
                  onSubmit={handleSubmit}
                  onCancel={() => setShowModal(false)}
                />
              </div>
            </div>
            <Snackbar
              open={showToast}
              autoHideDuration={3000}
              onClose={() => setShowToast(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                severity={toastSeverity}
                onClose={() => setShowToast(false)}
              >
                {toastMessage}
              </Alert>
            </Snackbar>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMS;
