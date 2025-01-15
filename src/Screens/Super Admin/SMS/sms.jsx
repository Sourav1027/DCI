import React, { useState } from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faBan,
  faCheck,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { Send } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Alert, Snackbar } from "@mui/material";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";
import AddSMS from "./addSMS/addsms";
import "./sms.css";

const SMS = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectednotification, setSelectednotification] = useState(null);
  const itemsPerPage = 5;

  const [notifications, setnotifications] = useState([
    {
      id: 1,
      centerName: "Tech Training",
      courseName: "DEV OPS",
      batchName: "Morning",
      recipients: "Raj",
      sms: "active",
      date:"20-02-2025"
    },
    {
      id: 2,
      centerName: "Tech Training Center",
      courseName: "DEV OPS",
      batchName: "Morning",
      recipients: "Raj",
      sms: "active",
      date:"20-02-2025"

    },
    {
      id: 3,
      centerName: "Tech Training Center",
      courseName: "DEV OPS",
      batchName: "Morning",
      recipients: "Raj",
      sms: "active",
      date:"20-02-2025"

    },
  ]);
  // Updated delete handler to use SweetAlert
  const handleDelete = async (notificationId) => {
    const deleteNotification = () => {
      const updatedNotifications = notifications.filter(
        (notification) => notification.id !== notificationId
      );
      setnotifications(updatedNotifications);
    };

    await deleteConfirmation(deleteNotification);
  };

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setShowModal(false);
    setShowToast(true);
  };

  const handleEdit = (notification) => {
    setSelectednotification(notification);
    setShowModal(true);
  };
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const currentItems = notifications.slice(
    indexOfFirstItem,
    indexOfFirstItem + itemsPerPage
  );

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
        <div className="table-box">
          <table className="sms-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Center Name</th>
                <th>Course Name</th>
                <th>Batch</th>
                <th>Recipients</th>
                <th>Message</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((notification, index) => (
                <tr key={notification.id} className="hover:bg-gray-50">
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h'>
                    {indexOfFirstItem + index + 1}</td>
                  <td>{notification.centerName}</td>
                  <td>{notification.courseName}</td>
                  <td>{notification.batchName}</td>
                  <td>{notification.recipients}</td>
                  <td className="message-cell">{notification.sms}</td>
                  <td>{notification.date}</td>
                  <td>
                    <div className="last-buttons">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => handleEdit(notification)}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                   
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                      >
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

        <div
          className={`modal fade ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectednotification ? "Edit SMS" : "Send New SMS"}
                </h5>
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
                  initialValues={selectednotification}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMS;
