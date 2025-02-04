import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./fee.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

const FeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [feeData, setFeeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 5;

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const showToast = (message, type) => {
    console.log(`${type}: ${message}`);
  };

  // Functions to get unique values from filtered data
  const getUniqueCenters = () => {
    return [...new Set(feeData.map(item => item.centerName))];
  };

  const getUniqueCourses = () => {
    // Only show courses for selected center
    const data = selectedCenter 
      ? feeData.filter(item => item.centerName === selectedCenter)
      : feeData;
    return [...new Set(data.map(item => item.course))];
  };

  const getUniqueBatches = () => {
    // Only show batches for selected center and course
    let data = feeData;
    if (selectedCenter) {
      data = data.filter(item => item.centerName === selectedCenter);
    }
    if (selectedCourse) {
      data = data.filter(item => item.course === selectedCourse);
    }
    return [...new Set(data.map(item => item.batch))];
  };

  // Filter data based on selections
  const filterData = () => {
    let filtered = [...feeData];

    if (selectedCenter) {
      filtered = filtered.filter(item => item.centerName === selectedCenter);
    }

    if (selectedCourse) {
      filtered = filtered.filter(item => item.course === selectedCourse);
    }

    if (selectedBatch) {
      filtered = filtered.filter(item => item.batch === selectedBatch);
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.includes(searchQuery)
      );
    }

    setFilteredData(filtered);
    setTotalRecords(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  };

  // Fetch Fee Data
  const fetchFeeData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("No token found", "error");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/feeUpdates/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setFeeData(responseData.data);
      setFilteredData(responseData.data);
      setTotalRecords(responseData.data.length);
      setTotalPages(Math.ceil(responseData.data.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching fee data:", error);
      showToast("Failed to load fee data", "error");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when selections change
  useEffect(() => {
    filterData();
  }, [selectedCenter, selectedCourse, selectedBatch, searchQuery]);

  // Fetch initial data
  useEffect(() => {
    fetchFeeData();
  }, []);

  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  };

  // Reset dependent filters when parent filter changes
  const handleCenterChange = (center) => {
    setSelectedCenter(center);
    setSelectedCourse("");
    setSelectedBatch("");
  };

  const handleCourseChange = (course) => {
    setSelectedCourse(course);
    setSelectedBatch("");
  };

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="gradient-text">Fee Management System</h1>

        {/* Filters */}
        <div className="fee-filter-container">
          <select 
            className="select-input"
            value={selectedCenter}
            onChange={(e) => handleCenterChange(e.target.value)}
          >
            <option value="">Select Center</option>
            {getUniqueCenters().map((center) => (
              <option key={center} value={center}>
                {center}
              </option>
            ))}
          </select>

          <select 
            className="select-input"
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
          >
            <option value="">Course</option>
            {getUniqueCourses().map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select 
            className="select-input"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">Select Batch</option>
            {getUniqueBatches().map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>

          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
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
            <div className="text-center py-4">Loading...</div>
          ) : (
            <table className="fee-table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left font-medium text-gray-600">Sr No</th>
                  <th className="text-left font-medium text-gray-600">Center Name</th>
                  <th className="text-left font-medium text-gray-600">Course</th>
                  <th className="text-left font-medium text-gray-600">Batch</th>
                  <th className="text-left font-medium text-gray-600">Student</th>
                  <th className="text-left font-medium text-gray-600">Phone</th>
                  <th className="text-left font-medium text-gray-600">M O P</th>
                  <th className="text-left font-medium text-gray-600">Amount</th>
                  <th className="text-left font-medium text-gray-600">Status</th>
                  <th className="text-left font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentPageItems().map((item, index) => (
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
                    <td>₹{item.totalAmount?.toLocaleString() || 0}</td>
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
                    <td>{item.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="pagination-container">
            <span className="page-info">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} results
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
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeManagement;