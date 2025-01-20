import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./pendingpayment.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCheckCircle,faClock,} from "@fortawesome/free-solid-svg-icons";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

const PendingPayment = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCenter, setSelectedCenter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  const feeData = [
    {
      id: 1,
      studentName: "Rahul Kumar",
      centerName: "D-codetech Malad",
      courseName: "Web Development",
      batch: "Morning Batch",
      totalFee: 50000,
      paidFee: 30000,
      pendingFee: 20000,
      dueDate: "15-02-2025"
    },
    {
      id: 2,
      studentName: "Priya Singh",
      centerName: "D-codetech Kalyan",
      courseName: "Mobile Development",
      batch: "Evening Batch",
      totalFee: 45000,
      paidFee: 45000,
      pendingFee: 0,
      dueDate: "25-02-2025"
    },
    {
      id: 3,
      studentName: "Amit Sharma",
      centerName: "D-codetech Thane",
      courseName: "UI/UX Design",
      batch: "Afternoon Batch",
      totalFee: 75000,
      paidFee: 50000,
      pendingFee: 25000,
      dueDate: "5-02-2025"
    }
  ];
  

  const filteredData = feeData.filter((item) => {
    const matchesSearchQuery =
      item.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = selectedCenter
      ? item.centerName === selectedCenter
      : true;

    const matchesCourse = selectedCourse
      ? item.courseName === selectedCourse
      : true;

    const matchesBatch = selectedBatch ? item.batch === selectedBatch : true;

    return matchesSearchQuery && matchesCenter && matchesCourse && matchesBatch;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="fee-container">
      <div className="fee-header">
        <h1 className="gradient-text">Pending Fee</h1>

        {/* Filters */}
        <div className="fee-filter-container">
          <select className="select-input">
            <option value="">Select Center</option>
            <option>D-codetech Malad</option>
            <option>D-codetech Kalyan</option>
            <option>D-codetech Thane</option>
            <option>D-codetech Navi Mumbai</option>
          </select>
          <select className="select-input">
            <option value="">Course</option>
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>UI/UX Design</option>
            <option>Data Science</option>
          </select>
          <select className="select-input">
            <option value="">Select Batch</option>
            <option>Morning Batch</option>
            <option>Afternoon Batch</option>
            <option>Evening Batch</option>
          </select>
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
            />
          </div>
        </div>

        <div className="table-fee-container">
          <table className="fee-table">
            <thead>
              <tr className="bg-gray-50">
                <th className=" text-left font-medium text-gray-600">Sr No</th>
                <th className=" text-left font-medium text-gray-600">Center Name</th>
                <th className=" text-left font-medium text-gray-600">Course Name</th>
                <th className=" text-left font-medium text-gray-600">Batch</th>
                <th className=" text-left font-medium text-gray-600"> Student Name</th>
                <th className=" text-left font-medium text-gray-600">Total Fee</th>
                <th className=" text-left font-medium text-gray-600">Paid Fee</th>
                <th className=" text-left font-medium text-gray-600">Pending Fee</th>
                <th className=" text-left font-medium text-gray-600">Due Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 table-tr-h">
                    {startIndex + index + 1}
                  </td>
                  <td>{item.centerName}</td>
                  <td>{item.courseName}</td>
                  <td>{item.batch}</td>
                  <td>{item.studentName}</td>
                  <td>₹{item.totalFee.toLocaleString()}</td>
                  <td>₹{item.paidFee.toLocaleString()}</td>
                  <td>₹{item.pendingFee.toLocaleString()}</td>
                  <td>{item.dueDate.toLocaleString()}</td>
                
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-container">
            <span className="page-info">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredData.length)} of {filteredData.length}{" "}
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
    </div>
  );
};

export default PendingPayment;
