import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./feeUpdate.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheckCircle,faClock,faPencil,faSearch,faTrash,} from "@fortawesome/free-solid-svg-icons";
import {ChevronLeft,ChevronRight,Plus,} from "lucide-react";
import AddFee from "./addfee";
import { Alert, Snackbar } from "@mui/material";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
import "animate.css";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const FeeUpdate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [feeData, setFeeData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const itemsPerPage = 5;

  const showToast = (message, severity = "success") => {
    setToast({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Fetch fee data
  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/feeUpdates/list?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFeeData(data.data);
      setTotalPages(data.totalPages);
      setTotalRecords(data.totalRecords);
    } catch (error) {
      console.error("Error fetching fee data:", error);
      showToast("Failed to load fee data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeData();
  }, [currentPage, searchQuery]);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication token not found");
      }
   // Remove both createdAt and updatedAt fields from the data
   const { createdAt, updatedAt, ...dataToSend } = formData;

      const url = selectedFee 
        ? `${API_BASE_URL}/feeUpdates/update/${selectedFee.id}` 
        : `${API_BASE_URL}/feeUpdates/create`;
      
      const response = await fetch(url, {
        method: selectedFee ? 'PUT' : 'POST',
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
      setSelectedFee(null); // Clear selected fee
      setShowAddForm(false); // Hide form
      showToast(
        selectedFee ? 'Fee updated successfully' : 'Fee added successfully'
      );
      fetchFeeData();
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Failed to process request', 'error');
    }
  };

  const handleCloseForm = () => {
    setSelectedFee(null); // Clear selected fee
    setShowAddForm(false); // Hide the form
  };

  const handleEdit = (item) => {
    setSelectedFee(item);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    const deleteCenter = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/feeUpdates/delete/${id}`, {
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
        await fetchFeeData();
      } catch (error) {
        console.error("Error deleting fee:", error);
        showToast(error.message || "Failed to delete fee", "error");
      }
    };

    await deleteConfirmation(deleteCenter);
  };
 
  return (
    <div className="feeupdate-container">
      <div className="feeupdate-header">
        <h1 className="fee-title">Fee Update System</h1>

        <div className="header-actions">
          <button className="add-btn" onClick={() => {setShowAddForm(true);   setSelectedFee(null);

          } }>
            <Plus size={18} />
            <span>Add Fee</span>
          </button>
          {showAddForm && (
            <AddFee
              onClose={() => setShowAddForm(false)}
              onSubmit={handleSubmit}
              initialValues={selectedFee}
            />
          )}
        </div>

        <div className="fee-search-section">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="table-fee-container">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <table className="fee-table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left font-medium text-gray-600">Sr No</th>
                  <th className="text-left font-medium text-gray-600">
                    Center Name
                  </th>
                  <th className="text-left font-medium text-gray-600">
                    Course Name
                  </th>
                  <th className="text-left font-medium text-gray-600">Batch</th>
                  <th className="text-left font-medium text-gray-600">
                    Student
                  </th>
                  <th className="text-left font-medium text-gray-600">
                    Phone No
                  </th>
                  <th className="text-left font-medium text-gray-600">M O P</th>
                  <th className="text-left font-medium text-gray-600">
                    Received Amount
                  </th>
                  {/* <th className="text-left font-medium text-gray-600">
                    Pending Amount
                  </th> */}
                  <th className="text-left font-medium text-gray-600">
                    Status
                  </th>
                  <th className="text-left font-medium text-gray-600">Date</th>
                  <th className="text-left font-medium text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeData.map((item, index) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td>{item.centerName}</td>
                    <td>{item.course}</td>
                    <td>{item.batch}</td>
                    <td>{item.studentName}</td>
                    <td>{item.phone}</td>
                    <td>{item.modeOfPayment}</td>
                    <td>₹{item.receivedAmount?.toLocaleString()}</td>
                    {/* <td>₹{item.pendingAmount?.toLocaleString()}</td> */}
                    <td>
                      {item.status === "Paid" ? (
                        <div className="status-cell flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ color: "green" }}
                          />
                          <span className="text-green-500">Paid</span>
                        </div>
                      ) : (
                        <div className="status-cell flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={faClock}
                            style={{ color: "orange" }}
                          />
                          <span className="text-yellow-500">Pending</span>
                        </div>
                      )}
                    </td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons-three">
                        <button
                          className="btn btn-icon button-edit"
                          onClick={() => handleEdit(item)}
                        >
                          <FontAwesomeIcon icon={faPencil} />
                        </button>

                        <button
                          className="btn btn-icon button-delete"
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
          )}

          {/* Pagination */}
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
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FeeUpdate;
