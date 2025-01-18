import React, { useState } from "react";
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
import { Snackbar, Alert, DialogActions, DialogTitle,DialogContent,Dialog } from "@mui/material";
import AddSyllabus from "./addSyllabus/addSyllabus";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./syllabus.css";
import { deleteConfirmation } from "../../../components/Providers/sweetalert";
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
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
        "AWS Basics",
      ],
    },
  ]);
  const [viewData, setViewData] = useState(null);
const [showDialog, setShowDialog] = useState(false);

const handleView = (syllabus) => {
  setViewData(syllabus);
  setShowDialog(true);
};

const closeDialog = () => {
  setViewData(null);
  setShowDialog(false);
};


  const handleDelete = async (syllabusId) => {
    const deleteSyllabus = () => {
      const updatedsyllabus = syllabus.filter(
        (syllabus) => syllabus.id !== syllabusId
      );
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
                <th>Duration</th>
                <th>Start Date</th>
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
                  <td>{item.duration}</td>
                  <td>{item.startDate}</td>
                  <td className="topics-column">{item.topics.join(", ")}</td>
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
      marginBottom:"20px",
    }}
  >    📘 Syllabus Details
  </DialogTitle>
  <DialogContent>
    {viewData && (
      <div className="view-data-modern">
        <p>
          <strong>📌 Batch :- </strong> <span className="highlight-modern">{viewData.batch}</span>
        </p>
        <p>
          <strong>📚 Course :- </strong> <span className="highlight-modern">{viewData.course}</span>
        </p>
        <p>
          <strong>⏳ Duration :- </strong> <span className="highlight-modern">{viewData.duration}</span>
        </p>
        <p>
          <strong>🗓 Start Date :- </strong> <span className="highlight-modern">{viewData.startDate}</span>
        </p>
        <p>
          <strong>📋 Topics :- </strong>
          <ul className="topic-list-modern">
            {viewData.topics.map((topic, index) => (
              <li key={index} className="topic-item-modern">
                {topic}
              </li>
            ))}
          </ul>
        </p>
      </div>
    )}
  </DialogContent>
  <DialogActions style={{ justifyContent: "center", marginTop: "20px" }}>
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
