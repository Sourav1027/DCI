import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPencil, faTrash, faPlus, faFileExport, faSearch,} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import { Snackbar, Alert } from "@mui/material";
import AddSyllabus from "./addSyllabus/addSyllabus";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./syllabus.css";
import { deleteConfirmation } from '../../../components/Providers/sweetalert';
import "animate.css";

const Syllabus = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteAlert, setDeleteAlert] = useState({
    show: false,
    syllabusId: null,
  });
  const [selectedSyllabus, setSelectedSyllabus] = useState(null);
  const itemsPerPage = 5;

  // Sample data
  const [syllabus, setsyllabus] = useState([
    {
      id: 1,
      batch: "Morning Batch",
      course: "Web Development",
      duration: "6 months",
      startDate: "01-02-2025",

      topics: [
        "HTML & CSS Fundamentals",
        "JavaScript Basics",
        "React JS",
        "Node JS",
      ],
    },
    {
      id: 2,
      batch: "Evening Batch",
      course: "App Development",
      duration: "6 months",
      startDate: "15-01-2025",

      topics: [
        "Java Fundamentals",
        "Android Studio",
        "UI/UX Design",
        "API Integration",
      ],
    },
    {
      id: 3,
      batch: "Afternoon Batch",
      course: "Full Stack Web Development",
      duration: "8 months",
      startDate: "25-01-2025",
      topics: [
        "HTML & CSS Fundamentals",
        "JavaScript ES6+",
        "React JS",
        "Node.js & Express",
        "MongoDB",
        "AWS Basics"
      ],
    },
  ]);

    const handleDelete = async (syllabusId) => {
      const deleteSyllabus = () => {
        const updatedsyllabus = syllabus.filter(syllabus => syllabus.id !== syllabusId);
        setsyllabus(updatedsyllabus);
        setShowToast(true);
      };
  
      await deleteConfirmation(deleteSyllabus);
    };

   const exportToExcel = () => {
     const ws = XLSX.utils.json_to_sheet(Syllabus);
     const wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "syllabus");
     XLSX.writeFile(wb, "syllabusList.xlsx");
   };
 

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    setShowModal(false);
    setShowToast(true);
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

  return (
    <div className="syllabus-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Syllabus Management</h1>
        <div className="header-actions">
          <button
            className="btn btn-outline-primary export-btn"
            onClick={exportToExcel}
          >
            <FontAwesomeIcon icon={faFileExport} className="me-2" />
            Export
          </button>
          <button
            className="btn btn-primary add-btn"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New Syllabus
          </button>
        </div>
        <div className="search-section">
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

        <div className="data-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Batch</th>
                <th>Course</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>Topics</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.batch}</td>
                  <td>{item.course}</td>
                  <td>{item.duration}</td>
                  <td>{item.startDate}</td>
                  <td>{item.topics.join(", ")}</td>
                  <td>
                    <div className="action-buttons">
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

          <div className="pagination-container">
            <button
              className="page-btn"
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="page-btn"
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>


        {/* <Snackbar
          open={showToast}
          autoHideDuration={3000}
          onClose={() => setShowToast(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setShowToast(false)}>
          </Alert>
        </Snackbar> */}

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
