import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import ADDSOFT from "./addsoftskill/addSoft";
import { Snackbar, Alert } from "@mui/material";

const SoftSkills = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [skillsData, setSkillsData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const itemsPerPage = 5;
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5000/v1";

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

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const fetchSkillsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${API_BASE_URL}/skills?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSkillsData(data.data || []);
      setTotalPages(data.totalPages || Math.ceil(data.totalRecords / itemsPerPage));
      setTotalRecords(data.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching skills data:", error);
      showToast(error.message || "Failed to load skills data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillsData();
  }, [currentPage, searchQuery]);

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token not found");

      const { createdAt, updatedAt, ...dataToSend } = formData;

      const url = selectedSkills
        ? `${API_BASE_URL}/skills/${selectedSkills.id}`
        : `${API_BASE_URL}/skills`;

      const response = await fetch(url, {
        method: selectedSkills ? "PUT" : "POST",
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

      const responseData = await response.json();
      
      if (!selectedSkills) {
        // Add new skill to the beginning of the list
        setSkillsData(prev => [responseData.skill, ...prev]);
      } else {
        // Update existing skill in the list
        setSkillsData(prev => 
          prev.map(skill => skill.id === selectedSkills.id ? responseData.skill : skill)
        );
      }

      setSelectedSkills(null);
      setShowAddForm(false);
      showToast(responseData.message || "Operation successful");
      fetchSkillsData();
    } catch (error) {
      console.error("Error:", error);
      showToast(error.message || "Failed to process request", "error");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="softskill-container">
      <div className="softskill-header">
        <h1 className="gradient-text">Add Soft Skills Marks</h1>

        <div className="header-actions">
          <button className="add-btn" onClick={() => setShowAddForm(true)}>
            <Plus size={18} />
            <span>ADD SKILL</span>
          </button>
        </div>

        <div className="enquiry-search-container">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-softskill-container">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <>
              <table className="softskill-table">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left font-medium text-gray-600">Sr No</th>
                    <th className="text-left font-medium text-gray-600">Center Name</th>
                    <th className="text-left font-medium text-gray-600">Course Name</th>
                    <th className="text-left font-medium text-gray-600">Batch</th>
                    <th className="text-left font-medium text-gray-600">Student Name</th>
                    <th className="text-left font-medium text-gray-600">Resume</th>
                    <th className="text-left font-medium text-gray-600">Presentation</th>
                    <th className="text-left font-medium text-gray-600">GD</th>
                    <th className="text-left font-medium text-gray-600">Technical</th>
                    <th className="text-left font-medium text-gray-600">Interview</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {skillsData.map((item, index) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="text-left font-medium text-gray-600">{item.centerName}</td>
                      <td className="text-left font-medium text-gray-600">{item.course}</td>
                      <td className="text-left font-medium text-gray-600">{item.batch}</td>
                      <td className="text-left font-medium text-gray-600">{item.studentName}</td>
                      <td className="text-left font-medium text-gray-600">{item.resumeCreation}</td>
                      <td className="text-left font-medium text-gray-600">{item.presentation}</td>
                      <td className="text-left font-medium text-gray-600">{item.groupDiscussion}</td>
                      <td className="text-left font-medium text-gray-600">{item.technical}</td>
                      <td className="text-left font-medium text-gray-600">{item.mockInterview}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pagination-container">
                <span className="page-info">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                  {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords}{" "}
                  results
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
            </>
          )}
        </div>
      </div>

      {showAddForm && (
        <ADDSOFT
          onClose={() => setShowAddForm(false)}
          onSubmit={handleSubmit}
          initialValues={selectedSkills}
        />
      )}

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

export default SoftSkills;