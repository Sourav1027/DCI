/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, History, Plus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faFileExport,
  faStickyNote,
  faSearch,
  faXmark,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import "./enquiry.css";
import AddEnquiry from "./AddEnquiry/addEnquiry";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const EnquiryManagement = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [showRemarksHistory, setShowRemarksHistory] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [enquiryData, setEnquiryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;
  const [remarksMap, setRemarksMap] = useState({});

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

  const [students, setStudents] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  // Fetch fee data
  const fetchEnquiryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${API_BASE_URL}/enquiries?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setEnquiryData(data.data);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error("Error fetching enquiry data:", error);
      showToast(error.message || "Failed to load enquiry data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiryData();
  }, [currentPage, searchQuery]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    const deleteEnquiry = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/enquiries/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete fee");
        }

        showToast("fee deleted successfully");
        await fetchEnquiryData();
      } catch (error) {
        console.error("Error deleting fee:", error);
        showToast(error.message || "Failed to delete fee", "error");
      }
    };

    await deleteConfirmation(deleteEnquiry);
  };

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      // Remove both createdAt and updatedAt fields from the data
      const { createdAt, updatedAt, ...dataToSend } = formData;

      const url = selectedEnquiry
        ? `${API_BASE_URL}/enquiries/${selectedEnquiry.id}`
        : `${API_BASE_URL}/enquiries`;

      const response = await fetch(url, {
        method: selectedEnquiry ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `HTTP error! status: ${response.status}`,
        }));
        throw new Error(errorData.message || "Operation failed");
      }

      const data = await response.json();
      setSelectedEnquiry(null);
      setShowAddForm(false);
      showToast(
        selectedEnquiry ? "Fee updated successfully" : "Fee added successfully"
      );
      fetchEnquiryData();
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to process request", "error");
    }
  };

  const handleEdit = (item) => {
    setSelectedEnquiry(item);
    setShowAddForm(true);
  };

  const handleRemarksSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${API_BASE_URL}/remarks/${currentStudent.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            enquiryId: currentStudent.id,
            remarks: remarks,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add remarks");
      }

      showToast("Remarks added successfully");
      setShowRemarksModal(false);
      setRemarks("");

      // Optional: Refresh the enquiry data if needed
      fetchEnquiryData();
    } catch (error) {
      console.error("Error adding remarks:", error);
      showToast(error.message || "Failed to add remarks", "error");
    }
  };

  const fetchRemarksHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const remarksPromises = enquiryData.map(async (enquiry) => {
        const response = await fetch(`${API_BASE_URL}/remarks/${enquiry.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return { enquiryId: enquiry.id, latestRemark: null };
        }

        const responseData = await response.json();

        const latestRemark =
          responseData.data && responseData.data.length > 0
            ? responseData.data[0]
            : null;

        return {
          enquiryId: enquiry.id,
          latestRemark: latestRemark,
        };
      });

      const allRemarks = await Promise.all(remarksPromises);

      const remarksMap = allRemarks.reduce((acc, item) => {
        acc[item.enquiryId] = item.latestRemark;
        return acc;
      }, {});

      setRemarksMap(remarksMap);
    } catch (error) {
      console.error("Error fetching latest remarks:", error);
      showToast(error.message || "Failed to fetch latest remarks", "error");
    }
  };

  useEffect(() => {
    if (enquiryData.length > 0) {
      fetchRemarksHistory();
    }
  }, [enquiryData]);

  // Update the RemarksHistoryDialog component
  const RemarksHistoryDialog = ({ student, onClose }) => {
    const [remarksHistory, setRemarksHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadRemarksHistory = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("No token found");
          }
          const response = await fetch(
            `${API_BASE_URL}/remarks/${student.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch remarks history");
          }

          const responseData = await response.json();
          const enrichedRemarksHistory = responseData.data.map((remark) => ({
            ...remark,
            counsellorName: student.counsellorName, // Use the counsellor name from the original enquiry
          }));

          setRemarksHistory(enrichedRemarksHistory);
        } catch (error) {
          console.error("Error loading remarks history:", error);
          showToast(error.message || "Failed to load remarks history", "error");
        } finally {
          setLoading(false);
        }
      };

      loadRemarksHistory();
    }, [student.id]);

    return (
      <div className="remarks-modal-overlay">
        <div className="remarks-modal-container">
          <div className="remarks-modal-header">
            <h2>
              Remarks History - {student.firstName} {student.lastName}
            </h2>
            <button onClick={onClose} className="remarks-close-btn">
              ×
            </button>
          </div>

          <div className="remarks-modal-body">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : remarksHistory.length > 0 ? (
              <div className="remarks-history-list">
                {remarksHistory.map((entry) => (
                  <div key={entry.id} className="remarks-history-item">
                    <div className="remarks-history-header">
                      <div className="remarks-timestamp">
                        <History size={14} className="remarks-icon" />
                        <span>
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <span className="remarks-author">
                        Added by:{" "}
                        {entry.counsellorName || student.counsellorName}
                      </span>
                    </div>
                    <div className="remarks-content">{entry.remarks}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="remarks-empty-state">
                <History size={48} className="remarks-empty-icon" />
                <p>No remarks history available</p>
              </div>
            )}
          </div>

          <div className="remarks-modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              <FontAwesomeIcon icon={faXmark} className="me-2" />
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "StudentsList.xlsx");
  };



  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <div className="title-section">
          <h1>Student Enquiry Management</h1>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            <span>New Enquiry</span>
          </button>
          {showAddForm && (
            <AddEnquiry
              onClose={() => setShowAddForm(false)}
              onSubmit={handleSubmit}
              initialValues={selectedEnquiry}
            />
          )}
          <button
            className="btn btn-outline-primary export-btn"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
        </div>

        <div className="enquiry-search-container">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-box">
          <table className="table-full">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Student Name</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Counsellor</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enquiryData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {index + 1}
                  </td>
                  <td>{`${item.firstName} ${item.lastName}`}</td>
                  <td>{item.phone}</td>
                  <td>{item.course}</td>
                  <td>{item.batch}</td>
                  <td>{item.counsellorName}</td>
                  <td> {remarksMap[item.id]?.remarks || "No remarks"}</td>
                  <td>
                    <span
                      className={`status-badge ${item.status ? "active" : "inactive"}`}
                    >
                      {item.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{item.createdAt}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn edit"
                        onClick={() => handleEdit(item)}
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className="icon-btn remarks"
                        onClick={() => {
                          console.log("Opening modal for student:", item);
                          setCurrentStudent(item);
                          setShowRemarksModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faStickyNote} />
                      </button>
                      <button
                        className="icon-btn history"
                        onClick={() => {
                          setCurrentStudent(item);
                          setShowRemarksHistory(true);
                        }}
                      >
                        <History size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showRemarksHistory && currentStudent && (
            <RemarksHistoryDialog
              student={currentStudent}
              onClose={() => setShowRemarksHistory(false)}
            />
          )}
        <div className="pagination-container">
            <span className="page-info">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalRecords)} of{" "}
              {totalRecords} results
            </span>
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
       
        </div>
      </div>

      {showRemarksModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "18px",
                textAlign: "left",
                color: "##6366f1",
              }}
            >
              Add Remarks for {currentStudent?.studentName}
            </h2>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter remarks here..."
              style={{
                width: "100%",
                height: "100px",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "14px",
                marginBottom: "15px",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "left",
                gap: "10px",
              }}
            >
              <button
                onClick={handleRemarksSubmit}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save
              </button>
              <button
                onClick={() => setShowRemarksModal(false)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <FontAwesomeIcon icon={faXmark} className="me-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
